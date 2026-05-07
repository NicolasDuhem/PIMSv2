"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nullableText, PAINT_STATUSES, text, toInt } from "./paint-db";

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required.");
  return neon(url);
}
function normalizeCode(value: FormDataEntryValue | null) {
  const code = text(value).toUpperCase().replace(/\s+/g, "_");
  if (!/^[A-Z0-9_-]{1,40}$/.test(code)) throw new Error("Code must be 1-40 characters using letters, numbers, underscores, or hyphens.");
  return code;
}
function validUuid(id: string) { if (!/^[0-9a-fA-F-]{36}$/.test(id)) throw new Error("Invalid identifier."); return id; }

export async function savePartType(formData: FormData) {
  const database = db();
  const id = text(formData.get("id"));
  const code = normalizeCode(formData.get("code"));
  const name = text(formData.get("name"));
  if (!name) throw new Error("Part type name is required.");
  const description = nullableText(formData.get("description"));
  if (id) await database`update paint_part_types set code=${code}, name=${name}, description=${description} where id=${validUuid(id)}::uuid`;
  else await database`insert into paint_part_types (code,name,description) values (${code},${name},${description})`;
  revalidatePath("/paint/master-data/parts");
}
export async function togglePartType(formData: FormData) {
  const database = db();
  await database`update paint_part_types set is_active = not is_active where id=${validUuid(text(formData.get("id")))}::uuid`;
  revalidatePath("/paint/master-data/parts");
}
export async function saveColour(formData: FormData) {
  const database = db();
  const id = text(formData.get("id"));
  const code = normalizeCode(formData.get("code"));
  const name = text(formData.get("name"));
  if (!name) throw new Error("Colour name is required.");
  const description = nullableText(formData.get("description"));
  const hex = nullableText(formData.get("hex_code"));
  if (hex && !/^#[0-9A-Fa-f]{6}$/.test(hex)) throw new Error("Hex code must use #RRGGBB format.");
  if (id) await database`update paint_colours set code=${code}, name=${name}, description=${description}, hex_code=${hex} where id=${validUuid(id)}::uuid`;
  else await database`insert into paint_colours (code,name,description,hex_code) values (${code},${name},${description},${hex})`;
  revalidatePath("/paint/master-data/colours");
}
export async function toggleColour(formData: FormData) {
  const database = db();
  await database`update paint_colours set is_active = not is_active where id=${validUuid(text(formData.get("id")))}::uuid`;
  revalidatePath("/paint/master-data/colours");
}

async function assertActive(database: ReturnType<typeof neon>, partId: string, colourId: string) {
  const rows = await database`select (select is_active from paint_part_types where id=${partId}::uuid) as part_active, (select is_active from paint_colours where id=${colourId}::uuid) as colour_active` as { part_active: boolean | null; colour_active: boolean | null }[];
  if (!rows[0]?.part_active) throw new Error("Selected part type is not active.");
  if (!rows[0]?.colour_active) throw new Error("Selected colour is not active.");
}

export async function createPaintRun(formData: FormData) {
  const database = db();
  const action = text(formData.get("action"));
  const partIds = formData.getAll("part_type_id").map(String);
  const colourIds = formData.getAll("colour_id").map(String);
  const qtys = formData.getAll("qty");
  const seen = new Set<string>();
  const lines = [] as { partId: string; colourId: string; qty: number }[];
  for (let i = 0; i < partIds.length; i++) {
    if (!partIds[i] && !colourIds[i] && !text(qtys[i] ?? null)) continue;
    const partId = validUuid(partIds[i]);
    const colourId = validUuid(colourIds[i]);
    const key = `${partId}:${colourId}`;
    if (seen.has(key)) throw new Error("Duplicate part type and colour lines are not allowed.");
    seen.add(key);
    await assertActive(database, partId, colourId);
    lines.push({ partId, colourId, qty: toInt(qtys[i] ?? null, "Quantity") });
  }
  if (lines.length === 0) throw new Error("At least one line is required.");
  const plannedDate = nullableText(formData.get("planned_date"));
  const notes = nullableText(formData.get("notes"));
  const status = action === "confirm" ? "LOADED" : "DRAFT";
  const run = await database`insert into paint_runs (run_number,status,planned_date,notes,loaded_at,loaded_by) values (nextval('paint_run_number_seq')::text,${status},${plannedDate},${notes},${status === "LOADED" ? new Date().toISOString() : null},null) returning id` as { id: string }[];
  await database`update paint_runs set run_number = 'PR-' || lpad(run_number, 6, '0') where id=${run[0].id}::uuid`;
  if (status === "LOADED") await database`insert into paint_run_stage_events (paint_run_id, stage, operator_id, notes) values (${run[0].id}::uuid, 'LOADING', null, 'Loading confirmed from create run screen')`;
  for (const line of lines) {
    await database`insert into paint_run_lines (paint_run_id,part_type_id,colour_id,planned_qty,loaded_qty) values (${run[0].id}::uuid,${line.partId}::uuid,${line.colourId}::uuid,${line.qty},${status === "LOADED" ? line.qty : null})`;
  }
  revalidatePath("/paint");
  redirect(`/paint/runs/${run[0].id}`);
}

export async function confirmSpraying(formData: FormData) {
  const database = db();
  const runId = validUuid(text(formData.get("run_id")));
  const run = await database`select status from paint_runs where id=${runId}::uuid` as { status: string }[];
  if (run[0]?.status !== "LOADED") throw new Error("Only LOADED runs can be sprayed.");
  const lineIds = formData.getAll("line_id").map(String);
  const qtys = formData.getAll("sprayed_qty");
  for (let i = 0; i < lineIds.length; i++) await database`update paint_run_lines set sprayed_qty=${toInt(qtys[i] ?? null, "Sprayed quantity")} where id=${validUuid(lineIds[i])}::uuid and paint_run_id=${runId}::uuid`;
  await database`update paint_runs set status='SPRAYED', sprayed_at=now(), sprayed_by=null where id=${runId}::uuid`;
  await database`insert into paint_run_stage_events (paint_run_id, stage, operator_id, notes) values (${runId}::uuid, 'SPRAYING', null, 'Spraying confirmed')`;
  revalidatePath("/paint");
  redirect(`/paint/runs/${runId}`);
}

export async function confirmUnloading(formData: FormData) {
  const database = db();
  const runId = validUuid(text(formData.get("run_id")));
  const run = await database`select status from paint_runs where id=${runId}::uuid` as { status: string }[];
  if (run[0]?.status !== "SPRAYED") throw new Error("Only SPRAYED runs can be unloaded.");
  const lineIds = formData.getAll("line_id").map(String);
  const okQtys = formData.getAll("rft_ok_qty");
  const rejectQtys = formData.getAll("reject_qty");
  for (let i = 0; i < lineIds.length; i++) {
    const lineId = validUuid(lineIds[i]);
    const line = await database`select sprayed_qty from paint_run_lines where id=${lineId}::uuid and paint_run_id=${runId}::uuid` as { sprayed_qty: number }[];
    const ok = toInt(okQtys[i] ?? null, "RFT OK quantity", true);
    const reject = toInt(rejectQtys[i] ?? null, "Reject quantity", true);
    if (ok + reject !== line[0]?.sprayed_qty) throw new Error("RFT OK quantity plus reject quantity must equal sprayed quantity.");
    await database`update paint_run_lines set rft_ok_qty=${ok}, reject_qty=${reject}, unloaded_qty=${ok + reject} where id=${lineId}::uuid`;
  }
  await database`update paint_runs set status='UNLOADED', unloaded_at=now(), unloaded_by=null where id=${runId}::uuid`;
  await database`insert into paint_run_stage_events (paint_run_id, stage, operator_id, notes) values (${runId}::uuid, 'UNLOADING', null, 'Unloading and RFT confirmed')`;
  revalidatePath("/paint");
  redirect(`/paint/runs/${runId}`);
}

export async function cancelRun(formData: FormData) {
  const status = text(formData.get("status"));
  if (!PAINT_STATUSES.includes(status as never)) throw new Error("Invalid status.");
  const database = db();
  await database`update paint_runs set status=${status} where id=${validUuid(text(formData.get("run_id")))}::uuid`;
  revalidatePath("/paint");
}
