import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Upload, AlertCircle, Building, MapPin, User, Landmark, Calendar, Globe, Phone, Mail, Briefcase, ListFilter, FileText, ClipboardCheck, CheckCircle2 } from 'lucide-react';
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
    // Check if all declarations are agreed
    if (!codeOfConductAgreed || !conflictOfInterestAgreed || !antiBriberyAgreed) {
      alert('Please agree to all declarations before submitting.');
      return;
    }
    
    // Show success message
    setIsSubmitted(true);
    
    // Redirect after a delay
    setTimeout(() => {
      navigate('/vendor/registration-status');
    }, 3000);
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            Complete Your Profile
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Provide company details and upload required documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Company Details
              </CardTitle>
              <CardDescription>Legal and registration information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legalNameEn">Company Legal Name (English)</Label>
                  <Input id="legalNameEn" placeholder="TechSolutions LLC" required />
                </div>
                <div className="space-y-2 text-right">
                  <Label htmlFor="legalNameAr">Company Legal Name (Arabic)</Label>
                  <Input id="legalNameAr" placeholder="تك سوليوشنز ذ.م.م" className="text-right" dir="rtl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeLicense">Trade Licensee Number</Label>
                  <Input id="tradeLicense" placeholder="TL-123456" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <Input id="expiryDate" type="date" required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Contact Information
              </CardTitle>
              <CardDescription>Company contact and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Building, Street, Area..." rows={2} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United Arab Emirates" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateEmirate">State/Emirate</Label>
                    <Input id="stateEmirate" placeholder="Dubai / Abu Dhabi" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Dubai" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                      <Input id="phone" className="pl-10" placeholder="+971 4 123 4567" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                      <Input id="fax" className="pl-10" placeholder="+971 4 123 4568" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailId">Email ID</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                      <Input id="emailId" type="email" className="pl-10" placeholder="info@company.com" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                    <Input id="website" className="pl-10" placeholder="https://www.company.com" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Primary Contact
              </CardTitle>
              <CardDescription>Details of the person managing the portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name</Label>
                  <Input id="contactName" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                    <Input id="jobTitle" className="pl-10" placeholder="Procurement Manager" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                    <Input id="mobileNumber" className="pl-10" placeholder="+971 50 123 4567" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                    <Input id="contactEmail" type="email" className="pl-10" placeholder="john.doe@company.com" required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Financial Info
              </CardTitle>
              <CardDescription>Bank and tax registration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" placeholder="Emirates NBD" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input id="accountHolderName" placeholder="TechSolutions LLC" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="100234567890" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" placeholder="AE12 3456 7890 1234 5678 901" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Swift Code</Label>
                  <Input id="swiftCode" placeholder="EBILAEADXXX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Registration Number</Label>
                  <Input id="vatNumber" placeholder="100234567890003" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Service Categories
              </CardTitle>
              <CardDescription>Select all categories that apply to your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {vendorCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer text-sm"
                      style={{ color: 'var(--fnrc-text-dark)' }}
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Document Upload
              </CardTitle>
              <CardDescription>Upload required company documents (PDF, max 5MB each)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Trade License */}
              <div className="space-y-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="tradeLicenseDoc" className="font-semibold">Trade License *</Label>
                    <div className="flex items-center gap-2">
                      <Input id="tradeLicenseDoc" type="file" accept=".pdf" required className="bg-gray-50/50" />
                      <Upload className="h-5 w-5 shrink-0" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="tlIssueDate" className="text-xs text-muted-foreground">Issue Date</Label>
                      <Input id="tlIssueDate" type="date" required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tlExpiryDate" className="text-xs text-muted-foreground">Expiry Date</Label>
                      <Input id="tlExpiryDate" type="date" required className="h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Registration Certificate */}
              <div className="space-y-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="taxCertificate" className="font-semibold">Tax Registration Certificate *</Label>
                    <div className="flex items-center gap-2">
                      <Input id="taxCertificate" type="file" accept=".pdf" required className="bg-gray-50/50" />
                      <Upload className="h-5 w-5 shrink-0" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="taxIssueDate" className="text-xs text-muted-foreground">Issue Date</Label>
                      <Input id="taxIssueDate" type="date" required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxExpiryDate" className="text-xs text-muted-foreground">Expiry Date</Label>
                      <Input id="taxExpiryDate" type="date" required className="h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile */}
              <div className="space-y-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="companyProfile" className="font-semibold">Company Profile</Label>
                    <div className="flex items-center gap-2">
                      <Input id="companyProfile" type="file" accept=".pdf" className="bg-gray-50/50" />
                      <Upload className="h-5 w-5 shrink-0" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="cpIssueDate" className="text-xs text-muted-foreground">Issue Date</Label>
                      <Input id="cpIssueDate" type="date" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpExpiryDate" className="text-xs text-muted-foreground">Expiry Date</Label>
                      <Input id="cpExpiryDate" type="date" className="h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Docs */}
              <div className="space-y-4 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="otherDocs" className="font-semibold">Other Supporting Documents</Label>
                    <div className="flex items-center gap-2">
                      <Input id="otherDocs" type="file" accept=".pdf" multiple className="bg-gray-50/50" />
                      <Upload className="h-5 w-5 shrink-0" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="otherIssueDate" className="text-xs text-muted-foreground">Issue Date</Label>
                      <Input id="otherIssueDate" type="date" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherExpiryDate" className="text-xs text-muted-foreground">Expiry Date</Label>
                      <Input id="otherExpiryDate" type="date" className="h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Declarations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Vendor Declarations
              </CardTitle>
              <CardDescription>Please read and agree to the following declarations (required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Code of Conduct */}
              <div className="space-y-3">
                <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Code of Conduct
                  </h4>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>
                    I acknowledge that my company will conduct business with the Federal National Regulatory Commission (FNRC) 
                    in accordance with the highest standards of ethical conduct. We will comply with all applicable laws, 
                    regulations, and professional standards. We commit to conducting our business with integrity, honesty, 
                    and fairness in all dealings with FNRC officials, employees, and other stakeholders.
                  </p>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="codeOfConduct"
                      checked={codeOfConductAgreed}
                      onCheckedChange={(checked) => setCodeOfConductAgreed(checked as boolean)}
                      required
                    />
                    <label
                      htmlFor="codeOfConduct"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      style={{ color: 'var(--fnrc-text-dark)' }}
                    >
                      I agree to abide by the Code of Conduct *
                    </label>
                  </div>
                </div>
              </div>

              {/* Conflict of Interest */}
              <div className="space-y-3">
                <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Conflict of Interest Declaration
                  </h4>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>
                    I declare that my company and its representatives have no conflict of interest that would impair our 
                    ability to provide impartial, objective services to FNRC. We will immediately disclose any actual, 
                    potential, or perceived conflict of interest that may arise during the course of our engagement. 
                    We understand that failure to disclose conflicts of interest may result in disqualification or 
                    termination of contract.
                  </p>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="conflictOfInterest"
                      checked={conflictOfInterestAgreed}
                      onCheckedChange={(checked) => setConflictOfInterestAgreed(checked as boolean)}
                      required
                    />
                    <label
                      htmlFor="conflictOfInterest"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      style={{ color: 'var(--fnrc-text-dark)' }}
                    >
                      I declare no conflict of interest and agree to disclose any that may arise *
                    </label>
                  </div>
                </div>
              </div>

              {/* Anti-Bribery */}
              <div className="space-y-3">
                <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Anti-Bribery and Corruption Policy
                  </h4>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>
                    I certify that my company strictly prohibits bribery, corruption, and any form of unethical payments. 
                    We have not and will not offer, promise, give, accept, or authorize any bribe or improper advantage 
                    to obtain or retain business or secure any advantage in relation to FNRC contracts. We commit to 
                    reporting any solicitation of bribes or improper conduct immediately. We understand that violation 
                    of this policy will result in immediate contract termination and possible legal action.
                  </p>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="antiBribery"
                      checked={antiBriberyAgreed}
                      onCheckedChange={(checked) => setAntiBriberyAgreed(checked as boolean)}
                      required
                    />
                    <label
                      htmlFor="antiBribery"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      style={{ color: 'var(--fnrc-text-dark)' }}
                    >
                      I agree to comply with the Anti-Bribery and Corruption Policy *
                    </label>
                  </div>
                </div>
              </div>

              {/* Required notice */}
              <Alert style={{ borderColor: 'var(--fnrc-error)', backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="h-4 w-4" style={{ color: 'var(--fnrc-error)' }} />
                <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }}>
                  All declarations are mandatory. Your registration cannot be submitted without agreeing to all policies.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Post-submission Success Message */}
          {isSubmitted && (
            <Alert style={{ borderColor: 'var(--fnrc-success)', backgroundColor: '#F0FDF4' }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--fnrc-success)' }} />
              <AlertDescription style={{ color: 'var(--fnrc-text-dark)' }} className="font-medium">
                Your registration will be pending FNRC approval. You will be notified via email once reviewed.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendor/landing')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Submit for Approval
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}