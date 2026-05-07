import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PaintLayout({ children }: { children: React.ReactNode }) {
  return <main className="shell"><nav className="nav"><Link href="/paint">Paint dashboard</Link><Link href="/paint/runs/new">New run</Link><Link href="/paint/master-data/parts">Part types</Link><Link href="/paint/master-data/colours">Colours</Link></nav>{children}</main>;
}
