import { useNavigate } from '@/app/context/RouterContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { mockTenders, mockProposals, vendorCategories } from '@/app/data/mockData';
import { Calendar, Plus, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchFilterBar } from '@/app/components/ui/search-filter-bar';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { EmptyState } from '@/app/components/ui/empty-state';
import { useTranslation } from '@/app/context/LanguageContext';
import { cn } from '@/app/components/ui/utils';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AdminTenderManagement() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilters, statusFilter, dateFrom, dateTo]);

  const getProposalCount = (tenderId: string) => {
    return mockProposals.filter(p => p.tenderId === tenderId).length;
  };

  // Filter Tenders based on selected filters
  const filteredTenders = mockTenders.filter(tender => {
    if (searchQuery && !tender.title.toLowerCase().includes(searchQuery.toLowerCase()) && !tender.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilters.length > 0 && !tender.category.some(c => categoryFilters.includes(c))) {
      return false;
    }
    const tenderDate = new Date(tender.submissionDeadline);
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (tenderDate < fromDate) return false;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      if (tenderDate > toDate) return false;
    }
    if (statusFilter && tender.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTenders = [...filteredTenders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal: any = key === 'proposalCount' ? getProposalCount(a.id) : a[key as keyof typeof a];
    let bVal: any = key === 'proposalCount' ? getProposalCount(b.id) : b[key as keyof typeof b];

    if (key === 'createdAt' || key === 'submissionDeadline') {
       aVal = new Date(aVal).getTime();
       bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTenders.length / itemsPerPage);
  const paginatedTenders = sortedTenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    {
      key: 'status',
      label: t('Status'),
      options: [
        { label: t('All Statuses'), value: 'all' },
        { label: t('Draft'), value: 'draft' },
        { label: t('Open'), value: 'published' },
        { label: t('Closed'), value: 'closed' },
      ],
      selectedValue: statusFilter || 'all',
      onChange: (val: string) => setStatusFilter(val === 'all' ? '' : val)
    }
  ];

  const activeChips: any[] = [];
  if (statusFilter) {
    const statusLabel = statusFilter === 'published' ? 'Open' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
    activeChips.push({
      label: `${t('Status')}: ${t(statusLabel)}`,
      onRemove: () => setStatusFilter('')
    });
  }
  if (dateFrom) {
    activeChips.push({
      label: `${t('Submission From')}: ${formatDate(dateFrom)}`,
      onRemove: () => setDateFrom('')
    });
  }
  if (dateTo) {
    activeChips.push({
      label: `${t('Submission To')}: ${formatDate(dateTo)}`,
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
            {t('Tender Management')}
          </h1>
        </div>
        <Button
          onClick={() => navigate('/admin/tenders/create')}
          className="text-white gap-2 shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
        >
          <Plus className="h-4 w-4" />
          {t('Create New Tender')}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Modern Search and Filter Bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={t('Search by Tender title or ID...')}
          filters={filters}
          activeChips={activeChips}
          onClearAll={handleClearAll}
        >
          {/* Inline Date Range */}
          <div className="flex items-center gap-2 bg-white px-4 h-12 rounded-input border border-gray-200 shadow-xs">
            <Calendar className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
            <span className="text-sm font-semibold text-gray-700">{t('Submission Range')}:</span>
            <div className="flex items-center gap-2 ms-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 text-xs rounded-md border-gray-200 w-[140px] px-2 bg-transparent"
              />
              <span className="text-xs text-gray-400 font-medium px-1">{t('to')}</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 text-xs rounded-md border-gray-200 w-[140px] px-2 bg-transparent"
              />
            </div>
          </div>
        </SearchFilterBar>
      </div>

      {/* Table Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {paginatedTenders.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1.5">
                      {t('Tender ID')}
                      {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1.5">
                      {t('Tender Title')}
                      {sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1.5">
                      {t('Created Date')}
                      {sortConfig?.key === 'createdAt' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('submissionDeadline')}>
                    <div className="flex items-center gap-1.5">
                      {t('Deadline')}
                      {sortConfig?.key === 'submissionDeadline' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => handleSort('proposalCount')}>
                    <div className="flex items-center justify-center gap-1.5">
                      {t('Proposal Count')}
                      {sortConfig?.key === 'proposalCount' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 text-center">{t('Unread Messages')}</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      {t('Status')}
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4">{t('Action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTenders.map((tender) => {
                  const proposalCount = getProposalCount(tender.id);
                  return (
                    <TableRow key={tender.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-bold text-[var(--fnrc-primary-green)]">
                        {tender.id}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">{tender.title}</TableCell>

                      <TableCell className="text-gray-500 font-medium">
                        {formatDate(tender.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {formatDate(tender.submissionDeadline)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "cursor-pointer rounded-md transition-colors",
                            proposalCount > 0
                              ? "bg-sky-50 text-sky-700 font-bold border border-sky-100 hover:bg-sky-100"
                              : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                          )}
                          onClick={() => navigate(`/admin/tenders/${tender.id}?tab=proposals`)}
                        >
                          {proposalCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {proposalCount > 0 ? (
                          <Badge variant="secondary" className="bg-rose-50 text-rose-600 font-bold border border-rose-100 rounded-md">
                            {tender.id.length % 3 + 1}
                          </Badge>
                        ) : (
                          <span className="text-gray-300 font-medium">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tender.status} />
                      </TableCell>
                      <TableCell className="text-right py-3 pr-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (tender.status.toLowerCase() === 'draft') {
                              navigate(`/admin/tenders/edit/${tender.id}`);
                            } else {
                              navigate(`/admin/tenders/${tender.id}`);
                            }
                          }}
                          className="h-8 w-8 p-0 justify-center items-center border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 font-semibold"
                          title={t('Manage Tender')}
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
              title={t('No Tenders Found')}
              description={t('No Tender campaigns matched your search or filters. Clear active filters to view all entries.')}
              actionLabel={t('Clear Filters')}
              onAction={handleClearAll}
            />
          )}

          {/* Pagination Controls */}
          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                {t('Showing')} <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')} <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedTenders.length)}</span> {t('of')} <span className="font-bold text-gray-900">{sortedTenders.length}</span> {t('entries')}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="font-semibold"
                >
                  <ChevronLeft className={cn("h-4 w-4 me-1", language === 'ar' && "scale-x-[-1]")} />
                  {t('Previous')}
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
                  {t('Next')}
                  <ChevronRight className={cn("h-4 w-4 ms-1", language === 'ar' && "scale-x-[-1]")} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}