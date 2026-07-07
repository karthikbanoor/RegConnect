import { T } from '../../constants';

export default function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-[11px] font-mono uppercase tracking-wide mb-1" style={{ color: T.inkSoft }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls = "w-full text-sm px-2.5 py-2 rounded-sm border outline-none focus:ring-2";
export const inputStyle = { borderColor: T.hair, color: T.ink };
