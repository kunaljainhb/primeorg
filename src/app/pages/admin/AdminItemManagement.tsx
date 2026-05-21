import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { mockRFPs, mockProposals } from '@/app/data/mockData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Find all Published RFPs
  const publishedRFPs = mockRFPs.filter(rfp => rfp.status === 'published');

  // Find RFPs that have at least one Shortlisted proposal
  const items = publishedRFPs.map((rfp, rfpIndex) => {
    const shortlistedProposals = mockProposals.filter(
      prop => prop.rfpId === rfp.id && prop.status === 'shortlisted'
    );
    
    return shortlistedProposals.map((proposal) => {
      // Logic for status: PROP-104 is mocked as fully received
      const status = proposal.id === 'PROP-104' ? 'Completed' : 'Pending';

      return {
        rfpId: rfp.id,
        rfpTitle: rfp.title,
        category: rfp.category.join(', '),
        createdAt: rfp.createdAt,
        proposalId: proposal.id,
        vendorName: proposal.vendorName,
        status
      };
    });
  }).flat();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.rfpId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.rfpTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.proposalId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return { bg: '#FEF3C7', text: 'var(--fnrc-warning)' };
    if (status === 'Completed') return { bg: '#D1FAE5', text: 'var(--fnrc-success)' };
    return { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            Item Management
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Track received quantities for shortlisted proposals
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--fnrc-text-muted)' }} />
              <Input
                placeholder="Search by RFP ID, Title, or Proposal ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)', borderColor: 'var(--fnrc-border-gray)' }}>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>RFP ID</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>RFP Title</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal ID</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Vendor Name</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Created Date</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item, index) => {
                const statusColor = getStatusColor(item.status);
                return (
                  <TableRow key={`${item.rfpId}-${item.proposalId}-${index}`} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <TableCell className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {item.rfpId}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{item.rfpTitle}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-primary-green)' }}>{item.proposalId}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{item.vendorName}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/items/${item.proposalId}`)}
                        className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredItems.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
              <p>No items found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
