import { useNavigate } from '@/app/context/RouterContext';
import { Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useTranslation, useLanguage } from '@/app/context/LanguageContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center p-8 relative" style={{ backgroundColor: '#F7F9FC' }}>
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

      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center">
              <img src="/prime-logo.png" alt="Prime Organization Logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold" style={{ color: 'var(--fnrc-primary-green)' }}>
            {t("Welcome to Prime Organization Portal")}
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }} className="text-[15px] font-medium">
            {t("Select your role to continue")}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Vendor Portal */}
          <Card className="border-2 transition-all hover:shadow-lg rounded-card" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <CardHeader className="space-y-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                <Building2 className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
              </div>
              <CardTitle className="text-2xl font-bold">{t("Vendor Portal")}</CardTitle>
              <CardDescription className="text-sm font-medium text-gray-500 min-h-[40px]">
                {t("For registered vendors to participate in Prime Organization Tenders and submit proposals")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                <p>• {t("View and respond to Tenders")}</p>
                <p>• {t("Submit technical and commercial proposals")}</p>
                <p>• {t("Track proposal status")}</p>
                <p>• {t("Manage company profile and documents")}</p>
              </div>
              <Button 
                className="w-full text-white cursor-pointer"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/login')}
              >
                {t("Continue as Vendor")}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="border-2 transition-all hover:shadow-lg rounded-card" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <CardHeader className="space-y-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-accent-gold)', opacity: 0.1 }}></div>
                <Shield className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-accent-gold)' }} />
              </div>
              <CardTitle className="text-2xl font-bold">{t("Admin Portal")}</CardTitle>
              <CardDescription className="text-sm font-medium text-gray-500 min-h-[40px]">
                {t("For Prime Organization internal procurement & administration")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                <p>• {t("Manage vendor registrations and approvals")}</p>
                <p>• {t("Create and manage Tenders")}</p>
                <p>• {t("Review and evaluate proposals")}</p>
                <p>• {t("Generate reports and audit logs")}</p>
              </div>
              <Button 
                className="w-full text-white cursor-pointer"
                style={{ backgroundColor: 'var(--fnrc-accent-gold)' }}
                onClick={() => navigate('/admin/login')}
              >
                {t("Continue as Admin")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs font-semibold" style={{ color: 'var(--fnrc-text-muted)' }}>
          <p>{t("© 2026 Prime Organization. All rights reserved.")}</p>
        </div>
      </div>
    </div>
  );
}