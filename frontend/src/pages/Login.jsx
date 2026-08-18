import { useState } from 'react'
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your auth backend
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-lg font-semibold text-center">Sign in</h1>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Sign in</Button>
        </CardContent>
      </Card>
    </div>
  );
}
