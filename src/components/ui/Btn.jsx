import { T } from '../../constants';

const variantStyles = {
  primary: { background: T.ink, color: "#fff" },
  stamp: { background: T.stamp, color: "#fff" },
  ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.hair}` },
  subtle: { background: T.tealSoft, color: T.teal },
};

export default function Btn({ children, onClick, variant = "primary", icon: Icon, small, type = "button", disabled }) {
  const base = "inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const size = small ? "text-xs px-2.5 py-1.5" : "text-sm px-3.5 py-2";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${size}`}
      style={variantStyles[variant]}
    >
      {Icon && <Icon size={small ? 13 : 15} />}
      {children}
    </button>
  );
}
