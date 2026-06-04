import { useNavigate } from '@/app/context/RouterContext';
import { Users, FileText, Send, CheckCircle, TrendingUp, MountainSnow, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { mockVendors, mockRFPs, mockProposals } from '@/app/data/mockData';

import { StatusBadge } from '@/app/components/ui/status-badge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const pendingVendors = mockVendors.filter(v => v.status === 'pending');
  const activeRFPs = mockRFPs.filter(r => r.status === 'published');
  const pendingProposals = mockProposals.filter(p => p.status === 'submitted' || p.status === 'under_review');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
          FNRC Admin Portal
        </h1>
        <p className="text-sm font-medium text-gray-500">
          FNRC Procurement Management System
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group" onClick={() => navigate('/admin/vendors')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Pending Approvals
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {pendingVendors.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-accent-gold)]/15 to-[var(--fnrc-accent-gold)]/5 group-hover:scale-105 transition-transform duration-200">
                <Users className="h-5 w-5 text-[var(--fnrc-accent-gold)] animate-pulse" strokeWidth={1.5} style={{ animationDuration: '4s' }} />
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group" onClick={() => navigate('/admin/rfps')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Active Tenders
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {activeRFPs.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-primary-green)]/15 to-[var(--fnrc-primary-green)]/5 group-hover:scale-105 transition-transform duration-200">
                <MountainSnow className="h-5 w-5 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group" onClick={() => navigate('/admin/proposals')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Proposals Received
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {mockProposals.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-royal-blue)]/15 to-[var(--fnrc-royal-blue)]/5 group-hover:scale-105 transition-transform duration-200">
                <Send className="h-5 w-5 text-[var(--fnrc-royal-blue)]" strokeWidth={1.5} />
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Approved Vendors
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {mockVendors.filter(v => v.status === 'approved').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 group-hover:scale-105 transition-transform duration-200">
                <CheckCircle className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Vendor Approvals */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">Pending Vendor Approvals</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.slice(0, 3).map((vendor) => (
                <div key={vendor.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-gray-100">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800 text-base">
                      {vendor.companyName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <span>{vendor.category.join(', ')}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Registered: {new Date(vendor.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                    className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10 text-xs rounded-button"
                  >
                    Review
                  </Button>
                </div>
              ))}
              {pendingVendors.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">
                  No pending approvals
                </p>
              )}
              {pendingVendors.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm"
                  onClick={() => navigate('/admin/vendors')}
                >
                  View All Vendors →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active RFPs */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">Active Tender Opportunities</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRFPs.slice(0, 3).map((rfp) => (
                <div key={rfp.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-gray-100">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800 text-base">
                      {rfp.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <span>{rfp.id}</span>
                      <span>•</span>
                      <span>Deadline: {new Date(rfp.submissionDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/rfps/${rfp.id}`)}
                    className="text-xs rounded-button"
                  >
                    Manage
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-semibold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm"
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
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">Recent Proposal Submissions</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProposals.slice(0, 4).map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-[#F7F9FC] cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-800 text-[15px]">
                        {proposal.vendorName}
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                    <div className="mt-1 text-xs text-gray-400 font-medium">
                      {proposal.rfpTitle} • AED {proposal.commercialAmount.toLocaleString()}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10 text-xs rounded-button transition-colors">
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