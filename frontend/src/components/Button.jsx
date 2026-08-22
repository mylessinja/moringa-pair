// The ONE Button everyone imports. Nobody writes their own <button> styling.
export default function Button({ children, variant = 'primary', icon, className = '', ...props }) {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
 