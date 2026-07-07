import { T } from '../../constants';

export default function SectionLabel({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-4 border-b pb-3" style={{ borderColor: T.hair }}>
      <div>
        <div className="text-[11px] font-mono tracking-[0.18em] uppercase mb-1" style={{ color: T.stamp }}>
          {eyebrow}
        </div>
        <h2 className="text-xl" style={{ color: T.ink, fontFamily: "'Source Serif 4', serif" }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}
