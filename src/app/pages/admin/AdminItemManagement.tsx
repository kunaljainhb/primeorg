import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { mockRFPs, mockProposals } from '@/app/data/mockData';
import { ArrowRight, Pencil } from 'lucide-react';
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

export default function AdminItemManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Find all Published RFPs
  const publishedRFPs = mockRFPs.filter(rfp => rfp.status === 'published');

  // Find RFPs that have at least one Shortlisted proposal
  const items = publishedRFPs.map((rfp) => {
    const shortlistedProposals = mockProposals.filter(
      prop => prop.rfpId === rfp.id && prop.status === 'shortlisted'
    );
    
    return shortlistedProposals.map((proposal) => {
      // Logic for status: PROP-104 is mocked as fully received
      const status = proposal.id === 'PROP-104' ? 'Completed' : 'Pending';

      return {
        rfpId: rfp.id,
        rfpTitle: rfp.title,
        category: rfp.category.join(', '),
        createdAt: rfp.createdAt,
        proposalId: proposal.id,
        vendorName: proposal.vendorName,
        status
      };
    });
  }).flat();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.rfpId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.proposalId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filters = [
    {
      key: 'status',
      label: 'Inventory Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Pending Verification', value: 'pending' },
        { label: 'Completed Receiving', value: 'completed' },
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter
    }
  ];

  const activeChips = statusFilter !== 'all' ? [
    {
      label: `Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`,
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
            Item Management
          </h1>
        </div>
      </div>

      {/* Modern Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search items by ID, title, or vendor..."
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredItems.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">RFP ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">RFP Campaign Title</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Shortlisted Bid ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Vendor Partner</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Shortlist Date</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Receiving Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={`${item.rfpId}-${item.proposalId}-${index}`} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                      {item.rfpId}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800 max-w-[200px] truncate">{item.rfpTitle}</TableCell>
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">{item.proposalId}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{item.vendorName}</TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/items/${item.proposalId}`)}
                        className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold"
                        title="Edit Item Specs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No Shortlisted Items Found"
              description="No inventory items matched your search query. Refine your keywords or clear active filters."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
