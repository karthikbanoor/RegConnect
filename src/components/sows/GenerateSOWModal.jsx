import { useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { T } from '../../constants';
import { uid, fmtMoney } from '../../utils';
import { Modal, Btn, Field, inputCls, inputStyle } from '../ui';
import { todayISO } from '../../utils';

export default function GenerateSOWModal({ proposal, consultants, clients, onClose, onCreate, seq }) {
  const cons = consultants.find(c => c.id === proposal.consultantId);
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState("");
  const [poc, setPoc] = useState("");
  const [milestones, setMilestones] = useState([
    { name: "Kickoff & Documentation Review", amount: Math.round(proposal.total * 0.3), dueDate: "", status: "Pending" },
    { name: "Dossier Preparation & Submission", amount: Math.round(proposal.total * 0.4), dueDate: "", status: "Pending" },
    { name: "Query Response & Approval", amount: Math.round(proposal.total * 0.3), dueDate: "", status: "Pending" },
  ]);

  const updateM = (i, patch) =>
    setMilestones(prev => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m));

  const addM = () =>
    setMilestones(prev => [...prev, { name: "New Milestone", amount: 0, dueDate: "", status: "Pending" }]);

  return (
    <Modal title="Generate Statement of Work" onClose={onClose} wide>
      <div className="mb-3 p-3 rounded-sm" style={{ background: T.tealSoft }}>
        <div className="text-xs font-mono" style={{ color: T.teal }}>
          Consultant {cons?.code} · Proposal {proposal.proposalId}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Start Date">
          <input type="date" className={inputCls} style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
        </Field>
        <Field label="End Date">
          <input type="date" className={inputCls} style={inputStyle} value={endDate} onChange={e => setEndDate(e.target.value)} />
        </Field>
        <Field label="Project POC">
          <input className={inputCls} style={inputStyle} value={poc} onChange={e => setPoc(e.target.value)} placeholder="Name of internal owner" />
        </Field>
      </div>
      <div className="text-xs font-mono uppercase mt-2 mb-2" style={{ color: T.inkSoft }}>Financial Breakdown / Milestones</div>
      <div className="space-y-2 mb-2">
        {milestones.map((m, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className={`${inputCls} col-span-5`} style={inputStyle} value={m.name} onChange={e => updateM(i, { name: e.target.value })} />
            <input type="number" className={`${inputCls} col-span-2`} style={inputStyle} value={m.amount} onChange={e => updateM(i, { amount: Number(e.target.value) })} />
            <input type="date" className={`${inputCls} col-span-3`} style={inputStyle} value={m.dueDate} onChange={e => updateM(i, { dueDate: e.target.value })} />
            <span className="col-span-2 text-xs font-mono text-right" style={{ color: T.inkSoft }}>{fmtMoney(m.amount)}</span>
          </div>
        ))}
      </div>
      <Btn small variant="ghost" icon={Plus} onClick={addM}>Add Milestone</Btn>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm font-semibold" style={{ color: T.ink }}>
          Total: {fmtMoney(milestones.reduce((a, m) => a + Number(m.amount), 0))}
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn icon={Briefcase} onClick={() => onCreate({
            id: uid("SOW"),
            sowId: `SOW-2026-${String(seq).padStart(4, "0")}`,
            proposalId: proposal.proposalId,
            consultantId: cons?.id,
            clientId: proposal.clientId,
            startDate, endDate, poc, milestones,
            total: milestones.reduce((a, m) => a + Number(m.amount), 0),
            status: "Active",
          })}>Create SOW</Btn>
        </div>
      </div>
    </Modal>
  );
}
