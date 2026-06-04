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
  ShieldAlert, 
  FileWarning, 
  RotateCcw, 
  ArrowRight,
  UserCheck,
  ClipboardCheck,
  FileCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Table, TableBody, TableCell, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/status-badge';

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
    nameAr: 'تيك سوليوشنز ذ.م.م',
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
          <Alert className="border-amber-100 bg-amber-50/50 shadow-card rounded-xl p-5 flex gap-4 transition-all duration-300">
            <Clock className="h-6 w-6 text-amber-600 animate-spin shrink-0 mt-0.5" />
            <div className="space-y-1">
              <AlertTitle className="text-base font-bold text-amber-900 leading-tight">
                Registration Under Review (Pending Approval)
              </AlertTitle>
              <AlertDescription className="text-sm text-amber-800 leading-relaxed">
                Your corrected vendor registration application was received and is currently under secondary review by the FNRC procurement board. 
                Email notifications will be sent as soon as a final decision has been logged. 
                Review typically completes in 24-48 hours.
              </AlertDescription>
            </div>
          </Alert>
        );
      
      case 'approved':
        return (
          <Alert className="border-emerald-100 bg-emerald-50/50 shadow-card rounded-xl p-5 flex gap-4 transition-all duration-300">
            <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <AlertTitle className="text-base font-bold text-emerald-900 leading-tight">
                Vendor Registration Approved
              </AlertTitle>
              <AlertDescription className="text-sm text-emerald-800 leading-relaxed">
                Congratulations! Your vendor profile has been fully validated and approved by the Federal National Regulatory Commission. 
                Your active vendor number is <strong className="font-mono font-bold">VEN-001</strong>. You can now access and participate in open RFPs.
              </AlertDescription>
            </div>
          </Alert>
        );
      
      case 'rejected':
        return (
          <div className="space-y-4">
            <Alert className="border-rose-100 bg-rose-50/50 shadow-card rounded-xl p-5 flex gap-4 transition-all duration-300">
              <XCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <AlertTitle className="text-base font-bold text-rose-900 leading-tight">
                  Registration Application Rejected
                </AlertTitle>
                <AlertDescription className="text-sm text-rose-800 leading-relaxed">
                  Your vendor registration application was evaluated by the procurement board and was unfortunately rejected. 
                  Please inspect the official rejection reasons and comments below.
                </AlertDescription>
              </div>
            </Alert>
            
            <Card className="border-none shadow-card bg-rose-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-800">
                  <ShieldAlert className="h-4 w-4" />
                  Official Auditor Remarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-rose-700 leading-relaxed font-medium">
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
            <Alert className="border-amber-100 bg-amber-50/40 shadow-card rounded-xl p-5 flex gap-4 transition-all duration-300">
              <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <AlertTitle className="text-base font-bold text-amber-900 leading-tight">
                  Correction Requested
                </AlertTitle>
                <AlertDescription className="text-sm text-amber-800 leading-relaxed">
                  Your registration application requires immediate corrections before review can proceed. 
                  Please update the fields highlighted below and upload clear replacement documents as indicated.
                </AlertDescription>
              </div>
            </Alert>
            
            <Card className="border-none shadow-card bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-800">
                  <FileWarning className="h-4 w-4 text-amber-600" />
                  Audit Corrections Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-amber-700 leading-relaxed font-semibold">
                  1. <strong className="text-amber-900">Arabic Legal Name spelling:</strong> The current Arabic name contains a typographical mismatch against official registration.
                </div>
                <div className="text-xs text-amber-700 leading-relaxed font-semibold">
                  2. <strong className="text-amber-900">Trade License Document:</strong> The uploaded license document copy is blurry and unreadable. Please upload a clear replacement.
                </div>
                <div className="text-xs text-amber-700 leading-relaxed font-semibold">
                  3. <strong className="text-amber-900">Trade License Number:</strong> The Trade License number entered does not match the verified company directory.
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => navigate('/vendor/profile-setup')}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-sm flex items-center gap-2 rounded-button text-xs h-9 px-4 active:scale-98"
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
    <div className="min-h-screen p-8 bg-[#F7F9FC]">
      <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
        
        {/* Top Header & Admin Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
              Registration Lifecycle
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Track review milestones, execute document corrections, and monitor portal compliance
            </p>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Admin Simulator</div>
            <div className="flex gap-1.5">
              <Button 
                size="sm"
                variant={status === 'approved' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('approved')}
                className={`h-8 font-semibold text-xs rounded-button transition-all ${
                  status === 'approved' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Approved
              </Button>
              <Button 
                size="sm"
                variant={status === 'rejected' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('rejected')}
                className={`h-8 font-semibold text-xs rounded-button transition-all ${
                  status === 'rejected' 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Rejected
              </Button>
              <Button 
                size="sm"
                variant={status === 'correction' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('correction')}
                className={`h-8 font-semibold text-xs rounded-button transition-all ${
                  status === 'correction' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Correction
              </Button>
            </div>
          </div>
        </div>


        {/* Dynamic Status Callout */}
        {renderStatusCard()}

        {/* Company Information Edit/Resubmit Card */}
        <Card className="border-none shadow-card bg-white">
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Legal Profile & Registration Form</CardTitle>
                <CardDescription className="text-xs text-gray-400 font-medium">
                  {isEditing 
                    ? "Resubmission mode: Edit details and upload readable files below" 
                    : "Submitted application parameters"}
                </CardDescription>
              </div>
              {status === 'correction' && !isEditing && (
                <Button 
                  size="sm" 
                  onClick={() => navigate('/vendor/profile-setup')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-none transition-all flex items-center gap-1.5 shadow-sm rounded-button text-xs h-9 px-4 active:scale-98"
                >
                  <RotateCcw className="h-4 w-4" />
                  Edit & Resubmit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-6">
              <Table>
                <TableBody>
                  {/* English Name - Normal */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 w-1/3 py-4 text-gray-500">
                      Company Legal Name (English) *
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.nameEn} 
                          onChange={(e) => setCompanyData({...companyData, nameEn: e.target.value})}
                          className="max-w-md h-10 text-sm border-gray-200 rounded-input focus:border-emerald-600"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800">{companyData.nameEn}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Arabic Name */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 w-1/3 py-4 text-gray-500">
                      Company Legal Name (Arabic) *
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.nameAr} 
                          onChange={(e) => setCompanyData({...companyData, nameAr: e.target.value})}
                          className="max-w-md h-10 text-sm text-right border-gray-200 rounded-input"
                          dir="rtl"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800 text-right block max-w-md" dir="rtl">{companyData.nameAr}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Address */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 py-4 text-gray-500">Company Address *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.address} 
                          onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                          className="max-w-md h-10 text-sm border-gray-200 rounded-input"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800">{companyData.address}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* City/Country */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 py-4 text-gray-500">City & Country *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <div className="flex gap-3 max-w-md">
                          <Input 
                            value={companyData.city} 
                            onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                            className="h-10 text-sm w-1/2 border-gray-200 rounded-input"
                            placeholder="City"
                          />
                          <Input 
                            value={companyData.country} 
                            onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
                            className="h-10 text-sm w-1/2 border-gray-200 rounded-input"
                            placeholder="Country"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-sm text-gray-800">{companyData.city}, {companyData.country}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Trade License Number */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 py-4 text-gray-500">
                      Trade License Number *
                    </TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.tradeLicense} 
                          onChange={(e) => setCompanyData({...companyData, tradeLicense: e.target.value})}
                          className="max-w-md h-10 text-sm border-gray-200 rounded-input"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800 font-mono">{companyData.tradeLicense}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* VAT Number */}
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableCell className="font-semibold text-sm pl-0 py-4 text-gray-500">VAT Registration Number *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.vatNumber} 
                          onChange={(e) => setCompanyData({...companyData, vatNumber: e.target.value})}
                          className="max-w-md h-10 text-sm border-gray-200 rounded-input"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800 font-mono">{companyData.vatNumber}</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Category */}
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell className="font-semibold text-sm pl-0 py-4 text-gray-500">Service Category *</TableCell>
                    <TableCell className="py-4">
                      {isEditing ? (
                        <Input 
                          value={companyData.category} 
                          onChange={(e) => setCompanyData({...companyData, category: e.target.value})}
                          className="max-w-md h-10 text-sm border-gray-200 rounded-input"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-gray-800">{companyData.category}</span>
                      )}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Support Information Details */}
        <Card className="border-none shadow-card bg-white">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
              <HelpCircle className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              Support Information Details
            </CardTitle>
            <CardDescription className="text-xs text-gray-400 font-medium font-medium">If you have any questions regarding your registration correction checklist, please reach out to our support team.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6 pt-1">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="p-2 rounded-full bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                <Mail className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400 font-medium">Email Support</div>
                <div className="text-sm font-semibold text-gray-700">vendor.support@fnrc.gov.ae</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="p-2 rounded-full bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)]">
                <Phone className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400 font-medium">Phone Support</div>
                <div className="text-sm font-semibold text-gray-700">+971 4 999 8888</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post-verification Redirect Row */}
        {status === 'approved' && (
          <div className="flex justify-center gap-4 pt-2">
            <Button
              className="text-white px-8 font-semibold shadow hover:shadow-md transition-all rounded-button bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90"
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