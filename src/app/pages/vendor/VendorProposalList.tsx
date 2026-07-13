import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Eye, Pencil, ArrowUpDown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { useTranslation } from '@/app/context/LanguageContext';

const formatDate = (dateStr?: string | Date, lang?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function VendorProposalList() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const myProposals = mockProposals.filter(p => p.vendorId === 'VEN-001');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getMappedStatus = (status: string): 'submitted' | 'under_review' | 'approved' | 'rejected' => {
    const norm = (status || '').toLowerCase().trim();
    if (norm === 'submitted') return 'submitted';
    if (norm === 'approved' || norm === 'selected') return 'approved';
    if (norm === 'rejected') return 'rejected';
    return 'under_review';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const filteredProposals = myProposals.filter(proposal => {
    const matchesSearch = proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const mapped = getMappedStatus(proposal.status);
    const matchesStatus = statusFilter === 'all' || mapped === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else { setSortColumn(null); setSortDirection('asc'); }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedProposals = [...filteredProposals].sort((a: any, b: any) => {
    if (!sortColumn) return 0;
    
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === 'status') {
      aVal = getMappedStatus(a.status);
      bVal = getMappedStatus(b.status);
    } else if (sortColumn === 'tenderTitle') {
      aVal = `${a.tenderId} ${a.tenderTitle}`;
      bVal = `${b.tenderId} ${b.tenderTitle}`;
    } else if (sortColumn === 'submissionDate') {
      aVal = new Date(a.submissionDate || 0).getTime();
      bVal = new Date(b.submissionDate || 0).getTime();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedProposals.length / itemsPerPage);
  
  const paginatedProposals = sortedProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const filterConfig: FilterDropdown[] = [
    {
      key: 'status',
      label: t('Status'),
      options: [
        { label: t('All Statuses'), value: 'all' },
        { label: t('Submitted'), value: 'submitted' },
        { label: t('Under Review'), value: 'under_review' },
        { label: t('Approved'), value: 'approved' },
        { label: t('Rejected'), value: 'rejected' }
      ],
      selectedValue: statusFilter,
      onChange: (val) => setStatusFilter(val)
    }
  ];

  const activeChips = [];
  if (statusFilter !== 'all') {
    const displayLabel = statusFilter === 'under_review' ? 'Under Review' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
    activeChips.push({
      label: `${t('Status:')} ${t(displayLabel)}`,
      onRemove: () => setStatusFilter('all')
    });
  }

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
          {t('My Proposals')}
        </h1>
      </div>

      {/* Unified Search & Filters component */}
      <Card className="shadow-card border-none">
        <CardContent className="p-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('Search by Proposal ID or Tender title...')}
            filters={filterConfig}
            activeChips={activeChips}
            onClearAll={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Standardized Table View */}
      {paginatedProposals.length > 0 ? (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="font-bold text-[13px] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors text-start"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1.5">
                    {t('Proposal ID')}
                    {sortColumn === 'id' ? (sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-[13px] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors text-start"
                  onClick={() => handleSort('tenderTitle')}
                >
                  <div className="flex items-center gap-1.5">
                    {t('Tender Number - Tender Title')}
                    {sortColumn === 'tenderTitle' ? (sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-[13px] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors text-start"
                  onClick={() => handleSort('submissionDate')}
                >
                  <div className="flex items-center gap-1.5">
                    {t('Submission Date')}
                    {sortColumn === 'submissionDate' ? (sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-[13px] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors text-start"
                  onClick={() => handleSort('commercialAmount')}
                >
                  <div className="flex items-center gap-1.5">
                    {t('Commercial Amount')}
                    {sortColumn === 'commercialAmount' ? (sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-[13px] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors text-start"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5">
                    {t('Status')}
                    {sortColumn === 'status' ? (sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 text-end pe-6">{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProposals.map((proposal) => (
              <TableRow 
                key={proposal.id}
                className="cursor-pointer"
                onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
              >
                <TableCell className="font-bold text-[14px] text-[var(--prime-primary-green)] text-start">
                  {proposal.id}
                </TableCell>
                <TableCell className="font-semibold text-[14px] text-gray-800 max-w-[280px] truncate text-start">
                  {proposal.tenderId} - {proposal.tenderTitle}
                </TableCell>
                <TableCell className="text-[14px] text-gray-500 font-medium text-start">
                  {formatDate(proposal.submissionDate, language)}
                </TableCell>
                <TableCell className="font-bold text-[14px] text-gray-800 text-start">
                  {t('AED')} {proposal.commercialAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-start">
                  <StatusBadge status={getMappedStatus(proposal.status) === 'under_review' ? 'under_review_vendor' : getMappedStatus(proposal.status)} />
                </TableCell>
                <TableCell className="text-end pe-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
                      className="gap-1.5 text-xs text-gray-600 border-gray-200 hover:bg-gray-50 rounded-button h-8 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t('Edit')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
          <span className="text-sm text-gray-500 font-medium">
            {t('Showing')} {sortedProposals.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} {t('to')} {Math.min(currentPage * itemsPerPage, sortedProposals.length)} {t('of')} {sortedProposals.length} {t('proposals')}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
            </Button>
            <span className="text-sm font-semibold text-gray-700 px-2">
              {t('Page')} {currentPage} {t('of')} {Math.max(1, totalPages)}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(Math.max(1, totalPages), p + 1))}
              disabled={currentPage === Math.max(1, totalPages) || totalPages === 0}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      ) : (
        <EmptyState
          type="proposal"
          title={t("No Proposals Found")}
          description={t("We couldn't find any proposals matching your query. Try adjusting your search query or status filter.")}
          actionLabel={t("Clear All Filters")}
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
}