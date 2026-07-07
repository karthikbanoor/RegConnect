import { Star } from 'lucide-react';
import { T } from '../../constants';

export default function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color: T.brass }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} fill={i <= full ? T.brass : "none"} strokeWidth={1.5} />
      ))}
      <span className="ml-1 text-xs font-mono" style={{ color: T.inkSoft }}>
        {value.toFixed(1)}
      </span>
    </span>
  );
}
