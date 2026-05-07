import { notFound } from "next/navigation";
import { confirmUnloading } from "@/lib/paint-actions";
import { getPaintRun } from "@/lib/paint-db";

export default async function UnloadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getPaintRun(id);
  if (!run) notFound();
  const disabled = run.status !== "SPRAYED";
  return <><h1>Confirm unloading and RFT: {run.run_number}</h1>{disabled && <p className="error">This run is {run.status}. Only SPRAYED runs can be unloaded.</p>}<p className="warning">Confirmation is blocked unless RFT OK + Reject equals the sprayed quantity for every line.</p><form action={confirmUnloading} className="card"><input type="hidden" name="run_id" value={run.id}/><table><thead><tr><th>Part</th><th>Colour</th><th>Sprayed</th><th>RFT OK</th><th>Reject</th><th>Expected total</th></tr></thead><tbody>{run.lines.map(l=><tr key={l.id}><td>{l.part_name}</td><td>{l.colour_name}</td><td>{l.sprayed_qty}</td><td><input type="hidden" name="line_id" value={l.id}/><input className="input" type="number" min="0" step="1" name="rft_ok_qty" defaultValue={l.sprayed_qty ?? 0} disabled={disabled}/></td><td><input className="input" type="number" min="0" step="1" name="reject_qty" defaultValue="0" disabled={disabled}/></td><td>{l.sprayed_qty}</td></tr>)}</tbody></table><button disabled={disabled}>Confirm unloading</button></form></>;
}
