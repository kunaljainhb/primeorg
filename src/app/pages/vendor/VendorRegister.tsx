import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Building2, QrCode, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { cn } from '@/app/components/ui/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/app/components/ui/tooltip';
import { Info, Eye, EyeOff } from 'lucide-react';
import { useTranslation, useLanguage } from '@/app/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";

export default function VendorRegister() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: 'TechSolutions LLC',
    identifier: 'contact@techsolutions.ae',
    password: '••••••••',
    confirmPassword: '••••••••'
  });
  const [activeStep, setActiveStep] = useState(0); // 0: Registration, 1: Verification, 2: Profile
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showUAEPass, setShowUAEPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Move to verification step
    setActiveStep(1);
    setShowOTPModal(true);
  };

  const handleVerifyOTP = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setActiveStep(2);
      
      // Navigate after success state
      setTimeout(() => {
        setShowOTPModal(false);
        navigate('/vendor/profile-setup');
      }, 1500);
    }, 2000);
  };

  const handleUAEPassClick = () => {
    setShowUAEPass(true);
    setIsScanning(true);
    
    // Simulate QR code scan after 2 seconds
    setTimeout(() => {
      setIsScanning(false);
      setShowUAEPass(false);
      setActiveStep(2);
      navigate('/vendor/profile-setup');
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
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
      <div className="w-full max-w-lg space-y-4 relative z-10">
        <Card className="border-none shadow-xl shadow-black/5 rounded-card">
          <CardHeader className="space-y-2 pb-6 border-b border-border">
            <div className="flex justify-center mb-4">
              <div className="flex h-24 w-24 items-center justify-center">
                <img src="/prime-logo.png" alt="Prime Organization Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              {t("Prime Organization Vendor Registration")}
            </CardTitle>
            <CardDescription className="text-center text-sm font-semibold text-muted-foreground min-h-[40px] px-4">
              {t("Create your account to access Prime Organization vendor portal")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-semibold opacity-70">{t("Company Name (as per Trade License)")}</Label>
                  <Input
                    id="companyName"
                    placeholder={t("Enter official company name")}
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="h-12 bg-gray-50/50 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-semibold opacity-70">{t("Email Address or Mobile Number")}</Label>
                  <Input
                    id="identifier"
                    placeholder={t("e.g. contact@company.ae or +971...")}
                    value={formData.identifier}
                    onChange={(e) => handleChange('identifier', e.target.value)}
                    className="h-12 bg-gray-50/50 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="password" title="Password" className="text-sm font-semibold opacity-70">{t("Password")}</Label>
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
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pe-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="confirmPassword" title="Confirm Password" className="text-sm font-semibold opacity-70">{t("Confirm Password")}</Label>
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
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pe-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agree} onCheckedChange={(checked: boolean) => setAgree(checked)} />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t("I agree to the")} <a href="/terms" target="_blank" className="text-primary hover:underline">{t("Terms of Service")}</a> {t("and")} <a href="/privacy" target="_blank" className="text-primary hover:underline">{t("Privacy Policy")}</a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={false}
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all text-white cursor-pointer"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              >
                {t("Create Account")}
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
                {t("Register Via UAE Pass")}
              </Button>

              <div className="text-center pt-4 border-t border-gray-50">
                <p className="text-sm text-gray-500 font-semibold">
                  {t("Already have an account?")}{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/vendor/login')}
                    className="p-0 h-auto font-bold underline-offset-4 hover:underline cursor-pointer"
                    style={{ color: 'var(--fnrc-primary-green)' }}
                  >
                    {t("Login here")}
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* AuthFooter moved inside the vertical stack */}
        <AuthFooter language={language} setLanguage={setLanguage} t={t} />
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md p-8">
          <DialogHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-50">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">{t("Verification Required")}</DialogTitle>
            <DialogDescription className="text-center text-base">
              {t("We've sent a 6-digit verification code to")} <span className="font-semibold text-gray-900">{formData.identifier}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex justify-between gap-2 dir-ltr">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="h-14 w-12 text-center text-xl font-bold border-2 focus:border-green-600 focus:ring-0 transition-all"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                />
              ))}
            </div>

            <Button
              className="w-full h-12 text-lg font-semibold text-white shadow-lg cursor-pointer"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={handleVerifyOTP}
              disabled={isVerifying || verificationSuccess}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("Verifying...")}
                </div>
              ) : verificationSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {t("Verified Successfully")}
                </div>
              ) : (
                t("Verify OTP")
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 font-semibold">
                {t("Didn't receive the code?")}{' '}
                <button 
                  className="font-bold hover:underline cursor-pointer" 
                  style={{ color: 'var(--fnrc-primary-green)' }}
                  onClick={() => alert(t('OTP Resent'))}
                >
                  {t("Resend OTP")}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* UAE Pass QR Code Dialog */}
      <Dialog open={showUAEPass} onOpenChange={setShowUAEPass}>
        <DialogContent aria-describedby="uaepass-register-description">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-lg">{t("Register with UAE Pass")}</DialogTitle>
          </DialogHeader>
          <div id="uaepass-register-description" className="flex flex-col items-center justify-center space-y-4 py-6">
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