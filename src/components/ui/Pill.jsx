import { T } from '../../constants';

const toneMap = {
  ink: { bg: T.tealSoft, color: T.teal },
  stamp: { bg: T.stampSoft, color: T.stamp },
  brass: { bg: "#F3ECDD", color: T.brass },
  slate: { bg: "#EEF0F3", color: T.inkSoft },
};

export default function Pill({ children, tone = "ink" }) {
  const s = toneMap[tone] || toneMap.ink;
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-sm"
    >
      {children}
    </span>
  );
}
