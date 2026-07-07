import { X } from 'lucide-react';
import { T } from '../../constants';

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-3"
      style={{ background: "rgba(18,33,59,0.55)" }}
    >
      <div className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-sm shadow-xl`} style={{ background: T.panel }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: T.hair }}>
          <h3 style={{ color: T.ink, fontFamily: "'Source Serif 4', serif" }} className="text-lg">
            {title}
          </h3>
          <button onClick={onClose}>
            <X size={18} color={T.inkSoft} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
