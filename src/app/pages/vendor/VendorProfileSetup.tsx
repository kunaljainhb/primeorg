import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Upload, AlertCircle, Building, MapPin, User, Landmark, Phone, Mail, Briefcase, ListFilter, FileText, ClipboardCheck, CheckCircle2, Globe } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Checkbox } from '@/app/components/ui/checkbox';
import { vendorCategories } from '@/app/data/mockData';

export default function VendorProfileSetup() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [codeOfConductAgreed, setCodeOfConductAgreed] = useState(false);
  const [conflictOfInterestAgreed, setConflictOfInterestAgreed] = useState(false);
  const [antiBriberyAgreed, setAntiBriberyAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeOfConductAgreed || !conflictOfInterestAgreed || !antiBriberyAgreed) {
      alert('Please agree to all declarations before submitting.');
      return;
    }
    
    setIsSubmitted(true);
    
    setTimeout(() => {
      navigate('/vendor/registration-status');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-6 sm:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="bg-white p-8 rounded-card shadow-card border border-gray-100/50">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
            Complete Your Supplier Profile
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Provide legal, contact, and financial details to complete your official registration with Fujairah Natural Resources Corporation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Details */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Building className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Company Details
              </CardTitle>
              <CardDescription>Legal registration and trade classification</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legalNameEn" className="text-sm font-bold text-gray-700">Company Legal Name (English) *</Label>
                  <Input id="legalNameEn" placeholder="TechSolutions LLC" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2 text-right">
                  <Label htmlFor="legalNameAr" className="text-sm font-bold text-gray-700 block">Company Legal Name (Arabic) *</Label>
                  <Input id="legalNameAr" placeholder="تك سوليوشنز ذ.م.م" className="text-right rounded-xl border-gray-200" dir="rtl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeLicense" className="text-sm font-bold text-gray-700">Trade License Number *</Label>
                  <Input id="tradeLicense" placeholder="TL-123456" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-bold text-gray-700">License Expiry Date *</Label>
                  <Input id="expiryDate" type="date" className="rounded-xl border-gray-200" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MapPin className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Contact Information
              </CardTitle>
              <CardDescription>Official business address and endpoints</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-bold text-gray-700">Address *</Label>
                  <Textarea id="address" placeholder="Building, Street, Office number, Area..." rows={2} className="rounded-xl border-gray-200 resize-none text-sm p-3" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-bold text-gray-700">Country *</Label>
                    <Input id="country" placeholder="United Arab Emirates" className="rounded-xl border-gray-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateEmirate" className="text-sm font-bold text-gray-700">State/Emirate *</Label>
                    <Input id="stateEmirate" placeholder="Fujairah" className="rounded-xl border-gray-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-bold text-gray-700">City *</Label>
                    <Input id="city" placeholder="Fujairah" className="rounded-xl border-gray-200" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                      <Input id="phone" className="pl-10 rounded-xl border-gray-200" placeholder="+971 9 223 4567" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax" className="text-sm font-bold text-gray-700">Fax Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                      <Input id="fax" className="pl-10 rounded-xl border-gray-200" placeholder="+971 9 223 4568" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailId" className="text-sm font-bold text-gray-700">Business Email ID *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                      <Input id="emailId" type="email" className="pl-10 rounded-xl border-gray-200" placeholder="info@techsolutions.ae" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website" className="text-sm font-bold text-gray-700">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                    <Input id="website" className="pl-10 rounded-xl border-gray-200" placeholder="https://www.techsolutions.ae" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contact */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <User className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Primary Contact Partner
              </CardTitle>
              <CardDescription>The main coordinator for communications and bids</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm font-bold text-gray-700">Full Name *</Label>
                  <Input id="contactName" placeholder="Ahmed Al-Mansoori" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-bold text-gray-700">Job Title *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                    <Input id="jobTitle" className="pl-10 rounded-xl border-gray-200" placeholder="Commercial Manager" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber" className="text-sm font-bold text-gray-700">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                    <Input id="mobileNumber" className="pl-10 rounded-xl border-gray-200" placeholder="+971 50 123 4567" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-bold text-gray-700">Direct Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 text-gray-700" />
                    <Input id="contactEmail" type="email" className="pl-10 rounded-xl border-gray-200" placeholder="ahmed@techsolutions.ae" required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Landmark className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Financial & Banking Info
              </CardTitle>
              <CardDescription>Required bank routing parameters for contract award disbursement</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-sm font-bold text-gray-700">Beneficiary Bank Name *</Label>
                  <Input id="bankName" placeholder="National Bank of Fujairah" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-sm font-bold text-gray-700">Account Holder Title *</Label>
                  <Input id="accountHolderName" placeholder="TechSolutions LLC" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-bold text-gray-700">Account Number *</Label>
                  <Input id="accountNumber" placeholder="100234567890" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban" className="text-sm font-bold text-gray-700">IBAN *</Label>
                  <Input id="iban" placeholder="AE12 3456 7890 1234 5678 901" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode" className="text-sm font-bold text-gray-700">SWIFT / BIC Code *</Label>
                  <Input id="swiftCode" placeholder="NBFXAEADXXX" className="rounded-xl border-gray-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber" className="text-sm font-bold text-gray-700">VAT TRN (Tax Registration Number) *</Label>
                  <Input id="vatNumber" placeholder="100234567890003" className="rounded-xl border-gray-200" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <ListFilter className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Technical Capabilities & Sectors
              </CardTitle>
              <CardDescription>Select business activities to receive customized tender matches</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {vendorCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className="rounded-md"
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer text-sm font-semibold text-gray-700 flex-1"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Uploads */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <FileText className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Required Legal Documents
              </CardTitle>
              <CardDescription>Upload files in PDF format (Maximum file size: 5MB per document)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Trade License */}
              <div className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/20 transition-colors">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tradeLicenseDoc" className="text-sm font-bold text-gray-900">Valid Trade License *</Label>
                    <div className="relative group cursor-pointer border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-colors flex items-center justify-between">
                      <input id="tradeLicenseDoc" type="file" accept=".pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <span className="text-xs text-gray-500 font-semibold truncate pr-6">Choose trade license file...</span>
                      <Upload className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tlIssueDate" className="text-xs font-bold text-gray-600">Issue Date *</Label>
                      <Input id="tlIssueDate" type="date" required className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tlExpiryDate" className="text-xs font-bold text-gray-600">Expiry Date *</Label>
                      <Input id="tlExpiryDate" type="date" required className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Registration Certificate */}
              <div className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/20 transition-colors">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="taxCertificate" className="text-sm font-bold text-gray-900">Tax Registration Certificate (TRN) *</Label>
                    <div className="relative group cursor-pointer border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-colors flex items-center justify-between">
                      <input id="taxCertificate" type="file" accept=".pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <span className="text-xs text-gray-500 font-semibold truncate pr-6">Choose TRN file...</span>
                      <Upload className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxIssueDate" className="text-xs font-bold text-gray-600">Issue Date *</Label>
                      <Input id="taxIssueDate" type="date" required className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxExpiryDate" className="text-xs font-bold text-gray-600">Expiry Date</Label>
                      <Input id="taxExpiryDate" type="date" className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile */}
              <div className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/20 transition-colors">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyProfile" className="text-sm font-bold text-gray-900">Corporate Capability Profile</Label>
                    <div className="relative group cursor-pointer border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-colors flex items-center justify-between">
                      <input id="companyProfile" type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <span className="text-xs text-gray-500 font-semibold truncate pr-6">Choose corporate brochure...</span>
                      <Upload className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpIssueDate" className="text-xs font-bold text-gray-600">Issue Date</Label>
                      <Input id="cpIssueDate" type="date" className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpExpiryDate" className="text-xs font-bold text-gray-600">Expiry Date</Label>
                      <Input id="cpExpiryDate" type="date" className="h-9 text-xs rounded-lg border-gray-200" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Declarations */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <ClipboardCheck className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Legal Declarations & Policies
              </CardTitle>
              <CardDescription>Affirm your agreement to official FNRC ethical guidelines (Mandatory)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Code of Conduct */}
              <div className="rounded-xl border border-gray-150 p-5 bg-gray-50/30 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">
                  1. Code of Business Conduct
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  I acknowledge that my company will conduct business with the Federal National Resources Commission (FNRC) in accordance with the highest standards of ethical conduct. We will comply with all applicable local laws, regulations, and procurement standards.
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="codeOfConduct"
                    checked={codeOfConductAgreed}
                    onCheckedChange={(checked) => setCodeOfConductAgreed(checked as boolean)}
                    className="rounded-md"
                  />
                  <label
                    htmlFor="codeOfConduct"
                    className="cursor-pointer text-xs font-bold text-gray-700"
                  >
                    I agree to abide by the Code of Conduct *
                  </label>
                </div>
              </div>

              {/* Conflict of Interest */}
              <div className="rounded-xl border border-gray-150 p-5 bg-gray-50/30 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">
                  2. Conflict of Interest Declaration
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  I declare that my company and its representatives have no conflict of interest that would impair our ability to provide impartial, objective services to FNRC. We will immediately disclose any potential or perceived conflict of interest that may arise.
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="conflictOfInterest"
                    checked={conflictOfInterestAgreed}
                    onCheckedChange={(checked) => setConflictOfInterestAgreed(checked as boolean)}
                    className="rounded-md"
                  />
                  <label
                    htmlFor="conflictOfInterest"
                    className="cursor-pointer text-xs font-bold text-gray-700"
                  >
                    I declare no conflict of interest and agree to disclose any that may arise *
                  </label>
                </div>
              </div>

              {/* Anti-Bribery */}
              <div className="rounded-xl border border-gray-150 p-5 bg-gray-50/30 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">
                  3. Anti-Bribery and Corruption Certificate
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  I certify that my company strictly prohibits bribery, corruption, and any form of unethical facilitation payments. We commit to reporting any solicitation of bribes or improper conduct immediately.
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="antiBribery"
                    checked={antiBriberyAgreed}
                    onCheckedChange={(checked) => setAntiBriberyAgreed(checked as boolean)}
                    className="rounded-md"
                  />
                  <label
                    htmlFor="antiBribery"
                    className="cursor-pointer text-xs font-bold text-gray-700"
                  >
                    I agree to comply with the Anti-Bribery and Corruption Policy *
                  </label>
                </div>
              </div>

              {/* Error Warning alert */}
              {(!codeOfConductAgreed || !conflictOfInterestAgreed || !antiBriberyAgreed) && (
                <Alert className="border-red-100 bg-red-50 text-red-700 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <AlertDescription className="text-xs font-semibold leading-relaxed">
                    All legal declarations are mandatory. Your profile setup cannot be submitted without agreeing to all terms.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Success Status Alert */}
          {isSubmitted && (
            <Alert className="border-emerald-100 bg-emerald-50 text-emerald-800 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <AlertDescription className="text-sm font-bold leading-relaxed">
                Profile submitted successfully! We are redirecting you to the registration status tracking...
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 font-semibold"
              onClick={() => navigate('/vendor/landing')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="text-white h-11 px-8 font-semibold shadow-lg shadow-[var(--fnrc-primary-green)]/15 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Submit for Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}