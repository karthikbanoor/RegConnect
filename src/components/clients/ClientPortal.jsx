import { useState } from 'react';
import { ShieldCheck, Search, Stamp } from 'lucide-react';
import { T, CATEGORIES, REGIONS } from '../../constants';
import { uid, todayISO } from '../../utils';
import { Pill, Stars, Btn, Modal } from '../ui';
import RequestForm from './RequestForm';

export default function ClientPortal({ consultants, clients, onSubmitInquiry }) {
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("All");
  const [fRegion, setFRegion] = useState("All");
  const [requesting, setRequesting] = useState(null);
  const [asClient, setAsClient] = useState(clients[0]?.id);

  const filtered = consultants.filter(c => {
    if (fCat !== "All" && !c.categories.includes(fCat)) return false;
    if (fRegion !== "All" && c.region !== fRegion) return false;
    if (q && !(`${c.code} ${c.expertise.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Privacy notice */}
      <div className="p-4 rounded-sm border flex items-center gap-3" style={{ borderColor: T.hair, background: T.ink }}>
        <ShieldCheck size={18} color="#fff" />
        <div className="text-xs text-white/90">
          Client Portal Preview — consultant identities, contact details, and files are hidden. Clients only see coded profiles, expertise, region, rating, and status.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select value={asClient} onChange={e => setAsClient(e.target.value)} className="text-sm px-2 py-2 rounded-sm border" style={{ borderColor: T.hair }}>
          {clients.map(cl => <option key={cl.id} value={cl.id}>Viewing as: {cl.company}</option>)}
        </select>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border flex-1 min-w-[180px]" style={{ borderColor: T.hair, background: T.panel }}>
          <Search size={14} color={T.slate} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search expertise or code..." className="text-sm outline-none flex-1" />
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

      {/* Consultant cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(c => (
          <div key={c.id} className="p-4 rounded-sm border relative overflow-hidden" style={{ borderColor: T.hair, background: T.panel }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-base font-semibold" style={{ color: T.stamp }}>{c.code}</span>
              <Stamp size={16} color={T.slate} />
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {c.categories.map(cat => <Pill key={cat} tone="ink">{cat}</Pill>)}
            </div>
            <div className="text-xs mb-2" style={{ color: T.inkSoft }}>
              {REGIONS.find(r => r.key === c.region)?.label}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {c.expertise.map(e => (
                <span key={e} className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ background: T.tealSoft, color: T.teal }}>
                  {e}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs mb-3">
              <Stars value={c.rating} />
              <span style={{ color: T.inkSoft }}>{c.yearsExp}+ yrs experience</span>
            </div>
            <div className="flex items-center justify-between">
              <Pill tone={c.status === "Available" ? "ink" : "stamp"}>{c.status}</Pill>
              <Btn small variant="subtle" onClick={() => setRequesting(c)}>Request Consultant</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Request modal */}
      {requesting && (
        <Modal title={`Request Consultant ${requesting.code}`} onClose={() => setRequesting(null)}>
          <RequestForm
            consultant={requesting}
            onCancel={() => setRequesting(null)}
            onSubmit={(desc) => {
              onSubmitInquiry({
                id: uid("INQ"),
                clientId: asClient,
                title: `Inquiry for ${requesting.code}`,
                description: desc,
                region: requesting.region,
                category: requesting.categories[0],
                requiredExpertise: requesting.expertise[0],
                stage: "Matched",
                consultantId: requesting.id,
                createdAt: todayISO(),
              });
              setRequesting(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
