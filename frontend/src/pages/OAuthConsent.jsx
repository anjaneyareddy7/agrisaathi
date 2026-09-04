import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Sprout, FileText, Wallet, CloudSun, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';

const SCOPES = [
  { key: 'profile', label: 'Your name and farm profile', icon: Sprout },
  { key: 'records', label: 'Harvest, soil and ledger records', icon: FileText },
  { key: 'payments', label: 'No payment data — read-only access', icon: Wallet },
  { key: 'weather', label: 'Your saved location for weather', icon: CloudSun },
];

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const [decision, setDecision] = useState(null);
  const appName = params.get('client_name') || params.get('client_id') || 'AgriSaathi';
  const redirect = params.get('redirect_uri');

  const decide = (allow) => {
    setDecision(allow ? 'allowed' : 'denied');
    if (redirect) {
      const sep = redirect.includes('?') ? '&' : '?';
      setTimeout(() => { window.location.href = `${redirect}${sep}status=${allow ? 'granted' : 'denied'}`; }, 900);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700"><ShieldCheck size={26} /></span>
          <h1 className="mt-3 text-lg font-bold text-gray-900">Allow access?</h1>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{appName}</span> wants to connect to your AgriSaathi account.
          </p>
        </div>

        <ul className="mt-5 space-y-2.5">
          {SCOPES.map((s) => (
            <li key={s.key} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 px-3.5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-leaf-700 shadow-sm"><s.icon size={16} /></span>
              <span className="text-xs font-medium text-gray-700">{s.label}</span>
            </li>
          ))}
        </ul>

        {decision ? (
          <div className={`mt-5 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold ${decision === 'allowed' ? 'bg-leaf-50 text-leaf-700' : 'bg-red-50 text-red-600'} animate-pop`}>
            {decision === 'allowed' ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
            {decision === 'allowed' ? 'Access granted — returning…' : 'Request denied'}
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <button onClick={() => decide(true)} className="w-full rounded-xl bg-leaf-700 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-800">
              Allow access
            </button>
            <button onClick={() => decide(false)} className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Deny
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-gray-400">
          You can revoke access anytime from Profile → Connected apps.
        </p>
      </div>

      <Link to="/" className="mt-5 flex items-center justify-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600">
        <ChevronLeft size={13} /> Back to AgriSaathi
      </Link>
    </div>
  );
}
