import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle, Download, FileText, Shield, AlertTriangle, Building2 } from 'lucide-react';
import { ComplianceNotificationIcon } from '@/app/components/vendor/ComplianceNotificationIcon';
import { mockVendorDocuments } from '@/app/data/mockData';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Globe, Phone, Mail, MapPin, Landmark, UserCircle, Briefcase, Lock, KeyRound } from 'lucide-react';

export default function VendorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('Approved');
  
  // Detailed vendor data (mock)
  const [vendorData, setVendorData] = useState({
    companyNameEn: 'TechSolutions LLC',
    companyNameAr: 'تيك سوليوشنز ذ.م.م',
    tradeLicense: 'TL-123456',
    licenseExpiry: '2026-12-31',
    address: 'Dubai Silicon Oasis, Dubai, UAE',
    country: 'United Arab Emirates',
    city: 'Dubai',
    phone: '+971 4 123 4567',
    email: 'contact@techsolutions.ae',
    website: 'www.techsolutions.ae',
    categories: ['Information Technology', 'Consulting'],
    primaryContact: {
      name: 'John Doe',
      jobTitle: 'Account Manager',
      mobile: '+971 50 987 6543',
      email: 'john.doe@techsolutions.ae'
    },
    financialInfo: {
      bankAccount: 'AE12 3456 7890 1234 5678 901',
      bankName: 'Emirates NBD',
      vatNumber: '100012345600003'
    }
  });

  const availableCategories = [
    'Information Technology',
    'Consulting',
    'Construction',
    'Facilities Management',
    'Logistics',
    'Marketing',
    'HR Services'
  ];

  const handleCategoryToggle = (category: string) => {
    setVendorData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Get documents for VEN-001
  const [documents, setDocuments] = useState(mockVendorDocuments.filter(doc => doc.vendorId === 'VEN-001').map(doc => ({
    ...doc,
    issueDate: '2023-12-15' // Adding a mock issue date
  })));

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would call an API here
  };

  const getStatusBadge = (status: string) => {
    if (status === 'verified') {
      return (
        <Badge variant="secondary" style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" style={{ backgroundColor: '#FEF3C7', color: 'var(--fnrc-warning)' }}>
        Pending
      </Badge>
    );
  };

  const getExpiryAlert = (expiryDate?: string) => {
    if (!expiryDate) return null;

    const today = new Date('2026-02-20');
    const expiry = new Date(expiryDate);
    const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Only show alert if document is expired or expiring within 30 days
    if (daysRemaining <= 30) {
      let alertColor, tooltipMessage;

      if (daysRemaining < 0) {
        alertColor = 'var(--fnrc-error)';
        tooltipMessage = `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago`;
      } else if (daysRemaining <= 15) {
        alertColor = '#EA580C';
        tooltipMessage = `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
      } else {
        alertColor = 'var(--fnrc-warning)';
        tooltipMessage = `Expires in ${daysRemaining} days`;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle 
                className="h-4 w-4 cursor-help" 
                style={{ color: alertColor }} 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            Profile Settings
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Manage your company information and account security
          </p>
        </div>
        <div className="flex items-center gap-4 p-3 rounded-lg border bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">Admin Action:</div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant={registrationStatus === 'Approved' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Approved')}
              style={registrationStatus === 'Approved' ? { backgroundColor: 'var(--fnrc-success)', color: 'white' } : {}}
              className="h-8"
            >
              Approved
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Rejected' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Rejected')}
              style={registrationStatus === 'Rejected' ? { backgroundColor: '#EF4444', color: 'white' } : {}}
              className="h-8"
            >
              Rejected
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Correction Required' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Correction Required')}
              style={registrationStatus === 'Correction Required' ? { backgroundColor: '#F59E0B', color: 'white' } : {}}
              className="h-8"
            >
              Correction Required
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </TabsTrigger>
        </TabsList>

        {/* --- COMPANY PROFILE TAB --- */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-3">
              <ComplianceNotificationIcon vendorId="VEN-001" />
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button style={{ backgroundColor: 'var(--fnrc-primary-green)' }} className="text-white" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Profile Header Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">{vendorData.companyNameEn}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {registrationStatus === 'Approved' && (
                      <Badge variant="secondary" style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Approved Vendor
                      </Badge>
                    )}
                    {registrationStatus === 'Rejected' && (
                      <Badge variant="secondary" style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}>
                        <AlertTriangle className="mr-1 h-3 w-3" /> Application Rejected
                      </Badge>
                    )}
                    {registrationStatus === 'Correction Required' && (
                      <Badge variant="secondary" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                        <AlertTriangle className="mr-1 h-3 w-3" /> Correction Required
                      </Badge>
                    )}
                    <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>ID: VEN-001</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Categories - Moved to left side */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Service Categories</CardTitle>
                  <CardDescription>Categories your company is registered for</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {availableCategories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={category}
                            checked={vendorData.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                          />
                          <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {vendorData.categories.map(category => (
                        <Badge key={category} variant="secondary" style={{ backgroundColor: 'var(--fnrc-bg-light)', color: 'var(--fnrc-primary-green)', borderColor: 'var(--fnrc-primary-green)' }}>
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                    Company Details
                  </CardTitle>
                  <CardDescription>Official registration information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Legal Name (English)</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameEn} onChange={(e) => setVendorData({...vendorData, companyNameEn: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{vendorData.companyNameEn}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Legal Name (Arabic)</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameAr} className="text-right" dir="rtl" onChange={(e) => setVendorData({...vendorData, companyNameAr: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark text-right" dir="rtl">{vendorData.companyNameAr}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Trade License Number</Label>
                      {isEditing ? (
                        <Input value={vendorData.tradeLicense} onChange={(e) => setVendorData({...vendorData, tradeLicense: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{vendorData.tradeLicense}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">License Expiry Date</Label>
                      {isEditing ? (
                        <Input type="date" value={vendorData.licenseExpiry} onChange={(e) => setVendorData({...vendorData, licenseExpiry: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{new Date(vendorData.licenseExpiry).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Office Address</Label>
                      {isEditing ? (
                        <Input value={vendorData.address} onChange={(e) => setVendorData({...vendorData, address: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{vendorData.address}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Country</Label>
                      {isEditing ? (
                        <Input value={vendorData.country} onChange={(e) => setVendorData({...vendorData, country: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{vendorData.country}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label>
                      {isEditing ? (
                        <Input value={vendorData.city} onChange={(e) => setVendorData({...vendorData, city: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark">{vendorData.city}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                      {isEditing ? (
                        <Input value={vendorData.phone} onChange={(e) => setVendorData({...vendorData, phone: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {vendorData.phone}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email ID</Label>
                      {isEditing ? (
                        <Input value={vendorData.email} onChange={(e) => setVendorData({...vendorData, email: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {vendorData.email}</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Website</Label>
                      {isEditing ? (
                        <Input value={vendorData.website} onChange={(e) => setVendorData({...vendorData, website: e.target.value})} />
                      ) : (
                        <div className="font-medium text-dark flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> {vendorData.website}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Secondary Info */}
            <div className="space-y-6">
              {/* Primary Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCircle className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.name} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, name: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark">{vendorData.primaryContact.name}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Job Title</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.jobTitle} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, jobTitle: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" /> {vendorData.primaryContact.jobTitle}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mobile Number</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.mobile} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, mobile: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {vendorData.primaryContact.mobile}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.email} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, email: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {vendorData.primaryContact.email}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Landmark className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                    Financial Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Bank Name</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankName} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankName: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark">{vendorData.financialInfo.bankName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Bank Account (IBAN)</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankAccount} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankAccount: e.target.value}})} />
                    ) : (
                      <div className="font-mono text-sm font-medium text-dark">{vendorData.financialInfo.bankAccount}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">VAT Registration Number</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.vatNumber} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, vatNumber: e.target.value}})} />
                    ) : (
                      <div className="font-medium text-dark">{vendorData.financialInfo.vatNumber}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                  <CardTitle>Compliance Documents</CardTitle>
                </div>
                <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)' }} className="text-white">
                  Upload New Document
                </Button>
              </div>
              <CardDescription>Mandatory regulatory and legal documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                      <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Name</TableHead>
                      <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Upload Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Issue Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Expiry Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Verification Status</TableHead>
                      <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc, idx) => (
                      <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-dark">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.fileSize}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(doc.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            {getExpiryAlert(doc.expiryDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CHANGE PASSWORD TAB --- */}
        <TabsContent value="security" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password to maintain security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Re-enter New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline">Reset Form</Button>
                <Button style={{ backgroundColor: 'var(--fnrc-primary-green)' }} className="text-white">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}