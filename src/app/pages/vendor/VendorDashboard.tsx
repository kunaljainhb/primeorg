import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Send, Bell, User, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockRFPs, mockProposals } from '@/app/data/mockData';
import { DocumentComplianceAlert } from '@/app/components/vendor/DocumentComplianceAlert';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const activeRFPs = mockRFPs.filter(rfp => rfp.status === 'published');
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            Vendor Dashboard
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Welcome back, TechSolutions LLC
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Active RFPs
            </CardTitle>
            <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {activeRFPs.length}
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Available opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              My Proposals
            </CardTitle>
            <Send className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {myProposals.length}
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Submitted proposals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Under Review
            </CardTitle>
            <Clock className="h-5 w-5" style={{ color: 'var(--fnrc-info)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              1
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Being evaluated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Success Rate
            </CardTitle>
            <TrendingUp className="h-5 w-5" style={{ color: 'var(--fnrc-success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              50%
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Proposal win rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active RFPs */}
        <Card>
          <CardHeader>
            <CardTitle>Active RFPs</CardTitle>
            <CardDescription>Recently published opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRFPs.slice(0, 3).map((rfp) => {
                const isClosed = new Date(rfp.submissionDeadline) < new Date('2026-05-15');
                return (
                  <div key={rfp.id} className="flex items-start justify-between border-b pb-4 last:border-0" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {rfp.title}
                        <Badge 
                          className="text-[10px] h-4 px-1.5" 
                          style={{ 
                            backgroundColor: isClosed ? 'var(--fnrc-border-gray)' : 'var(--fnrc-success)',
                            color: 'white'
                          }}
                        >
                          {isClosed ? 'Closed' : 'Open'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        <span>{rfp.id}</span>
                        <span>•</span>
                        <span>Due: {new Date(rfp.submissionDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/rfps/${rfp.id}`)}
                      style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                    >
                      View
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="link"
                className="w-full"
                style={{ color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/rfps')}
              >
                View All RFPs →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Proposals */}
        <Card>
          <CardHeader>
            <CardTitle>My Proposals</CardTitle>
            <CardDescription>Track your submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProposals.map((proposal) => {
                const getCamelStatus = (status: string) => {
                  if (status === 'under_review') return 'UnderReview';
                  return status.charAt(0).toUpperCase() + status.slice(1);
                };
                
                const getStatusStyles = (status: string) => {
                  switch (status) {
                    case 'shortlisted': return { bg: '#D1FAE5', text: 'var(--fnrc-success)' };
                    case 'under_review': return { bg: '#FFEDD5', text: '#EA580C' }; // Orange
                    case 'rejected': return { bg: '#FEE2E2', text: 'var(--fnrc-error)' }; // Red
                    case 'submitted': return { bg: '#DBEAFE', text: 'var(--fnrc-info)' };
                    default: return { bg: '#F3F4F6', text: 'var(--fnrc-text-muted)' };
                  }
                };

                const styles = getStatusStyles(proposal.status);
                
                return (
                  <div key={proposal.id} className="flex items-start justify-between border-b pb-4 last:border-0" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <div className="space-y-1">
                      <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {proposal.rfpTitle}
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        <span>{proposal.id}</span>
                        <span>•</span>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: styles.bg,
                            color: styles.text
                          }}
                        >
                          {getCamelStatus(proposal.status)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
                    >
                      Track
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="link"
                className="w-full"
                style={{ color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/vendor/proposals')}
              >
                View All Proposals →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent News */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
              <CardTitle>Recent Portal News</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-success)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal Shortlisted!</div>
                <p className="text-xs mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>Your proposal for <span className="font-medium">RFP-2026-005 (Office Renovation)</span> has been shortlisted for technical review.</p>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--fnrc-success)' }}>Update</span>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-info)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>New RFP Published: HVAC Systems</div>
                <p className="text-xs mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>FNRC has published a new RFP for Annual Maintenance of HVAC Systems. Check eligibility now.</p>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--fnrc-info)' }}>New RFP</span>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-error)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal Status Update</div>
                <p className="text-xs mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>A decision has been finalized for <span className="font-medium">RFP-2026-003</span>. Please check your tracking page.</p>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--fnrc-error)' }}>Alert</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Compliance Alert */}
        <DocumentComplianceAlert vendorId="VEN-001" />
      </div>
    </div>
  );
}