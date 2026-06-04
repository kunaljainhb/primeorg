import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { mockProposals } from '@/app/data/mockData';
import { SearchFilterBar, FilterDropdown } from '@/app/components/ui/search-filter-bar';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { EmptyState } from '@/app/components/ui/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function VendorProposalList() {
  const navigate = useNavigate();
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dynamically extract statuses present in the vendor's proposals list
  const availableStatuses = Array.from(new Set(myProposals.map(p => p.status)));

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const filteredProposals = myProposals.filter(proposal => {
    const matchesSearch = proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filterConfig: FilterDropdown[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        ...availableStatuses.map(status => {
          // Format text elegantly for select options
          const label = status
            .split(/_|\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          return { label, value: status };
        })
      ],
      selectedValue: statusFilter,
      onChange: (val) => setStatusFilter(val)
    }
  ];

  const activeChips = [];
  if (statusFilter !== 'all') {
    const displayLabel = statusFilter
      .split(/_|\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    activeChips.push({
      label: `Status: ${displayLabel}`,
      onRemove: () => setStatusFilter('all')
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
          My Proposals
        </h1>
      </div>

      {/* Unified Search & Filters component */}
      <Card className="shadow-card border-none">
        <CardContent className="p-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by Proposal ID or RFP title..."
            filters={filterConfig}
            activeChips={activeChips}
            onClearAll={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Standardized Table View */}
      {filteredProposals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-[13px] text-gray-400">Proposal ID</TableHead>
              <TableHead className="font-bold text-[13px] text-gray-400">RFP Number - RFP Title</TableHead>
              <TableHead className="font-bold text-[13px] text-gray-400">Submission Date</TableHead>
              <TableHead className="font-bold text-[13px] text-gray-400">Commercial Amount</TableHead>
              <TableHead className="font-bold text-[13px] text-gray-400">Status</TableHead>
              <TableHead className="font-bold text-[13px] text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProposals.map((proposal) => (
              <TableRow 
                key={proposal.id}
                className="cursor-pointer"
                onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
              >
                <TableCell className="font-bold text-[14px] text-[var(--fnrc-primary-green)]">
                  {proposal.id}
                </TableCell>
                <TableCell className="font-semibold text-[14px] text-gray-800 max-w-[280px] truncate">
                  {proposal.rfpId} - {proposal.rfpTitle}
                </TableCell>
                <TableCell className="text-[14px] text-gray-500 font-medium">
                  {formatDate(proposal.submissionDate)}
                </TableCell>
                <TableCell className="font-bold text-[14px] text-gray-800">
                  AED {proposal.commercialAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={proposal.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
                      className="gap-1.5 text-xs text-gray-600 border-gray-200 hover:bg-gray-50 rounded-button h-8"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          type="proposal"
          title="No Proposals Found"
          description="We couldn't find any proposals matching your query. Try adjusting your search query or status filter."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}