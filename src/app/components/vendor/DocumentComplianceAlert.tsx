import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { mockVendorDocuments } from '@/app/data/mockData';

export function DocumentComplianceAlert({ vendorId }: { vendorId: string }) {
  const today = new Date('2026-05-15');
  const vendorDocs = mockVendorDocuments.filter(doc => doc.vendorId === vendorId && doc.expiryDate);
  
  const complianceIssues = vendorDocs.map(doc => {
    const expiryDate = new Date(doc.expiryDate!);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      ...doc,
      daysLeft: diffDays,
      severity: diffDays <= 0 ? 'expired' : diffDays <= 7 ? 'critical' : diffDays <= 30 ? 'warning' : 'safe'
    };
  }).filter(issue => issue.severity !== 'safe');

  if (complianceIssues.length === 0) {
    return (
      <Card className="bg-green-50/30 border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-700">
            <ShieldAlert className="h-4 w-4" />
            Document Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-green-600">All regulatory documents are up to date.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--prime-error)' }}>
            <AlertTriangle className="h-4 w-4" />
            Document Compliance Alert
          </CardTitle>
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
            {complianceIssues.length} Action Required
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {complianceIssues.map((issue) => (
          <div key={issue.id} className="flex items-center justify-between gap-2 border-b last:border-0 pb-2 last:pb-0">
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--prime-text-dark)' }}>{issue.name}</div>
              <div className="text-[10px]" style={{ color: 'var(--prime-text-muted)' }}>{issue.documentType}</div>
            </div>
            <div className="text-right shrink-0">
              {issue.severity === 'expired' ? (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none text-[10px] h-5">Expired</Badge>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: issue.severity === 'critical' ? 'var(--prime-error)' : 'var(--prime-warning)' }}>
                  <Clock className="h-3 w-3" />
                  {issue.daysLeft} days
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
