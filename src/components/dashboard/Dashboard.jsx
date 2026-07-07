import { useState } from 'react';
import { Users, ClipboardList, FileText, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip } from 'recharts';
import { T, CATEGORIES, REGIONS } from '../../constants';
import { SectionLabel, Stars, Btn } from '../ui';
import RegionRegistry from './RegionRegistry';

export default function Dashboard({ consultants, inquiries, proposals, sows }) {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const catData = CATEGORIES.map(cat => ({
    name: cat,
    value: consultants.filter(c => c.categories.includes(cat)).length
  }));
  const colors = [T.teal, T.stamp, T.brass];

  const regionData = REGIONS.map(r => ({
    name: r.key,
    count: consultants.filter(c => c.region === r.key).length
  }));

  const visible = selectedRegion
    ? consultants.filter(c => c.region === selectedRegion)
    : consultants;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Consultants", value: consultants.length, icon: Users, tone: T.teal },
          { label: "Open Inquiries", value: inquiries.filter(i => i.stage !== "Won" && i.stage !== "Lost").length, icon: ClipboardList, tone: T.stamp },
          { label: "Active Proposals", value: proposals.filter(p => p.status !== "Rejected").length, icon: FileText, tone: T.brass },
          { label: "Live SOWs", value: sows.filter(s => s.status === "Active").length, icon: Briefcase, tone: T.ink },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
            <div className="flex items-center justify-between mb-2">
              <s.icon size={16} color={s.tone} />
            </div>
            <div className="text-2xl font-mono" style={{ color: T.ink }}>{s.value}</div>
            <div className="text-[11px] uppercase tracking-wide font-mono mt-1" style={{ color: T.inkSoft }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Region registry + Pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
          <SectionLabel eyebrow="Global Registry" title="Consultants by Region" />
          <RegionRegistry
            consultants={consultants}
            onSelectRegion={setSelectedRegion}
            selectedRegion={selectedRegion}
          />
        </div>
        <div className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
          <SectionLabel eyebrow="Portfolio" title="By Category" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {catData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {catData.map((c, i) => (
              <span key={c.name} className="text-[11px] font-mono flex items-center gap-1" style={{ color: T.inkSoft }}>
                <span className="w-2 h-2 inline-block rounded-full" style={{ background: colors[i] }} /> {c.name} ({c.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered region view */}
      {selectedRegion && (
        <div className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
          <SectionLabel
            eyebrow="Filtered View"
            title={`Consultants — ${REGIONS.find(r => r.key === selectedRegion)?.label}`}
            right={<Btn small variant="ghost" onClick={() => setSelectedRegion(null)}>Clear filter</Btn>}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {visible.map(c => (
              <div key={c.id} className="p-2.5 rounded-sm border text-xs" style={{ borderColor: T.hair }}>
                <div className="font-mono font-semibold" style={{ color: T.ink }}>{c.code}</div>
                <div style={{ color: T.inkSoft }}>{c.categories.join(", ")}</div>
                <Stars value={c.rating} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar chart */}
      <div className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
        <SectionLabel eyebrow="Load" title="Consultants by Region (count)" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={regionData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "monospace" }} stroke={T.slate} />
            <YAxis tick={{ fontSize: 11 }} stroke={T.slate} allowDecimals={false} />
            <RTooltip />
            <Bar dataKey="count" fill={T.teal} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
