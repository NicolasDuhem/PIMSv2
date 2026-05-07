import { listActiveColours, listActivePartTypes, listPaintRuns, PAINT_STATUSES } from "@/lib/paint-db";

export default async function PaintDashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [runs, parts, colours] = await Promise.all([listPaintRuns({ status: params.status, plannedDate: params.planned_date, partTypeId: params.part_type_id, colourId: params.colour_id }), listActivePartTypes(), listActiveColours()]);
  return <>
    <div className="row"><h1>Paint production tracking</h1><a className="button" href="/paint/runs/new">Create paint run</a></div>
    <form className="card row">
      <div className="field"><label>Status</label><select name="status" defaultValue={params.status ?? ""}><option value="">All</option>{PAINT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
      <div className="field"><label>Planned date</label><input className="input" type="date" name="planned_date" defaultValue={params.planned_date ?? ""}/></div>
      <div className="field"><label>Part type</label><select name="part_type_id" defaultValue={params.part_type_id ?? ""}><option value="">All</option>{parts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="field"><label>Colour</label><select name="colour_id" defaultValue={params.colour_id ?? ""}><option value="">All</option>{colours.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <button>Filter</button><a className="button ghost" href="/paint">Reset</a>
    </form>
    <div className="card"><table><thead><tr><th>Run</th><th>Status</th><th>Planned</th><th>Loaded</th><th>Sprayed</th><th>Unloaded</th><th>RFT OK</th><th>Reject</th><th>RFT %</th><th>Actions</th></tr></thead><tbody>{runs.map(r=><tr key={r.id}><td><a href={`/paint/runs/${r.id}`}>{r.run_number}</a></td><td><span className="badge">{r.status}</span></td><td>{r.planned_date ?? "—"}</td><td>{r.total_loaded_qty}</td><td>{r.total_sprayed_qty}</td><td>{r.total_unloaded_qty}</td><td>{r.total_rft_ok_qty}</td><td>{r.total_reject_qty}</td><td>{r.rft_percentage == null ? "—" : `${r.rft_percentage}%`}</td><td className="actions">{r.status === "LOADED" && <a href={`/paint/runs/${r.id}/spraying`}>Spray</a>}{r.status === "SPRAYED" && <a href={`/paint/runs/${r.id}/unloading`}>Unload</a>}</td></tr>)}</tbody></table>{runs.length===0 && <p className="muted">No paint runs match the current filters.</p>}</div>
  </>;
}
