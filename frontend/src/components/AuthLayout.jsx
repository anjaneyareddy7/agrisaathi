import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sprout, CloudSun } from 'lucide-react';
import Logo from './Logo';

/** Shared shell for auth screens (login / register / reset). */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col px-4 pb-10 pt-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-leaf-700">
        <ArrowLeft size={14} /> Back to home
      </Link>

      <div className="mt-6 animate-fade-up rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <Logo />
        <h1 className="mt-5 text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && <div className="mt-4 text-center text-sm text-gray-500">{footer}</div>}

      <div className="mt-auto pt-8">
        <div className="flex items-center justify-center gap-5 text-[11px] font-medium text-gray-400">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} /> Your data stays yours</span>
          <span className="inline-flex items-center gap-1.5"><Sprout size={13} /> Free for farmers</span>
          <span className="inline-flex items-center gap-1.5"><CloudSun size={13} /> Works offline</span>
        </div>
      </div>
    </div>
  );
}
