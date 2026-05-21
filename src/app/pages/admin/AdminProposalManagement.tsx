import { useNavigate } from '@/app/context/RouterContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { mockProposals } from '@/app/data/mockData';

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
  if (statusStr === 'technical_correction_requested') return 'Technical Correction Requested';
  if (statusStr === 'commercial_correction_requested') return 'Commercial Correction Requested';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminProposalManagement() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      technical_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      commercial_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      selected: { bg: '#D1FAE5', text: 'var(--fnrc-success)' }
    };
    return colors[status] || colors.submitted;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Proposal Management
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Review and evaluate vendor proposals
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)', borderColor: 'var(--fnrc-border-gray)' }}>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal ID</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>RFP</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Vendor</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Submitted</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Amount</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProposals.map((proposal) => {
                const statusColor = getStatusColor(proposal.status);
                return (
                  <TableRow key={proposal.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <TableCell className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {proposal.id}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.rfpTitle}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.vendorName}</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                      {formatDate(proposal.submissionDate)}
                    </TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      AED {proposal.commercialAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {formatStatus(proposal.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                        style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}