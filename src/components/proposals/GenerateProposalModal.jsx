import { useState } from 'react';
import { FileText } from 'lucide-react';
import { T } from '../../constants';
import { uid, fmtMoney } from '../../utils';
import { Modal, Btn, Field, inputCls, inputStyle } from '../ui';

export default function GenerateProposalModal({ inquiry, consultants, clients, onClose, onCreate, seq }) {
  const cons = consultants.find(c => c.id === inquiry.consultantId);
  const [estHours, setEstHours] = useState(80);
  const [margin, setMargin] = useState(35);
  const [scope, setScope] = useState(inquiry.description);
  const rate = cons?.hourlyRate || 0;
  const clientRate = Math.round(rate * (1 + margin / 100));
  const total = clientRate * Number(estHours || 0);

  return (
    <Modal title="Generate Proposal" onClose={onClose} wide>
      <div className="mb-3 p-3 rounded-sm" style={{ background: T.tealSoft }}>
        <div className="text-xs font-mono" style={{ color: T.teal }}>
          Consultant {cons?.code} · Base rate {fmtMoney(rate)}/hr
        </div>
      </div>
      <Field label="Scope of Work">
        <textarea className={inputCls} style={inputStyle} rows={3} value={scope} onChange={e => setScope(e.target.value)} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Estimated Hours">
          <input type="number" className={inputCls} style={inputStyle} value={estHours} onChange={e => setEstHours(e.target.value)} />
        </Field>
        <Field label="Margin (%)">
          <input type="number" className={inputCls} style={inputStyle} value={margin} onChange={e => setMargin(e.target.value)} />
        </Field>
        <Field label="Client Rate (auto)">
          <div className="text-sm font-mono py-2" style={{ color: T.ink }}>{fmtMoney(clientRate)}/hr</div>
        </Field>
      </div>
      <div className="text-lg font-semibold mt-2 mb-4" style={{ color: T.ink }}>Total: {fmtMoney(total)}</div>
      <div className="flex justify-end gap-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn icon={FileText} onClick={() => onCreate({
          id: uid("PR"),
          proposalId: `PRO-2026-${String(seq).padStart(4, "0")}`,
          inquiryId: inquiry.id,
          consultantId: cons?.id,
          clientId: inquiry.clientId,
          scope, estHours: Number(estHours), rate, clientRate, total, status: "Draft",
        })}>Create Proposal</Btn>
      </div>
    </Modal>
  );
}
