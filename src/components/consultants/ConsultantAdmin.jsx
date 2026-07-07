import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { T, CATEGORIES, REGIONS } from '../../constants';
import { fmtMoney } from '../../utils';
import { SectionLabel, Pill, Stars, Btn } from '../ui';
import ConsultantFile from './ConsultantFile';
import NewConsultantModal from './NewConsultantModal';

export default function ConsultantAdmin({ consultants, setConsultants }) {
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("All");
  const [fRegion, setFRegion] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = consultants.filter(c => {
    if (fCat !== "All" && !c.categories.includes(fCat)) return false;
    if (fRegion !== "All" && c.region !== fRegion) return false;
    if (q && !(`${c.name} ${c.code} ${c.expertise.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const updateOne = (id, patch) => setConsultants(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));

  return (
    <div className="space-y-4">
      <SectionLabel
        eyebrow="Master File · Admin Only"
        title="Consultant Registry"
        right={<Btn icon={Plus} onClick={() => setShowNew(true)}>Add Consultant</Btn>}
      />

      {/* Search and filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border flex-1 min-w-[200px]" style={{ borderColor: T.hair, background: T.panel }}>
          <Search size={14} color={T.slate} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search name, code, expertise..."
            className="text-sm outline-none flex-1"
            style={{ color: T.ink }}
          />
        </div>
        <select value={fCat} onChange={e => setFCat(e.target.value)} className="text-sm px-2 py-2 rounded-sm border" style={{ borderColor: T.hair }}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={fRegion} onChange={e => setFRegion(e.target.value)} className="text-sm px-2 py-2 rounded-sm border" style={{ borderColor: T.hair }}>
          <option value="All">All Regions</option>
          {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-sm border overflow-hidden" style={{ borderColor: T.hair }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.ink }}>
              {["Code", "Name", "Region", "Category", "Expertise", "Rate/hr", "Rating", "Status", ""].map(h => (
                <th key={h} className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white/90">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t" style={{ borderColor: T.hair }}>
                <td className="px-3 py-2 font-mono text-xs" style={{ color: T.stamp }}>{c.code}</td>
                <td className="px-3 py-2" style={{ color: T.ink }}>{c.name}</td>
                <td className="px-3 py-2 text-xs" style={{ color: T.inkSoft }}>{c.country}</td>
                <td className="px-3 py-2 text-xs" style={{ color: T.inkSoft }}>{c.categories.join(", ")}</td>
                <td className="px-3 py-2 text-xs" style={{ color: T.inkSoft }}>
                  {c.expertise.slice(0, 2).join(", ")}{c.expertise.length > 2 ? "…" : ""}
                </td>
                <td className="px-3 py-2 font-mono text-xs">{fmtMoney(c.hourlyRate)}</td>
                <td className="px-3 py-2"><Stars value={c.rating} /></td>
                <td className="px-3 py-2">
                  <Pill tone={c.status === "Available" ? "ink" : "stamp"}>{c.status}</Pill>
                </td>
                <td className="px-3 py-2">
                  <Btn small variant="ghost" onClick={() => setSelected(c.id)}>Open File</Btn>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-sm" style={{ color: T.slate }}>
                  No consultants match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selected && (
        <ConsultantFile
          consultant={consultants.find(c => c.id === selected)}
          onClose={() => setSelected(null)}
          onUpdate={patch => updateOne(selected, patch)}
          onDelete={() => { setConsultants(prev => prev.filter(c => c.id !== selected)); setSelected(null); }}
        />
      )}
      {showNew && (
        <NewConsultantModal
          onClose={() => setShowNew(false)}
          onCreate={(nc) => { setConsultants(prev => [nc, ...prev]); setShowNew(false); }}
        />
      )}
    </div>
  );
}
