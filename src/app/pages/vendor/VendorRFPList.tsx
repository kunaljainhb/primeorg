import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockRFPs } from '@/app/data/mockData';
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

export default function VendorRFPList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rfpStatusFilter, setRfpStatusFilter] = useState('all');

  const activeRFPs = mockRFPs.filter(rfp => rfp.status === 'published');
  
  // Get unique categories from active RFPs
  const categories = Array.from(new Set(activeRFPs.flatMap(rfp => rfp.category)));

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setRfpStatusFilter('all');
  };

  const filteredRFPs = activeRFPs.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rfp.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || rfp.category.some(cat => selectedCategories.includes(cat));
    
    const isClosed = new Date(rfp.submissionDeadline) < new Date('2026-05-15');
    const matchesStatus = rfpStatusFilter === 'all' ||
                          (rfpStatusFilter === 'published' && !isClosed) ||
                          (rfpStatusFilter === 'closed' && isClosed);
                          
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
        { label: 'Published', value: 'published' },
        { label: 'Closed', value: 'closed' }
      ],
      selectedValue: rfpStatusFilter,
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
  if (rfpStatusFilter !== 'all') {
    activeChips.push({
      label: `Status: ${rfpStatusFilter === 'published' ? 'Published' : 'Closed'}`,
      onRemove: () => setRfpStatusFilter('all')
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
          Available RFPs
        </h1>
      </div>

      {/* Reusable Search & Filter Component */}
      <Card className="shadow-card border-none">
        <CardContent className="p-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by RFP ID or title..."
            filters={filterConfig}
            activeChips={activeChips}
            onClearAll={clearFilters}
          />
        </CardContent>
      </Card>

      {/* RFP Cards Grid */}
      {filteredRFPs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRFPs.map((rfp) => {
            const isClosed = new Date(rfp.submissionDeadline) < new Date('2026-05-15');
            return (
              <Card 
                key={rfp.id} 
                className="flex flex-col h-full bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
              >
                {/* Visual Accent bar inside cards */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[var(--fnrc-primary-green)] to-[var(--fnrc-accent-gold)]" />
                
                <CardContent className="p-6 flex flex-col justify-between flex-1 gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{rfp.id}</span>
                      <StatusBadge status={isClosed ? 'closed' : 'published'} />
                    </div>

                    <h3 className="text-[18px] font-bold text-gray-800 leading-snug line-clamp-2">
                      {rfp.title}
                    </h3>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rfp.category.map((cat, i) => (
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
                        <span>Deadline: {formatDate(rfp.submissionDeadline)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                        <Clock className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                        <span>Duration: {rfp.timeline}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full text-white text-xs font-semibold rounded-button bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 hover:shadow-md transition-all duration-150 py-4.5 gap-2 flex items-center justify-center"
                      onClick={() => navigate(`/vendor/rfps/${rfp.id}`)}
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
      ) : (
        /* Standard Empty State */
        <EmptyState
          type="rfp"
          title="No RFPs Found"
          description="We couldn't find any RFP matching your query or selected filters. Try clearing your filters or searches to view all opportunities."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}