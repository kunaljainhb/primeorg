import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Shield, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { useTranslation, useLanguage } from '@/app/context/LanguageContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fnrc.gov.ae');
  const [password, setPassword] = useState('••••••••');
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguage();
  
  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error(t('Please enter a valid email address'));
      return;
    }
    toast.success(`${t('A secure password reset link has been sent to')} ${resetEmail}`);
    setIsForgotPassword(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 relative overflow-hidden bg-background">
      {/* Floating Language Toggle */}
      <div className="absolute top-4 end-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 text-xs font-semibold bg-white border border-gray-300 shadow-sm rounded-full hover:bg-gray-50 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] uppercase font-bold">
            {language === 'en' ? 'ar' : 'en'}
          </span>
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23000000' stroke-width='1'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23000000' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center">
              <img src="/fnrc-logo.png" alt="FNRC Logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
            {isForgotPassword ? t('Reset Password') : t('Admin Portal')}
          </CardTitle>
          <CardDescription className="text-center text-sm font-semibold min-h-[40px] px-4">
            {isForgotPassword 
              ? t('Enter your registered email address') 
              : t('Secure access for FNRC procurement team')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">{t('Email Address')}</Label>
                <div className="relative">
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="admin@fnrc.gov.ae"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="ps-9"
                    required
                  />
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full text-white font-bold h-11 cursor-pointer"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              >
                {t('Submit')}
              </Button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm font-semibold hover:underline text-[var(--fnrc-primary-green)] flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} /> {t('Back to Login')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('Email Address')}</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('Password')}</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsForgotPassword(true);
                    }}
                    className="text-xs font-semibold hover:underline text-[var(--fnrc-primary-green)] cursor-pointer"
                  >
                    {t('Forgot Password?')}
                  </button>
                </div>
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
                className="w-full text-white font-bold h-11 cursor-pointer"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              >
                {t('Login')}
              </Button>
              <div className="text-center text-sm pt-2" style={{ color: 'var(--fnrc-text-muted)' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer font-semibold"
                >
                  <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} /> {t('Back to Home')}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}