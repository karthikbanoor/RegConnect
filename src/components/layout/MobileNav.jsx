import { T, NAV } from '../../constants';

export default function MobileNav({ activeTab, onTabChange }) {
  return (
    <div className="md:hidden flex gap-1 mb-4 overflow-x-auto pb-2">
      {NAV.map(n => (
        <button
          key={n.k}
          onClick={() => onTabChange(n.k)}
          className="text-xs px-3 py-1.5 rounded-sm whitespace-nowrap"
          style={{
            background: activeTab === n.k ? T.ink : T.panel,
            color: activeTab === n.k ? "#fff" : T.ink,
            border: `1px solid ${T.hair}`,
          }}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}
