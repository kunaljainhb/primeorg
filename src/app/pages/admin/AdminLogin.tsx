import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fnrc.gov.ae');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--fnrc-accent-gold)' }}>
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">FNRC Admin Login</CardTitle>
          <CardDescription className="text-center">
            Secure access for FNRC procurement team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fnrc.gov.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white font-bold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Login
            </Button>
            <div className="text-center text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:underline"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}