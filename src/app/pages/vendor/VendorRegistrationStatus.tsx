import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  HelpCircle, 
  Upload, 
  FileText, 
  History, 
  ShieldAlert, 
  FileWarning, 
  RotateCcw, 
  FileCheck2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Table, TableBody, TableCell, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

export default function VendorRegistrationStatus() {
  const navigate = useNavigate();
  
  // Set default state to 'pending' after initial submission
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'correction'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Files status
  const [tradeLicenseFile, setTradeLicenseFile] = useState<string>('Trade_License_2026.pdf');
  const [tradeLicenseStatus, setTradeLicenseStatus] = useState<'blurry' | 'replacing' | 'uploaded'>('blurry');
  const [vatCertificateFile, setVatCertificateFile] = useState<string>('VAT_Certificate.pdf');
  const [vatStatus, setVatStatus] = useState<'verified' | 'replacing' | 'uploaded'>('verified');
  
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

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'rejected' | 'correction') => {
    setStatus(newStatus);
    if (newStatus === 'correction') {
      setIsEditing(true);
      setTradeLicenseStatus('blurry');
    } else {
      setIsEditing(false);
    }
  };

  const handleFileChange = (type: 'trade' | 'vat', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'trade') {
      setTradeLicenseStatus('replacing');
      setTimeout(() => {
        setTradeLicenseFile(file.name);
        setTradeLicenseStatus('uploaded');
        toast.success(`Successfully uploaded replacement document: ${file.name}`);
      }, 1200);
    } else {
      setVatStatus('replacing');
      setTimeout(() => {
        setVatCertificateFile(file.name);
        setVatStatus('uploaded');
        toast.success(`Successfully uploaded VAT document: ${file.name}`);
      }, 1200);
    }
  };

  const handleResubmit = () => {
    if (!companyData.nameEn.trim() || !companyData.nameAr.trim() || !companyData.tradeLicense.trim()) {
      toast.error('Please fill in all mandatory legal details.');
      return;
    }

    if (status === 'correction' && tradeLicenseStatus === 'blurry') {
      toast.error('Please upload a clear replacement for the blurry Trade License document.');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditing(false);
      setStatus('pending');
      toast.success('Your corrected registration details and documents have been resubmitted successfully!');
    }, 1800);
  };

  const renderStatusCard = () => {
    switch (status) {
      case 'pending':
        return (
          <Alert className="border-amber-200 bg-amber-50/50 shadow-sm transition-all duration-300">
            <Clock className="h-5 w-5 text-amber-600 animate-spin" />
            <AlertTitle className="text-lg font-semibold text-amber-900">
              Registration Under Review (Pending Approval)
            </AlertTitle>
            <AlertDescription className="text-amber-800 mt-1 leading-relaxed">
              Your corrected vendor registration application was received and is currently under secondary review by the FNRC procurement board. 
              Email notifications will be sent as soon as a final decision has been logged. 
              Review typically completes in 24-48 hours.
            </AlertDescription>
          </Alert>
        );
      
      case 'approved':
        return (
          <Alert className="border-emerald-200 bg-emerald-50/50 shadow-sm transition-all duration-300">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <AlertTitle className="text-lg font-semibold text-emerald-900">
              Vendor Registration Approved
            </AlertTitle>
            <AlertDescription className="text-emerald-800 mt-1 leading-relaxed">
              Congratulations! Your vendor profile has been fully validated and approved by the Federal National Regulatory Commission. 
              Your active vendor number is <strong className="font-mono">VEN-001</strong>. You can now access and participate in open RFPs.
            </AlertDescription>
          </Alert>
        );
      
      case 'rejected':
        return (
          <div className="space-y-4">
            <Alert className="border-rose-200 bg-rose-50/50 shadow-sm">
              <XCircle className="h-5 w-5 text-rose-600" />
              <AlertTitle className="text-lg font-semibold text-rose-900">
                Registration Application Rejected
              </AlertTitle>
              <AlertDescription className="text-rose-800 mt-1 leading-relaxed">
                Your vendor registration application was evaluated by the procurement board and was unfortunately rejected. 
                Please inspect the official rejection reasons and comments below.
              </AlertDescription>
            </Alert>
            
            <Card className="border-red-100 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-800">
                  <ShieldAlert className="h-4 w-4" />
                  Official Auditor Remarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 leading-relaxed font-medium">
                  The uploaded compliance credentials do not meet the minimum validity guidelines (less than 6 months validity remaining). 
                  Additionally, your business category listing does not align with the verified trade license activities.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'correction':
        return (
          <div className="space-y-4 animate-fadeIn">
            <Alert className="border-amber-200 bg-amber-50/40 shadow-sm">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-lg font-semibold text-amber-900">
                Correction Requested
              </AlertTitle>
              <AlertDescription className="text-amber-800 mt-1 leading-relaxed">
                Your registration application requires immediate corrections before review can proceed. 
                Please update the fields highlighted below and upload clear replacement documents as indicated.
              </AlertDescription>
            </Alert>
            
            <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-800">
                  <FileWarning className="h-4 w-4" />
                  Audit Corrections Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-amber-700 leading-relaxed font-medium">
                  1. <strong className="text-amber-900">Arabic Legal Name spelling:</strong> The current Arabic name contains a typographical mismatch against official registration.
                </div>
                <div className="text-sm text-amber-700 leading-relaxed font-medium">
                  2. <strong className="text-amber-900">Trade License Document:</strong> The uploaded license document copy is blurry and unreadable. Please upload a clear replacement.
                </div>
                <div className="text-sm text-amber-700 leading-relaxed font-medium">
                  3. <strong className="text-amber-900">Trade License Number:</strong> The Trade License number entered does not match the verified company directory.
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => navigate('/vendor/profile-setup')}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resubmit Application Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fnrc-text-dark)' }}>
              Registration Lifecycle
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>
              Track review milestones, execute document corrections, and monitor portal compliance
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-lg border bg-white shadow-sm" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Admin Status Simulator</div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant={status === 'approved' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('approved')}
                style={status === 'approved' ? { backgroundColor: 'var(--fnrc-success)', color: 'white' } : {}}
                className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
              >
                Approved
              </Button>
              <Button 
                size="sm"
                variant={status === 'rejected' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('rejected')}
                style={status === 'rejected' ? { backgroundColor: '#EF4444', color: 'white' } : {}}
                className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
              >
                Rejected
              </Button>
              <Button 
                size="sm"
                variant={status === 'correction' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('correction')}
                style={status === 'correction' ? { backgroundColor: '#F59E0B', color: 'white' } : {}}
                className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
              >
                Correction Requested
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Status Callout */}
        {renderStatusCard()}


        {/* Company Information Edit/Resubmit Card */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Legal Profile & Registration Form</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? "Resubmission mode: Edit details and upload readable files below" 
                    : "Submitted application parameters"}
                </CardDescription>
              </div>
              {status === 'correction' && !isEditing && (
                <Button 
                  size="sm" 
                  onClick={() => navigate('/vendor/profile-setup')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-none transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Edit & Resubmit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Table>
                <TableBody>
                  
                  {/* English Name - Normal */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 w-1/3 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Company Legal Name (English) *
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input 
                            value={companyData.nameEn} 
                            onChange={(e) => setCompanyData({...companyData, nameEn: e.target.value})}
                            className="max-w-md h-9 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-sm text-gray-800">{companyData.nameEn}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Arabic Name - UNDER CORRECTION */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 w-1/3 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        Company Legal Name (Arabic) *

                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input 
                            value={companyData.nameAr} 
                            onChange={(e) => setCompanyData({...companyData, nameAr: e.target.value})}
                            className="max-w-md h-9 text-sm text-right"
                            dir="rtl"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-sm text-gray-800 text-right block max-w-md" dir="rtl">{companyData.nameAr}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Address - Normal */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>Company Address *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.address} 
                          onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                          className="max-w-md h-9 text-sm"
                        />
                      ) : (
                        <span className="font-medium text-sm text-gray-800">{companyData.address}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* City/Country - Normal */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>City & Country *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <div className="flex gap-3 max-w-md">
                          <Input 
                            value={companyData.city} 
                            onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                            className="h-9 text-sm w-1/2"
                            placeholder="City"
                          />
                          <Input 
                            value={companyData.country} 
                            onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
                            className="h-9 text-sm w-1/2"
                            placeholder="Country"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-sm text-gray-800">{companyData.city}, {companyData.country}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Trade License Number - UNDER CORRECTION */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        Trade License Number *

                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input 
                            value={companyData.tradeLicense} 
                            onChange={(e) => setCompanyData({...companyData, tradeLicense: e.target.value})}
                            className="max-w-md h-9 text-sm"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-sm text-gray-800 font-mono">{companyData.tradeLicense}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* VAT Number - Normal */}
                  <TableRow className="hover:bg-transparent border-b border-gray-50">
                    <TableCell className="font-semibold text-sm pl-0 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>VAT Registration Number *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.vatNumber} 
                          onChange={(e) => setCompanyData({...companyData, vatNumber: e.target.value})}
                          className="max-w-md h-9 text-sm"
                        />
                      ) : (
                        <span className="font-medium text-sm text-gray-800 font-mono">{companyData.vatNumber}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Category - Normal */}
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell className="font-semibold text-sm pl-0 py-4" style={{ color: 'var(--fnrc-text-muted)' }}>Service Category *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.category} 
                          onChange={(e) => setCompanyData({...companyData, category: e.target.value})}
                          className="max-w-md h-9 text-sm"
                        />
                      ) : (
                        <span className="font-medium text-sm text-gray-800">{companyData.category}</span>
                      )}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>

            </div>
          </CardContent>
        </Card>

        {/* Support Information Details */}
        <Card className="border shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-700" />
              Support Information Details
            </CardTitle>
            <CardDescription>If you have any questions regarding your registration correction checklist, please reach out to our support team.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="p-2 rounded-full bg-emerald-50 text-emerald-700">
                <Mail className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Email Support</div>
                <div className="text-sm font-semibold text-gray-800">vendor.support@fnrc.gov.ae</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="p-2 rounded-full bg-emerald-50 text-emerald-700">
                <Phone className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Phone Support</div>
                <div className="text-sm font-semibold text-gray-800">+971 4 999 8888</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post-verification Redirect Row */}
        {status === 'approved' && (
          <div className="flex justify-center gap-4 pt-4">
            <Button
              className="text-white px-8 font-semibold shadow"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={() => navigate('/vendor/dashboard')}
            >
              Go to Vendor Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}