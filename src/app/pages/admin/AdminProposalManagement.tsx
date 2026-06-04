import { useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { mockProposals } from '@/app/data/mockData';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SearchFilterBar } from '@/app/components/ui/search-filter-bar';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { EmptyState } from '@/app/components/ui/empty-state';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function AdminProposalManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filters = [
    {
      key: 'status',
      label: 'Review Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Technical Review', value: 'technical_review' },
        { label: 'Technical Review Started', value: 'technical_review_started' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Correction Requested', value: 'correction_requested' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter
    }
  ];

  const activeChips = statusFilter !== 'all' ? [
    {
      label: `Status: ${statusFilter.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      onRemove: () => setStatusFilter('all')
    }
  ] : [];

  const handleClearAll = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Proposal Evaluation
          </h1>
        </div>
      </div>

      {/* Modern Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search proposals by ID, vendor or RFP..."
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredProposals.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Proposal ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">RFP Details</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Vendor Entity</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Submission Date</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Bid Amount</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Evaluation Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                      {proposal.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800 max-w-[200px] truncate">{proposal.rfpId} - {proposal.rfpTitle}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{proposal.vendorName}</TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      {formatDate(proposal.submissionDate)}
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">
                      AED {proposal.commercialAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={proposal.status} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                        className="gap-1 border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold"
                      >
                        Review
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No Proposals Found"
              description="No proposal bids matched your search or filters. Clear active filters to view all entries."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}