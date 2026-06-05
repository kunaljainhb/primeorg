import { useNavigate } from '@/app/context/RouterContext';
import { Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-8" style={{ backgroundColor: '#F7F9FC' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center">
              <img src="/fnrc-logo.png" alt="FNRC Logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
            Welcome to FNRC Vendor Portal
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Vendor Portal */}
          <Card className="border-2 transition-all hover:shadow-lg" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <CardHeader className="space-y-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                <Building2 className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
              </div>
              <CardTitle className="text-2xl">Vendor Portal</CardTitle>
              <CardDescription className="text-base">
                For registered vendors to participate in FNRC Tenders and submit proposals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                <p>• View and respond to Tenders</p>
                <p>• Submit technical and commercial proposals</p>
                <p>• Track proposal status</p>
                <p>• Manage company profile and documents</p>
              </div>
              <Button 
                className="w-full text-white"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/landing')}
              >
                Continue as Vendor
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="border-2 transition-all hover:shadow-lg" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <CardHeader className="space-y-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-accent-gold)', opacity: 0.1 }}></div>
                <Shield className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-accent-gold)' }} />
              </div>
              <CardTitle className="text-2xl">FNRC Admin Portal</CardTitle>
              <CardDescription className="text-base">
                For FNRC internal procurement & administration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                <p>• Manage vendor registrations and approvals</p>
                <p>• Create and manage Tenders</p>
                <p>• Review and evaluate proposals</p>
                <p>• Generate reports and audit logs</p>
              </div>
              <Button 
                className="w-full text-white"
                style={{ backgroundColor: 'var(--fnrc-accent-gold)' }}
                onClick={() => navigate('/admin/login')}
              >
                Continue as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
          <p>© 2026 Fujairah Natural Resources Corporation. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}