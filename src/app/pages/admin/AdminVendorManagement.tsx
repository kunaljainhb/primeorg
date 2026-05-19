import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Search, Filter } from 'lucide-react';
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
import { mockVendors } from '@/app/data/mockData';

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

export default function AdminVendorManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      suspended: { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' },
      correction_requested: { bg: '#DBEAFE', text: 'var(--fnrc-info)' }
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            Vendor Management
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Manage vendor registrations and approvals
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
                placeholder="Search by vendor name or ID..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="correction_requested">Correction Requested</SelectItem>
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
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Vendor ID</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Company Name</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Category</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Registration Date</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => {
                const statusColor = getStatusColor(vendor.status);
                return (
                  <TableRow key={vendor.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <TableCell className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {vendor.id}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{vendor.companyName}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                      {vendor.category.slice(0, 2).join(', ')}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {formatDate(vendor.registrationDate)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {formatStatus(vendor.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
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
          {filteredVendors.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
              <p>No vendors found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}