import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Send, Bell, User, TrendingUp, Clock, MountainSnow } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground font-medium">
            Welcome back, TechSolutions LLC
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => navigate('/vendor/rfps')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Active Tenders
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-primary-green)]/10 group-hover:bg-[var(--fnrc-primary-green)]/20 transition-colors">
              <MountainSnow className="h-5 w-5 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {activeRFPs.length}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Available opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => navigate('/vendor/proposals')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              My Proposals
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-accent-gold)]/10 group-hover:bg-[var(--fnrc-accent-gold)]/20 transition-colors">
              <Send className="h-5 w-5 text-[var(--fnrc-accent-gold)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {myProposals.length}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Submitted proposals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Under Review
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-info)]/10">
              <Clock className="h-5 w-5 text-[var(--fnrc-info)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              1
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Being evaluated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Success Rate
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-success)]/10">
              <TrendingUp className="h-5 w-5 text-[var(--fnrc-success)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              50%
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
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
            <CardTitle>Active Tenders</CardTitle>
            <CardDescription>Recently published resource opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRFPs.slice(0, 3).map((rfp) => {
                const isClosed = new Date(rfp.submissionDeadline) < new Date('2026-05-15');
                return (
                  <div key={rfp.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-border">
                    <div className="space-y-1">
                      <div className="font-semibold text-base text-foreground flex items-center gap-2">
                        {rfp.title}
                        <Badge 
                          className="text-[10px] h-4 px-1.5 uppercase font-bold tracking-wider" 
                          style={{ 
                            backgroundColor: isClosed ? 'var(--fnrc-border-gray)' : 'var(--fnrc-success)',
                            color: 'white'
                          }}
                        >
                          {isClosed ? 'Closed' : 'Open'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <span>{rfp.id}</span>
                        <span>•</span>
                        <span>Due: {new Date(rfp.submissionDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/rfps/${rfp.id}`)}
                      className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10"
                    >
                      View
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5"
                onClick={() => navigate('/vendor/rfps')}
              >
                View All Tenders →
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
                    case 'shortlisted': return { bg: 'var(--fnrc-success)', text: '#ffffff' };
                    case 'under_review': return { bg: 'var(--fnrc-warning)', text: '#ffffff' };
                    case 'rejected': return { bg: 'var(--fnrc-error)', text: '#ffffff' };
                    case 'submitted': return { bg: 'var(--fnrc-info)', text: '#ffffff' };
                    default: return { bg: 'var(--fnrc-border-gray)', text: 'var(--fnrc-text-dark)' };
                  }
                };

                const styles = getStatusStyles(proposal.status);
                
                return (
                  <div key={proposal.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-border">
                    <div className="space-y-1">
                      <div className="font-semibold text-base text-foreground">
                        {proposal.rfpTitle}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <span>{proposal.id}</span>
                        <span>•</span>
                        <Badge
                          variant="secondary"
                          className="font-medium tracking-wide"
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
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5"
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
              <div className="p-2 rounded-full bg-[var(--fnrc-primary-green)]/10">
                <Bell className="h-5 w-5 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />
              </div>
              <CardTitle>Recent Portal Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-success)' }}>
                <div className="text-sm font-semibold text-foreground">Proposal Shortlisted!</div>
                <p className="text-sm mt-1 text-muted-foreground">Your proposal for <span className="font-semibold text-foreground">RFP-2026-005 (Office Renovation)</span> has been shortlisted for technical review.</p>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--fnrc-success)' }}>Update</span>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-info)' }}>
                <div className="text-sm font-semibold text-foreground">New Tender Published: HVAC Systems</div>
                <p className="text-sm mt-1 text-muted-foreground">FNRC has published a new RFP for Annual Maintenance of HVAC Systems. Check eligibility now.</p>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--fnrc-info)' }}>New RFP</span>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--fnrc-error)' }}>
                <div className="text-sm font-semibold text-foreground">Proposal Status Update</div>
                <p className="text-sm mt-1 text-muted-foreground">A decision has been finalized for <span className="font-semibold text-foreground">RFP-2026-003</span>. Please check your tracking page.</p>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--fnrc-error)' }}>Alert</span>
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