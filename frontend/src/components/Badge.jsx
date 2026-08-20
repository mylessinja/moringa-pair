const variantStyles = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
};

// Small status pill — matches the Approved/Pending/Suspended badges
// and the skill tags (React, Figma, etc.) in the Figma design.
// <Badge variant="success">Approved</Badge>
export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
