import { useState, useEffect } from 'react';
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
import { mockTenders, mockProposals } from '@/app/data/mockData';
import { ArrowRight, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
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

export default function AdminItemManagement() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Find all Published Tenders
  const publishedTenders = mockTenders.filter(tender => tender.status === 'published');

  // Find Tenders that have at least one Approved proposal
  const items = publishedTenders.map((tender) => {
    const approvedProposals = mockProposals.filter(
      prop => prop.tenderId === tender.id && prop.status === 'approved'
    );
    
    return approvedProposals.map((proposal) => {
      // Logic for status: PROP-104 and PROP-108 are mocked as Receiving Completed
      const status = (proposal.id === 'PROP-104' || proposal.id === 'PROP-108') ? 'Receiving Completed' : 'Receiving Pending';

      return {
        tenderId: tender.id,
        tenderTitle: tender.title,
        category: tender.category.join(', '),
        createdAt: tender.createdAt,
        proposalId: proposal.id,
        vendorName: proposal.vendorName,
        status
      };
    });
  }).flat();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.tenderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.proposalId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal: any = a[key as keyof typeof a];
    let bVal: any = b[key as keyof typeof b];

    if (key === 'createdAt') {
       aVal = new Date(aVal).getTime();
       bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    {
      key: 'status',
      label: t('Inventory Status'),
      options: [
        { label: t('All Statuses'), value: 'all' },
        { label: t('Receiving Pending'), value: 'receiving pending' },
        { label: t('Receiving Completed'), value: 'receiving completed' },
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter
    }
  ];

  const activeChips = statusFilter !== 'all' ? [
    {
      label: `${t('Status')}: ${t(statusFilter === 'receiving pending' ? 'Receiving Pending' : 'Receiving Completed')}`,
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
            {t("Item Management")}
          </h1>
        </div>
      </div>

      {/* Modern Search and Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={t("Search items by ID, title, or vendor...")}
        filters={filters}
        activeChips={activeChips}
        onClearAll={handleClearAll}
      />

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden rounded-card">
        <CardContent className="p-0">
          {paginatedItems.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('tenderId')}>
                    <div className="flex items-center gap-1.5">
                      {t("Tender ID")}
                      {sortConfig?.key === 'tenderId' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('tenderTitle')}>
                    <div className="flex items-center gap-1.5">
                      {t("Tender Title")}
                      {sortConfig?.key === 'tenderTitle' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('proposalId')}>
                    <div className="flex items-center gap-1.5">
                      {t("Shortlist Proposal ID")}
                      {sortConfig?.key === 'proposalId' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('vendorName')}>
                    <div className="flex items-center gap-1.5">
                      {t("Vendor Name")}
                      {sortConfig?.key === 'vendorName' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1.5">
                      {t("Proposal approved date")}
                      {sortConfig?.key === 'createdAt' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      {t("Receiving Status")}
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-end font-bold text-gray-900 text-sm py-4 pe-6">{t("Action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item, index) => (
                  <TableRow key={`${item.tenderId}-${item.proposalId}-${index}`} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                      {item.tenderId}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800 max-w-[200px] truncate">{item.tenderTitle}</TableCell>
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">{item.proposalId}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{item.vendorName}</TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-end py-3 pe-6">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/items/${item.proposalId}`)}
                        className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold cursor-pointer"
                        title={t("Edit Item Specs")}
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
              title={t("No Approved Items Found")}
              description={t("No inventory items matched your search query. Refine your keywords or clear active filters.")}
              actionLabel={t("Clear Filters")}
              onAction={handleClearAll}
            />
          )}

          {/* Pagination Controls */}
          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-semibold">
                {t("Showing")} <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> {t("to")} <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedItems.length)}</span> {t("of")} <span className="font-bold text-gray-900">{sortedItems.length}</span> {t("entries")}
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
