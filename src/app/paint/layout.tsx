export const dynamic = "force-dynamic";

export default function PaintLayout({ children }: { children: React.ReactNode }) {
  return <main className="shell"><nav className="nav"><a href="/paint">Paint dashboard</a><a href="/paint/runs/new">New run</a><a href="/paint/master-data/parts">Part types</a><a href="/paint/master-data/colours">Colours</a></nav>{children}</main>;
}
