import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle, Download, FileText, Shield, AlertTriangle, Building2, Info, Clock } from 'lucide-react';
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
import { useTranslation } from '@/app/context/LanguageContext';

export default function VendorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('Approved');
  const [activeTab, setActiveTab] = useState('company');
  const { t, language } = useTranslation();
  
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
    <div className="space-y-8 text-start">
      {/* Upper action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-gray-800 leading-tight">
            {t('Profile Settings')}
          </h1>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mr-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {t('Review Actions:')}
          </div>
          <div className="flex gap-1.5">
            <Button 
              size="sm"
              variant={registrationStatus === 'Approved' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Approved')}
              className={`h-8 font-semibold text-xs rounded-button transition-all cursor-pointer ${
                registrationStatus === 'Approved' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t('Approved')}
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Rejected' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Rejected')}
              className={`h-8 font-semibold text-xs rounded-button transition-all cursor-pointer ${
                registrationStatus === 'Rejected' 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t('Rejected')}
            </Button>
            <Button 
              size="sm"
              variant={registrationStatus === 'Correction Requested' ? 'default' : 'outline'}
              onClick={() => setRegistrationStatus('Correction Requested')}
              className={`h-8 font-semibold text-xs rounded-button transition-all cursor-pointer ${
                registrationStatus === 'Correction Requested' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t('Correction Requested')}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Modernized Segmented Tabs List */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200/80 pb-2 gap-4">
          <TabsList className="bg-gray-100/80 border border-gray-200/20 p-1 rounded-xl h-10 w-full sm:w-[360px] flex shrink-0">
            <TabsTrigger value="company" className="flex items-center justify-center gap-2 font-semibold text-xs rounded-lg py-1.5 transition-all w-1/2">
              <Building2 className="h-3.5 w-3.5" />
              {t('Company Profile')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center gap-2 font-semibold text-xs rounded-lg py-1.5 transition-all w-1/2">
              <Lock className="h-3.5 w-3.5" />
              {t('Change Password')}
            </TabsTrigger>
          </TabsList>

          {activeTab === 'company' && (
            <div className="flex justify-end">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-button text-xs font-semibold h-9 px-4 cursor-pointer">
                    {t('Cancel')}
                  </Button>
                  <Button onClick={handleSave} className="bg-[var(--fnrc-primary-green)] text-white hover:bg-[var(--fnrc-primary-green)]/90 rounded-button text-xs font-semibold h-9 px-4 shadow-sm cursor-pointer">
                    {t('Save Changes')}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-button text-xs font-semibold border-gray-200 hover:bg-gray-50 h-9 px-4 flex items-center gap-1.5 cursor-pointer">
                  {t('Edit Profile')}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* --- COMPANY PROFILE TAB --- */}
        <TabsContent value="company" className="space-y-6 mt-6 focus-visible:outline-none">
          {/* Profile Overview Header Card */}
          <Card className="shadow-card border-none bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[var(--fnrc-primary-green)]/10 flex items-center justify-center text-[var(--fnrc-primary-green)]">
                    <Building2 className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-[22px] font-bold text-gray-800 leading-none">{language === 'ar' ? vendorData.companyNameAr : vendorData.companyNameEn}</h2>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2">
                      <StatusBadge status={registrationStatus} />
                      <span className="text-[14px] text-black font-bold">{t('Vendor ID:')} VEN-001</span>
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
                <CardHeader className="pb-2 px-6 pt-5">
                  <CardTitle className="text-lg font-bold text-black">{t('Service Categories')}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-start">
                      {availableCategories.map(category => (
                        <div key={category} className="flex items-center space-x-2.5 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50/60 transition-colors">
                          <input
                            type="checkbox"
                            id={category}
                            checked={vendorData.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="h-4 w-4 rounded-[4px] border-gray-300 text-[var(--fnrc-primary-green)] focus:ring-[var(--fnrc-primary-green)]/50 cursor-pointer"
                          />
                          <label htmlFor={category} className="text-xs font-semibold text-gray-600 leading-none cursor-pointer">
                            {t(category)}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {vendorData.categories.map(category => (
                        <Badge key={category} variant="secondary" className="bg-[var(--fnrc-primary-green)]/5 border border-[var(--fnrc-primary-green)]/15 text-[var(--fnrc-primary-green)] font-semibold text-xs px-3 py-1 rounded-full shadow-2xs">
                          {t(category)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Details */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-5 pb-2">
                  <CardTitle className="text-lg font-bold text-black">
                    {t('Company Details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-1">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('Company Name (English)')}</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameEn} onChange={(e) => setVendorData({...vendorData, companyNameEn: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.companyNameEn}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('Company Name (Arabic)')}</Label>
                      {isEditing ? (
                        <Input value={vendorData.companyNameAr} className="rounded-input h-10 border-gray-200 text-start" onChange={(e) => setVendorData({...vendorData, companyNameAr: e.target.value})} />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.companyNameAr}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('Trade License Number')}</Label>
                      {isEditing ? (
                        <Input value={vendorData.tradeLicense} onChange={(e) => setVendorData({...vendorData, tradeLicense: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.tradeLicense}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('License Expiry Date')}</Label>
                      {isEditing ? (
                        <Input type="date" value={vendorData.licenseExpiry} onChange={(e) => setVendorData({...vendorData, licenseExpiry: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{new Date(vendorData.licenseExpiry).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB')}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-5 pb-2">
                  <CardTitle className="text-lg font-bold text-black">
                    {t('Contact Info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-1">
                  <div className="grid gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('Office Address')}</Label>
                      {isEditing ? (
                        <Input value={vendorData.address} onChange={(e) => setVendorData({...vendorData, address: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.address}</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('Country')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.country} onChange={(e) => setVendorData({...vendorData, country: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorData.country)}</div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('State / Emirate')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.stateEmirate} onChange={(e) => setVendorData({...vendorData, stateEmirate: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorData.stateEmirate)}</div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('City')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.city} onChange={(e) => setVendorData({...vendorData, city: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorData.city)}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('Phone Number')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.phone} onChange={(e) => setVendorData({...vendorData, phone: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                            <Phone className="h-4 w-4 text-gray-400 shrink-0" /> 
                            {vendorData.phone}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('Fax Number')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.fax} onChange={(e) => setVendorData({...vendorData, fax: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                            <Phone className="h-4 w-4 text-gray-400 shrink-0" /> 
                            {vendorData.fax}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] text-black font-bold">{t('Email ID')}</Label>
                        {isEditing ? (
                          <Input value={vendorData.email} onChange={(e) => setVendorData({...vendorData, email: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                        ) : (
                          <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                            <Mail className="h-4 w-4 text-gray-400 shrink-0" /> 
                            {vendorData.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[14px] text-black font-bold">{t('Website')}</Label>
                      {isEditing ? (
                        <Input value={vendorData.website} onChange={(e) => setVendorData({...vendorData, website: e.target.value})} className="rounded-input h-10 border-gray-200 text-start" />
                      ) : (
                        <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                          <Globe className="h-4 w-4 text-gray-400 shrink-0" /> 
                          {vendorData.website}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Dashboard-style groupings */}
            <div className="space-y-6 text-start">
              {/* Primary Contact Card */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-5 pb-0">
                  <CardTitle className="text-lg font-bold text-black">
                    {t('Primary Contact')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Name')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.name} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, name: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.primaryContact.name}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Job Title')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.jobTitle} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, jobTitle: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                        <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                        {t(vendorData.primaryContact.jobTitle)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Mobile Number')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.mobile} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, mobile: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                        {vendorData.primaryContact.mobile}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Email')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.primaryContact.email} onChange={(e) => setVendorData({...vendorData, primaryContact: {...vendorData.primaryContact, email: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 flex items-center gap-2 text-start">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                        {vendorData.primaryContact.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Info Card */}
              <Card className="shadow-card border-none bg-white">
                <CardHeader className="px-6 pt-5 pb-2">
                  <CardTitle className="text-lg font-bold text-black">
                    {t('Financial Info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Bank Name')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankName} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankName: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{t(vendorData.financialInfo.bankName)}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Account Holder Name')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.accountHolderName} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, accountHolderName: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.financialInfo.accountHolderName}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('IBAN')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.bankAccount} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, bankAccount: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-mono text-xs font-semibold text-gray-700 break-all text-start">{vendorData.financialInfo.bankAccount}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('Swift Code')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.swiftCode} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, swiftCode: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.financialInfo.swiftCode}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[14px] text-black font-bold">{t('VAT Registration Number')}</Label>
                    {isEditing ? (
                      <Input value={vendorData.financialInfo.vatNumber} onChange={(e) => setVendorData({...vendorData, financialInfo: {...vendorData.financialInfo, vatNumber: e.target.value}})} className="rounded-input h-10 border-gray-200 text-start" />
                    ) : (
                      <div className="font-normal text-[14px] text-gray-700 p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/30 text-start">{vendorData.financialInfo.vatNumber}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Compliance Documents Section */}
          <Card className="shadow-card border-none bg-white">
            <CardHeader className="px-6 pt-5 pb-2">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-lg font-bold text-black text-start">{t('Compliance Documents')}</CardTitle>
                <Button size="sm" className="bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 text-white rounded-button text-xs font-semibold h-9 px-4 cursor-pointer">
                  {t('Upload Document')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-[13px] text-gray-400 text-start">{t('Document Name')}</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400 text-start">{t('Upload Date')}</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400 text-start">{t('Issue Date')}</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400 text-start">{t('Expiry Date')}</TableHead>
                    <TableHead className="font-bold text-[13px] text-gray-400 text-start">{t('Verification Status')}</TableHead>
                    <TableHead className="text-end font-bold text-[13px] text-gray-400 pe-6">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-start">
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
                        {new Date(doc.issueDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB')}
                      </TableCell>
                      <TableCell className="text-[14px] text-gray-500 font-medium text-start">
                        {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB') : '-'}
                      </TableCell>
                      <TableCell className="text-start">
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
                                        ? `${t('Expired')} ${Math.abs(daysRemaining)} ${t('days ago')}` 
                                        : `${t('Document expires in')} ${daysRemaining} ${t('days')}`}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-end pe-6">
                        <div className="flex justify-end">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
            <CardHeader className="px-6 pt-5 pb-2">
              <CardTitle className="text-lg font-bold text-black text-start">
                {t('Change Password')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5 pt-1 text-start">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t('Current Password')}</Label>
                <Input id="current-password" type="password" placeholder={t('Enter current password')} className="rounded-input h-10 border-gray-200 text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('New Password')}</Label>
                <Input id="new-password" type="password" placeholder={t('Enter new password')} className="rounded-input h-10 border-gray-200 text-start" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('Re-enter New Password')}</Label>
                <Input id="confirm-password" type="password" placeholder={t('Confirm new password')} className="rounded-input h-10 border-gray-200 text-start" />
              </div>
              
              <div className="pt-3 flex justify-end gap-3">
                <Button variant="outline" className="rounded-button text-xs font-semibold h-9 px-4 cursor-pointer">{t('Reset Form')}</Button>
                <Button className="bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 text-white rounded-button text-xs font-semibold h-9 px-4 shadow-sm cursor-pointer">
                  {t('Update Password')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}