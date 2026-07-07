import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { T } from '../../constants';
import { fmtMoney } from '../../utils';
import { SectionLabel, Pill, Modal, Btn } from '../ui';

export default function SOWs({ sows, setSows, consultants, clients, proposals }) {
  const [viewing, setViewing] = useState(null);

  const updateMilestone = (sowId, mIdx, patch) => {
    setSows(prev => prev.map(s => {
      if (s.id !== sowId) return s;
      const milestones = s.milestones.map((m, i) => i === mIdx ? { ...m, ...patch } : m);
      return { ...s, milestones };
    }));
  };

  return (
    <div className="space-y-4">
      <SectionLabel eyebrow="Execution" title="Statements of Work" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sows.map(s => {
          const cons = consultants.find(c => c.id === s.consultantId);
          const client = clients.find(c => c.id === s.clientId);
          const paid = s.milestones.filter(m => m.status === "Paid").reduce((a, m) => a + m.amount, 0);

          return (
            <div key={s.id} className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-mono text-sm font-semibold" style={{ color: T.stamp }}>{s.sowId}</div>
                  <div className="text-xs" style={{ color: T.inkSoft }}>
                    {client?.company} · Consultant {cons?.code}
                  </div>
                </div>
                <Pill tone={s.status === "Active" ? "ink" : "brass"}>{s.status}</Pill>
              </div>
              <div className="flex items-center gap-3 text-xs mb-2" style={{ color: T.inkSoft }}>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {s.startDate} → {s.endDate}
                </span>
              </div>
              <div className="text-xs mb-2" style={{ color: T.inkSoft }}>
                POC: <span style={{ color: T.ink }}>{s.poc}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full mb-1" style={{ background: T.hair }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (paid / s.total) * 100)}%`, background: T.teal }}
                />
              </div>
              <div className="flex justify-between text-xs mb-3" style={{ color: T.inkSoft }}>
                <span>{fmtMoney(paid)} released</span>
                <span>{fmtMoney(s.total)} total</span>
              </div>
              <Btn small variant="ghost" onClick={() => setViewing(s)}>Open SOW</Btn>
            </div>
          );
        })}
        {sows.length === 0 && (
          <div className="text-sm col-span-2" style={{ color: T.slate }}>
            No SOWs yet — generate one from an accepted proposal.
          </div>
        )}
      </div>

      {/* SOW detail modal */}
      {viewing && (
        <Modal title={`SOW ${viewing.sowId}`} onClose={() => setViewing(null)} wide>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <span className="text-xs font-mono" style={{ color: T.inkSoft }}>Proposal Ref:</span> {viewing.proposalId}
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: T.inkSoft }}>Project POC:</span> {viewing.poc}
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: T.inkSoft }}>Start:</span> {viewing.startDate}
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: T.inkSoft }}>End:</span> {viewing.endDate}
            </div>
          </div>
          <div className="text-xs font-mono uppercase mb-2" style={{ color: T.inkSoft }}>Financial Milestones</div>
          <div className="space-y-2">
            {viewing.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-sm border text-xs" style={{ borderColor: T.hair }}>
                <span className="flex-1" style={{ color: T.ink }}>{m.name}</span>
                <span className="font-mono" style={{ color: T.inkSoft }}>{m.dueDate}</span>
                <span className="font-mono font-semibold" style={{ color: T.ink }}>{fmtMoney(m.amount)}</span>
                <select
                  value={m.status}
                  onChange={e => updateMilestone(viewing.id, i, { status: e.target.value })}
                  className="text-xs px-1.5 py-1 rounded-sm border"
                  style={{ borderColor: T.hair }}
                >
                  <option>Pending</option>
                  <option>Invoiced</option>
                  <option>Paid</option>
                </select>
              </div>
            ))}
          </div>
          <div className="text-right mt-3 text-base font-semibold" style={{ color: T.ink }}>
            Total: {fmtMoney(viewing.total)}
          </div>
        </Modal>
      )}
    </div>
  );
}
