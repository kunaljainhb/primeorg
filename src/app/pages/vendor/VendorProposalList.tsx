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
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function VendorProposalList() {
  const navigate = useNavigate();
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      selected: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status] || colors.submitted;
  };

  const filteredProposals = myProposals.filter(proposal => {
    const matchesSearch = proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const submissionDate = new Date(proposal.submissionDate);
    const matchesDateFrom = !dateFrom || submissionDate >= dateFrom;
    const matchesDateTo = !dateTo || submissionDate <= dateTo;
    
    return matchesSearch && matchesDateFrom && matchesDateTo;
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

            {/* Date From */}
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || dateFrom || dateTo) && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setDateFrom(undefined);
                  setDateTo(undefined);
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
                          backgroundColor: 
                            proposal.status === 'shortlisted' ? '#D1FAE5' : 
                            proposal.status === 'under_review' ? '#FFEDD5' : 
                            proposal.status === 'rejected' ? '#FEE2E2' : '#DBEAFE',
                          color: 
                            proposal.status === 'shortlisted' ? 'var(--fnrc-success)' : 
                            proposal.status === 'under_review' ? '#EA580C' : 
                            proposal.status === 'rejected' ? 'var(--fnrc-error)' : 'var(--fnrc-info)'
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
                  className="w-full mt-4"
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