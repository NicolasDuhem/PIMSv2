import { neon } from "@neondatabase/serverless";
import { unstable_noStore as noStore } from "next/cache";

export type PaintStatus = "DRAFT" | "LOADED" | "SPRAYED" | "UNLOADED" | "CANCELLED";
export const PAINT_STATUSES: PaintStatus[] = ["DRAFT", "LOADED", "SPRAYED", "UNLOADED", "CANCELLED"];

export type MasterRow = { id: string; code: string; name: string; description: string | null; is_active: boolean; created_at: string; updated_at: string };
export type ColourRow = MasterRow & { hex_code: string | null };
export type RunLine = { id: string; paint_run_id: string; part_type_id: string; colour_id: string; planned_qty: number; loaded_qty: number | null; sprayed_qty: number | null; unloaded_qty: number | null; rft_ok_qty: number | null; reject_qty: number | null; part_code: string; part_name: string; colour_code: string; colour_name: string; hex_code: string | null };
export type RunRow = { id: string; run_number: string; status: PaintStatus; planned_date: string | null; notes: string | null; loaded_at: string | null; sprayed_at: string | null; unloaded_at: string | null; loaded_by: string | null; sprayed_by: string | null; unloaded_by: string | null; created_at: string; updated_at: string };
export type RunSummary = RunRow & { total_loaded_qty: number; total_sprayed_qty: number; total_unloaded_qty: number; total_rft_ok_qty: number; total_reject_qty: number; rft_percentage: number | null };
export type RunDetail = RunRow & { lines: RunLine[] };

function sql() {
  noStore();
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for paint production tracking database access.");
  return neon(url);
}

export function toInt(value: FormDataEntryValue | null, field: string, allowZero = false) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < (allowZero ? 0 : 1)) throw new Error(`${field} must be ${allowZero ? "zero or a positive" : "a positive"} integer.`);
  return parsed;
}
export function text(value: FormDataEntryValue | null) { return String(value ?? "").trim(); }
export function nullableText(value: FormDataEntryValue | null) { const v = text(value); return v === "" ? null : v; }

export async function listPartTypes(includeInactive = true): Promise<MasterRow[]> {
  const db = sql();
  return db`select * from paint_part_types where ${includeInactive} or is_active = true order by is_active desc, name asc` as Promise<MasterRow[]>;
}
export async function listColours(includeInactive = true): Promise<ColourRow[]> {
  const db = sql();
  return db`select * from paint_colours where ${includeInactive} or is_active = true order by is_active desc, name asc` as Promise<ColourRow[]>;
}
export async function listActivePartTypes() { return listPartTypes(false); }
export async function listActiveColours() { return listColours(false); }

export async function listPaintRuns(filters: { status?: string; plannedDate?: string; partTypeId?: string; colourId?: string }): Promise<RunSummary[]> {
  const db = sql();
  return db`
    select r.*,
      coalesce(sum(l.loaded_qty),0)::int as total_loaded_qty,
      coalesce(sum(l.sprayed_qty),0)::int as total_sprayed_qty,
      coalesce(sum(l.unloaded_qty),0)::int as total_unloaded_qty,
      coalesce(sum(l.rft_ok_qty),0)::int as total_rft_ok_qty,
      coalesce(sum(l.reject_qty),0)::int as total_reject_qty,
      case when coalesce(sum(l.unloaded_qty),0) = 0 then null
        else round((coalesce(sum(l.rft_ok_qty),0)::numeric / nullif(sum(l.unloaded_qty),0)::numeric) * 100, 2)::float end as rft_percentage
    from paint_runs r
    left join paint_run_lines l on l.paint_run_id = r.id
    where (${filters.status || null}::text is null or r.status = ${filters.status || null})
      and (${filters.plannedDate || null}::date is null or r.planned_date = ${filters.plannedDate || null}::date)
      and (${filters.partTypeId || null}::uuid is null or exists (select 1 from paint_run_lines x where x.paint_run_id = r.id and x.part_type_id = ${filters.partTypeId || null}::uuid))
      and (${filters.colourId || null}::uuid is null or exists (select 1 from paint_run_lines x where x.paint_run_id = r.id and x.colour_id = ${filters.colourId || null}::uuid))
    group by r.id
    order by r.created_at desc` as Promise<RunSummary[]>;
}

export async function getPaintRun(id: string): Promise<RunDetail | null> {
  const db = sql();
  const runs = await db`select * from paint_runs where id = ${id}::uuid` as RunRow[];
  if (runs.length === 0) return null;
  const lines = await db`
    select l.*, p.code as part_code, p.name as part_name, c.code as colour_code, c.name as colour_name, c.hex_code
    from paint_run_lines l
    join paint_part_types p on p.id = l.part_type_id
    join paint_colours c on c.id = l.colour_id
    where l.paint_run_id = ${id}::uuid
    order by p.name, c.name` as RunLine[];
  return { ...runs[0], lines };
}
