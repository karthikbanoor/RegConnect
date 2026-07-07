import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { T } from '../../constants';
import { fmtMoney } from '../../utils';
import { SectionLabel, Modal, Btn } from '../ui';

export default function Proposals({ proposals, setProposals, consultants, clients, onGenerateSOW }) {
  const [editing, setEditing] = useState(null);

  const updateStatus = (id, status) =>
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));

  return (
    <div className="space-y-4">
      <SectionLabel eyebrow="Commercial" title="Proposals" />
      <div className="rounded-sm border overflow-hidden" style={{ borderColor: T.hair }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.ink }}>
              {["Proposal ID", "Client", "Consultant", "Est. Hours", "Rate", "Total", "Status", ""].map(h => (
                <th key={h} className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white/90">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => {
              const cons = consultants.find(c => c.id === p.consultantId);
              const client = clients.find(c => c.id === p.clientId);
              return (
                <tr key={p.id} className="border-t" style={{ borderColor: T.hair }}>
                  <td className="px-3 py-2 font-mono text-xs" style={{ color: T.stamp }}>{p.proposalId}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: T.ink }}>{client?.company}</td>
                  <td className="px-3 py-2 font-mono text-xs">{cons?.code}</td>
                  <td className="px-3 py-2 text-xs">{p.estHours}</td>
                  <td className="px-3 py-2 font-mono text-xs">{fmtMoney(p.rate)}</td>
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{fmtMoney(p.total)}</td>
                  <td className="px-3 py-2">
                    <select
                      value={p.status}
                      onChange={e => updateStatus(p.id, e.target.value)}
                      className="text-xs px-1.5 py-1 rounded-sm border"
                      style={{ borderColor: T.hair }}
                    >
                      {["Draft", "Sent", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 flex gap-1">
                    <Btn small variant="ghost" onClick={() => setEditing(p)}>View</Btn>
                    {p.status === "Accepted" && (
                      <Btn small icon={Briefcase} onClick={() => onGenerateSOW(p)}>Create SOW</Btn>
                    )}
                  </td>
                </tr>
              );
            })}
            {proposals.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-sm" style={{ color: T.slate }}>
                  No proposals generated yet — create one from an inquiry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Proposal detail modal */}
      {editing && (
        <Modal title={`Proposal ${editing.proposalId}`} onClose={() => setEditing(null)}>
          <div className="text-sm space-y-2" style={{ color: T.ink }}>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Consultant:</span>{" "}
              {consultants.find(c => c.id === editing.consultantId)?.code}
            </div>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Client:</span>{" "}
              {clients.find(c => c.id === editing.clientId)?.company}
            </div>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Scope:</span> {editing.scope}
            </div>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Estimated Hours:</span> {editing.estHours}
            </div>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Consultant Rate:</span> {fmtMoney(editing.rate)}/hr
            </div>
            <div>
              <span className="font-mono text-xs" style={{ color: T.inkSoft }}>Client Rate (with margin):</span> {fmtMoney(editing.clientRate)}/hr
            </div>
            <div className="text-base font-semibold pt-2 border-t" style={{ borderColor: T.hair }}>
              Total Proposal Value: {fmtMoney(editing.total)}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
