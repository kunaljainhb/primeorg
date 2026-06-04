import { useNavigate } from '@/app/context/RouterContext';
import { Building2, FileText, CheckCircle, Users, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Header } from '@/app/components/layout/Header';

export default function VendorLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans">
      <Header role="public" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q 20 20 40 40 T 80 40' fill='none' stroke='%23000000' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--fnrc-primary-green)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)] text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="h-4 w-4" /> Official FNRC Procurement Platform
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight mb-6">
              Empowering Suppliers, <br />
              <span className="text-[var(--fnrc-primary-green)]">Developing Fujairah</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-500 max-w-2xl mx-auto mb-10">
              Welcome to the Fujairah Natural Resources Corporation Vendor Portal. Access government tenders, manage active proposals, and build long-term partnerships with transparent, enterprise-grade procurement tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto h-12 text-base font-semibold text-white px-8 shadow-lg shadow-[var(--fnrc-primary-green)]/20 hover:shadow-xl hover:shadow-[var(--fnrc-primary-green)]/30 hover:-translate-y-0.5 transition-all duration-200"
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/register')}
              >
                Register as Vendor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 text-base font-semibold hover:bg-gray-50 border-2 hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/login')}
              >
                Vendor Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About FNRC Section */}
      <section className="bg-white py-20 sm:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl mb-6">
              About FNRC Procurement
            </h2>
            <div className="text-base leading-relaxed text-gray-500 space-y-4">
              <p>
                The Fujairah Natural Resources Corporation (FNRC) is dedicated to fostering sustainable economic growth and resource utilization in the Emirate of Fujairah. Our procurement processes are governed by principles of equal opportunity, strict transparency, and social and environmental responsibility.
              </p>
              <p>
                By registering on our modern Vendor Portal, your business gains direct exposure to official government requirements and request-for-proposal campaigns, enabling active partnership in prestigious public infrastructure and mining operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Procurement Process */}
      <section className="py-20 sm:py-24 flex-1">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center text-gray-950 sm:text-4xl mb-16">
            Our Procurement Journey
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
              <CardContent className="pt-8 pb-6 px-6 text-center flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  1. Register Account
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Establish your supplier credentials and complete your comprehensive enterprise profile online.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
              <CardContent className="pt-8 pb-6 px-6 text-center flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  2. Document Approval
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our compliance team reviews trade licenses and financial records to guarantee premium partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
              <CardContent className="pt-8 pb-6 px-6 text-center flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  3. Explore RFPs
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Access active Request for Proposals categorized by technical service and resource sectors.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
              <CardContent className="pt-8 pb-6 px-6 text-center flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                  <Building2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  4. Bid & Win
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Prepare technical and commercial specifications, submit proposal files, and track evaluation milestones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support & Contact */}
      <section className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Need help with registration?</p>
              <p className="text-xs text-gray-500">Our customer support team is available 24/7 to assist you.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-sm font-medium text-gray-600">Email: <a href="mailto:procurement@fnrc.gov.ae" className="text-[var(--fnrc-primary-green)] font-bold hover:underline">procurement@fnrc.gov.ae</a></span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-xs text-gray-400 space-y-2">
          <p>© 2026 Fujairah Natural Resources Corporation. All rights reserved.</p>
          <p className="uppercase tracking-widest font-bold opacity-40 text-[9px]">Government of Fujairah</p>
        </div>
      </footer>
    </div>
  );
}