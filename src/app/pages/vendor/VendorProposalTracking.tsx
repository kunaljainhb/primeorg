import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { ArrowLeft, FileText, Download, Award, Star, History, RefreshCw, AlertTriangle, UploadCloud, Trash2, Paperclip, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockProposals, mockERPDocuments, saveProposalsToStorage, mockVendorReviews, mockAdminUsers } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { toast } from 'sonner';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const formatStatus = (statusStr?: string) => {
  if (!statusStr) return '';
  if (statusStr === 'technical_correction_requested') return 'Technical Correction Requested';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function VendorProposalTracking() {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const getReviewerRoleName = (name: string) => {
    const admin = mockAdminUsers.find(u => u.name === name);
    if (!admin) return 'Reviewer';
    return admin.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  
  // Wrap proposal in React state to ensure UI updates instantly on resubmit or simulation
  const [proposal, setProposal] = useState(() => {
    return mockProposals.find(p => p.id === proposalId);
  });
  
  const [activeTab, setActiveTab] = useState('status');
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  // States for Vendor Supporting Documents Upload
  const [docRemarks, setDocRemarks] = useState('');
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
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

  const handleStatusSimulate = (newStatus: 'technical_correction_requested' | 'technical_review') => {
    const targetIdx = mockProposals.findIndex(p => p.id === proposalId);
    if (targetIdx !== -1) {
      mockProposals[targetIdx].status = newStatus;
      if (newStatus === 'technical_correction_requested') {
        mockProposals[targetIdx].remarks = 'Technical proposal is missing detail about multi-zone failover mechanisms. Please provide specific redundant architecture details and update the technical document.';
        mockProposals[targetIdx].technicalProposal = 'Hybrid cloud solution using Azure Stack Hub'; // Reset to initial state
        mockProposals[targetIdx].technicalStatus = 'correction_requested';
      } else {
        mockProposals[targetIdx].remarks = undefined;
        mockProposals[targetIdx].technicalStatus = 'under_review';
      }
      saveProposalsToStorage(mockProposals);
      setProposal({ ...mockProposals[targetIdx] });
      toast.success(`Proposal status simulated to: ${newStatus === 'technical_correction_requested' ? 'Technical Correction Requested' : 'Technical Review'}`);
    }
  };

  const handleUploadSupportingDoc = () => {
    if (!selectedDocFile) {
      toast.error('Please select a document file to upload.');
      return;
    }
    
    setIsUploadingDoc(true);
    
    // Simulate API upload & saving delay
    setTimeout(() => {
      const targetIdx = mockProposals.findIndex(p => p.id === proposal.id);
      if (targetIdx !== -1) {
        const currentUploadedDocs = mockProposals[targetIdx].uploadedDocuments || [];
        
        const newDoc = {
          name: selectedDocFile.name,
          url: '#',
          remarks: docRemarks.trim() || 'No remarks provided.',
          uploadedDate: new Date().toISOString().split('T')[0]
        };
        
        const updatedDocs = [...currentUploadedDocs, newDoc];
        mockProposals[targetIdx].uploadedDocuments = updatedDocs;
        
        // Save back to localStorage
        saveProposalsToStorage(mockProposals);
        
        // Update local React states
        const updatedProposal = { ...mockProposals[targetIdx] };
        setProposal(updatedProposal);
        
        toast.success(`Supporting document "${selectedDocFile.name}" uploaded successfully!`);
        
        // Reset form
        setSelectedDocFile(null);
        setDocRemarks('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Failed to find proposal.');
      }
      setIsUploadingDoc(false);
    }, 1500);
  };

  if (!proposal) {
    return <div>Proposal not found</div>;
  }

  // Check if vendor is approved or rejected to show additional tabs
  const isApproved = proposal.status === 'approved' || proposal.status === 'selected';
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

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/vendor/proposals')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Proposals
      </Button>

      {proposal.id === 'PROP-102' && (
        <div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-sm"
          style={{ borderColor: 'var(--fnrc-border-gray)' }}
        >
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Demo Simulator Tool</div>
              <p className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
                Easily simulate review decisions and test the Technical Correction and resubmission workflow.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant={proposal.status === 'technical_correction_requested' ? 'default' : 'outline'}
              onClick={() => handleStatusSimulate('technical_correction_requested')}
              style={proposal.status === 'technical_correction_requested' ? { backgroundColor: '#F59E0B', color: 'white' } : { borderColor: '#F59E0B', color: '#D97706' }}
              className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
            >
              Set to Technical Correction Requested
            </Button>
            <Button 
              size="sm"
              variant={proposal.status === 'technical_review' ? 'default' : 'outline'}
              onClick={() => handleStatusSimulate('technical_review')}
              style={proposal.status === 'technical_review' ? { backgroundColor: 'var(--fnrc-primary-green)', color: 'white' } : { borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
              className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
            >
              Set to Under Review (Technical)
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
            {proposal.id}
          </h1>

        </div>
        <StatusBadge status={proposal.status} className="px-5 py-2 text-sm font-semibold" />
      </div>

      {/* Tab Structure */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-0">
        <TabsList className="flex w-full border-b border-gray-200 gap-8 overflow-x-auto overflow-y-hidden bg-transparent scrollbar-hide">
          <TabsTrigger 
            value="submitted" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            Proposal Details
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            Proposal Status
          </TabsTrigger>
          
          {/* Conditional tabs for approved/rejected vendors */}
          {isApproved && (
            <TabsTrigger 
              value="documents" 
              className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
            >
              Documents
            </TabsTrigger>
          )}

          <TabsTrigger 
            value="reviews" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            Reviews
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

        {/* TAB 2: PROPOSAL STATUS */}
        <TabsContent value="status" className="mt-4">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="status"
            onProposalUpdate={handleProposalUpdate}
          />
        </TabsContent>

        {/* TAB 2: DOCUMENTS (Only visible if approved) */}
        {isApproved && (
          <TabsContent value="documents" className="mt-4 space-y-6">
            {/* ERP Synced Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                  ERP Documents
                </CardTitle>
                <CardDescription>LPO, Invoices, and other ERP synced documents (Read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                {erpDocuments.length > 0 ? (
                  <div className="rounded-lg border" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: '#F7F9FC' }}>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Type</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Number</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Date</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Amount</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {erpDocuments.map((doc) => {
                          const statusColor = getStatusColor(doc.status);
                          return (
                            <TableRow key={doc.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                              <TableCell className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.documentType}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.documentNumber}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                                {formatDate(doc.date)}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.amount ? `AED ${doc.amount.toLocaleString()}` : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary"
                                  className="text-xs"
                                  style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                                >
                                  {formatStatus(doc.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
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
                    <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--fnrc-border-gray)' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                      No documents available
                    </p>
                    <p className="text-sm">
                      ERP documents will appear here once they are synced
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vendor Supporting Documents Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                  Vendor Supporting Documents
                </CardTitle>
                <CardDescription>
                  Upload supporting files such as Bank Guarantee, signed contracts, security clearances, or extra clarifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* List of uploaded supporting documents */}
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Uploaded Supporting Documents
                  </h3>
                  
                  {proposal.uploadedDocuments && proposal.uploadedDocuments.length > 0 ? (
                    <div className="rounded-lg border" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <Table>
                        <TableHeader>
                          <TableRow style={{ backgroundColor: '#F7F9FC' }}>
                            <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Name</TableHead>
                            <TableHead className="font-semibold animate-pulse-once" style={{ color: 'var(--fnrc-text-dark)' }}>Uploaded Date</TableHead>
                            <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Remarks</TableHead>
                            <TableHead className="font-semibold text-right" style={{ color: 'var(--fnrc-text-dark)' }}>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {proposal.uploadedDocuments.map((doc, idx) => (
                            <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                              <TableCell className="font-medium flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                                <Paperclip className="h-4 w-4" style={{ color: 'var(--fnrc-primary-green)' }} />
                                <span>{doc.name}</span>
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                                {formatDate(doc.uploadedDate)}
                              </TableCell>
                              <TableCell className="text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.remarks}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline" className="h-8 gap-1">
                                  <Download className="h-3 w-3" />
                                  Download
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
                      <p className="text-sm font-medium text-muted-foreground">
                        No supporting documents uploaded yet
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Upload New Supporting Document
                  </h3>
                  
                  {/* Dashed Drag/Drop File Upload Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50/50 transition-all flex flex-col items-center justify-center gap-2 group" 
                    style={{ borderColor: 'var(--fnrc-border-gray)' }}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedDocFile(e.target.files[0]);
                        }
                      }}
                    />
                    <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:scale-110 transition-transform" style={{ color: 'var(--fnrc-primary-green)' }} />
                    {selectedDocFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                          <Paperclip className="h-4 w-4" /> {selectedDocFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{(selectedDocFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                          Click to choose a supporting document
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, XLSX, JPG, or PNG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Remarks input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Remarks / Explanations
                    </label>
                    <Textarea 
                      placeholder="Add remarks explaining this upload (e.g. 'Bank Guarantee for Proposal PROP-101', 'NDA Signed Agreement')" 
                      value={docRemarks} 
                      onChange={(e) => setDocRemarks(e.target.value)}
                      className="min-h-[80px]"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    />
                  </div>

                  {/* Submit Upload Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleUploadSupportingDoc} 
                      disabled={isUploadingDoc || !selectedDocFile}
                      className="gap-2 font-bold text-white transition-all duration-300"
                      style={{ 
                        backgroundColor: (isUploadingDoc || !selectedDocFile) ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)',
                        cursor: (isUploadingDoc || !selectedDocFile) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isUploadingDoc ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Upload Document
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}


      {/* TAB 3: REVIEWS */}
      <TabsContent value="reviews" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
              Performance Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {localRating ? (
              <div className="space-y-6">
                <div className="rounded-lg border p-6 bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                      Reviewed by {getReviewerRoleName(localRating.submittedBy || 'Admin')} on {formatDate(localRating.submittedAt)}
                    </div>
                  </div>

                  {/* Questions & Answers List */}
                  <div className="space-y-4">
                    {[
                      { 
                        label: "How would you rate the vendor's technical capability?", 
                        value: localRating.q1Remark,
                        rating: localRating.q1Rating
                      },
                      { 
                        label: "Does the vendor have relevant experience in the required domain?", 
                        value: localRating.q2Remark,
                        rating: localRating.q2Rating
                      },
                      { 
                        label: "Rate the vendor's financial stability.", 
                        value: localRating.q3Remark,
                        rating: localRating.q3Rating
                      }
                    ].map((q, i) => (
                      <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">{q.label}</span>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-gray-800">{q.rating || '-'} / 5</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-white p-3 rounded-md border border-gray-100">{q.value || "No remarks provided."}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dedicated Remarks */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-extrabold text-gray-750 uppercase tracking-wider">Overall Comments & Rating</h4>
                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-black text-amber-700">{localRating.overallRating || '-'} / 5</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white">
                      {localRating.comments || "No overall comments provided."}
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
                      <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        Reviewed by {getReviewerRoleName(review.reviewedBy)} on {formatDate(review.reviewDate)}
                      </div>
                    </div>

                    {/* Questions & Answers List */}
                    <div className="space-y-4">
                      {[
                        { 
                          label: "How would you rate the vendor's technical capability?", 
                          value: "Vendor demonstrated strong technical capability and adherence to the Tender technical requirements.",
                          rating: 5
                        },
                        { 
                          label: "Does the vendor have relevant experience in the required domain?", 
                          value: "Yes, the vendor has extensive previous experience completing similar projects successfully.",
                          rating: 5
                        },
                        { 
                          label: "Rate the vendor's financial stability.", 
                          value: "Financially stable and capable of handling the proposed project scale without advanced payments.",
                          rating: 4
                        }
                      ].map((q, i) => (
                        <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">{q.label}</span>
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-black text-gray-800">{q.rating} / 5</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600 bg-white p-3 rounded-md border border-gray-100">{q.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dedicated Remarks */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-extrabold text-gray-750 uppercase tracking-wider">Overall Comments & Rating</h4>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-black text-amber-700">5 / 5</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white">
                        {review.comments}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--fnrc-border-gray)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                  No reviews yet
                </p>
                <p className="text-sm">
                  Reviews from FNRC will appear here once your performance is evaluated
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
