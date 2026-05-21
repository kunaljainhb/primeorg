import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Search, Calendar, DollarSign, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Calendar as CalendarComponent } from '@/app/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { format } from 'date-fns';
import { mockProposals } from '@/app/data/mockData';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatStatus = (statusStr?: string) => {
  if (!statusStr) return '';
  if (statusStr === 'technical_correction_requested') return 'Technical Correction Requested';
  if (statusStr === 'commercial_correction_requested') return 'Commercial Correction Requested';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function VendorProposalList() {
  const navigate = useNavigate();
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  // Dynamically extract statuses present in the vendor's proposals list
  const availableStatuses = Array.from(
    new Set(myProposals.map(p => p.status))
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      technical_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      commercial_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      selected: { bg: '#D1FAE5', text: 'var(--fnrc-success)' }
    };
    return colors[status] || colors.submitted;
  };

  const formatDateRangeText = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'LLL dd, yyyy')} - ${format(dateRange.to, 'LLL dd, yyyy')}`;
    }
    if (dateRange.from) {
      return `${format(dateRange.from, 'LLL dd, yyyy')} - Select to date`;
    }
    if (dateRange.to) {
      return `Select from date - ${format(dateRange.to, 'LLL dd, yyyy')}`;
    }
    return 'Select date range';
  };

  const filteredProposals = myProposals.filter(proposal => {
    const matchesSearch = proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const submissionDate = new Date(proposal.submissionDate);
    submissionDate.setHours(0, 0, 0, 0);

    let matchesDateFrom = true;
    if (dateRange.from) {
      const fromLimit = new Date(dateRange.from);
      fromLimit.setHours(0, 0, 0, 0);
      matchesDateFrom = submissionDate >= fromLimit;
    }
    
    let matchesDateTo = true;
    if (dateRange.to) {
      const toLimit = new Date(dateRange.to);
      toLimit.setHours(0, 0, 0, 0);
      matchesDateTo = submissionDate <= toLimit;
    }
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          My Proposals
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Track status of your submitted proposals
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--fnrc-text-muted)' }} />
                <Input
                  placeholder="Proposal ID or RFP Title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal border-2 h-9 bg-white">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground animate-pulse-subtle" />
                    <span className="text-sm font-semibold text-gray-700">{formatDateRangeText()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white border shadow-xl rounded-xl" align="start">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* From Date Selector */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center border-b pb-1">From Date</div>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </div>
                    
                    {/* Vertical Divider */}
                    <div className="hidden sm:block w-px bg-gray-100 self-stretch"></div>
                    
                    {/* To Date Selector */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center border-b pb-1">To Date</div>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full h-9 border-2 text-sm font-semibold text-gray-750 bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-semibold text-xs text-gray-700">All Statuses</SelectItem>
                  {availableStatuses.map(status => (
                    <SelectItem key={status} value={status} className="font-semibold text-xs text-gray-700">
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || dateRange.from || dateRange.to || statusFilter !== 'all') && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-xs text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded-lg px-3 h-8 transition-all"
                onClick={() => {
                  setSearchQuery('');
                  setDateRange({ from: undefined, to: undefined });
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposal Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProposals.map((proposal) => {
          const statusColor = getStatusColor(proposal.status);
          return (
            <Card key={proposal.id} className="flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {proposal.id}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.rfpTitle}</span>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text
                        }}
                      >
                        {formatStatus(proposal.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatDate(proposal.submissionDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  <DollarSign className="h-4 w-4" />
                  <span>AED {proposal.commercialAmount.toLocaleString()}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 hover:bg-transparent hover:text-[var(--fnrc-primary-green)] hover:border-[var(--fnrc-primary-green)]"
                  style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vendor/proposals/${proposal.id}`);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Proposal
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProposals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
            <p>No proposals found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}