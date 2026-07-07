import { useState } from 'react';
import { Send } from 'lucide-react';
import { Btn, Field, inputCls, inputStyle } from '../ui';

export default function RequestForm({ consultant, onSubmit, onCancel }) {
  const [desc, setDesc] = useState("");

  return (
    <div>
      <Field label={`Describe your requirement for ${consultant.code}`}>
        <textarea
          className={inputCls}
          style={inputStyle}
          rows={4}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. Product category, target country, timeline, scope of registration support needed..."
        />
      </Field>
      <div className="flex justify-end gap-2">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn icon={Send} onClick={() => onSubmit(desc)}>Submit Inquiry</Btn>
      </div>
    </div>
  );
}
