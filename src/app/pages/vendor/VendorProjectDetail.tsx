import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { ArrowLeft, FileText, Download, Award, Star, RefreshCw, UploadCloud, Paperclip, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockProposals, mockERPDocuments, saveProposalsToStorage, mockVendorReviews, mockAdminUsers } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import { toast } from 'sonner';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useTranslation } from '@/app/context/LanguageContext';

const formatDate = (dateStr?: string | Date, lang?: string) => {
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
  if (statusStr === 'technical_correction_requested') return 'Technical Correction Requested';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function VendorProjectDetail() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const { t, language } = useTranslation();

  const getReviewerRoleName = (name: string) => {
    const admin = mockAdminUsers.find(u => u.name === name);
    if (!admin) return t('Reviewer');
    return admin.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  
  const [proposal, setProposal] = useState(() => {
    return mockProposals.find(p => p.id === proposalId);
  });
  
  const [activeTab, setActiveTab] = useState('submitted');

  // States for Vendor Supporting Documents Upload
  const [docRemarks, setDocRemarks] = useState('');
  const [selectedDocFiles, setSelectedDocFiles] = useState<File[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if proposalId changes
  useEffect(() => {
    const found = mockProposals.find(p => p.id === proposalId);
    setProposal(found);
  }, [proposalId]);

  const [localRating, setLocalRating] = useState<any>(null);
  useEffect(() => {
    if (proposalId) {
      const saved = localStorage.getItem(`external_rating_${proposalId}`);
      if (saved) {
        try {
          setLocalRating(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [proposalId]);

  const handleProposalUpdate = (updatedProposal: any) => {
    setProposal(updatedProposal);
  };

  const handleUploadSupportingDoc = () => {
    if (!selectedDocFiles || selectedDocFiles.length === 0) {
      toast.error(t('Please select at least one document to upload.'));
      return;
    }
    
    setIsUploadingDoc(true);
    
    // Simulate API upload & saving delay
    setTimeout(() => {
      const targetIdx = mockProposals.findIndex(p => p.id === proposal.id);
      if (targetIdx !== -1) {
        const currentUploadedDocs = mockProposals[targetIdx].uploadedDocuments || [];
        
        const newDocs = selectedDocFiles.map(file => ({
          name: file.name,
          url: '#',
          remarks: docRemarks.trim() || 'No remarks provided.',
          uploadedDate: new Date().toISOString().split('T')[0]
        }));
        
        const updatedDocs = [...currentUploadedDocs, ...newDocs];
        mockProposals[targetIdx].uploadedDocuments = updatedDocs;
        
        // Save back to localStorage
        saveProposalsToStorage(mockProposals);
        
        // Update local React states
        const updatedProposal = { ...mockProposals[targetIdx] };
        setProposal(updatedProposal);
        
        toast.success(t('Supporting documents uploaded successfully!'));
        
        // Reset form
        setSelectedDocFiles([]);
        setDocRemarks('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(t('Failed to find proposal.'));
      }
      setIsUploadingDoc(false);
    }, 1500);
  };

  if (!proposal) {
    return <div className="p-6 text-center">{t('Project not found')}</div>;
  }

  // Filter ERP documents for this vendor and Tender
  const erpDocuments = mockERPDocuments.filter(doc => doc.tenderId === proposal.tenderId && doc.vendorId === proposal.vendorId);
  const vendorReviews = mockVendorReviews.filter(review => review.tenderId === proposal.tenderId && review.vendorId === proposal.vendorId);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      paid: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      delivered: { bg: '#E0E7FF', text: '#6366F1' }
    };
    return colors[status] || colors.pending;
  };

  // Get active display rating, falling back to default mockup rating if no rating exists
  const getDisplayRating = () => {
    if (localRating) return localRating;
    if (vendorReviews.length > 0) return null; // use standard reviews list
    
    // Fallback mockup rating values for approved projects
    return {
      q1Remark: 'Excellent work layout matching FNRC green space standards.',
      q1Rating: 5,
      q2Remark: 'Vendor has relevant fit-out experience at public offices.',
      q2Rating: 4,
      q3Remark: 'Perfect financial capability showing robust project reserves.',
      q3Rating: 5,
      overallRating: 5,
      comments: 'Outstanding fit-out and layout diagrams. Highly recommended.',
      submittedBy: 'Fatima Al Hammadi',
      submittedAt: '2026-04-18T16:30:00.000Z'
    };
  };

  const displayRating = getDisplayRating();

  return (
    <div className="space-y-6 text-start">
      <Button
        variant="ghost"
        onClick={() => navigate('/vendor/projects')}
        className="gap-2 cursor-pointer"
      >
        <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
        {t('Back to Projects')}
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
            {proposal.id}
          </h1>
        </div>
      </div>

      {/* Tab Structure */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-0">
        <TabsList className="flex w-full border-b border-gray-200 gap-8 overflow-x-auto overflow-y-hidden bg-transparent scrollbar-hide">
          <TabsTrigger 
            value="submitted" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t('Proposal Details')}
          </TabsTrigger>

          <TabsTrigger 
            value="documents" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t('Documents')}
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t('Reviews')}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROPOSAL DETAILS */}
        <TabsContent value="submitted" className="mt-4">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="submitted"
            onProposalUpdate={handleProposalUpdate}
          />
        </TabsContent>



        {/* TAB 3: DOCUMENTS */}
        <TabsContent value="documents" className="mt-4 space-y-6">
          {/* ERP Synced Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-start">
                <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                {t('ERP Documents')}
              </CardTitle>
              <CardDescription className="text-start">{t('LPO, Invoices, and other ERP synced documents (Read-only)')}</CardDescription>
            </CardHeader>
            <CardContent>
              {erpDocuments.length > 0 ? (
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: '#F7F9FC' }}>
                        <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Document Type')}</TableHead>
                        <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Document Number')}</TableHead>
                        <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Date')}</TableHead>
                        <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Amount')}</TableHead>
                        <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Status')}</TableHead>
                        <TableHead className="font-semibold text-end pe-6" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {erpDocuments.map((doc) => {
                        const statusColor = getStatusColor(doc.status);
                        return (
                          <TableRow key={doc.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableCell className="font-medium text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                              {t(doc.documentType)}
                            </TableCell>
                            <TableCell className="text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                              {doc.documentNumber}
                            </TableCell>
                            <TableCell className="text-start" style={{ color: 'var(--fnrc-text-muted)' }}>
                              {formatDate(doc.date, language)}
                            </TableCell>
                            <TableCell className="text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                              {doc.amount ? `${t('AED')} ${doc.amount.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-start">
                              <Badge 
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                              >
                                {t(formatStatus(doc.status))}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-end pe-6">
                              <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => toast.info(`${t('Downloading')} ${doc.documentNumber}...`)}>
                                <Download className={`mr-2 h-4 w-4 ${language === 'ar' ? 'ml-2 mr-0 scale-x-[-1]' : ''}`} />
                                {t('Download')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <FileText className="h-12 w-12 mx-auto mb-4 animate-bounce" style={{ color: 'var(--fnrc-border-gray)' }} />
                  <p className="text-lg font-medium mb-2 text-center" style={{ color: 'var(--fnrc-text-dark)' }}>
                    {t('No documents available')}
                  </p>
                  <p className="text-sm text-center">
                    {t('ERP documents will appear here once they are synced')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Supporting Documents Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-start">
                <UploadCloud className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                {t('Vendor Supporting Documents')}
              </CardTitle>
              <CardDescription className="text-start">
                {t('Upload supporting files such as Bank Guarantee, signed contracts, security clearances, or extra clarifications.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* List of uploaded supporting documents */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                  {t('Uploaded Supporting Documents')}
                </h3>
                
                {proposal.uploadedDocuments && proposal.uploadedDocuments.length > 0 ? (
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: '#F7F9FC' }}>
                          <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Document Name')}</TableHead>
                          <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Uploaded Date')}</TableHead>
                          <TableHead className="font-semibold text-start" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Remarks')}</TableHead>
                          <TableHead className="font-semibold text-end pe-6" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {proposal.uploadedDocuments.map((doc, idx) => (
                          <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableCell className="font-medium flex items-center gap-2 text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                              <Paperclip className="h-4 w-4 shrink-0" style={{ color: 'var(--fnrc-primary-green)' }} />
                              <span>{doc.name}</span>
                            </TableCell>
                            <TableCell className="text-start" style={{ color: 'var(--fnrc-text-muted)' }}>
                              {formatDate(doc.uploadedDate, language)}
                            </TableCell>
                            <TableCell className="text-sm text-start" style={{ color: 'var(--fnrc-text-dark)' }}>
                              {t(doc.remarks)}
                            </TableCell>
                            <TableCell className="text-end pe-6">
                              <Button size="sm" variant="outline" className="h-8 gap-1 cursor-pointer" onClick={() => toast.info(`${t('Downloading')} ${doc.name}...`)}>
                                <Download className={`h-3 w-3 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
                                {t('Download')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-lg border border-dashed" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground text-center">
                      {t('No supporting documents uploaded yet')}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Upload Section */}
              <div className="space-y-4 text-start">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  {t('Upload New Supporting Document')}
                </h3>
                
                {/* Dashed Drag/Drop File Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50/50 transition-all flex flex-col items-center justify-center gap-2 group" 
                  style={{ borderColor: 'var(--fnrc-border-gray)' }}
                >
                  <input 
                    type="file" 
                    multiple
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedDocFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:scale-110 transition-transform" style={{ color: 'var(--fnrc-primary-green)' }} />
                  {selectedDocFiles.length > 0 ? (
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                        <Paperclip className="h-4 w-4 shrink-0" /> {selectedDocFiles.length} {t('files selected')}
                      </p>
                      <ul className="text-xs text-muted-foreground">
                        {selectedDocFiles.map((file, i) => (
                          <li key={i}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {t('Click to choose supporting documents')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('PDF, DOCX, XLSX, JPG, or PNG up to 10MB')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Remarks input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('Remarks / Explanations')}
                  </label>
                  <Textarea 
                    placeholder={t("Add remarks explaining this upload (e.g. 'Bank Guarantee for Proposal PROP-101', 'NDA Signed Agreement')")} 
                    value={docRemarks} 
                    onChange={(e) => setDocRemarks(e.target.value)}
                    className="min-h-[80px] text-start"
                    style={{ borderColor: 'var(--fnrc-border-gray)' }}
                  />
                </div>

                {/* Submit Upload Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleUploadSupportingDoc} 
                    disabled={isUploadingDoc || selectedDocFiles.length === 0}
                    className="gap-2 font-bold text-white transition-all duration-300 cursor-pointer"
                    style={{ 
                      backgroundColor: (isUploadingDoc || selectedDocFiles.length === 0) ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)'
                    }}
                  >
                    {isUploadingDoc ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {t('Uploading...')}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        {t('Upload Document')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: REVIEWS */}
        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-start">
                <Award className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
                {t('Performance Reviews')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {displayRating ? (
                <div className="space-y-6">
                  <div className="rounded-lg border p-6 bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider text-start">
                        {t('Reviewed by')} {getReviewerRoleName(displayRating.submittedBy || 'Admin')} {t('on')} {formatDate(displayRating.submittedAt, language)}
                      </div>
                    </div>

                    {/* Questions & Answers List */}
                    <div className="space-y-4">
                      {[
                        { 
                          label: t("How would you rate the vendor's technical capability?"), 
                          value: t(displayRating.q1Remark),
                          rating: displayRating.q1Rating
                        },
                        { 
                          label: t("Does the vendor have relevant experience in the required domain?"), 
                          value: t(displayRating.q2Remark),
                          rating: displayRating.q2Rating
                        },
                        { 
                          label: t("Rate the vendor's financial stability."), 
                          value: t(displayRating.q3Remark),
                          rating: displayRating.q3Rating
                        }
                      ].map((q, i) => (
                        <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2 text-start">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">{q.label}</span>
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm shrink-0">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-black text-gray-800">{q.rating || '-'} / 5</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600 bg-white p-3 rounded-md border border-gray-100">{q.value || t("No remarks provided.")}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dedicated Remarks */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-start">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">{t('Overall Comments & Rating')}</h4>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm shrink-0">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-black text-amber-700">{displayRating.overallRating || '-'} / 5</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white">
                        {t(displayRating.comments) || t("No overall comments provided.")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : vendorReviews.length > 0 ? (
                <div className="space-y-6">
                  {vendorReviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="rounded-lg border p-6 bg-white" 
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider text-start">
                          {t('Reviewed by')} {getReviewerRoleName(review.reviewedBy)} {t('on')} {formatDate(review.reviewDate, language)}
                        </div>
                      </div>

                      {/* Questions & Answers List */}
                      <div className="space-y-4">
                        {[
                          { 
                            label: t("How would you rate the vendor's technical capability?"), 
                            value: t("Vendor demonstrated strong technical capability and adherence to the Tender technical requirements."),
                            rating: 5
                          },
                          { 
                            label: t("Does the vendor have relevant experience in the required domain?"), 
                            value: t("Yes, the vendor has extensive previous experience completing similar projects successfully."),
                            rating: 5
                          },
                          { 
                            label: t("Rate the vendor's financial stability."), 
                            value: t("Financially stable and capable of handling the proposed project scale without advanced payments."),
                            rating: 4
                          }
                        ].map((q, i) => (
                          <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2 text-start">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">{q.label}</span>
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm shrink-0">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-black text-gray-800">{q.rating} / 5</span>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 bg-white p-3 rounded-md border border-gray-100">{q.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dedicated Remarks */}
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-start">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">{t('Overall Comments & Rating')}</h4>
                          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm shrink-0">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-700">5 / 5</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white">
                          {t(review.comments)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--fnrc-border-gray)' }} />
                  <p className="text-lg font-medium mb-2 text-center" style={{ color: 'var(--fnrc-text-dark)' }}>
                    {t('No reviews yet')}
                  </p>
                  <p className="text-sm text-center">
                    {t('Reviews from FNRC will appear here once your performance is evaluated')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
