import Logo from '../components/Logo';

export default function AuthLayout({ eyebrow, title, subtitle, asideQuote, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-sm w-full mx-auto">
          <Logo className="mb-10 block" />
          <p className="text-xs font-medium uppercase tracking-wide text-primary mb-2">{eyebrow}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground flex-col justify-center px-16">
        <p className="text-base max-w-sm leading-relaxed">{asideQuote}</p>
      </div>
    </div>
  );
}
