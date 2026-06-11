import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Send, User, TrendingUp, Clock, MountainSnow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { mockTenders, mockProposals } from '@/app/data/mockData';
import { DocumentComplianceAlert } from '@/app/components/vendor/DocumentComplianceAlert';
import { useTranslation } from '@/app/context/LanguageContext';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const activeTenders = mockTenders.filter(tender => tender.status === 'published');
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');

  const getMappedStatus = (status: string): 'submitted' | 'under_review' | 'approved' | 'rejected' => {
    const norm = (status || '').toLowerCase().trim();
    if (norm === 'submitted') return 'submitted';
    if (norm === 'approved' || norm === 'selected') return 'approved';
    if (norm === 'rejected') return 'rejected';
    return 'under_review';
  };

  const underReviewCount = myProposals.filter(p => getMappedStatus(p.status) === 'under_review').length;

  return (
    <div className="space-y-8 text-start">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
            {t('Vendor Dashboard')}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            {t('Welcome back,')} <span className="text-gray-700 font-semibold">TechSolutions LLC</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group" onClick={() => navigate('/vendor/tenders')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  {t('Active Tenders')}
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {activeTenders.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-primary-green)]/15 to-[var(--fnrc-primary-green)]/5 group-hover:scale-105 transition-transform duration-200">
                <MountainSnow className="h-6 w-6 text-[var(--fnrc-primary-green)] animate-pulse" strokeWidth={1.5} style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group" onClick={() => navigate('/vendor/proposals')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  {t('My Proposals')}
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {myProposals.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-accent-gold)]/15 to-[var(--fnrc-accent-gold)]/5 group-hover:scale-105 transition-transform duration-200">
                <Send className="h-5 w-5 text-[var(--fnrc-accent-gold)]" strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  {t('Under Review')}
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {underReviewCount}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-royal-blue)]/15 to-[var(--fnrc-royal-blue)]/5 group-hover:scale-105 transition-transform duration-200">
                <Clock className="h-5 w-5 text-[var(--fnrc-royal-blue)]" strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Tenders */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800 text-start">{t('Active Tenders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTenders.slice(0, 3).map((tender) => {
                const isClosed = new Date(tender.submissionDeadline) < new Date('2026-05-15');
                return (
                  <div key={tender.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-gray-100">
                    <div className="space-y-1">
                      <div className="font-semibold text-[15px] text-gray-800 flex items-center gap-2 text-start">
                        {tender.title}
                        <StatusBadge status={isClosed ? 'closed' : 'published'} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium text-start">
                        <span>{tender.id}</span>
                        <span>•</span>
                        <span>{t('Deadline:')} {new Date(tender.submissionDeadline).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB')}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/tenders/${tender.id}`)}
                      className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10 text-xs rounded-button"
                    >
                      {t('View')}
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm"
                onClick={() => navigate('/vendor/tenders')}
              >
                {t('View All Tenders')} {language === 'ar' ? '←' : '→'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Proposals */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800 text-start">{t('My Proposals')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProposals.map((proposal) => {
                return (
                  <div key={proposal.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-gray-100">
                    <div className="space-y-1.5 flex flex-col items-start text-start">
                      <div className="font-semibold text-[15px] text-gray-800">
                        {proposal.tenderTitle}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <span>{proposal.id}</span>
                        <span>•</span>
                        <StatusBadge status={getMappedStatus(proposal.status) === 'under_review' ? 'under_review_vendor' : getMappedStatus(proposal.status)} />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
                      className="rounded-button text-xs"
                    >
                      {t('Track')}
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm"
                onClick={() => navigate('/vendor/proposals')}
              >
                {t('View All Proposals')} {language === 'ar' ? '←' : '→'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Document Compliance Alert */}
        <DocumentComplianceAlert vendorId="VEN-001" />
      </div>
    </div>
  );
}