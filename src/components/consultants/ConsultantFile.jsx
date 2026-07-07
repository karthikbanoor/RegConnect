import { useState } from 'react';
import { Star, Upload, FolderOpen, Trash2, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { T, REGIONS } from '../../constants';
import { uid, todayISO } from '../../utils';
import { Modal, Pill, Stars, Btn, Field, inputCls, inputStyle } from '../ui';

export default function ConsultantFile({ consultant: c, onClose, onUpdate, onDelete }) {
  const [tab, setTab] = useState("profile");
  const [newDoc, setNewDoc] = useState({ type: "CV", title: "", note: "" });
  const [newRating, setNewRating] = useState({ score: 5, note: "" });
  const [linkedin, setLinkedin] = useState(c.linkedinUrl || "");

  const addDoc = () => {
    if (!newDoc.title.trim()) return;
    onUpdate({ documents: [{ id: uid("DOC"), date: todayISO(), ...newDoc }, ...c.documents] });
    setNewDoc({ type: "CV", title: "", note: "" });
  };

  const removeDoc = (id) => onUpdate({ documents: c.documents.filter(d => d.id !== id) });

  const addRating = () => {
    const log = [{ id: uid("RT"), date: todayISO(), score: Number(newRating.score), note: newRating.note }, ...c.ratingsLog];
    const avg = log.reduce((s, r) => s + r.score, 0) / log.length;
    onUpdate({ ratingsLog: log, rating: avg });
    setNewRating({ score: 5, note: "" });
  };

  const syncLinkedIn = () => {
    onUpdate({ linkedinUrl: linkedin, lastSynced: todayISO() });
  };

  const tabs = [
    { k: "profile", l: "Profile" },
    { k: "docs", l: `Documents (${c.documents.length})` },
    { k: "ratings", l: `Ratings (${c.ratingsLog.length})` },
    { k: "sync", l: "LinkedIn Sync" },
  ];

  return (
    <Modal title={`Consultant File — ${c.code}`} onClose={onClose} wide>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-lg font-medium" style={{ color: T.ink }}>{c.name}</div>
          <div className="text-xs font-mono" style={{ color: T.inkSoft }}>{c.email} · {c.phone}</div>
        </div>
        <Pill tone={c.status === "Available" ? "ink" : "stamp"}>{c.status}</Pill>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: T.hair }}>
        {tabs.map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className="text-xs font-mono uppercase px-3 py-2 -mb-px border-b-2"
            style={{
              borderColor: tab === t.k ? T.stamp : "transparent",
              color: tab === t.k ? T.stamp : T.inkSoft
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <Field label="Region / Country">
            <div style={{ color: T.ink }}>
              {REGIONS.find(r => r.key === c.region)?.label} — {c.country}
            </div>
          </Field>
          <Field label="Years of Experience">
            <div style={{ color: T.ink }}>{c.yearsExp} yrs</div>
          </Field>
          <Field label="Categories">
            <div style={{ color: T.ink }}>{c.categories.join(", ")}</div>
          </Field>
          <Field label="Hourly Rate">
            <input
              type="number"
              className={inputCls}
              style={inputStyle}
              value={c.hourlyRate}
              onChange={e => onUpdate({ hourlyRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputCls}
              style={inputStyle}
              value={c.status}
              onChange={e => onUpdate({ status: e.target.value })}
            >
              <option>Available</option>
              <option>On Assignment</option>
              <option>Inactive</option>
            </select>
          </Field>
          <Field label="Expertise Tags">
            <div className="flex flex-wrap gap-1">
              {c.expertise.map(e => <Pill key={e}>{e}</Pill>)}
            </div>
          </Field>
          <div className="col-span-2">
            <Field label="Internal Notes">
              <textarea
                className={inputCls}
                style={inputStyle}
                rows={2}
                value={c.notes}
                onChange={e => onUpdate({ notes: e.target.value })}
              />
            </Field>
          </div>
          <div className="col-span-2 flex justify-end">
            <Btn variant="stamp" icon={Trash2} small onClick={onDelete}>Remove from Registry</Btn>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === "docs" && (
        <div>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {c.documents.map(d => (
              <div key={d.id} className="flex items-center justify-between p-2.5 rounded-sm border text-xs" style={{ borderColor: T.hair }}>
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} color={T.teal} />
                  <div>
                    <div style={{ color: T.ink }}>{d.title}</div>
                    <div style={{ color: T.slate }}>{d.type} · {d.date} {d.note && `· ${d.note}`}</div>
                  </div>
                </div>
                <button onClick={() => removeDoc(d.id)}>
                  <Trash2 size={13} color={T.stamp} />
                </button>
              </div>
            ))}
            {c.documents.length === 0 && (
              <div className="text-xs" style={{ color: T.slate }}>No documents on file yet.</div>
            )}
          </div>
          <div className="p-3 rounded-sm border" style={{ borderColor: T.hair, background: T.bg }}>
            <div className="text-[11px] font-mono uppercase mb-2" style={{ color: T.inkSoft }}>Add document record</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select className={inputCls} style={inputStyle} value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
                {["CV", "License", "Agreement", "Presentation", "Feedback Form", "Other"].map(t => <option key={t}>{t}</option>)}
              </select>
              <input
                className={`${inputCls} col-span-2`}
                style={inputStyle}
                placeholder="File name / title"
                value={newDoc.title}
                onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
              />
            </div>
            <input
              className={inputCls}
              style={inputStyle}
              placeholder="Note (optional)"
              value={newDoc.note}
              onChange={e => setNewDoc({ ...newDoc, note: e.target.value })}
            />
            <div className="flex justify-end mt-2">
              <Btn small icon={Upload} onClick={addDoc}>Add Record</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Ratings Tab */}
      {tab === "ratings" && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Stars value={c.rating} />
            <span className="text-xs" style={{ color: T.slate }}>{c.ratingsLog.length} review(s)</span>
          </div>
          <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
            {c.ratingsLog.map(r => (
              <div key={r.id} className="p-2.5 rounded-sm border text-xs" style={{ borderColor: T.hair }}>
                <div className="flex justify-between mb-1">
                  <Stars value={r.score} />
                  <span style={{ color: T.slate }}>{r.date}</span>
                </div>
                <div style={{ color: T.ink }}>{r.note}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-sm border" style={{ borderColor: T.hair, background: T.bg }}>
            <div className="text-[11px] font-mono uppercase mb-2" style={{ color: T.inkSoft }}>Log a new rating</div>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setNewRating({ ...newRating, score: n })}>
                  <Star size={18} fill={n <= newRating.score ? T.brass : "none"} color={T.brass} />
                </button>
              ))}
            </div>
            <textarea
              className={inputCls}
              style={inputStyle}
              rows={2}
              placeholder="Feedback note..."
              value={newRating.note}
              onChange={e => setNewRating({ ...newRating, note: e.target.value })}
            />
            <div className="flex justify-end mt-2">
              <Btn small icon={Plus} onClick={addRating}>Add Rating</Btn>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Sync Tab */}
      {tab === "sync" && (
        <div>
          <div className="p-3 rounded-sm border mb-3 flex gap-2 items-start" style={{ borderColor: T.hair, background: T.stampSoft }}>
            <AlertCircle size={16} color={T.stamp} className="shrink-0 mt-0.5" />
            <div className="text-xs" style={{ color: T.ink }}>
              LinkedIn does not offer a public API for scraping profile data, and doing so would violate its Terms of Service —
              so this tool cannot silently auto-pull profile updates. Instead, store the profile URL and use "Mark Synced"
              as a manual review checkpoint (e.g. a quarterly reminder to revisit and refresh this consultant's expertise tags yourself).
            </div>
          </div>
          <Field label="LinkedIn Profile URL">
            <input
              className={inputCls}
              style={inputStyle}
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
          <div className="flex items-center justify-between text-xs mb-3" style={{ color: T.inkSoft }}>
            <span>Last manually synced: {c.lastSynced || "never"}</span>
          </div>
          <Btn small icon={RefreshCw} onClick={syncLinkedIn}>Mark Synced Today</Btn>
        </div>
      )}
    </Modal>
  );
}
