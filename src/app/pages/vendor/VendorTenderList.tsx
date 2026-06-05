import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockTenders } from '@/app/data/mockData';
import { SearchFilterBar, FilterDropdown } from '@/app/components/ui/search-filter-bar';
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

export default function VendorTenderList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tenderStatusFilter, setRfpStatusFilter] = useState('all');

  const activeTenders = mockTenders.filter(tender => tender.status === 'published');
  
  // Get unique categories from active Tenders
  const categories = Array.from(new Set(activeTenders.flatMap(tender => tender.category)));

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setRfpStatusFilter('all');
    setCurrentPage(1);
  };

  const filteredTenders = activeTenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tender.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || tender.category.some(cat => selectedCategories.includes(cat));
    
    const isClosed = new Date(tender.submissionDeadline) < new Date('2026-05-15');
    const matchesStatus = tenderStatusFilter === 'all' ||
                          (tenderStatusFilter === 'published' && !isClosed) ||
                          (tenderStatusFilter === 'closed' && isClosed);
                          
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Grid is 3 columns, 9 fits nicely
  const totalPages = Math.ceil(filteredTenders.length / itemsPerPage);
  
  const paginatedTenders = filteredTenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Setup filters for standard SearchFilterBar
  const filterConfig: FilterDropdown[] = [
    {
      key: 'category',
      label: 'Category',
      isMulti: true,
      options: [
        { label: 'All Categories', value: 'all' },
        ...categories.map(cat => ({ label: cat, value: cat }))
      ],
      selectedValues: selectedCategories,
      onMultiChange: (vals) => setSelectedCategories(vals),
      onChange: () => {}
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Open', value: 'published' },
        { label: 'Closed', value: 'closed' },
        { label: 'Cancelled', value: 'cancelled' }
      ],
      selectedValue: tenderStatusFilter,
      onChange: (val) => setRfpStatusFilter(val)
    }
  ];

  // Active filter chips
  const activeChips = [];
  if (selectedCategories.length > 0) {
    activeChips.push({
      label: `Categories: ${selectedCategories.join(', ')}`,
      onRemove: () => setSelectedCategories([])
    });
  }
  if (tenderStatusFilter !== 'all') {
    activeChips.push({
      label: `Status: ${tenderStatusFilter === 'published' ? 'Open' : 'Closed'}`,
      onRemove: () => setRfpStatusFilter('all')
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
          Available Tenders
        </h1>
      </div>

      {/* Reusable Search & Filter Component */}
      <Card className="shadow-card border-none">
        <CardContent className="p-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by Tender ID or title..."
            filters={filterConfig}
            activeChips={activeChips}
            onClearAll={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Tender Cards Grid */}
      {paginatedTenders.length > 0 ? (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedTenders.map((tender) => {
              const isClosed = new Date(tender.submissionDeadline) < new Date('2026-05-15');
            return (
              <Card 
                key={tender.id} 
                className="flex flex-col h-full bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
              >
                {/* Visual Accent bar inside cards */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[var(--fnrc-primary-green)] to-[var(--fnrc-accent-gold)]" />
                
                <CardContent className="p-6 flex flex-col justify-between flex-1 gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{tender.id}</span>
                      <div className="flex items-center gap-2">
                        {tender.id === 'TEND-001' && (
                          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                            Unread Message
                          </Badge>
                        )}
                        <StatusBadge status={isClosed ? 'closed' : 'published'} />
                      </div>
                    </div>

                    <h3 className="text-[18px] font-bold text-gray-800 leading-snug line-clamp-2">
                      {tender.title}
                    </h3>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tender.category.map((cat, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-[11px] px-2.5 py-0.5 rounded-full"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Time details */}
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                        <Calendar className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                        <span>Deadline: {formatDate(tender.submissionDeadline)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                        <Clock className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                        <span>Duration: {tender.timeline}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full text-white text-xs font-semibold rounded-button bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 hover:shadow-md transition-all duration-150 py-4.5 gap-2 flex items-center justify-center"
                      onClick={() => navigate(`/vendor/tenders/${tender.id}`)}
                    >
                      View Opportunities
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
            <span className="text-sm text-gray-500 font-medium">
              Showing {filteredTenders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTenders.length)} of {filteredTenders.length} Tenders
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-gray-700 px-2">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(Math.max(1, totalPages), p + 1))}
                disabled={currentPage === Math.max(1, totalPages) || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Empty State */
        <EmptyState
          type="tender"
          title="No Tenders Found"
          description="We couldn't find any Tender matching your query or selected filters. Try clearing your filters or searches to view all opportunities."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}