import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, SendHorizonal } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Button } from '../components/ui/button';
import { FormField } from '../components/kit';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a reset link to your registered email."
      footer={<Link to="/login" className="font-semibold text-leaf-700 hover:text-leaf-800">Back to sign in</Link>}
    >
      {sent ? (
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-5 text-center">
          <SendHorizonal size={22} className="mx-auto text-leaf-600" />
          <p className="mt-2 text-sm font-semibold text-leaf-800">Link sent</p>
          <p className="mt-1 text-xs text-leaf-700/80">Check <span className="font-semibold">{email}</span> for the reset link.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
            </div>
          </FormField>
          <Button type="submit" size="lg" className="w-full">
            <SendHorizonal size={16} /> Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
