import { useNavigate, useParams } from '@/app/context/RouterContext';
import { 
  ArrowLeft, CheckCircle, XCircle, FileText, Star, Ban, Pause, 
  RotateCcw, Building2, MapPin, 
  Landmark, UserCircle, Download, History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { useState } from 'react';
import { mockVendors } from '@/app/data/mockData';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { useTranslation } from '@/app/context/LanguageContext';
import { cn } from '@/app/components/ui/utils';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function AdminVendorDetail() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const vendor = mockVendors.find(v => v.id === vendorId);
  const { t, language } = useTranslation();
  
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  if (!vendor) {
    return <div className="p-8 text-center font-bold font-sans">{t("Vendor not found")}</div>;
  }

  // Comprehensive Vendor Details
  const vendorDetails = {
    companyNameAr: 'تيك سوليوشنز ذ.م.م',
    expiryDate: '2026-12-31',
    country: 'United Arab Emirates',
    stateEmirate: 'Dubai',
    city: 'Dubai',
    fax: '+971 4 123 4568',
    website: 'www.techsolutions.ae',
    primaryContact: {
      name: 'John Doe',
      jobTitle: 'Account Manager',
      mobile: '+971 50 987 6543',
      email: 'john.doe@techsolutions.ae'
    },
    financialInfo: {
      accountNumber: '100234567890',
      bankAccountNumber: 'AE12 3456 7890 1234 5678 901',
      bankName: 'Emirates NBD',
      accountHolderName: 'TechSolutions LLC',
      swiftCode: 'EBILAEADXXX',
      vatNumber: vendor.taxNumber || '100012345600003'
    }
  };

  // Sample documents
  const sampleDocuments = [
    {
      id: 'DOC-001',
      name: 'Trade License',
      fileSize: '2.4 MB',
      uploadDate: '2023-12-15',
      issueDate: '2023-12-15',
      expiryDate: '2026-05-20',
      status: 'verified'
    },
    {
      id: 'DOC-002',
      name: 'Tax Registration Certificate',
      fileSize: '1.8 MB',
      uploadDate: '2023-12-15',
      issueDate: '2023-12-15',
      expiryDate: '2026-12-31',
      status: 'verified'
    },
    {
      id: 'DOC-003',
      name: 'ISO 27001 Certification',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-20',
      issueDate: '2023-12-15',
      expiryDate: '2026-06-05',
      status: 'verified'
    },
    {
      id: 'DOC-004',
      name: 'Company Profile Document',
      fileSize: '3.2 MB',
      uploadDate: '2023-12-20',
      issueDate: '2023-12-15',
      expiryDate: null,
      status: 'verified'
    },
    {
      id: 'DOC-005',
      name: 'Insurance Certificate',
      fileSize: '1.9 MB',
      uploadDate: '2024-02-01',
      issueDate: '2023-12-15',
      expiryDate: '2026-05-10',
      status: 'pending'
    },
    {
      id: 'DOC-006',
      name: 'Other Document',
      fileSize: '1.5 MB',
      uploadDate: '2024-01-10',
      issueDate: '2023-12-15',
      expiryDate: null,
      status: 'pending'
    }
  ];

  const handleAction = (action: string) => {
    if (!remarks.trim()) {
      setError(t('Administrative remarks are mandatory before processing any status change.'));
      return;
    }
    setError('');
    navigate('/admin/vendors');
  };

  const getExpiryDays = (expiryDate?: string | null) => {
    if (!expiryDate) return null;
    const today = new Date('2026-02-20');
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/vendors')} className="gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className={cn("h-4 w-4", language === 'ar' && "scale-x-[-1]")} />
          {t("Back to Vendors")}
        </Button>
      </div>

      {/* Header card summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-8 rounded-card shadow-card border border-gray-100/50">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {vendor.companyName}
            </h1>
            <StatusBadge status={vendor.status} />
          </div>
          <p className="text-sm font-semibold tracking-wider text-[var(--fnrc-primary-green)] uppercase">
            {vendor.id} • {t("Registered on")} {formatDate(vendor.registrationDate)}
          </p>
        </div>

        <Button 
          variant="outline" 
          className="gap-2 border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-all duration-150 h-10 font-semibold shadow-xs" 
          onClick={() => setShowAuditHistory(true)}
        >
          <History className={cn("h-4 w-4", language === 'ar' && "scale-x-[-1]")} />
          {t("Audit History")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Details */}
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">
              {t("Company Details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Company Legal Name (English)")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendor.companyName}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold block">{t("Company Legal Name (Arabic)")}</Label>
              <div className="text-sm font-normal text-gray-800 text-end" dir="rtl">{vendorDetails.companyNameAr}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Trade License Number")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendor.tradeLicense}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Expiry Date")}</Label>
              <div className="text-sm font-normal text-gray-800">{formatDate(vendorDetails.expiryDate)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">
              {t("Contact Details & Location")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
              <div className="space-y-0 md:col-span-2">
              <Label className="text-[13px] text-black font-bold">{t("Address")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendor.address}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-2">
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Country")}</Label>
                <div className="text-sm font-normal text-gray-800">{t(vendorDetails.country)}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("State/Emirate")}</Label>
                <div className="text-sm font-normal text-gray-800">{t(vendorDetails.stateEmirate)}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("City")}</Label>
                <div className="text-sm font-normal text-gray-800">{t(vendorDetails.city)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-2">
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Phone Number")}</Label>
                <div className="text-sm font-normal text-gray-800">+971 4 123 4567</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Fax Number")}</Label>
                <div className="text-sm font-normal text-gray-800">{vendorDetails.fax}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Business Email")}</Label>
                <div className="text-sm font-normal text-gray-800">{vendor.email}</div>
              </div>
            </div>

            <div className="space-y-0 md:col-span-2">
              <Label className="text-[13px] text-black font-bold">{t("Website")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendorDetails.website}</div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">
              {t("Primary Contact")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Full Name")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendorDetails.primaryContact.name}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Job Title")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendorDetails.primaryContact.jobTitle}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Mobile Number")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendorDetails.primaryContact.mobile}</div>
            </div>
            <div className="space-y-0">
              <Label className="text-[13px] text-black font-bold">{t("Email")}</Label>
              <div className="text-sm font-normal text-gray-800">{vendorDetails.primaryContact.email}</div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">
              {t("Financial Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Bank Name")}</Label>
                <div className="text-sm font-normal text-gray-800">{vendorDetails.financialInfo.bankName}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Account Holder Name")}</Label>
                <div className="text-sm font-normal text-gray-800">{vendorDetails.financialInfo.accountHolderName}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("Account Number")}</Label>
                <div className="text-sm font-mono font-normal bg-gray-50 p-3 rounded-xl border border-gray-100">{vendorDetails.financialInfo.accountNumber}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("IBAN")}</Label>
                <div className="text-sm font-mono font-normal bg-gray-50 p-3 rounded-xl border border-gray-100">{vendorDetails.financialInfo.bankAccountNumber}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("SWIFT code")}</Label>
                <div className="text-sm font-normal font-mono bg-gray-50 p-3 rounded-xl border border-gray-100">{vendorDetails.financialInfo.swiftCode}</div>
              </div>
              <div className="space-y-0">
                <Label className="text-[13px] text-black font-bold">{t("VAT Registration Number (TRN)")}</Label>
                <div className="text-sm font-normal bg-gray-50 p-3 rounded-xl border border-gray-100">{vendorDetails.financialInfo.vatNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden gap-0">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-gray-900">{t("Service Categories")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-5">
          <div className="flex flex-wrap gap-2">
            {vendor.category.map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)] border-[var(--fnrc-primary-green)]/20 font-semibold px-3 py-1 text-sm">
                {cat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Documents Section */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden gap-0">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-gray-900">{t("Vendor Documents")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold text-gray-900 text-sm py-4 ps-6">{t("Document Name")}</TableHead>
                <TableHead className="font-bold text-gray-900 text-sm">{t("Upload Date")}</TableHead>
                <TableHead className="font-bold text-gray-900 text-sm">{t("Issue Date")}</TableHead>
                <TableHead className="font-bold text-gray-900 text-sm">{t("Expiry Date")}</TableHead>
                <TableHead className="font-bold text-gray-900 text-sm">{t("Verification Status")}</TableHead>
                <TableHead className="text-right font-bold text-gray-900 text-sm pe-6">{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleDocuments.map((doc) => {
                const daysRemaining = getExpiryDays(doc.expiryDate);
                
                return (
                  <TableRow key={doc.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="py-4 ps-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-normal text-gray-800">{doc.name}</div>
                          <div className="text-[10px] font-bold text-gray-400">{doc.fileSize}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-500">
                      {formatDate(doc.uploadDate)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-500">
                      {doc.issueDate ? formatDate(doc.issueDate) : '-'}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-500">
                      {doc.expiryDate ? formatDate(doc.expiryDate) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} />
                        
                        {/* Expiry Info Icon beside status */}
                        {daysRemaining !== null && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${daysRemaining < 30 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {daysRemaining < 0 ? t('Expired') : `${daysRemaining} ${t("days left")}`}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs font-bold">
                                  {daysRemaining < 0 ? `${t("Expired")} ${Math.abs(daysRemaining)} ${t("days ago")}` : `${t("Document expires in")} ${daysRemaining} ${t("days")}`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pe-6">
                      <div className="flex items-center justify-end gap-2">
                        {(vendor.status === 'pending' || vendor.status === 'draft') && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-green-200 text-green-700 hover:bg-green-50">
                              {t("Verify")}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-red-200 text-red-700 hover:bg-red-50">
                              {t("Not Verified")}
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--fnrc-primary-green)]">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Administrative Action Card */}
      {vendor.status !== 'rejected' && vendor.status !== 'blacklisted' && (
        <Card className="border border-gray-200/60 shadow-sm gap-0 font-sans">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-base font-bold text-gray-900">{t("Administrative Review Panel")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="remarks" className="font-bold text-sm text-gray-700 flex items-center justify-between">
                  <span>{t("Administrative Remarks / Review Feedback")}</span>
                  <span className="text-[10px] text-red-500 font-bold uppercase">{t("Required for state change")}</span>
                </Label>
                <Textarea
                  id="remarks"
                  placeholder={t("Enter detailed feedback remarks for the vendor regarding this decision campaign...")}
                  className={`min-h-[100px] resize-none rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 ${error ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                />
                {error && <p className="text-xs font-bold text-red-500">{t(error)}</p>}
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
                {/* Actions for Pending Status */}
                {vendor.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 h-10 font-bold transition-all"
                      onClick={() => handleAction('correction')}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("Correction Requested")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-red-200 text-red-700 hover:bg-red-55 h-10 font-bold transition-all"
                      onClick={() => handleAction('reject')}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("Reject Application")}
                    </Button>
                    <Button
                      className="gap-2 text-white h-10 px-6 font-bold shadow-md shadow-green-600/10 transition-all hover:shadow-lg"
                      style={{ backgroundColor: 'var(--fnrc-success)' }}
                      onClick={() => handleAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t("Approve Vendor")}
                    </Button>
                  </>
                )}

                {/* Actions for Approved Status */}
                {vendor.status === 'approved' && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-55 h-10 font-bold transition-all"
                      onClick={() => handleAction('suspend')}
                    >
                      <Pause className="h-4 w-4" />
                      {t("Suspend Account")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-red-200 text-red-700 hover:bg-red-55 h-10 font-bold transition-all"
                      onClick={() => handleAction('blacklist')}
                    >
                      <Ban className="h-4 w-4" />
                      {t("Blacklist Vendor")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit History Dialog */}
      <Dialog open={showAuditHistory} onOpenChange={setShowAuditHistory}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto font-sans">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <History className={cn("h-5 w-5 text-[var(--fnrc-primary-green)]", language === 'ar' && "scale-x-[-1]")} />
              {t("Vendor Audit Trail")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 ps-4">{t("Date & Time")}</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs">{t("Operator")}</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs">{t("Role")}</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs pe-4">{t("Action Detail")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: '10/05/2026 14:30', name: 'Ahmed Al Mansoori', role: 'Super Admin', change: 'Vendor application status changed from Pending to Approved. Trade License verified.' },
                  { date: '08/05/2026 09:15', name: 'Fatima Al Hammadi', role: 'Procurement Admin', change: 'Requested correction for Tax Registration Certificate.' },
                  { date: '01/05/2026 11:20', name: 'System', role: 'System', change: 'Initial vendor registration submitted.' }
                ].map((audit, i) => (
                  <TableRow key={i} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="text-xs font-semibold text-gray-500 whitespace-nowrap ps-4 py-3">{audit.date}</TableCell>
                    <TableCell className="text-sm font-normal text-gray-800">{audit.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] bg-gray-50 text-gray-600 font-bold border border-gray-100 rounded-md">
                        {t(audit.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-600 leading-relaxed pe-4 py-3">{t(audit.change)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}