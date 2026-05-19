import { useNavigate, useParams } from '@/app/context/RouterContext';
import { 
  ArrowLeft, CheckCircle, XCircle, FileText, Award, Star, Ban, Pause, 
  RotateCcw, AlertTriangle, Building2, Globe, Phone, Mail, MapPin, 
  Landmark, UserCircle, Briefcase, Info, Check, X, Calendar, Clock,
  Shield, Download, History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
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

export default function AdminVendorDetail() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const vendor = mockVendors.find(v => v.id === vendorId);
  
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  if (!vendor) {
    return <div className="p-8 text-center font-bold">Vendor not found</div>;
  }

  // Comprehensive Vendor Details
  const vendorDetails = {
    companyNameAr: 'تيك سوليوشنز ذ.م.م',
    expiryDate: '2026-12-31',
    country: 'United Arab Emirates',
    city: 'Dubai',
    website: 'www.techsolutions.ae',
    primaryContact: {
      name: 'John Doe',
      jobTitle: 'Account Manager',
      mobile: '+971 50 987 6543',
      email: 'john.doe@techsolutions.ae'
    },
    financialInfo: {
      bankAccountNumber: 'AE12 3456 7890 1234 5678 901',
      bankName: 'Emirates NBD',
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
      setError('Administrative remarks are mandatory before processing any status change.');
      return;
    }
    setError('');
    navigate('/admin/vendors');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      suspended: { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' },
      correction_requested: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      blacklisted: { bg: '#1F2937', text: 'white' }
    };
    return colors[status] || colors.pending;
  };

  const getExpiryDays = (expiryDate?: string | null) => {
    if (!expiryDate) return null;
    const today = new Date('2026-02-20');
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const statusColor = getStatusColor(vendor.status);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendors')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Vendor File: {vendor.id}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                {formatStatus(vendor.status)}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground italic">Registered on {formatDate(vendor.registrationDate)}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2 border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors h-10 font-bold" onClick={() => setShowAuditHistory(true)}>
          <History className="h-4 w-4" />
          Audit History
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Details */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Company Legal Name in English</Label>
              <div className="text-sm font-semibold">{vendor.companyName}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Company Legal Name in Arabic</Label>
              <div className="text-sm font-semibold text-right" dir="rtl">{vendorDetails.companyNameAr}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Trade Licensee Number</Label>
              <div className="text-sm font-semibold">{vendor.tradeLicense}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry Date</Label>
              <div className="text-sm font-semibold">{formatDate(vendorDetails.expiryDate)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Address</Label>
              <div className="text-sm font-semibold">{vendor.address}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Country</Label>
              <div className="text-sm font-semibold">{vendorDetails.country}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">City</Label>
              <div className="text-sm font-semibold">{vendorDetails.city}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</Label>
              <div className="text-sm font-semibold">+971 4 123 4567</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Email ID</Label>
              <div className="text-sm font-semibold">{vendor.email}</div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Website</Label>
              <div className="text-sm font-semibold">{vendorDetails.website}</div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-green-600" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Name</Label>
              <div className="text-sm font-semibold">{vendorDetails.primaryContact.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Job Title</Label>
              <div className="text-sm font-semibold">{vendorDetails.primaryContact.jobTitle}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Number</Label>
              <div className="text-sm font-semibold">{vendorDetails.primaryContact.mobile}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Email</Label>
              <div className="text-sm font-semibold">{vendorDetails.primaryContact.email}</div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Landmark className="h-4 w-4 text-green-600" />
              Financial Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Bank Details (Account Number)</Label>
              <div className="text-sm font-mono font-bold bg-gray-50 p-2 rounded border border-gray-100">{vendorDetails.financialInfo.bankAccountNumber}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Bank Name</Label>
                <div className="text-sm font-semibold">{vendorDetails.financialInfo.bankName}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">VAT Registration Number</Label>
                <div className="text-sm font-semibold">{vendorDetails.financialInfo.vatNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Documents Section */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-800" />
            <CardTitle className="text-lg font-bold">Compliance Documents</CardTitle>
          </div>
          <CardDescription className="text-sm">Mandatory regulatory and legal documents</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-gray-100">
                <TableHead className="font-bold text-xs text-gray-600 py-4 pl-6">Document Name</TableHead>
                <TableHead className="font-bold text-xs text-gray-600">Upload Date</TableHead>
                <TableHead className="font-bold text-xs text-gray-600">Issue Date</TableHead>
                <TableHead className="font-bold text-xs text-gray-600">Expiry Date</TableHead>
                <TableHead className="font-bold text-xs text-gray-600">Verification Status</TableHead>
                <TableHead className="text-right font-bold text-xs text-gray-600 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleDocuments.map((doc) => {
                const daysRemaining = getExpiryDays(doc.expiryDate);
                
                return (
                  <TableRow key={doc.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-gray-800">{doc.name}</div>
                          <div className="text-[10px] font-bold text-gray-400">{doc.fileSize}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(doc.uploadDate)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {doc.issueDate ? formatDate(doc.issueDate) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {doc.expiryDate ? formatDate(doc.expiryDate) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {doc.status === 'verified' ? (
                          <Badge variant="secondary" className="bg-green-50 text-green-600 border-none rounded-full px-3 py-1 text-[10px] font-bold gap-1.5">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none rounded-full px-3 py-1 text-[10px] font-bold gap-1.5">
                             <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                        
                        {/* Expiry Info Icon beside status */}
                        {daysRemaining !== null && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <Info className={`h-4 w-4 ${daysRemaining < 30 ? 'text-red-500' : 'text-blue-500'}`} />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs font-bold">
                                  {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)} days ago` : `Document expires in ${daysRemaining} days`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {(vendor.status === 'pending' || vendor.status === 'draft') && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-green-200 text-green-700 hover:bg-green-50">
                              Verify
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-red-200 text-red-700 hover:bg-red-50">
                              Not Verified
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600">
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

      {/* Inline Administrative Action Card */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-bold">Administrative Review Panel</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remarks" className="font-bold text-sm flex items-center justify-between">
                Administrative Remarks
                <span className="text-[9px] text-red-500 font-black uppercase">Required for any action</span>
              </Label>
              <Textarea
                id="remarks"
                placeholder="Enter detailed remarks for the vendor regarding this decision..."
                className={`min-h-[100px] resize-none ${error ? 'border-red-500 ring-red-100 focus-visible:ring-red-200' : ''}`}
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
              />
              {error && <p className="text-xs font-bold text-red-500">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {/* Actions for Pending Status */}
              {vendor.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 h-10 font-bold"
                    onClick={() => handleAction('correction')}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Correction Requested
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-red-200 text-red-700 hover:bg-red-50 h-10 font-bold"
                    onClick={() => handleAction('reject')}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Application
                  </Button>
                  <Button
                    className="gap-2 text-white h-10 px-6 font-bold shadow-md shadow-green-600/10"
                    style={{ backgroundColor: 'var(--fnrc-success)' }}
                    onClick={() => handleAction('approve')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Vendor
                  </Button>
                </>
              )}

              {/* Actions for Approved Status */}
              {vendor.status === 'approved' && (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 h-10 font-bold"
                    onClick={() => handleAction('suspend')}
                  >
                    <Pause className="h-4 w-4" />
                    Suspend Account
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-red-200 text-red-700 hover:bg-red-50 h-10 font-bold"
                    onClick={() => handleAction('blacklist')}
                  >
                    <Ban className="h-4 w-4" />
                    Blacklist Vendor
                  </Button>
                </>
              )}

              {/* Finalized Status Info */}
              {(vendor.status === 'rejected' || vendor.status === 'blacklisted') && (
                <div className="w-full text-center py-4 text-sm font-bold opacity-30 uppercase tracking-[0.2em] bg-gray-50 rounded-lg">
                  Application Finalized • View Only Mode
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit History Dialog */}
      <Dialog open={showAuditHistory} onOpenChange={setShowAuditHistory}>
        <DialogContent className="sm:max-w-[950px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              <History className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              Vendor Audit History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-bold text-xs text-gray-600">Date & Time</TableHead>
                  <TableHead className="font-bold text-xs text-gray-600">Name</TableHead>
                  <TableHead className="font-bold text-xs text-gray-600">Role</TableHead>
                  <TableHead className="font-bold text-xs text-gray-600">What Changed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: '10/05/2026 14:30', name: 'Ahmed Al Mansoori', role: 'Super Admin', change: 'Vendor application status changed from Pending to Approved. Trade License verified.' },
                  { date: '08/05/2026 09:15', name: 'Fatima Al Hammadi', role: 'Procurement Admin', change: 'Requested correction for Tax Registration Certificate.' },
                  { date: '01/05/2026 11:20', name: 'System', role: 'System', change: 'Initial vendor registration submitted.' }
                ].map((audit, i) => (
                  <TableRow key={i} className="hover:bg-gray-50/30">
                    <TableCell className="text-xs font-semibold text-gray-500 whitespace-nowrap">{audit.date}</TableCell>
                    <TableCell className="text-sm font-bold text-gray-800">{audit.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 font-bold border-none">
                        {audit.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-normal break-words max-w-[400px] leading-relaxed">{audit.change}</TableCell>
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