import { useNavigate } from '@/app/context/RouterContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { mockRFPs, mockProposals, vendorCategories } from '@/app/data/mockData';
import { Calendar, ArrowRight, Plus, Pencil } from 'lucide-react';
import { useState } from 'react';
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

export default function AdminRFPManagement() {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const getProposalCount = (rfpId: string) => {
    return mockProposals.filter(p => p.rfpId === rfpId).length;
  };

  // Filter RFPs based on selected filters
  const filteredRFPs = mockRFPs.filter(rfp => {
    if (searchQuery && !rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) && !rfp.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilters.length > 0 && !rfp.category.some(c => categoryFilters.includes(c))) {
      return false;
    }
    const rfpDate = new Date(rfp.submissionDeadline);
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (rfpDate < fromDate) return false;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      if (rfpDate > toDate) return false;
    }
    if (statusFilter && rfp.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Closed', value: 'closed' },
      ],
      selectedValue: statusFilter || 'all',
      onChange: (val: string) => setStatusFilter(val === 'all' ? '' : val)
    },
    {
      key: 'category',
      label: 'Category',
      options: [
        { label: 'All Categories', value: 'all' },
        ...vendorCategories.map(cat => ({ label: cat, value: cat }))
      ],
      selectedValue: categoryFilters[0] || 'all',
      onChange: (val: string) => setCategoryFilters(val === 'all' ? [] : [val])
    }
  ];

  const activeChips: any[] = [];
  if (statusFilter) {
    activeChips.push({
      label: `Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`,
      onRemove: () => setStatusFilter('')
    });
  }
  if (categoryFilters.length > 0) {
    activeChips.push({
      label: `Category: ${categoryFilters[0]}`,
      onRemove: () => setCategoryFilters([])
    });
  }
  if (dateFrom) {
    activeChips.push({
      label: `Deadline From: ${formatDate(dateFrom)}`,
      onRemove: () => setDateFrom('')
    });
  }
  if (dateTo) {
    activeChips.push({
      label: `Deadline To: ${formatDate(dateTo)}`,
      onRemove: () => setDateTo('')
    });
  }

  const handleClearAll = () => {
    setSearchQuery('');
    setCategoryFilters([]);
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            RFP Management
          </h1>
        </div>
        <Button
          onClick={() => navigate('/admin/rfps/create')}
          className="text-white gap-2 shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
        >
          <Plus className="h-4 w-4" />
          Create New RFP
        </Button>
      </div>

      <div className="space-y-4">
        {/* Modern Search and Filter Bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by RFP title or ID..."
          filters={filters}
          activeChips={activeChips}
          onClearAll={handleClearAll}
        />

        {/* Date Range Sub-Bar */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-gray-200/60 shadow-sm w-max">
          <Calendar className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
          <span className="text-sm font-semibold text-gray-700">Deadline Range:</span>
          <div className="flex items-center gap-2 ml-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-xs rounded-md border-gray-200 w-[130px]"
            />
            <span className="text-xs text-gray-400 font-medium px-1">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-xs rounded-md border-gray-200 w-[130px]"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredRFPs.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">RFP ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Title</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Categories</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Created Date</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Submission Deadline</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Bids Count</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRFPs.map((rfp) => {
                  const proposalCount = getProposalCount(rfp.id);
                  return (
                    <TableRow key={rfp.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                        {rfp.id}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">{rfp.title}</TableCell>
                      <TableCell className="text-gray-500 font-medium text-xs max-w-[200px] truncate">
                        {rfp.category.join(', ')}
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {formatDate(rfp.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {formatDate(rfp.submissionDeadline)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={proposalCount > 0 ? "bg-sky-50 text-sky-700 font-bold border border-sky-100 rounded-md" : "bg-gray-50 text-gray-400 border border-gray-100 rounded-md"}
                        >
                          {proposalCount} Bids
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={rfp.status} />
                      </TableCell>
                      <TableCell className="text-right py-3 pr-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (rfp.status.toLowerCase() === 'draft') {
                              navigate(`/admin/rfps/edit/${rfp.id}`);
                            } else {
                              navigate(`/admin/rfps/${rfp.id}`);
                            }
                          }}
                          className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold"
                          title="Manage RFP"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No RFPs Found"
              description="No RFP campaigns matched your search or filters. Clear active filters to view all entries."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}