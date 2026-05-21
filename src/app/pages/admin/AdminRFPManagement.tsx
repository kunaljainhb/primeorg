import { useNavigate } from '@/app/context/RouterContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { mockRFPs, mockProposals, vendorCategories } from '@/app/data/mockData';
import { Search, Calendar, Filter, X, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Checkbox } from "@/app/components/ui/checkbox";

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatStatus = (statusStr?: string) => {
  if (!statusStr) return '';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminRFPManagement() {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      draft: { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' },
      published: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      closed: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      cancelled: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status] || colors.draft;
  };

  const getProposalCount = (rfpId: string) => {
    return mockProposals.filter(p => p.rfpId === rfpId).length;
  };

  const toggleCategory = (category: string) => {
    setCategoryFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Filter RFPs based on selected filters
  const filteredRFPs = mockRFPs.filter(rfp => {
    // Search filter
    if (searchQuery && !rfp.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter (Multi-select)
    if (categoryFilters.length > 0 && !rfp.category.some(c => categoryFilters.includes(c))) {
      return false;
    }

    // Date range filter (Submission Deadline)
    const rfpDate = new Date(rfp.submissionDeadline);
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (rfpDate < fromDate) return false;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      if (rfpDate > toDate) return false;
    }

    if (statusFilter && statusFilter !== 'all' && rfp.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilters([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            RFP Management
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Create and manage Request for Proposals
          </p>
        </div>
        <Button
          onClick={() => navigate('/admin/rfps/create')}
          className="text-white"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
        >
          Create New RFP
        </Button>
      </div>

      {/* Filter Section - Reverted to Original Style */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <Label htmlFor="search" className="mb-2 block">Search RFP Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="search"
                    placeholder="Search by RFP title..."
                    className="pl-10 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Service Category Filter */}
              <div style={{ width: '230px' }}>
                <Label className="mb-2 block">Service Category</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-full justify-between font-normal">
                      <div className="flex items-center gap-2 truncate">
                        {categoryFilters.length === 0 ? "All Categories" : `${categoryFilters.length} Selected`}
                      </div>
                      <Filter className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[230px] p-2" align="start">
                    <div className="max-h-[250px] overflow-y-auto space-y-1">
                      {vendorCategories.map((cat) => (
                        <div 
                          key={cat} 
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                          onClick={() => toggleCategory(cat)}
                        >
                          <Checkbox 
                            id={`list-cat-${cat}`} 
                            checked={categoryFilters.includes(cat)}
                            onCheckedChange={() => {}}
                          />
                          <label className="text-sm cursor-pointer flex-1">{cat}</label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Filter */}
              <div style={{ width: '150px' }}>
                <Label className="mb-2 block">Status</Label>
                <Select value={statusFilter || "all"} onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submission Deadline Group */}
              <div>
                <Label className="mb-2 block">Submission Deadline</Label>
                <div className="flex items-center gap-3">
                  <div className="relative" style={{ width: '150px' }}>
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--fnrc-text-muted)' }} />
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-10 pl-10 text-sm"
                    />
                  </div>
                  <span style={{ color: 'var(--fnrc-text-muted)' }}>—</span>
                  <div className="relative" style={{ width: '150px' }}>
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--fnrc-text-muted)' }} />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-10 pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section - Reverted to Original Style */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)', borderColor: 'var(--fnrc-border-gray)' }}>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>RFP ID</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Title</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Category</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Created Date</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Deadline</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposals</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFPs.map((rfp) => {
                const statusColor = getStatusColor(rfp.status);
                const proposalCount = getProposalCount(rfp.id);
                return (
                  <TableRow key={rfp.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <TableCell className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {rfp.id}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{rfp.title}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>{rfp.category.join(', ')}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                      {formatDate(rfp.createdAt)}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {formatDate(rfp.submissionDeadline)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{ 
                          backgroundColor: proposalCount > 0 ? '#E0F2FE' : '#F3F4F6',
                          color: proposalCount > 0 ? '#0369A1' : 'var(--fnrc-text-muted)'
                        }}
                      >
                        {proposalCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {formatStatus(rfp.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRFPs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground italic">
                    No RFPs found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}