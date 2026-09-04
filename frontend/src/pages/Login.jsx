import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/button';
import { FormField } from '../components/kit';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to auth backend
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to sync your farm records across devices."
      footer={<span>New to AgriSaathi? <Link to="/register" className="font-semibold text-leaf-700 hover:text-leaf-800">Create an account</Link></span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
            />
          </div>
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-semibold text-leaf-700 hover:text-leaf-800">Forgot password?</Link>
        </div>

        <Button type="submit" size="lg" className="w-full">
          <LogIn size={16} /> Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
