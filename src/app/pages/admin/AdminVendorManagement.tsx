import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { RefreshCw, ArrowRight, Pencil } from 'lucide-react';
import { toast } from 'sonner';
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
import { mockVendors } from '@/app/data/mockData';
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

export default function AdminVendorManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncERP = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Vendors synced successfully from ERP');
    }, 1500);
  };

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Correction Requested', value: 'correction_requested' },
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter,
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
            Vendor Directory
          </h1>
        </div>
        <Button 
          onClick={handleSyncERP} 
          disabled={isSyncing}
          className="gap-2 text-white shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5" 
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync from ERP'}
        </Button>
      </div>

      {/* Modern Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search vendors by ID or name..."
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Results Table */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredVendors.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Vendor ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Company Name</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Category Sectors</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Registration Date</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                      {vendor.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">{vendor.companyName}</TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      {vendor.category.slice(0, 2).join(', ')}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      {formatDate(vendor.registrationDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.status} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                        className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold"
                        title="Review Vendor"
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
              title="No Vendors Matching Search"
              description="Refine your criteria or clear active search filter badges above."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}