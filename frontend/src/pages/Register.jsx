import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Sprout, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/button';
import { FormField } from '../components/kit';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [show, setShow] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to auth backend
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save your plots, records and get personal advisories."
      footer={<span>Already with us? <Link to="/login" className="font-semibold text-leaf-700 hover:text-leaf-800">Sign in</Link></span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full name">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={form.name} onChange={set('name')} placeholder="Your name" required
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
          </div>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
            </div>
          </FormField>
          <FormField label="Mobile">
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit number" required
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
            </div>
          </FormField>
        </div>

        <FormField label="Password" hint="At least 8 characters">
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Create a password" required minLength={8}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <Button type="submit" size="lg" className="w-full">
          <Sprout size={16} /> Create account
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-gray-400">
          By continuing you agree to use AgriSaathi honestly and kindly.
        </p>
      </form>
    </AuthLayout>
  );
}
