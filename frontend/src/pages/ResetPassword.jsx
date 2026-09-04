import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/button';
import { FormField } from '../components/kit';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirm) setDone(true);
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Make it strong — at least 8 characters."
      footer={<Link to="/login" className="font-semibold text-leaf-700 hover:text-leaf-800">Back to sign in</Link>}
    >
      {done ? (
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-5 text-center">
          <ShieldCheck size={22} className="mx-auto text-leaf-600" />
          <p className="mt-2 text-sm font-semibold text-leaf-800">Password updated</p>
          <p className="mt-1 text-xs text-leaf-700/80">Your new password is ready to use.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="New password">
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                placeholder="New password"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm password">
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                placeholder="Repeat new password"
                className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:ring-4 ${
                  mismatch ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-leaf-500 focus:ring-leaf-100'
                }`} />
            </div>
          </FormField>
          {mismatch && <p className="text-xs font-medium text-red-500">Passwords do not match</p>}

          <Button type="submit" size="lg" className="w-full" disabled={mismatch || password.length < 8}>
            Update password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
