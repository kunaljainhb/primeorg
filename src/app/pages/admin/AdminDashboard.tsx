import { useNavigate } from '@/app/context/RouterContext';
import { Users, FileText, Send, CheckCircle, TrendingUp, MountainSnow, MessageSquare, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { mockVendors, mockTenders, mockProposals } from '@/app/data/mockData';
import { useTranslation } from '@/app/context/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';

import { StatusBadge } from '@/app/components/ui/status-badge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pendingVendors = mockVendors.filter(v => v.status === 'pending');
  const activeTenders = mockTenders.filter(r => r.status === 'published');
  const pendingProposals = mockProposals.filter(p => p.status === 'submitted' || p.status === 'under_review');

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
            {t("Admin Portal")}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            {t("FNRC Procurement Management System")}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group rounded-card" onClick={() => navigate('/admin/vendors')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("Pending Approvals")}
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

        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group rounded-card" onClick={() => navigate('/admin/tenders')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("Active Tenders")}
                </span>
                <div className="text-3xl font-bold text-gray-800">
                  {activeTenders.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--fnrc-primary-green)]/15 to-[var(--fnrc-primary-green)]/5 group-hover:scale-105 transition-transform duration-200">
                <MountainSnow className="h-5 w-5 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group rounded-card" onClick={() => navigate('/admin/proposals')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("Proposals Received")}
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

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover group rounded-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("Approved Vendors")}
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
        <Card className="shadow-card rounded-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">{t("Pending Vendor Approvals")}</CardTitle>

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
                    <div className="text-[11px] text-gray-400 mt-1 font-semibold">
                      {t("Registered")}: {new Date(vendor.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                    className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10 text-xs rounded-button cursor-pointer"
                  >
                    {t("Review")}
                  </Button>
                </div>
              ))}
              {pendingVendors.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4 font-semibold">
                  {t("No pending approvals")}
                </p>
              )}
              {pendingVendors.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-[var(--fnrc-primary-green)] font-bold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm cursor-pointer"
                  onClick={() => navigate('/admin/vendors')}
                >
                  {t("View All Vendors")} {t("→")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Tenders */}
        <Card className="shadow-card rounded-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">{t("Active Tender Opportunities")}</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTenders.slice(0, 3).map((tender) => (
                <div key={tender.id} className="flex items-start justify-between border-b pb-4 last:border-0 border-gray-100">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800 text-base">
                      {tender.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <span>{tender.id}</span>
                      <span>•</span>
                      <span className="font-semibold">{t("Deadline")}: {new Date(tender.submissionDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/tenders/${tender.id}`)}
                    className="text-xs rounded-button cursor-pointer"
                  >
                    {t("Manage")}
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-[var(--fnrc-primary-green)] font-bold hover:text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/5 text-sm cursor-pointer"
                onClick={() => navigate('/admin/tenders')}
              >
                {t("View All Tenders")} {t("→")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent Proposals */}
        <Card className="shadow-card rounded-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">{t("Recent Proposal Submissions")}</CardTitle>

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
                      {proposal.tenderTitle} • AED {proposal.commercialAmount.toLocaleString()}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10 text-xs rounded-button transition-colors cursor-pointer">
                    {t("Review")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Vendor Chats */}
        <Card className="flex flex-col h-[500px] rounded-card">
          <CardHeader className="pb-3 border-b border-[#E5E5E5]">
            <CardTitle className="flex items-center gap-2 font-bold">
              <MessageSquare className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              {t("Active Vendor Chats")}
            </CardTitle>

          </CardHeader>
          <CardContent className="p-4 overflow-y-auto">
            <div className="space-y-4">
              {[
                { vendor: 'TechSolutions LLC', tenderId: 'TEND-001', tenderTitle: 'Supply of IT Hardware for HQ', unread: 2, time: '10:45 AM', lastMessage: 'Can you clarify section 4.2?' },
                { vendor: 'Modern Office', tenderId: 'TEND-005', tenderTitle: 'Office Renovation Project', unread: 0, time: 'Yesterday', lastMessage: 'Thank you, we will submit shortly.' },
                { vendor: 'Gulf Construction', tenderId: 'TEND-003', tenderTitle: 'Security Guard Services', unread: 1, time: 'Yesterday', lastMessage: 'Do we need ISO certification?' },
              ].map((chat, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col gap-3 rounded-xl border border-gray-100 p-4 hover:border-[var(--fnrc-primary-green)]/30 hover:bg-gradient-to-br hover:from-[var(--fnrc-primary-green)]/[0.02] hover:to-transparent cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/admin/tenders/${chat.tenderId}?tab=chats`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                          <span className="text-sm font-bold text-gray-600 tracking-wider">{chat.vendor.substring(0, 2).toUpperCase()}</span>
                        </div>
                        {chat.unread > 0 && (
                          <span className="absolute -top-1 -end-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--fnrc-primary-green)' }}></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-[15px] group-hover:text-[var(--fnrc-primary-green)] transition-colors">
                          {chat.vendor}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-gray-50 border-gray-200 font-bold text-gray-500">
                            {chat.tenderId}
                          </Badge>
                          <span className="text-xs font-semibold text-gray-400 truncate max-w-[120px]">
                            {chat.tenderTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold text-gray-400">
                        {chat.time}
                      </span>
                      {chat.unread > 0 && (
                        <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px] flex items-center justify-center font-bold shadow-sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }}>
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
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