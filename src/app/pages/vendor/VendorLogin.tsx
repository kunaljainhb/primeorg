import { Building2, QrCode, Mail, Lock, Info, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/app/components/ui/tooltip';
import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { useTranslation, useLanguage } from '@/app/context/LanguageContext';

export default function VendorLogin() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguage();
  const [email, setEmail] = useState('vendor@techsolutions.ae');
  const [password, setPassword] = useState('••••••••');
  const [showUAEPass, setShowUAEPass] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Request, 2: Reset
  const [resetData, setResetData] = useState({
    identifier: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isResetting, setIsResetting] = useState(false);
  
  // Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect directly to dashboard
    navigate('/vendor/dashboard');
  };

  const handleUAEPassClick = () => {
    setShowUAEPass(true);
    setIsScanning(true);
    
    // Simulate QR code scan after 3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setShowUAEPass(false);
      navigate('/vendor/dashboard');
    }, 3000);
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    // Simulate sending code
    setTimeout(() => {
      setIsResetting(false);
      setForgotStep(2);
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    // Simulate password reset
    setTimeout(() => {
      setIsResetting(false);
      setIsForgotMode(false);
      setForgotStep(1);
      alert(t('Password has been reset successfully. Please login with your new password.'));
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23000000' stroke-width='1'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23000000' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      <div className="w-full max-w-md space-y-8 relative z-10">
        <Card className="border-none shadow-xl shadow-black/5 rounded-card">
          <CardHeader className="space-y-2 pb-6 border-b border-border">
            <div className="flex justify-center mb-4">
              <div className="flex h-24 w-24 items-center justify-center">
                <img src="/prime-logo.png" alt="Prime Organization Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              {t("Prime Organization Vendor Portal")}
            </CardTitle>
            <CardDescription className="text-center text-sm font-semibold text-muted-foreground px-4">
              {t("Sign in to manage your vendor portal")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            {!isForgotMode ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold opacity-70">{t("Email Address or Mobile Number")}</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="text"
                        placeholder={t("Email Address or Mobile Number")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all ps-10"
                        required
                      />
                      <div className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="password" title="Password" className="text-sm font-semibold opacity-70">{t("Password")}</Label>
                      </div>
                      <Button 
                        type="button"
                        variant="link" 
                        className="p-0 h-auto text-xs font-semibold cursor-pointer" 
                        style={{ color: 'var(--fnrc-primary-green)' }}
                        onClick={() => setIsForgotMode(true)}
                      >
                        {t("Forgot Password?")}
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all ps-10 pe-10"
                        required
                      />
                      <div className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                >
                  {t("Login")}
                </Button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="px-4 bg-white text-gray-400 font-bold">
                      {t("Or continue with")}
                    </span>
                  </div>
                </div>

                {/* UAE Pass Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 hover:bg-gray-50 text-foreground hover:text-foreground transition-all font-semibold cursor-pointer"
                  onClick={handleUAEPassClick}
                  style={{ borderColor: 'var(--fnrc-border-gray)' }}
                >
                  <QrCode className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                  {t("Login with UAE Pass")}
                </Button>

                <div className="text-center pt-4 border-t border-gray-50">
                  <p className="text-sm text-gray-500 font-semibold">
                    {t("Don't have an account?")}{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => navigate('/vendor/register')}
                      className="p-0 h-auto font-bold underline-offset-4 hover:underline cursor-pointer"
                      style={{ color: 'var(--fnrc-primary-green)' }}
                    >
                      {t("Register here")}
                    </Button>
                  </p>
                </div>
              </form>
            ) : forgotStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resetIdentifier" className="text-sm font-semibold opacity-70">{t("Email Address or Mobile Number")}</Label>
                  <div className="relative">
                    <Input
                      id="resetIdentifier"
                      placeholder="e.g. vendor@company.ae"
                      value={resetData.identifier}
                      onChange={(e) => setResetData({...resetData, identifier: e.target.value})}
                      className="h-12 bg-gray-50/50 focus:bg-white transition-all ps-10"
                      required
                    />
                    <div className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 font-semibold">
                    {t("Enter your registered email or mobile to receive a reset code.")}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold shadow-lg text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  disabled={isResetting}
                >
                  {isResetting ? t("Sending Code...") : t("Send Reset Code")}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsForgotMode(false)}
                    className="text-sm font-semibold cursor-pointer"
                    style={{ color: 'var(--fnrc-text-muted)' }}
                  >
                    {t("Back to Login")}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetCode" className="text-sm font-semibold opacity-70">{t("Reset Code")}</Label>
                    <Input
                      id="resetCode"
                      placeholder={t("Enter 6-digit code")}
                      value={resetData.code}
                      onChange={(e) => setResetData({...resetData, code: e.target.value})}
                      className="h-12 bg-gray-50/50 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="newPassword" title="New Password" className="text-sm font-semibold opacity-70">{t("New Password")}</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="max-w-[200px] text-xs font-semibold">{t("Strong password recommendation: Minimum 8 characters, including uppercase, lowercase, numbers, and special characters.")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showResetNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={resetData.newPassword}
                        onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pe-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                      >
                        {showResetNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="confirmNewPassword" title="Confirm Password" className="text-sm font-semibold opacity-70">{t("Confirm Password")}</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="max-w-[200px] text-xs font-semibold">{t("Passwords must match.")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showResetConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={resetData.confirmPassword}
                        onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pe-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      >
                        {showResetConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold shadow-lg text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  disabled={isResetting}
                >
                  {isResetting ? t("Resetting...") : t("Reset Password")}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setForgotStep(1)}
                    className="text-sm font-semibold cursor-pointer"
                    style={{ color: 'var(--fnrc-text-muted)' }}
                  >
                    {t("Resend Code")}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* AuthFooter moved inside the vertical stack */}
        <AuthFooter language={language} setLanguage={setLanguage} t={t} />
      </div>

      {/* UAE Pass QR Code Dialog */}
      <Dialog open={showUAEPass} onOpenChange={setShowUAEPass}>
        <DialogContent aria-describedby="uaepass-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-lg">{t("Login with UAE Pass")}</DialogTitle>
          </DialogHeader>
          <div id="uaepass-dialog-description" className="flex flex-col items-center justify-center space-y-4 py-6">
            {/* QR Code Placeholder */}
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: '#F7F9FC' }}>
              <div className="text-center">
                <QrCode className="mx-auto h-48 w-48" style={{ color: 'var(--fnrc-text-muted)' }} />
              </div>
            </div>
            
            {/* Helper Text */}
            <div className="text-center space-y-2">
              <p className="font-bold text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>
                {t("Scan using UAE Pass mobile application")}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--fnrc-text-muted)' }}>
                {isScanning ? t("Waiting for authentication...") : t("Authentication successful!")}
              </p>
            </div>

            {/* Loading indicator */}
            {isScanning && (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: 'var(--fnrc-primary-green)', animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: 'var(--fnrc-primary-green)', animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: 'var(--fnrc-primary-green)', animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AuthFooterProps {
  language: string;
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

function AuthFooter({ language, setLanguage, t }: AuthFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-transparent py-4 px-6 flex items-center justify-between text-sm text-gray-500">

      {/* Left side: Terms and Privacy */}
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-[var(--fnrc-primary-green)] transition-colors hover:underline">{t('Terms and Conditions')}</a>
        <a href="#" className="hover:text-[var(--fnrc-primary-green)] transition-colors hover:underline">{t('Privacy Policy')}</a>
      </div>

      {/* Center: Language selection */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage('en')}
          className={`gap-2 h-8 px-3 rounded-full border transition-all cursor-pointer ${language === 'en' ? 'border-gray-250 bg-white shadow-xs hover:bg-gray-50 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-900'}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[9px] font-bold">EN</span>
          <span className="text-xs font-semibold">English</span>
        </Button>
        <span className="text-gray-200">|</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage('ar')}
          className={`gap-2 h-8 px-3 rounded-full border transition-all cursor-pointer ${language === 'ar' ? 'border-gray-250 bg-white shadow-xs hover:bg-gray-50 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-900'}`}
        >
          <span className="text-xs font-semibold">العربية</span>
        </Button>
      </div>

      {/* Right side: Copyright */}
      <p className="text-xs uppercase tracking-widest font-bold text-gray-350 mb-0">
        © {new Date().getFullYear()} {t('Prime Organization Procurement Portal')}
      </p>
    </footer>
  );
}