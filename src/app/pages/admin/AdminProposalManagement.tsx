import { useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { mockProposals } from '@/app/data/mockData';
import { ArrowRight, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
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

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal: any = a[key as keyof typeof a];
    let bVal: any = b[key as keyof typeof b];

    if (key === 'submissionDate') {
       aVal = new Date(aVal).getTime();
       bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProposals.length / itemsPerPage);
  const paginatedProposals = sortedProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    {
      key: 'status',
      label: 'Review Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Technical Review', value: 'technical_review' },
        { label: 'Technical Review Started', value: 'technical_review_started' },
        { label: 'Commercial Review Completed', value: 'under_review' },
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
        placeholder="Search proposals by ID, vendor or Tender..."
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {paginatedProposals.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1.5">
                      Proposal ID
                      {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('tenderId')}>
                    <div className="flex items-center gap-1.5">
                      Tender Details
                      {sortConfig?.key === 'tenderId' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('vendorName')}>
                    <div className="flex items-center gap-1.5">
                      Vendor Entity
                      {sortConfig?.key === 'vendorName' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('submissionDate')}>
                    <div className="flex items-center gap-1.5">
                      Deadline Date
                      {sortConfig?.key === 'submissionDate' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('commercialAmount')}>
                    <div className="flex items-center gap-1.5">
                      Bid Amount
                      {sortConfig?.key === 'commercialAmount' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      Evaluation Status
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                      {proposal.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800 max-w-[200px] truncate">{proposal.tenderId} - {proposal.tenderTitle}</TableCell>
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

          {/* Pagination Controls */}
          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedProposals.length)}</span> of <span className="font-bold text-gray-900">{sortedProposals.length}</span> entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="font-semibold"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-md text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[var(--fnrc-primary-green)] text-white' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="font-semibold"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}