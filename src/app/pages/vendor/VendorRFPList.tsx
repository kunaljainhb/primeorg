import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Search, Filter, Calendar, Clock, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Checkbox } from '@/app/components/ui/checkbox';
import { mockRFPs } from '@/app/data/mockData';

export default function VendorRFPList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const activeRFPs = mockRFPs.filter(rfp => rfp.status === 'published');
  
  // Get unique categories from active RFPs
  const categories = Array.from(new Set(activeRFPs.flatMap(rfp => rfp.category)));

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
  };

  const filteredRFPs = activeRFPs.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rfp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || rfp.category.some(c => selectedCategories.includes(c));
    return matchesSearch && matchesCategory;
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Available RFPs
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Browse and respond to active procurement opportunities
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--fnrc-text-muted)' }} />
                <Input
                  placeholder="Search by RFP ID or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter by Category
                      {selectedCategories.length > 0 && (
                        <Badge className="ml-1 px-1.5 py-0.5 h-5 min-w-[20px] justify-center" style={{ backgroundColor: 'var(--fnrc-primary-green)' }}>
                          {selectedCategories.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="end">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Categories</span>
                        {selectedCategories.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedCategories([])}
                            className="h-auto p-0 text-xs text-red-500 hover:text-red-700"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cat-${category}`} 
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <label
                              htmlFor={`cat-${category}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {(searchQuery || selectedCategories.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs">
                    <X className="h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filter Badges */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                {selectedCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                    {cat}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => toggleCategory(cat)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* RFP Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRFPs.map((rfp) => (
          <Card key={rfp.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                    {rfp.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className="text-xs px-2 py-0.5" 
                      style={{ 
                        backgroundColor: new Date(rfp.submissionDeadline) < new Date('2026-05-15') ? 'var(--fnrc-border-gray)' : 'var(--fnrc-success)',
                        color: 'white'
                      }}
                    >
                      {new Date(rfp.submissionDeadline) < new Date('2026-05-15') ? 'Closed' : 'Open'}
                    </Badge>
                    <Badge variant="outline" style={{ color: 'var(--fnrc-text-muted)' }}>
                      {rfp.id}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription>
                <div className="flex flex-wrap gap-1">
                  {rfp.category.map((cat, i) => (
                    <Badge key={i} variant="secondary" style={{ backgroundColor: 'var(--fnrc-bg-light)', color: 'var(--fnrc-text-muted)' }}>
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(rfp.submissionDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <Clock className="h-4 w-4" />
                  <span>Timeline: {rfp.timeline}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  onClick={() => navigate(`/vendor/rfps/${rfp.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRFPs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
            <p>No RFPs found matching your criteria</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}