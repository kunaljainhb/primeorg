import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle, Download, FileText, Shield, AlertTriangle, Building2, Info } from 'lucide-react';
import { mockVendorDocuments } from '@/app/data/mockData';
import { StatusBadge } from '@/app/components/ui/status-badge';
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
    stateEmirate: 'Dubai',
    city: 'Dubai',
    phone: '+971 4 123 4567',
    fax: '+971 4 123 4568',
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
      accountNumber: '100234567890',
      bankAccount: 'AE12 3456 7890 1234 5678 901',
      bankName: 'Emirates NBD',
      accountHolderName: 'TechSolutions LLC',
      swiftCode: 'EBILAEADXXX',
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
    issueDate: '2023-12-15'
  })));

  const handleSave = () => {
    setIsEditing(false);
    setRegistrationStatus('Correction Requested');
  };

  const getExpiryDays = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date('2026-02-20');
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8">
      {/* Upper action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
            Profile Settings
          </h1>
        </div>
        <div className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-gray-400" />
            Review Actions:
          </div>
          <div className="flex gap-1.5">
            <Button 
              size="sm"
              variant={registrationStatus === 'Approved' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Approved')}
              className={`h-8 font-semibold text-xs rounded-button transition-all ${
                registrationStatus === 'Approved' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Approved
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Rejected' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Rejected')}
              className={`h-8 font-semibold text-xs rounded-button transition-all ${
                registrationStatus === 'Rejected' 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Rejected
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Correction Requested' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Correction Requested')}
              className={`h-8 font-semibold text-xs rounded-button transition-all ${
                registrationStatus === 'Correction Requested' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Correction requested
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        {/* Modernized Segmented Tabs List */}
        <div className="flex border-b border-gray-200/80 pb-1">
          <TabsList className="bg-gray-100/80 border border-gray-200/20 p-1 rounded-xl h-10 w-full sm:w-[360px] flex">
            <TabsTrigger value="company" className="flex items-center justify-center gap-2 font-semibold text-xs rounded-lg py-1.5 transition-all w-1/2">
              <Building2 className="h-3.5 w-3.5" />
              Company Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center gap-2 font-semibold text-xs rounded-lg py-1.5 transition-all w-1/2">
              <Lock className="h-3.5 w-3.5" />
              Change Password
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- COMPANY PROFILE TAB --- */}
        <TabsContent value="company" className="space-y-6 mt-6 focus-visible:outline-none">
          <div className="flex justify-end">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-button text-xs font-semibold h-9 px-4">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-[var(--fnrc-primary-green)] text-white hover:bg-[var(--fnrc-primary-green)]/90 rounded-button text-xs font-semibold h-9 px-4 shadow-sm">
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-button text-xs font-semibold border-gray-200 hover:bg-gray-50 h-9 px-4 flex items-center gap-1.5">
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Overview Header Card */}
          <Card className="shadow-card border-none bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[var(--fnrc-primary-green)]/10 flex items-center justify-center text-[var(--fnrc-primary-green)]">
                    <Building2 className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-[22px] font-bold text-gray-800 leading-none">{vendorData.companyNameEn}</h2>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2">
                      <StatusBadge status={registrationStatus} />
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Vendor ID: VEN-001</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Service Categories */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="text-lg font-bold text-gray-800">Service Categories</CardTitle>
                  <CardDescription className="text-xs text-gray-400 font-medium">Core capabilities registered under FNRC registry</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {availableCategories.map(category => (
                        <div key={category} className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50/60 transition-colors">
                          <input
                            type="checkbox"
                            id={category}
                            checked={vendorData.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="h-4 w-4 rounded-[4px] border-gray-300 text-[var(--fnrc-primary-green)] focus:ring-[var(--fnrc-primary-green)]/50 cursor-pointer"
                          />
                          <label htmlFor={category} className="text-xs font-semibold text-gray-600 leading-none cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {vendorData.categories.map(category => (
                        <Badge key={category} variant="secondary" className="bg-[var(--fnrc-primary-green)]/5 border border-[var(--fnrc-primary-green)]/15 text-[var(--fnrc-primary-green)] font-semibold text-xs px-3 py-1 rounded-full shadow-2xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Details */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                    Company Details
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400 font-medium">Official trade license and company details</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-1">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Company Name (English)</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameEn} onChange={(e) => setVendorData({...vendorData, companyNameEn: e.target.value})} className="rounded-input h-10 border-gray-200" />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.companyNameEn}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Company Name (Arabic)</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameAr} className="text-right rounded-input h-10 border-gray-200" dir="rtl" onChange={(e) => setVendorData({...vendorData, companyNameAr: e.target.value})} />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 text-right bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30" dir="rtl">{vendorData.companyNameAr}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Trade License Number</Label>
                      {isEditing ? (
                        <Input value={vendorData.tradeLicense} onChange={(e) => setVendorData({...vendorData, tradeLicense: e.target.value})} className="rounded-input h-10 border-gray-200" />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.tradeLicense}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">License Expiry Date</Label>
                      {isEditing ? (
                        <Input type="date" value={vendorData.licenseExpiry} onChange={(e) => setVendorData({...vendorData, licenseExpiry: e.target.value})} className="rounded-input h-10 border-gray-200" />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{new Date(vendorData.licenseExpiry).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <MapPin className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-1">
                  <div className="grid gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Office Address</Label>
                      {isEditing ? (
                        <Input value={vendorData.address} onChange={(e) => setVendorData({...vendorData, address: e.target.value})} className="rounded-input h-10 border-gray-200" />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.address}</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Country</Label>
                        {isEditing ? (
                          <Input value={vendorData.country} onChange={(e) => setVendorData({...vendorData, country: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.country}</div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">State / Emirate</Label>
                        {isEditing ? (
                          <Input value={vendorData.stateEmirate} onChange={(e) => setVendorData({...vendorData, stateEmirate: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.stateEmirate}</div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">City</Label>
                        {isEditing ? (
                          <Input value={vendorData.city} onChange={(e) => setVendorData({...vendorData, city: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.city}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Phone Number</Label>
                        {isEditing ? (
                          <Input value={vendorData.phone} onChange={(e) => setVendorData({...vendorData, phone: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" /> 
                            {vendorData.phone}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Fax Number</Label>
                        {isEditing ? (
                          <Input value={vendorData.fax} onChange={(e) => setVendorData({...vendorData, fax: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" /> 
                            {vendorData.fax}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email ID</Label>
                        {isEditing ? (
                          <Input value={vendorData.email} onChange={(e) => setVendorData({...vendorData, email: e.target.value})} className="rounded-input h-10 border-gray-200" />
                        ) : (
                          <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" /> 
                            {vendorData.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Website</Label>
                      {isEditing ? (
                        <Input value={vendorData.website} onChange={(e) => setVendorData({...vendorData, website: e.target.value})} className="rounded-input h-10 border-gray-200" />
                      ) : (
                        <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" /> 
                          {vendorData.website}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Dashboard-style groupings */}
            <div className="space-y-6">
              
              {/* Primary Contact Card */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <UserCircle className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Name</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.name} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, name: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.primaryContact.name}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Job Title</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.jobTitle} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, jobTitle: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        {vendorData.primaryContact.jobTitle}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mobile Number</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.mobile} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, mobile: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {vendorData.primaryContact.mobile}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.email} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, email: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {vendorData.primaryContact.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Info Card */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Landmark className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                    Financial Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Bank Name</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankName} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankName: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.financialInfo.bankName}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account Holder Name</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.accountHolderName} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, accountHolderName: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.financialInfo.accountHolderName}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">IBAN</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankAccount} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankAccount: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-mono text-xs font-semibold text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30 break-all">{vendorData.financialInfo.bankAccount}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Swift Code</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.swiftCode} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, swiftCode: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.financialInfo.swiftCode}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">VAT Registration Number</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.vatNumber} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, vatNumber: e.target.value}})} className="rounded-input h-10 border-gray-200" />
                    ) : (
                      <div className="font-semibold text-[14px] text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/30">{vendorData.financialInfo.vatNumber}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Compliance Documents Section */}
          <Card className="shadow-card border-none bg-white">
            <CardHeader className="px-6 pt-6 pb-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                  <CardTitle className="text-lg font-bold text-gray-800">Compliance Documents</CardTitle>
                </div>
                <Button size="sm" className="bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 text-white rounded-button text-xs font-semibold h-9 px-4">
                  Upload Document
                </Button>
              </div>
              <CardDescription className="text-xs text-gray-400 font-medium font-medium">Regulatory and legal credentials required for FNRC qualifications</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-[13px] text-gray-400">Document Name</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400">Upload Date</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400">Issue Date</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400">Expiry Date</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400">Verification Status</TableHead>
                    <TableHead className="text-right font-bold text-[13px] text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-semibold text-gray-800 text-[14px]">{doc.name}</div>
                            <div className="text-[11px] text-gray-400 font-medium">{doc.fileSize}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[14px] text-gray-500 font-medium">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-[14px] text-gray-500 font-medium">
                        {new Date(doc.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-[14px] text-gray-500 font-medium">
                        {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={doc.status} />
                          {doc.expiryDate && (() => {
                            const daysRemaining = getExpiryDays(doc.expiryDate);
                            if (daysRemaining === null || daysRemaining >= 30) return null;
                            
                            let iconColor = 'text-blue-500';
                            if (daysRemaining < 0) {
                              iconColor = 'text-red-600 animate-pulse';
                            } else if (daysRemaining <= 15) {
                              iconColor = 'text-orange-500';
                            } else {
                              iconColor = 'text-amber-500';
                            }

                            return (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                      <Info className={`h-4 w-4 ${iconColor}`} />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="rounded-lg bg-gray-900 text-white border-none text-[11px] font-semibold px-2 py-1 shadow-md">
                                    <p>
                                      {daysRemaining < 0 
                                        ? `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago` 
                                        : `Document expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CHANGE PASSWORD TAB --- */}
        <TabsContent value="security" className="mt-6 focus-visible:outline-none">
          <Card className="max-w-2xl mx-auto shadow-card border-none bg-white">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <KeyRound className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Change Password
              </CardTitle>
              <CardDescription className="text-xs text-gray-400 font-medium font-medium">Update account password to maintain security credentials</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5 pt-1">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" className="rounded-input h-10 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" className="rounded-input h-10 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Re-enter New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" className="rounded-input h-10 border-gray-200" />
              </div>
              
              <div className="pt-3 flex justify-end gap-3">
                <Button variant="outline" className="rounded-button text-xs font-semibold h-9 px-4">Reset Form</Button>
                <Button className="bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 text-white rounded-button text-xs font-semibold h-9 px-4 shadow-sm">
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