import { useNavigate } from '@/app/context/RouterContext';
import { Users, FileText, Send, CheckCircle, TrendingUp, MountainSnow, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { mockVendors, mockRFPs, mockProposals } from '@/app/data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const pendingVendors = mockVendors.filter(v => v.status === 'pending');
  const activeRFPs = mockRFPs.filter(r => r.status === 'published');
  const pendingProposals = mockProposals.filter(p => p.status === 'submitted' || p.status === 'under_review');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          FNRC Admin Portal
        </h1>
        <p className="text-muted-foreground font-medium">
          FNRC Procurement Management System
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => navigate('/admin/vendors')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-warning)]/10 group-hover:bg-[var(--fnrc-warning)]/20 transition-colors">
              <Users className="h-5 w-5 text-[var(--fnrc-warning)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {pendingVendors.length}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Vendors awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => navigate('/admin/rfps')}>
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
              Currently published RFPs
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => navigate('/admin/proposals')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Proposals Received
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-info)]/10 group-hover:bg-[var(--fnrc-info)]/20 transition-colors">
              <Send className="h-5 w-5 text-[var(--fnrc-info)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {mockProposals.length}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Total submissions to evaluate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Approved Vendors
            </CardTitle>
            <div className="p-2 rounded-full bg-[var(--fnrc-success)]/10">
              <CheckCircle className="h-5 w-5 text-[var(--fnrc-success)]" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {mockVendors.filter(v => v.status === 'approved').length}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Active registered partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Vendor Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Vendor Approvals</CardTitle>
            <CardDescription>New resource & service vendor registrations awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.slice(0, 3).map((vendor) => (
                <div key={vendor.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-border">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground text-base">
                      {vendor.companyName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{vendor.category.join(', ')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Registered: {new Date(vendor.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                    className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10"
                  >
                    Review
                  </Button>
                </div>
              ))}
              {pendingVendors.length === 0 && (
                <p className="text-center text-sm text-muted-foreground font-medium">
                  No pending approvals
                </p>
              )}
              {pendingVendors.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5"
                  onClick={() => navigate('/admin/vendors')}
                >
                  View All Vendors →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active RFPs */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tender Opportunities</CardTitle>
            <CardDescription>Currently published resource requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRFPs.slice(0, 3).map((rfp) => (
                <div key={rfp.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-border">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground text-base">
                      {rfp.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <span>{rfp.id}</span>
                      <span>•</span>
                      <span>Deadline: {new Date(rfp.submissionDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/rfps/${rfp.id}`)}
                  >
                    Manage
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5"
                onClick={() => navigate('/admin/rfps')}
              >
                View All Tenders →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Proposal Submissions</CardTitle>
            <CardDescription>Latest vendor evaluations for open tenders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProposals.slice(0, 4).map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-[var(--fnrc-bg-light)] cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-foreground text-base">
                        {proposal.vendorName}
                      </div>
                      <Badge
                        variant="secondary"
                        className="capitalize font-medium tracking-wide"
                        style={{
                          backgroundColor: proposal.status === 'shortlisted' ? 'var(--fnrc-success)' : 'var(--fnrc-info)',
                          color: '#ffffff'
                        }}
                      >
                        {proposal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm font-medium text-muted-foreground">
                      {proposal.rfpTitle} • AED {proposal.commercialAmount.toLocaleString()}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Vendor Chats */}
        <Card className="flex flex-col h-[500px]">
          <CardHeader className="pb-3 border-b border-[#E5E5E5]">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              Active Vendor Chats
            </CardTitle>
            <CardDescription>Current discussions regarding open RFPs</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[
                { vendor: 'TechSolutions LLC', rfpId: 'RFP-001', rfpTitle: 'Supply of IT Hardware for HQ', unread: 2, time: '10:45 AM' },
                { vendor: 'Modern Office', rfpId: 'RFP-005', rfpTitle: 'Office Renovation Project', unread: 0, time: 'Yesterday' },
                { vendor: 'Gulf Construction', rfpId: 'RFP-003', rfpTitle: 'Security Guard Services', unread: 1, time: 'Yesterday' },
              ].map((chat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-[#E5E5E5] p-3 hover:bg-[var(--fnrc-bg-light)] cursor-pointer transition-colors shadow-sm"
                  onClick={() => navigate(`/admin/rfps/${chat.rfpId}?tab=chats`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--fnrc-bg-light)] border border-[var(--fnrc-border-gray)] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[var(--fnrc-text-muted)]">{chat.vendor.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {chat.vendor}
                        {chat.unread > 0 && (
                          <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px] flex items-center justify-center border-none" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }}>
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground line-clamp-1">
                        {chat.rfpId} • {chat.rfpTitle}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-400">
                    {chat.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}