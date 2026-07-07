import { MapPin } from 'lucide-react';
import { T, CATEGORIES, REGIONS } from '../../constants';

export default function RegionRegistry({ consultants, onSelectRegion, selectedRegion }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {REGIONS.map(r => {
        const list = consultants.filter(c => c.region === r.key);
        const byCat = CATEGORIES.map(cat => ({
          cat, n: list.filter(c => c.categories.includes(cat)).length
        }));
        const active = selectedRegion === r.key;

        return (
          <button
            key={r.key}
            onClick={() => onSelectRegion(active ? null : r.key)}
            className="text-left p-3.5 rounded-sm border transition-all group"
            style={{
              borderColor: active ? T.stamp : T.hair,
              background: active ? T.stampSoft : T.panel,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} color={T.stamp} />
                <span className="text-sm font-medium" style={{ color: T.ink }}>{r.label}</span>
              </div>
              <span className="font-mono text-lg" style={{ color: T.ink }}>{list.length}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {byCat.map(b => (
                <span
                  key={b.cat}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm"
                  style={{ background: T.tealSoft, color: T.teal }}
                >
                  {b.cat.slice(0, 4)} {b.n}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
