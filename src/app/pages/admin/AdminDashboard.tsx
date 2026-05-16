import { useNavigate } from '@/app/context/RouterContext';
import { Users, FileText, Send, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockVendors, mockRFPs, mockProposals } from '@/app/data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const pendingVendors = mockVendors.filter(v => v.status === 'pending');
  const activeRFPs = mockRFPs.filter(r => r.status === 'published');
  const pendingProposals = mockProposals.filter(p => p.status === 'submitted' || p.status === 'under_review');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          FNRC Procurement Management System
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/admin/vendors')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Pending Vendor Approvals
            </CardTitle>
            <Users className="h-5 w-5" style={{ color: 'var(--fnrc-warning)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {pendingVendors.length}
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/admin/rfps')}>
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
              Currently published
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/admin/proposals')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Proposals Received
            </CardTitle>
            <Send className="h-5 w-5" style={{ color: 'var(--fnrc-info)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {mockProposals.length}
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Total submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
              Approved Vendors
            </CardTitle>
            <CheckCircle className="h-5 w-5" style={{ color: 'var(--fnrc-success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {mockVendors.filter(v => v.status === 'approved').length}
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
              Active in system
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate('/admin/vendors')}
            >
              <Users className="h-6 w-6" style={{ color: 'var(--fnrc-primary-green)' }} />
              <span>Review Vendors</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate('/admin/rfps/create')}
            >
              <FileText className="h-6 w-6" style={{ color: 'var(--fnrc-primary-green)' }} />
              <span>Create New RFP</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate('/admin/proposals')}
            >
              <Send className="h-6 w-6" style={{ color: 'var(--fnrc-primary-green)' }} />
              <span>Review Proposals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Vendor Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Vendor Approvals</CardTitle>
            <CardDescription>New vendor registrations awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.slice(0, 3).map((vendor) => (
                <div key={vendor.id} className="flex items-start justify-between border-b pb-4 last:border-0" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="space-y-1">
                    <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {vendor.companyName}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                      <span>{vendor.category.join(', ')}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Registered: {new Date(vendor.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                    style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                  >
                    Review
                  </Button>
                </div>
              ))}
              {pendingVendors.length === 0 && (
                <p className="text-center text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  No pending approvals
                </p>
              )}
              {pendingVendors.length > 0 && (
                <Button
                  variant="link"
                  className="w-full"
                  style={{ color: 'var(--fnrc-primary-green)' }}
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
            <CardTitle>Active RFPs</CardTitle>
            <CardDescription>Currently published opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRFPs.slice(0, 3).map((rfp) => (
                <div key={rfp.id} className="flex items-start justify-between border-b pb-4 last:border-0" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="space-y-1">
                    <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {rfp.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
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
                variant="link"
                className="w-full"
                style={{ color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate('/admin/rfps')}
              >
                View All RFPs →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Proposal Submissions</CardTitle>
          <CardDescription>Latest proposals awaiting evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProposals.slice(0, 4).map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 cursor-pointer"
                style={{ borderColor: 'var(--fnrc-border-gray)' }}
                onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {proposal.vendorName}
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: proposal.status === 'shortlisted' ? '#D1FAE5' : '#DBEAFE',
                        color: proposal.status === 'shortlisted' ? 'var(--fnrc-success)' : 'var(--fnrc-info)'
                      }}
                    >
                      {proposal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                    {proposal.rfpTitle} • AED {proposal.commercialAmount.toLocaleString()}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}