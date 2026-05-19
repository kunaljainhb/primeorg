import { useNavigate } from '@/app/context/RouterContext';
import { Building2, FileText, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Header } from '@/app/components/layout/Header';

export default function VendorLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <Header role="public" />
      
      {/* Hero Section */}
      <section className="border-b bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
        <div className="mx-auto max-w-7xl px-8 py-20">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
              FNRC Vendor Portal
            </h1>
            <p className="mb-8 text-xl" style={{ color: 'var(--fnrc-text-muted)' }}>
              Your gateway to government procurement opportunities
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                className="text-white"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/register')}
              >
                Vendor Registration
              </Button>
              <Button 
                size="lg"
                variant="outline"
                style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/login')}
              >
                Vendor Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About FNRC */}
      <section className="border-b bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
        <div className="mx-auto max-w-7xl px-8 py-16">
          <h2 className="mb-8 text-center text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            About FNRC Procurement
          </h2>
          <div className="mx-auto max-w-3xl text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
            <p className="mb-4 text-lg">
              The Fujairah Natural Resources Corporation (FNRC) is committed to transparent and efficient procurement practices.
              Our vendor portal provides a streamlined platform for suppliers to access RFP opportunities and submit proposals.
            </p>
            <p className="text-lg">
              Join our network of trusted vendors and participate in government procurement initiatives that drive
              sustainable development in Fujairah.
            </p>
          </div>
        </div>
      </section>

      {/* Procurement Process */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="mb-12 text-center text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                    <Users className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  1. Register
                </h3>
                <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Create your vendor account and complete your company profile
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                    <CheckCircle className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  2. Get Approved
                </h3>
                <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Submit required documents for FNRC verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                    <FileText className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  3. Browse RFPs
                </h3>
                <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Access active RFPs matching your service categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--fnrc-primary-green)', opacity: 0.1 }}></div>
                    <Building2 className="h-8 w-8 relative z-10" style={{ color: 'var(--fnrc-primary-green)' }} />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  4. Submit Proposals
                </h3>
                <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Prepare and submit your technical and commercial proposals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
        <div className="mx-auto max-w-7xl px-8 text-center text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
          <p>© 2026 Fujairah Natural Resources Corporation. All rights reserved.</p>
          <p className="mt-2">For support, contact: procurement@fnrc.gov.ae</p>
        </div>
      </footer>
    </div>
  );
}