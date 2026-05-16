import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Table, TableBody, TableCell, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';

export default function VendorRegistrationStatus() {
  const navigate = useNavigate();
  
  // Dynamic status - controlled by Admin Action panel for demo
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'correction'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock company data for the status screen
  const [companyData, setCompanyData] = useState({
    nameEn: 'TechSolutions LLC',
    nameAr: 'تك سوليوشنز ذ.م.م',
    address: 'Office 402, Business Bay Tower, Al Abraj St',
    city: 'Dubai',
    country: 'United Arab Emirates',
    tradeLicense: 'TL-123456',
    vatNumber: '100234567890003',
    registrationDate: 'May 14, 2026',
    category: 'IT Services, Digital Transformation'
  });

  const handleResubmit = () => {
    setIsEditing(false);
    setStatus('pending');
    // In a real app, this would trigger an API call
  };

  const renderStatusCard = () => {
    switch (status) {
      case 'pending':
        return (
          <Alert style={{ borderColor: 'var(--fnrc-warning)', backgroundColor: '#FEF3C7' }}>
            <Clock className="h-5 w-5" style={{ color: 'var(--fnrc-warning)' }} />
            <AlertTitle className="text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
              Registration Pending Approval
            </AlertTitle>
            <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }}>
              Your vendor registration is currently under review by FNRC procurement team. 
              You will receive an email notification once your application has been processed.
              This typically takes 3-5 business days.
            </AlertDescription>
          </Alert>
        );
      
      case 'approved':
        return (
          <Alert style={{ borderColor: 'var(--fnrc-success)', backgroundColor: '#D1FAE5' }}>
            <CheckCircle className="h-5 w-5" style={{ color: 'var(--fnrc-success)' }} />
            <AlertTitle className="text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
              Registration Approved
            </AlertTitle>
            <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }}>
              Congratulations! Your vendor registration has been approved by FNRC. 
              You can now access RFPs and submit proposals.
            </AlertDescription>
          </Alert>
        );
      
      case 'rejected':
        return (
          <div className="space-y-4">
            <Alert style={{ borderColor: 'var(--fnrc-error)', backgroundColor: '#FEE2E2' }}>
              <XCircle className="h-5 w-5" style={{ color: 'var(--fnrc-error)' }} />
              <AlertTitle className="text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                Registration Rejected
              </AlertTitle>
              <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }}>
                Your vendor registration application has been reviewed and was not approved at this time.
              </AlertDescription>
            </Alert>
            
            <Card className="border-red-100 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  Rejection Remarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 leading-relaxed">
                  The uploaded Trade License is nearing its expiry date and the VAT Registration Certificate is blurry. 
                  Please provide a clear copy of your VAT certificate and ensure all legal documents have at least 
                  6 months of validity remaining.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'correction':
        return (
          <div className="space-y-4">
            <Alert style={{ borderColor: '#F59E0B', backgroundColor: '#FEF3C7' }}>
              <AlertCircle className="h-5 w-5" style={{ color: '#F59E0B' }} />
              <AlertTitle className="text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                Correction Required
              </AlertTitle>
              <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }}>
                Further information or corrections are required for your registration application. 
                Please review the remarks below and update your profile accordingly.
              </AlertDescription>
            </Alert>
            
            <Card className="border-amber-100 bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  Required Corrections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 leading-relaxed">
                  The Trade License number provided does not match the uploaded document. 
                  Additionally, the Arabic Legal Name contains a spelling error. 
                  Please correct these details and re-submit your profile for review.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              Registration Status
            </h1>
            <p style={{ color: 'var(--fnrc-text-muted)' }}>
              Check your vendor registration status
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-lg border bg-white shadow-sm" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Admin Action Simulator</div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant={status === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatus('approved')}
                style={status === 'approved' ? { backgroundColor: 'var(--fnrc-success)', color: 'white' } : {}}
                className="h-8 text-xs px-3"
              >
                Approved
              </Button>
              <Button 
                size="sm"
                variant={status === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatus('rejected')}
                style={status === 'rejected' ? { backgroundColor: '#EF4444', color: 'white' } : {}}
                className="h-8 text-xs px-3"
              >
                Rejected
              </Button>
              <Button 
                size="sm"
                variant={status === 'correction' ? 'default' : 'outline'}
                onClick={() => setStatus('correction')}
                style={status === 'correction' ? { backgroundColor: '#F59E0B', color: 'white' } : {}}
                className="h-8 text-xs px-3"
              >
                Correction Required
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {renderStatusCard()}

          {/* Company Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Submitted Information</CardTitle>
                  <CardDescription>Your registration details</CardDescription>
                </div>
                {status === 'correction' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/vendor/profile-setup')}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    Edit & Resubmit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0 w-1/3" style={{ color: 'var(--fnrc-text-muted)' }}>Company Legal Name (English)</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.nameEn}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>Company Legal Name (Arabic)</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }} dir="rtl">
                      {companyData.nameAr}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>Company Address</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.address}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>City</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.city}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>Country</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.country}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>Trade Licensee Number</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.tradeLicense}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>VAT Registration Number</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.vatNumber}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell className="font-medium pl-0" style={{ color: 'var(--fnrc-text-muted)' }}>Service Category</TableCell>
                    <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                      {companyData.category}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              className="text-white px-8"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={() => navigate('/vendor/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}