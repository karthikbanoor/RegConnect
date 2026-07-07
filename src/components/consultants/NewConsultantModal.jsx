import { useState } from 'react';
import { T, CATEGORIES, REGIONS } from '../../constants';
import { uid } from '../../utils';
import { Modal, Btn, Field, inputCls, inputStyle } from '../ui';

export default function NewConsultantModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", region: "NA", country: "", categories: [],
    expertiseText: "", yearsExp: 5, hourlyRate: 90, notes: ""
  });

  const toggleCat = (c) => setForm(f => ({
    ...f,
    categories: f.categories.includes(c) ? f.categories.filter(x => x !== c) : [...f.categories, c]
  }));

  const submit = () => {
    if (!form.name.trim()) return;
    const region = form.region;
    const code = uid(`RA-${region}`);
    onCreate({
      id: uid("CN"), code, name: form.name, email: form.email, phone: form.phone,
      region, country: form.country,
      categories: form.categories.length ? form.categories : [CATEGORIES[0]],
      expertise: form.expertiseText.split(",").map(s => s.trim()).filter(Boolean),
      yearsExp: Number(form.yearsExp), hourlyRate: Number(form.hourlyRate),
      rating: 0, ratingsLog: [], documents: [], linkedinUrl: "", lastSynced: null,
      status: "Available", notes: form.notes,
    });
  };

  return (
    <Modal title="Add Consultant to Registry" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Full Name (internal only)">
          <input className={inputCls} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Country">
          <input className={inputCls} style={inputStyle} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className={inputCls} style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className={inputCls} style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Region">
          <select className={inputCls} style={inputStyle} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
            {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </Field>
        <Field label="Years of Experience">
          <input type="number" className={inputCls} style={inputStyle} value={form.yearsExp} onChange={e => setForm({ ...form, yearsExp: e.target.value })} />
        </Field>
        <Field label="Hourly Rate (USD)">
          <input type="number" className={inputCls} style={inputStyle} value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
        </Field>
      </div>
      <Field label="Product Categories">
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => toggleCat(c)}
              type="button"
              className="text-xs px-2.5 py-1.5 rounded-sm border"
              style={{
                borderColor: form.categories.includes(c) ? T.teal : T.hair,
                background: form.categories.includes(c) ? T.tealSoft : "transparent",
                color: form.categories.includes(c) ? T.teal : T.inkSoft
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Expertise Tags (comma separated)">
        <input
          className={inputCls}
          style={inputStyle}
          placeholder="EU MDR, FDA 510(k), ..."
          value={form.expertiseText}
          onChange={e => setForm({ ...form, expertiseText: e.target.value })}
        />
      </Field>
      <Field label="Internal Notes">
        <textarea className={inputCls} style={inputStyle} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </Field>
      <div className="flex justify-end gap-2 mt-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit}>Save to Registry</Btn>
      </div>
    </Modal>
  );
}
