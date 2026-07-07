import { FileText } from 'lucide-react';
import { T, STAGES } from '../../constants';
import { SectionLabel, Pill, Btn } from '../ui';

export default function Inquiries({ inquiries, setInquiries, consultants, clients, onCreateProposal }) {
  const clientName = (id) => clients.find(c => c.id === id)?.company || "Unknown Client";
  const consultantCode = (id) => consultants.find(c => c.id === id)?.code || "—";

  const assign = (id, consultantId) =>
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, consultantId, stage: "Matched" } : i));

  const setStage = (id, stage) =>
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, stage } : i));

  return (
    <div className="space-y-4">
      <SectionLabel eyebrow="Intake" title="Client Inquiries" />
      <div className="space-y-3">
        {inquiries.map(inq => (
          <div key={inq.id} className="p-4 rounded-sm border" style={{ borderColor: T.hair, background: T.panel }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium" style={{ color: T.ink }}>{inq.title}</div>
                <div className="text-xs font-mono" style={{ color: T.inkSoft }}>
                  {clientName(inq.clientId)} · {inq.createdAt}
                </div>
              </div>
              <Pill tone={inq.stage === "New" ? "stamp" : inq.stage === "Won" ? "ink" : "brass"}>
                {inq.stage}
              </Pill>
            </div>
            <p className="text-xs mb-3" style={{ color: T.inkSoft }}>{inq.description}</p>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={inq.consultantId || ""}
                onChange={e => assign(inq.id, e.target.value)}
                className="text-xs px-2 py-1.5 rounded-sm border"
                style={{ borderColor: T.hair }}
              >
                <option value="">Assign consultant...</option>
                {consultants.filter(c => c.categories.includes(inq.category) || c.region === inq.region).map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.expertise[0]}</option>
                ))}
              </select>
              <select
                value={inq.stage}
                onChange={e => setStage(inq.id, e.target.value)}
                className="text-xs px-2 py-1.5 rounded-sm border"
                style={{ borderColor: T.hair }}
              >
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
              {inq.consultantId && (
                <Btn small icon={FileText} onClick={() => onCreateProposal(inq)}>Generate Proposal</Btn>
              )}
              <span className="text-xs font-mono ml-auto" style={{ color: T.slate }}>
                Matched: {consultantCode(inq.consultantId)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
