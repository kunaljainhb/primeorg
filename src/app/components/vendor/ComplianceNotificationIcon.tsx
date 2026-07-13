import { AlertCircle } from 'lucide-react';
import { mockVendorDocuments } from '@/app/data/mockData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useNavigate } from '@/app/context/RouterContext';

interface ComplianceNotificationIconProps {
  vendorId: string;
}

export function ComplianceNotificationIcon({ vendorId }: ComplianceNotificationIconProps) {
  const navigate = useNavigate();
  const today = new Date('2026-02-20');
  
  // Get vendor's regulatory documents with expiry dates
  const regulatoryDocs = mockVendorDocuments.filter(
    doc => doc.vendorId === vendorId && doc.isRegulatory && doc.expiryDate
  );

  // Calculate which documents need alerts
  const alerts = regulatoryDocs
    .map(doc => {
      const expiryDate = new Date(doc.expiryDate!);
      const diffTime = expiryDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 30) {
        let severity: 'expired' | 'critical' | 'warning';
        let message: string;

        if (daysRemaining < 0) {
          severity = 'expired';
          message = `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago`;
        } else if (daysRemaining <= 15) {
          severity = 'critical';
          message = `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
        } else {
          severity = 'warning';
          message = `Expires in ${daysRemaining} days`;
        }

        return { document: doc, severity, daysRemaining, message };
      }
      return null;
    })
    .filter(Boolean) as Array<{
      document: any;
      severity: 'expired' | 'critical' | 'warning';
      daysRemaining: number;
      message: string;
    }>;

  // Sort alerts: expired first, then by days remaining
  alerts.sort((a, b) => {
    if (a.severity === 'expired' && b.severity !== 'expired') return -1;
    if (a.severity !== 'expired' && b.severity === 'expired') return 1;
    return a.daysRemaining - b.daysRemaining;
  });

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex items-center justify-center focus:outline-none">
          <AlertCircle 
            className="h-6 w-6" 
            style={{ color: 'var(--prime-error)' }} 
          />
          <span 
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
            style={{ backgroundColor: 'var(--prime-error)' }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold" style={{ color: 'var(--prime-text-dark)' }}>
              Document Compliance Alerts
            </h4>
            <p className="text-sm mt-1" style={{ color: 'var(--prime-text-muted)' }}>
              {alerts.length} document{alerts.length !== 1 ? 's' : ''} requiring attention
            </p>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {alerts.map((alert) => {
              let bgColor, textColor;
              
              switch (alert.severity) {
                case 'expired':
                  bgColor = '#FEE2E2';
                  textColor = 'var(--prime-error)';
                  break;
                case 'critical':
                  bgColor = '#FED7AA';
                  textColor = '#EA580C';
                  break;
                case 'warning':
                  bgColor = '#FEF3C7';
                  textColor = 'var(--prime-warning)';
                  break;
              }

              return (
                <div
                  key={alert.document.id}
                  className="rounded-lg p-3 border-l-4"
                  style={{
                    backgroundColor: bgColor,
                    borderLeftColor: textColor,
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent'
                  }}
                >
                  <div className="font-medium text-sm" style={{ color: 'var(--prime-text-dark)' }}>
                    {alert.document.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: textColor }}>
                    {alert.message}
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            className="w-full"
            onClick={() => navigate('/vendor/profile')}
            style={{
              backgroundColor: 'var(--prime-primary-green)',
              color: 'white'
            }}
          >
            Update Documents
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
