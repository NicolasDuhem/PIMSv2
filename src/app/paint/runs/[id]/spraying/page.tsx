import { notFound } from "next/navigation";
import { confirmSpraying } from "@/lib/paint-actions";
import { getPaintRun } from "@/lib/paint-db";

export default async function SprayingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getPaintRun(id);
  if (!run) notFound();
  const disabled = run.status !== "LOADED";
  return <><h1>Confirm spraying: {run.run_number}</h1>{disabled && <p className="error">This run is {run.status}. Only LOADED runs can be sprayed.</p>}<p className="warning">If sprayed quantities differ from loaded quantities, review the difference before confirming.</p><form action={confirmSpraying} className="card"><input type="hidden" name="run_id" value={run.id}/><table><thead><tr><th>Part</th><th>Colour</th><th>Loaded quantity</th><th>Sprayed quantity</th></tr></thead><tbody>{run.lines.map(l=><tr key={l.id}><td>{l.part_name}</td><td>{l.colour_name}</td><td>{l.loaded_qty}</td><td><input type="hidden" name="line_id" value={l.id}/><input className="input" type="number" min="1" step="1" name="sprayed_qty" defaultValue={l.loaded_qty ?? 1} disabled={disabled}/></td></tr>)}</tbody></table><button disabled={disabled}>Confirm spraying</button></form></>;
}
