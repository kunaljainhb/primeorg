import { useNavigate, useParams } from '@/app/context/RouterContext';
import { 
  ArrowLeft, CheckCircle, XCircle, FileText, Star, Ban, Pause, 
  RotateCcw, Building2, MapPin, 
  Landmark, UserCircle, Download, History, Globe, Phone, Mail, Briefcase, Clock, AlertTriangle
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
  return `${day}/${month}/${year}`;
};

export default function AdminVendorDetail() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const vendor = mockVendors.find(v => v.id === vendorId);
  const { t, language } = useTranslation();
  
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [documentsList, setDocumentsList] = useState([
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
  ]);

  const toggleDocStatus = (docId: string, newStatus: string) => {
    setDocumentsList(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: newStatus };
      }
      return doc;
    }));
  };

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

      {/* Profile Overview Header Card */}
      <Card className="shadow-card border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-start">
              <div className="space-y-1">
                <h2 className="text-[22px] font-bold text-gray-800 leading-none">
                  {language === 'ar' ? vendorDetails.companyNameAr : vendor.companyName}
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <span className="text-[14px] text-black font-bold">{t('Vendor ID:')} {vendor.id}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <StatusBadge status={vendor.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Company Details */}
        <Card className="shadow-card border-none bg-white">
          <CardHeader className="px-6 pt-1 pb-0">
            <CardTitle className="text-lg font-bold text-black text-start">
              {t("Company Details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 pt-0">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Company Name (English)")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendor.companyName}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Company Name (Arabic)")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.companyNameAr}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Trade License Number")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendor.tradeLicense}</div>
                {vendor.status === 'pending' && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="text-[12px] text-amber-600 font-medium">{t("Changed from :")} TL-882299</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("License Expiry Date")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{new Date(vendorDetails.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-card border-none bg-white">
          <CardHeader className="px-6 pt-1 pb-0">
            <CardTitle className="text-lg font-bold text-black text-start">
              {t("Contact Info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 pt-0">
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Office Address")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendor.address}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("Country")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorDetails.country)}</div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("State / Emirate")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorDetails.stateEmirate)}</div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("City")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorDetails.city)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("Phone Number")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    +971 4 123 4567
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("Fax Number")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    {vendorDetails.fax}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] text-black font-bold">{t("Email ID")}</Label>
                  <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    {vendor.email}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Website")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  {vendorDetails.website}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card className="shadow-card border-none bg-white">
          <CardHeader className="px-6 pt-1 pb-0">
            <CardTitle className="text-lg font-bold text-black text-start">
              {t("Primary Contact")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 pt-0">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Name")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.primaryContact.name}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Job Title")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                  <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                  {t(vendorDetails.primaryContact.jobTitle)}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Mobile Number")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  {vendorDetails.primaryContact.mobile}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Email")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  {vendorDetails.primaryContact.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card className="shadow-card border-none bg-white">
          <CardHeader className="px-6 pt-1 pb-0">
            <CardTitle className="text-lg font-bold text-black text-start">
              {t("Financial Info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 pt-0">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Bank Name")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.financialInfo.bankName}</div>
                {vendor.status === 'pending' && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="text-[12px] text-amber-600 font-medium">{t("Changed from :")} First Abu Dhabi Bank</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Account Holder Name")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.financialInfo.accountHolderName}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("IBAN")}</Label>
                <div className="font-mono text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 break-all text-start">{vendorDetails.financialInfo.bankAccountNumber}</div>
                {vendor.status === 'pending' && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="text-[12px] text-amber-600 font-medium">{t("Changed from :")} AE12 0000 0000 0000 0000 000</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("Swift Code")}</Label>
                <div className="font-mono text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.financialInfo.swiftCode}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] text-black font-bold">{t("VAT Registration Number")}</Label>
                <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorDetails.financialInfo.vatNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories Section */}
      <Card className="shadow-card border-none bg-white">
        <CardHeader className="pb-0 px-6 pt-1">
          <CardTitle className="text-lg font-bold text-black text-start">{t("Service Categories")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2 px-6 pb-4">
          <div className="flex flex-wrap gap-2 pt-1">
            {vendor.category.map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="bg-[var(--fnrc-primary-green)]/5 border border-[var(--fnrc-primary-green)]/15 text-[var(--fnrc-primary-green)] font-semibold text-xs px-3 py-1 rounded-full shadow-2xs">
                {t(cat)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Documents Card */}
      <Card className="shadow-card border-none bg-white">
        <CardHeader className="px-6 pt-1 pb-0">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-black text-start">{t("Vendor Documents")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-[13px] text-gray-400 text-start uppercase">{t("Document Name")}</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 text-start uppercase">{t("Upload Date")}</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 text-start uppercase">{t("Issue Date")}</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 text-start uppercase">{t("Expiry Date")}</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 text-start uppercase">{t("Verification Status")}</TableHead>
                <TableHead className="text-end font-bold text-[13px] text-gray-400 pe-6 uppercase">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsList.map((doc) => {
                const daysRemaining = getExpiryDays(doc.expiryDate);
                const normStatus = (doc.status || '').toLowerCase().trim();
                
                return (
                  <TableRow key={doc.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="text-start py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800 text-[14px]">{t(doc.name)}</div>
                          <div className="text-[11px] text-gray-400 font-medium">{doc.fileSize}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[14px] text-gray-500 font-medium text-start">
                      {new Date(doc.uploadDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB')}
                    </TableCell>
                    <TableCell className="text-[14px] text-gray-500 font-medium text-start">
                      {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB') : '-'}
                    </TableCell>
                    <TableCell className="text-[14px] text-gray-500 font-medium text-start">
                      {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB') : '-'}
                    </TableCell>
                    <TableCell className="text-start">
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "h-8 text-[10px] font-bold border-green-200 text-green-700 hover:bg-green-50",
                            normStatus === 'verified' && "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white",
                            (vendor.status === 'correction_requested' || vendor.status === 'correction' || vendor.status === 'rejected') ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                          )}
                          onClick={() => toggleDocStatus(doc.id, 'verified')}
                          disabled={vendor.status === 'correction_requested' || vendor.status === 'correction' || vendor.status === 'rejected'}
                        >
                          {t("Verify")}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "h-8 text-[10px] font-bold border-red-200 text-red-700 hover:bg-red-55",
                            (normStatus === 'rejected' || normStatus === 'not_verified' || normStatus === 'not verified') && "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 hover:text-white",
                            (vendor.status === 'correction_requested' || vendor.status === 'correction' || vendor.status === 'rejected') ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                          )}
                          onClick={() => toggleDocStatus(doc.id, 'not_verified')}
                          disabled={vendor.status === 'correction_requested' || vendor.status === 'correction' || vendor.status === 'rejected'}
                        >
                          {t("Not Verify")}
                        </Button>
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

      {/* Administrative Review Panel Card */}
      <Card className="shadow-card border-none bg-white">
        <CardHeader className="px-6 pt-5 pb-3">
          <CardTitle className="text-lg font-bold text-black text-start">{t("Administrative Review Panel")}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          {vendor.status === 'correction_requested' || vendor.status === 'correction' ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium text-start flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900">{t("Awaiting Vendor Correction")}</h4>
                <p className="text-xs text-amber-800 mt-1">
                  {t("This vendor has been notified to make corrections. No further administrative action can be taken until the vendor resubmits their details.")}
                </p>
                {vendor.rejectionReason && (
                  <p className="text-xs text-amber-900 font-bold mt-2">
                    {t("Requested Correction Reason:")} <span className="font-normal">{t(vendor.rejectionReason)}</span>
                  </p>
                )}
              </div>
            </div>
          ) : vendor.status === 'rejected' ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium text-start flex items-start gap-3">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-900">{t("Vendor Registration Rejected")}</h4>
                <p className="text-xs text-rose-800 mt-1">
                  {t("This vendor application has been rejected. No further administrative action can be taken.")}
                </p>
                {vendor.rejectionReason && (
                  <p className="text-xs text-rose-950 font-bold mt-2">
                    {t("Rejection Reason:")} <span className="font-normal">{t(vendor.rejectionReason)}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 text-start">
                <Label htmlFor="remarks" className="font-bold text-[14px] text-black flex items-center justify-between">
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
                {/* Actions based on status */}
                {(vendor.status === 'pending' || vendor.status === 'draft') && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-55 h-10 font-bold transition-all cursor-pointer"
                      onClick={() => handleAction('correction')}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("Correction Required")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-55 h-10 font-bold transition-all cursor-pointer"
                      onClick={() => handleAction('reject')}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("Reject")}
                    </Button>
                    <Button
                      className="gap-2 text-white h-10 px-6 font-bold shadow-md shadow-green-600/10 transition-all hover:shadow-lg hover:bg-[var(--fnrc-primary-green)]/90 cursor-pointer"
                      style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                      onClick={() => handleAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t("Approve Vendor")}
                    </Button>
                  </>
                )}

                {vendor.status === 'approved' && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-55 h-10 font-bold transition-all cursor-pointer"
                      onClick={() => handleAction('suspend')}
                    >
                      <Pause className="h-4 w-4" />
                      {t("Suspend")}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-55 h-10 font-bold transition-all cursor-pointer"
                      onClick={() => handleAction('blacklist')}
                    >
                      <Ban className="h-4 w-4" />
                      {t("Blacklist")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Activity Log Card */}
      <Card id="vendor-audit-trail-section" className="shadow-card border-none bg-white">
        <CardHeader className="px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg font-bold text-black text-start">{t("Detailed Activity Log")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8FAFC] border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start w-[220px] uppercase">{t("Action")}</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start w-[180px] uppercase">{t("Role")}</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start w-[180px] uppercase">{t("Date & Time")}</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start uppercase">{t("Remarks")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const logs = [];
                  if (vendor.status === 'pending') {
                    logs.push({
                      action: 'Vendor resubmitted again',
                      performedBy: 'Vendor',
                      dateTime: formatDate(vendor.registrationDate) + ' - 09:45 AM',
                      remarks: 'Vendor resubmitted the application with updated Trade License and Bank details.'
                    });
                    logs.push({
                      action: 'FNRC Procurement Admin request for correction',
                      performedBy: 'FNRC Procurement Admin',
                      dateTime: formatDate(vendor.registrationDate) + ' - 04:30 PM',
                      remarks: 'Trade license file is unreadable. Swift Code is missing in bank details. Please correct.'
                    });
                  } else if (vendor.id === 'VEN-001') {
                    return [
                      { action: 'Profile Approved', performedBy: 'Super Admin', dateTime: '15/02/2026 - 11:20 AM', remarks: 'All document corrections are verified and compliant. Vendor profile fully approved.' },
                      { action: 'Resubmitted for Review', performedBy: 'Vendor', dateTime: '14/02/2026 - 09:45 AM', remarks: 'Uploaded readable Trade License copy and updated Swift Code.' },
                      { action: 'Correction Requested', performedBy: 'Super Admin', dateTime: '12/02/2026 - 04:30 PM', remarks: 'Trade license file is unreadable. Swift Code is missing in bank details. Please correct.' },
                      { action: 'First submitted', performedBy: 'Vendor', dateTime: '10/02/2026 - 02:15 PM', remarks: 'Registration form submitted with basic company profiles and compliance documents.' }
                    ];
                  } else if (vendor.status === 'correction_requested' || vendor.status === 'correction') {
                    logs.push({
                      action: 'Correction Required',
                      performedBy: 'Super Admin',
                      dateTime: formatDate(vendor.registrationDate) + ' - 04:30 PM',
                      remarks: vendor.rejectionReason || 'Trade license file is blurry. Swift Code is missing in bank details. Please correct.'
                    });
                  } else if (vendor.status === 'rejected') {
                    logs.push({
                      action: 'Profile Rejected',
                      performedBy: 'Super Admin',
                      dateTime: formatDate(vendor.registrationDate) + ' - 03:00 PM',
                      remarks: vendor.rejectionReason || 'Vendor application does not meet commercial/technical criteria.'
                    });
                  } else if (vendor.status === 'approved') {
                    logs.push({
                      action: 'Profile Approved',
                      performedBy: 'Super Admin',
                      dateTime: formatDate(vendor.registrationDate) + ' - 02:00 PM',
                      remarks: 'All documents verified. Vendor profile approved.'
                    });
                  }
                  
                  logs.push({
                    action: 'First submitted',
                    performedBy: 'Vendor',
                    dateTime: formatDate(vendor.registrationDate) + ' - 10:00 AM',
                    remarks: 'Initial vendor registration onboarding submitted.'
                  });
                  
                  return logs;
                })().map((log, idx) => (
                  <TableRow key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                    <TableCell className="text-start font-medium text-gray-900 text-sm py-4 px-6">
                      {t(log.action)}
                    </TableCell>
                    <TableCell className="text-start font-normal text-gray-600 text-sm py-4 px-6">
                      {t(log.performedBy)}
                    </TableCell>
                    <TableCell className="text-start text-gray-500 font-normal text-sm py-4 px-6">
                      {log.dateTime}
                    </TableCell>
                    <TableCell className="text-start text-gray-600 text-sm py-4 px-6 leading-relaxed">
                      {t(log.remarks)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}