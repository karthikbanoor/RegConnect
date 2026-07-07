import { ShieldCheck, LayoutGrid, Users, ClipboardList, FileText, Briefcase, Eye } from 'lucide-react';
import { T, NAV } from '../../constants';

const NAV_ICONS = {
  dash: LayoutGrid,
  consultants: Users,
  inquiries: ClipboardList,
  proposals: FileText,
  sows: Briefcase,
  client: Eye,
};

export default function Sidebar({ activeTab, onTabChange, consultantCount }) {
  return (
    <aside className="w-64 min-h-screen shrink-0 hidden md:flex flex-col" style={{ background: T.ink }}>
      {/* Brand header */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} color="#fff" />
          <span className="text-white font-medium" style={{ fontFamily: "'Source Serif 4', serif" }}>
            RegConnect
          </span>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
          Regulatory Consultant Registry
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {NAV.map(n => {
          const Icon = NAV_ICONS[n.k];
          return (
            <button
              key={n.k}
              onClick={() => onTabChange(n.k)}
              className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-left transition-colors"
              style={{
                color: activeTab === n.k ? "#fff" : "rgba(255,255,255,0.6)",
                background: activeTab === n.k ? "rgba(255,255,255,0.08)" : "transparent",
                borderLeft: activeTab === n.k ? `3px solid ${T.stamp}` : "3px solid transparent",
              }}
            >
              <Icon size={15} /> {n.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 text-[10px] font-mono text-white/40 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        {consultantCount} consultants on file<br />Data stored locally to this workspace.
      </div>
    </aside>
  );
}
