const variantStyles = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function Badge({ children, variant = 'neutral', dot = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
