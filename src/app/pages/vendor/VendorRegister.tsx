import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Building2, QrCode, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { cn } from '@/app/components/ui/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/app/components/ui/tooltip';
import { Info, Eye, EyeOff } from 'lucide-react';

export default function VendorRegister() {
  const navigate = useNavigate();
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
  const [showUAEPass, setShowUAEPass] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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
      <div className="w-full max-w-xl space-y-8 relative z-10">
        <Card className="border-none shadow-xl shadow-black/5">
          <CardHeader className="space-y-2 pb-6 border-b border-border">
            <div className="flex justify-center mb-4">
              <div className="flex h-24 w-24 items-center justify-center">
                <img src="/fnrc-logo.png" alt="FNRC Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              FNRC Vendor Registration
            </CardTitle>
            <CardDescription className="text-center text-base font-medium text-muted-foreground">
              Create your enterprise account to access FNRC procurement portal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-semibold opacity-70">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter official company name"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="h-12 bg-gray-50/50 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-semibold opacity-70">Email Address or Mobile Number</Label>
                  <Input
                    id="identifier"
                    placeholder="e.g. contact@company.ae or +971..."
                    value={formData.identifier}
                    onChange={(e) => handleChange('identifier', e.target.value)}
                    className="h-12 bg-gray-50/50 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="password" title="Password" className="text-sm font-semibold opacity-70">Password</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="max-w-[200px]">Strong password recommendation: Minimum 8 characters, including uppercase, lowercase, numbers, and special characters.</p>
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
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                      <Label htmlFor="confirmPassword" title="Confirm Password" className="text-sm font-semibold opacity-70">Confirm Password</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="max-w-[200px]">Passwords must match.</p>
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
                        className="h-12 bg-gray-50/50 focus:bg-white transition-all pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-4 bg-white text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* UAE Pass Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-gray-50 text-foreground hover:text-foreground transition-all font-semibold"
                onClick={handleUAEPassClick}
                style={{ borderColor: 'var(--fnrc-border-gray)' }}
              >
                <QrCode className="mr-2 h-5 w-5" />
                Register Via UAE Pass
              </Button>

              <div className="text-center pt-4 border-t border-gray-50">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/vendor/login')}
                    className="p-0 h-auto font-bold underline-offset-4 hover:underline"
                    style={{ color: 'var(--fnrc-primary-green)' }}
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AuthFooter moved inside the vertical stack */}
        <AuthFooter />
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
            <DialogTitle className="text-center text-2xl font-bold">Verification Required</DialogTitle>
            <DialogDescription className="text-center text-base">
              We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{formData.identifier}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex justify-between gap-2">
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
              className="w-full h-12 text-lg font-semibold text-white shadow-lg"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={handleVerifyOTP}
              disabled={isVerifying || verificationSuccess}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </div>
              ) : verificationSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Verified Successfully
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button 
                  className="font-bold hover:underline" 
                  style={{ color: 'var(--fnrc-primary-green)' }}
                  onClick={() => alert('OTP Resent')}
                >
                  Resend OTP
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
            <DialogTitle className="text-center">Register with UAE Pass</DialogTitle>
          </DialogHeader>
          <div id="uaepass-register-description" className="flex flex-col items-center justify-center space-y-4 py-6">
            {/* QR Code Placeholder */}
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
              <div className="text-center">
                <QrCode className="mx-auto h-48 w-48" style={{ color: 'var(--fnrc-text-muted)' }} />
              </div>
            </div>
            
            {/* Helper Text */}
            <div className="text-center space-y-2">
              <p className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                Scan using UAE Pass mobile application
              </p>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                {isScanning ? 'Waiting for authentication...' : 'Authentication successful!'}
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

function AuthFooter() {
  return (
    <footer className="mt-8 text-center space-y-4">
      <div className="flex items-center justify-center gap-6 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
        <a href="#" className="hover:underline hover:text-green-700 transition-colors">Terms and Conditions</a>
        <a href="#" className="hover:underline hover:text-green-700 transition-colors">Privacy Policy</a>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-3 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-gray-100 hover:text-gray-900 transition-all">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[9px] font-bold">EN</span>
          <span className="text-xs font-semibold">English</span>
        </Button>
        <span className="text-gray-300">|</span>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-3 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all">
          <span className="text-xs font-semibold">العربية</span>
        </Button>
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">
        © 2026 FNRC Procurement Portal
      </p>
    </footer>
  );
}