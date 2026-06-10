import { useState, useEffect } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { RefreshCw, ArrowRight, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
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
import { useTranslation } from '@/app/context/LanguageContext';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AdminVendorManagement() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>('01/01/2020 12:00:00');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSyncERP = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setLastSync(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
      toast.success('Vendors synced successfully from ERP');
    }, 1500);
  };
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal: any = a[key as keyof typeof a];
    let bVal: any = b[key as keyof typeof b];

    if (key === 'registrationDate') {
       aVal = new Date(aVal).getTime();
       bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedVendors.length / itemsPerPage);
  const paginatedVendors = sortedVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    {
      key: 'status',
      label: t('Status'),
      options: [
        { label: t('All'), value: 'all' },
        { label: t('Pending'), value: 'pending' },
        { label: t('Approved'), value: 'approved' },
        { label: t('Correction Required'), value: 'correction_requested' },
        { label: t('Rejected'), value: 'rejected' },
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter,
    }
  ];

  const activeChips = statusFilter !== 'all' ? [
    {
      label: `${t('Status')}: ${t(statusFilter === 'correction_requested' ? 'Correction Required' : statusFilter === 'rejected' ? 'Rejected' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))}`,
      onRemove: () => setStatusFilter('all')
    }
  ] : [];

  const handleClearAll = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-2 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t("Vendor Management")}
          </h1>
        </div>
          <div className="flex flex-col items-end">
            <Button
              onClick={handleSyncERP}
              disabled={isSyncing}
              className="gap-2 text-white shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer animate-fade-in"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? t('Syncing...') : t('Sync from ERP')}
            </Button>
            <span className="text-xs text-gray-500 mt-1">
              {t('Last Sync')}: {lastSync || '-'}
            </span>
          </div>
      </div>

      {/* Modern Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={t("Search vendors by ID or name...")}
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Results Table */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden rounded-card">
        <CardContent className="p-0">
          {paginatedVendors.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1.5">
                      {t("Vendor ID")}
                      {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('companyName')}>
                    <div className="flex items-center gap-1.5">
                      {t("Vendor name")}
                      {sortConfig?.key === 'companyName' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">{t("Service Category")}</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('registrationDate')}>
                    <div className="flex items-center gap-1.5">
                      {t("Registration Date")}
                      {sortConfig?.key === 'registrationDate' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      {t("Status")}
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-end font-bold text-gray-900 text-sm py-4">{t("Action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendors.map((vendor) => (
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
                    <TableCell className="text-end py-3 pe-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                        className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold cursor-pointer"
                        title={t("Review Vendor")}
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
              title={t("No Vendors Matching Search")}
              description={t("Refine your criteria or clear active search filter badges above.")}
              actionLabel={t("Clear Filters")}
              onAction={handleClearAll}
            />
          )}

          {/* Pagination Controls */}
          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-semibold">
                {t("Showing")} <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> {t("to")} <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedVendors.length)}</span> {t("of")} <span className="font-bold text-gray-900">{sortedVendors.length}</span> {t("entries")}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="font-bold cursor-pointer"
                >
                  <ChevronLeft className={`h-4 w-4 me-1 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
                  {t("Previous")}
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-md text-sm font-bold transition-colors cursor-pointer ${
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
                  className="font-bold cursor-pointer"
                >
                  {t("Next")}
                  <ChevronRight className={`h-4 w-4 ms-1 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}