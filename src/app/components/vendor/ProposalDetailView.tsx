import { useState, useEffect } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Download, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, DollarSign, UploadCloud, AlertTriangle, Paperclip, RefreshCw, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { toast } from 'sonner';
import { mockProposals, saveProposalsToStorage } from '@/app/data/mockData';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

interface ProposalDetailViewProps {
  proposal: {
    id: string;
    rfpId: string;
    rfpTitle: string;
    status: string;
    submissionDate: string;
    commercialAmount: number;
    technicalProposal: string;
    remarks?: string;
    paymentTerms?: string;
  };
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBack?: () => void;
  viewMode?: 'submitted' | 'status' | 'all';
  onProposalUpdate?: (updatedProposal: any) => void;
}

export function ProposalDetailView({ 
  proposal, 
  showBackButton = true, 
  backButtonLabel = 'Back to Proposals',
  onBack,
  viewMode = 'all',
  onProposalUpdate
}: ProposalDetailViewProps) {
  const navigate = useNavigate();

  // Local state for proposal data and resubmission interaction
  const [proposalState, setProposalState] = useState(proposal);
  const [editedTechnical, setEditedTechnical] = useState(proposal.technicalProposal);
  const [editedAmount, setEditedAmount] = useState(proposal.commercialAmount);
  const [editedPaymentTerms, setEditedPaymentTerms] = useState(proposal.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('Technical_Proposal_v1.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if proposal prop changes
  useEffect(() => {
    setProposalState(proposal);
    setEditedTechnical(proposal.technicalProposal);
    setEditedAmount(proposal.commercialAmount);
    setEditedPaymentTerms(proposal.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)');
    setSelectedFile(null);
    if (proposal.id === 'PROP-102' && proposal.status === 'technical_review') {
      setUploadedFileName('Technical_Proposal_v2.pdf');
    } else {
      setUploadedFileName('Technical_Proposal_v1.pdf');
    }
  }, [proposal]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      technical_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      technical_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      commercial_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      selected: { bg: '#D1FAE5', text: 'var(--fnrc-success)' }
    };
    return colors[status] || colors.submitted;
  };

  const statusColor = getStatusColor(proposalState.status);

  // Determine current step index for the 7-stage proposal lifecycle:
  // 1. Proposal Submitted (Index 0)
  // 2. Evaluation Started (Index 1)
  // 3. Evaluation Approved/Rejected (Index 2)
  // 4. Final Decision (Index 3)
  const getCurrentStepIndex = (status: string) => {
    const statusMap: Record<string, number> = {
      submitted: 0,
      
      technical_review: 1,
      technical_review_started: 1,
      under_review: 1,
      commercial_review_started: 1,
      
      technical_correction_requested: 2,
      technical_review_completed: 2,
      technical_review_approved: 2,
      technical_review_rejected: 2,
      commercial_correction_requested: 2,
      commercial_review_completed: 2,
      commercial_review_approved: 2,
      commercial_review_rejected: 2,
      correction_requested: 2,
      
      approved: 3,
      rejected: 3,
      shortlisted: 3,
      selected: 3
    };
    
    return statusMap[status] !== undefined ? statusMap[status] : 0;
  };

  const currentStepIndex = getCurrentStepIndex(proposalState.status);
  const isRejected = proposalState.status === 'rejected';

  // Dynamic step generator representing the 4 stages of proposal flow with outcomes
  const getDynamicSteps = () => {
    // 1. Proposal Submitted
    const step0 = { label: 'Proposal Submitted', index: 0, desc: 'Proposal Submitted successfully', status: 'completed' as const };
    
    // 2. Evaluation Started
    const isEvalStarted = currentStepIndex >= 1;
    const step1 = {
      label: 'Evaluation Started',
      index: 1,
      desc: isEvalStarted ? 'Evaluation in progress' : 'Pending evaluation',
      status: currentStepIndex > 1 ? ('completed' as const) : (currentStepIndex === 1 ? ('current' as const) : ('pending' as const))
    };

    // 3. Evaluation Approved / Rejected
    let step2Label = 'Evaluation Outcome';
    let step2Desc = 'Pending completion';
    let step2Status: 'completed' | 'current' | 'warning' | 'error' | 'pending' = 'pending';
    
    const isTechRejected = proposalState.technicalStatus === 'rejected' || proposalState.status === 'technical_review_rejected';
    const isCommRejected = proposalState.commercialStatus === 'rejected' || proposalState.status === 'commercial_review_rejected';
    const isOverallRejected = proposalState.status === 'rejected';
    
    const isTechApproved = proposalState.technicalStatus === 'approved' || proposalState.status === 'technical_review_completed';
    const isCommApproved = proposalState.commercialStatus === 'approved' || proposalState.status === 'commercial_review_completed';
    const isOverallApproved = ['approved', 'shortlisted', 'selected'].includes(proposalState.status);

    if (isTechRejected || isCommRejected || isOverallRejected) {
      step2Label = 'Evaluation Rejected';
      step2Desc = 'Rejected during evaluation phase';
      step2Status = 'error';
    } else if ((isTechApproved && isCommApproved) || isOverallApproved) {
      step2Label = 'Evaluation Approved';
      step2Desc = 'Approved by evaluators';
      step2Status = 'completed';
    } else if (proposalState.status.includes('correction_requested') || proposalState.technicalStatus === 'correction_requested' || proposalState.commercialStatus === 'correction_requested') {
      step2Label = 'Evaluation Outcome';
      step2Desc = 'Correction requested';
      step2Status = 'warning';
    } else if (currentStepIndex === 2) {
      step2Label = 'Evaluation Outcome';
      step2Desc = 'Pending outcome';
      step2Status = 'current';
    }

    const step2 = { label: step2Label, index: 2, desc: step2Desc, status: step2Status };

    // 4. Final Decision
    let step3Label = 'Final Decision';
    let step3Desc = 'Pending decision';
    let step3Status: 'completed' | 'current' | 'error' | 'pending' = 'pending';

    if (proposalState.status === 'rejected') {
      step3Label = 'Proposal Rejected';
      step3Desc = 'Proposal rejected by procurement';
      step3Status = 'error';
    } else if (['approved', 'shortlisted', 'selected'].includes(proposalState.status)) {
      step3Label = 'Proposal Approved';
      step3Desc = 'Proposal approved by procurement';
      step3Status = 'completed';
    } else if (currentStepIndex === 3) {
      step3Status = 'current';
    }

    const step3 = { label: step3Label, index: 3, desc: step3Desc, status: step3Status };

    return [step0, step1, step2, step3];
  };

  const progressSteps = getDynamicSteps();

  // Dynamic activity log based on status
  const getActivityLog = () => {
    const logs = [
      {
        action: 'Proposal Submitted',
        performedBy: 'System',
        date: proposalState.submissionDate,
        time: '10:30 AM',
        remarks: '—'
      }
    ];

    if (proposalState.status === 'submitted') return logs;

    if (proposalState.status === 'technical_correction_requested') {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Technical Evaluator',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
      logs.push({
        action: 'Correction Requested',
        performedBy: 'Technical Evaluator',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: proposalState.remarks || 'Clarification needed on failover mechanisms.'
      });
      return logs;
    }

    if (proposalState.id === 'PROP-102' && proposalState.status === 'technical_review') {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Technical Evaluator',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
      logs.push({
        action: 'Correction Requested',
        performedBy: 'Technical Evaluator',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: 'Clarification needed on failover mechanisms.'
      });
      logs.push({
        action: 'Technical Proposal Resubmitted',
        performedBy: 'Vendor (Self)',
        date: '2026-05-20',
        time: '06:50 PM',
        remarks: 'Resubmitted with updated multi-zone failover architecture description and document.'
      });
      return logs;
    }

    logs.push({
      action: 'Technical Review Started',
      performedBy: 'Technical Evaluator',
      date: '2026-02-12',
      time: '09:00 AM',
      remarks: 'Technical proposal review initiated'
    });

    if (proposalState.status === 'technical_review') return logs;

    if (proposalState.status === 'rejected') {
      logs.push({
        action: 'Proposal Rejected',
        performedBy: 'Procurement Manager',
        date: '2026-02-20',
        time: '11:45 AM',
        remarks: proposalState.remarks || 'Proposal did not meet requirements'
      });
      return logs;
    }

    // Shortlisted status
    logs.push(
      {
        action: 'Technical Proposal Approved',
        performedBy: 'Technical Evaluator',
        date: '2026-02-15',
        time: '02:45 PM',
        remarks: 'All technical requirements met. Score: 85/100'
      },
      {
        action: 'Commercial Review Started',
        performedBy: 'Commercial Evaluator',
        date: '2026-02-16',
        time: '11:00 AM',
        remarks: 'Commercial proposal under evaluation'
      },
      {
        action: 'Commercial Proposal Approved',
        performedBy: 'Commercial Evaluator',
        date: '2026-02-18',
        time: '04:30 PM',
        remarks: 'Pricing aligned with budget. Recommended for shortlisting'
      },
      {
        action: 'Proposal Shortlisted',
        performedBy: 'Procurement Manager',
        date: '2026-02-20',
        time: '10:00 AM',
        remarks: 'Selected for final evaluation round'
      }
    );

    return logs;
  };

  const activityLog = getActivityLog();

  const getProgressStatusText = () => {
    const statusText: Record<string, string> = {
      submitted: 'Your proposal has been submitted and is awaiting review',
      technical_review: 'Your technical proposal is currently under review by our evaluators',
      technical_correction_requested: 'Attention Required: The evaluation team has requested corrections on your technical proposal',
      under_review: 'Your proposal is currently under commercial evaluation',
      shortlisted: 'Congratulations! Your proposal has been shortlisted',
      rejected: 'Your proposal was not selected for this RFP'
    };
    return statusText[proposalState.status] || 'Processing your proposal';
  };

  const handleResubmitProposal = async () => {
    if (!editedTechnical.trim()) {
      toast.error('Please enter the updated technical approach details.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API upload & saving delay
    setTimeout(() => {
      // 1. Update the proposal in our mockProposals data array
      const targetIdx = mockProposals.findIndex(p => p.id === proposalState.id);
      if (targetIdx !== -1) {
        mockProposals[targetIdx].technicalProposal = editedTechnical;
        mockProposals[targetIdx].status = 'technical_review';
        mockProposals[targetIdx].technicalStatus = 'under_review';
        
        // Remove or clear remarks
        mockProposals[targetIdx].remarks = undefined;
        
        // Save to localStorage
        saveProposalsToStorage(mockProposals);
        
        const updatedProposal = {
          ...proposalState,
          status: 'technical_review' as const,
          technicalProposal: editedTechnical,
          remarks: undefined
        };

        // Update local React state to trigger immediate UI transition
        setProposalState(updatedProposal);
        
        // Propagate state update to the parent component
        if (onProposalUpdate) {
          onProposalUpdate(updatedProposal);
        }
        
        // If a file was uploaded, set the filename state
        if (selectedFile) {
          setUploadedFileName(selectedFile.name);
        } else {
          setUploadedFileName('Technical_Proposal_v2.pdf'); // Fallback premium name
        }
        
        toast.success('Technical proposal successfully updated and resubmitted for review!');
      } else {
        toast.error('Failed to find proposal record.');
      }
      
      setIsSubmitting(false);
    }, 1200);
  };

  const handleResubmitCommercial = async () => {
    if (editedAmount <= 0) {
      toast.error('Please enter a valid commercial amount.');
      return;
    }
    if (!editedPaymentTerms.trim()) {
      toast.error('Please enter the payment terms.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API upload & saving delay
    setTimeout(() => {
      // 1. Update the proposal in our mockProposals data array
      const targetIdx = mockProposals.findIndex(p => p.id === proposalState.id);
      if (targetIdx !== -1) {
        mockProposals[targetIdx].commercialAmount = editedAmount;
        mockProposals[targetIdx].paymentTerms = editedPaymentTerms;
        mockProposals[targetIdx].status = 'commercial_review_started';
        mockProposals[targetIdx].commercialStatus = 'under_review';
        
        // Remove or clear remarks
        mockProposals[targetIdx].remarks = undefined;
        
        // Save to localStorage
        saveProposalsToStorage(mockProposals);
        
        const updatedProposal = {
          ...proposalState,
          status: 'commercial_review_started' as const,
          commercialAmount: editedAmount,
          paymentTerms: editedPaymentTerms,
          remarks: undefined
        };

        // Update local React state to trigger immediate UI transition
        setProposalState(updatedProposal);
        
        // Propagate state update to the parent component
        if (onProposalUpdate) {
          onProposalUpdate(updatedProposal);
        }
        
        toast.success('Commercial proposal successfully updated and resubmitted for review!');
      } else {
        toast.error('Failed to find proposal record.');
      }
      
      setIsSubmitting(false);
    }, 1200);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/vendor/proposals');
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: PROPOSAL SUMMARY (Always show in both) */}
      <Card style={{ borderColor: isRejected ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)', borderWidth: '2px' }}>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Proposal ID</div>
              <div 
                className="font-semibold cursor-pointer hover:underline" 
                style={{ color: 'var(--fnrc-primary-green)' }}
                onClick={() => navigate(`/vendor/proposals/${proposalState.id}`)}
              >
                {proposalState.id}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>RFP Title</div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>{proposalState.rfpTitle}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Status</div>
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: statusColor.bg,
                  color: statusColor.text
                }}
              >
                {proposalState.status === 'technical_correction_requested' 
                  ? 'Technical Correction Requested' 
                  : proposalState.status === 'technical_review'
                  ? 'Technical Review'
                  : proposalState.status === 'under_review'
                  ? 'Under Review'
                  : proposalState.status.charAt(0).toUpperCase() + proposalState.status.slice(1)}
              </Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Submission Date</div>
              <div style={{ color: 'var(--fnrc-text-dark)' }}>{new Date(proposalState.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Commercial Amount</div>
              <div className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>AED {proposalState.commercialAmount.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION: WHAT WAS SUBMITTED CONTENT (Proposal Details) */}
      {(viewMode === 'all' || viewMode === 'submitted') && (
        <div className="space-y-6">
          {/* Technical Proposal Card - conditional editor zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Technical Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposalState.status === 'technical_correction_requested' ? (
                <div className="space-y-6">
                  {/* Warning Alert with Admin Remarks */}
                  <div 
                    className="flex gap-3 rounded-lg border p-4 text-sm"
                    style={{ 
                      backgroundColor: '#FEF3C7', 
                      borderColor: '#F59E0B', 
                      color: 'var(--fnrc-text-dark)' 
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" style={{ color: '#D97706' }} />
                    <div className="space-y-1">
                      <div className="font-semibold text-[#B45309]">Correction Required by Reviewer</div>
                      <p className="leading-relaxed text-[#78350F]">
                        {proposalState.remarks || 'Reviewer has requested corrections on your technical proposal.'}
                      </p>
                    </div>
                  </div>

                  {/* Textarea for editing Technical Approach */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block" style={{ color: 'var(--fnrc-text-dark)' }}>
                      Modify Technical Approach Statement <span className="text-[var(--fnrc-error)]">*</span>
                    </label>
                    <textarea
                      value={editedTechnical}
                      onChange={(e) => setEditedTechnical(e.target.value)}
                      rows={8}
                      className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--fnrc-primary-green)] transition-all bg-white"
                      style={{ 
                        borderColor: 'var(--fnrc-border-gray)',
                        color: 'var(--fnrc-text-dark)',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Enter detailed technical architecture, multi-zone failover mechanisms, and system configurations here..."
                    />
                  </div>

                  {/* File Upload zone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block" style={{ color: 'var(--fnrc-text-dark)' }}>
                      Replace Technical Proposal Document <span className="text-[var(--fnrc-text-muted)]">(PDF, Max 10MB)</span>
                    </label>
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50/50"
                      style={{ 
                        borderColor: selectedFile ? 'var(--fnrc-primary-green)' : 'var(--fnrc-border-gray)',
                        backgroundColor: 'var(--fnrc-bg-light)'
                      }}
                      onClick={() => document.getElementById('technical-file-input')?.click()}
                    >
                      <input
                        id="technical-file-input"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                      <UploadCloud className="h-10 w-10 mb-2" style={{ color: selectedFile ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)' }} />
                      {selectedFile ? (
                        <div className="text-center space-y-1">
                          <span className="text-sm font-semibold text-[var(--fnrc-primary-green)] flex items-center justify-center gap-1">
                            <Paperclip className="h-4 w-4" /> {selectedFile.name}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <span className="text-sm font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                            Drag and drop or <span className="text-[var(--fnrc-primary-green)] underline">browse</span> to upload file
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            Recommend uploading: Technical_Proposal_v2.pdf
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditedTechnical(proposalState.technicalProposal)}
                      disabled={isSubmitting}
                    >
                      Reset Changes
                    </Button>
                    <Button
                      type="button"
                      className="transition-all active:scale-[0.98] font-semibold text-white shadow-md hover:opacity-95"
                      style={{ 
                        backgroundColor: 'var(--fnrc-primary-green)',
                      }}
                      onClick={handleResubmitProposal}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Resubmitting...
                        </>
                      ) : (
                        'Resubmit Technical Proposal'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--fnrc-text-muted)' }}>Technical Approach</h4>
                    <div className="rounded-lg border p-4 bg-gray-50" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {proposalState.technicalProposal}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commercial Proposal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Commercial Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {proposalState.status === 'commercial_correction_requested' || proposalState.status === 'correction_requested' ? (
                <div className="space-y-6">
                  {/* Warning Alert with Admin Remarks */}
                  <div 
                    className="flex gap-3 rounded-lg border p-4 text-sm"
                    style={{ 
                      backgroundColor: '#FEF3C7', 
                      borderColor: '#F59E0B', 
                      color: 'var(--fnrc-text-dark)' 
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" style={{ color: '#D97706' }} />
                    <div className="space-y-1">
                      <div className="font-semibold text-[#B45309]">Commercial Correction Required by Reviewer</div>
                      <p className="leading-relaxed text-[#78350F]">
                        {proposalState.remarks || 'Reviewer has requested corrections on your commercial proposal details.'}
                      </p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Modify Commercial Bid Amount (AED) <span className="text-[var(--fnrc-error)]">*</span>
                      </label>
                      <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(Number(e.target.value))}
                        className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--fnrc-primary-green)] transition-all bg-white"
                        style={{ 
                          borderColor: 'var(--fnrc-border-gray)',
                          color: 'var(--fnrc-text-dark)'
                        }}
                        placeholder="Enter modified amount in AED"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Modify Payment Terms <span className="text-[var(--fnrc-error)]">*</span>
                      </label>
                      <textarea
                        value={editedPaymentTerms}
                        onChange={(e) => setEditedPaymentTerms(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--fnrc-primary-green)] transition-all bg-white"
                        style={{ 
                          borderColor: 'var(--fnrc-border-gray)',
                          color: 'var(--fnrc-text-dark)',
                          fontFamily: 'inherit'
                        }}
                        placeholder="Enter payment terms detail..."
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Live Cost Breakdown Preview */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>Updated Cost Breakdown Preview</h4>
                    <div className="border rounded-lg overflow-hidden bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <Table>
                        <TableHeader className="bg-gray-50/80">
                          <TableRow className="border-b hover:bg-gray-50/80" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider w-[40%]">Description</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-center w-[20%]">Unit Price (AED)</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-center w-[20%]">Quantity</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-right w-[20%] pr-4">Amount (AED)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { desc: 'Core Services & Implementation (70%)', amt: editedAmount * 0.7 },
                            { desc: 'Support & Maintenance (Annual) (20%)', amt: editedAmount * 0.2 },
                            { desc: 'Contingency & Other Expenses (10%)', amt: editedAmount * 0.1 }
                          ].map((item, i) => (
                            <TableRow key={i} className="border-b bg-white hover:bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                              <TableCell className="p-3">
                                <Input 
                                  value={item.desc} 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3">
                                <Input 
                                  value={(item.amt / 1).toFixed(2)} 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm text-right focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3">
                                <Input 
                                  value="1" 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm text-center focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3 text-right">
                                <div className="h-9 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-end px-3 text-gray-500 text-sm shadow-inner">
                                  {item.amt.toFixed(2)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="p-4 border-t bg-gray-50/50 flex justify-end items-center gap-6" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                        <span className="font-bold text-sm text-gray-700">Total Proposal Amount</span>
                        <span className="font-bold text-lg text-[var(--fnrc-primary-green)]">
                          AED {editedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditedAmount(proposalState.commercialAmount);
                        setEditedPaymentTerms(proposalState.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)');
                      }}
                      disabled={isSubmitting}
                    >
                      Reset Changes
                    </Button>
                    <Button
                      type="button"
                      className="transition-all active:scale-[0.98] font-semibold text-white shadow-md hover:opacity-95"
                      style={{ 
                        backgroundColor: 'var(--fnrc-primary-green)',
                      }}
                      onClick={handleResubmitCommercial}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Resubmitting...
                        </>
                      ) : (
                        'Resubmit Commercial Proposal'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Total Proposed Amount</h4>
                      <div className="text-2xl font-bold" style={{ color: 'var(--fnrc-text-dark)' }}>
                        AED {proposalState.commercialAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Payment Terms</h4>
                      <p className="text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {proposalState.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>Cost Breakdown</h4>
                    <div className="border rounded-lg overflow-hidden bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <Table>
                        <TableHeader className="bg-gray-50/80">
                          <TableRow className="border-b hover:bg-gray-50/80" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider w-[40%]">Description</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-center w-[20%]">Unit Price (AED)</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-center w-[20%]">Quantity</TableHead>
                            <TableHead className="font-bold text-[10px] text-gray-600 uppercase tracking-wider text-right w-[20%] pr-4">Amount (AED)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { desc: 'Core Services & Implementation', amt: proposalState.commercialAmount * 0.7 },
                            { desc: 'Support & Maintenance (Annual)', amt: proposalState.commercialAmount * 0.2 },
                            { desc: 'Contingency & Other Expenses', amt: proposalState.commercialAmount * 0.1 }
                          ].map((item, i) => (
                            <TableRow key={i} className="border-b bg-white hover:bg-white" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                              <TableCell className="p-3">
                                <Input 
                                  value={item.desc} 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3">
                                <Input 
                                  value={(item.amt / 1).toFixed(2)} 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm text-right focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3">
                                <Input 
                                  value="1" 
                                  readOnly 
                                  className="h-9 border-gray-200 bg-white text-gray-700 shadow-sm text-center focus-visible:ring-0 cursor-default" 
                                />
                              </TableCell>
                              <TableCell className="p-3 text-right">
                                <div className="h-9 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-end px-3 text-gray-500 text-sm shadow-inner">
                                  {item.amt.toFixed(2)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="p-4 border-t bg-gray-50/50 flex justify-end items-center gap-6" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                        <span className="font-bold text-sm text-gray-700">Total Proposal Amount</span>
                        <span className="font-bold text-lg text-[var(--fnrc-primary-green)]">
                          AED {proposalState.commercialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technical Document</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate pr-2">{uploadedFileName}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commercial Document</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate pr-2">Commercial_Proposal_v1.pdf</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Other Supporting Documents</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate pr-2">Company_Profile.pdf</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: VISUAL STATUS PROGRESS */}
      {(viewMode === 'all' || viewMode === 'status') && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Progress</CardTitle>
            <CardDescription>{getProgressStatusText()}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step-based Progress Tracker */}
            <div className="relative">
              {/* Progress bar background */}
              <div className="absolute top-5 left-0 right-0 h-1" style={{ backgroundColor: 'var(--fnrc-border-gray)' }}></div>
              {/* Progress bar fill */}
              <div 
                className="absolute top-5 left-0 h-1 transition-all duration-500" 
                style={{ 
                  backgroundColor: 'var(--fnrc-success)', 
                  width: proposalState.status === 'submitted' ? '0%' : `${(currentStepIndex / (progressSteps.length - 1)) * 100}%`
                }}
              ></div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {progressSteps.map((step) => {
                  // Determine premium theme colors and icons dynamically per step status
                  const getStepTheme = (status: 'completed' | 'current' | 'warning' | 'error' | 'pending') => {
                    switch (status) {
                      case 'completed':
                        return {
                          bg: 'var(--fnrc-success)',
                          border: 'var(--fnrc-success)',
                          icon: <CheckCircle className="h-5 w-5 text-white" />,
                          glow: 'none',
                          labelColor: 'var(--fnrc-text-dark)',
                          descColor: 'var(--fnrc-success)',
                          opacity: 1
                        };
                      case 'current':
                        return {
                          bg: '#EFF6FF',
                          border: 'var(--fnrc-info)',
                          icon: <Clock className="h-5 w-5" style={{ color: 'var(--fnrc-info)' }} />,
                          glow: '0 0 0 4px rgba(59, 130, 246, 0.15)',
                          labelColor: 'var(--fnrc-text-dark)',
                          descColor: 'var(--fnrc-info)',
                          opacity: 1
                        };
                      case 'warning':
                        return {
                          bg: '#FFFBEB',
                          border: '#F59E0B',
                          icon: <AlertTriangle className="h-5 w-5 text-[#D97706]" />,
                          glow: '0 0 0 4px rgba(245, 158, 11, 0.25)',
                          labelColor: 'var(--fnrc-text-dark)',
                          descColor: '#D97706',
                          opacity: 1
                        };
                      case 'error':
                        return {
                          bg: '#FEE2E2',
                          border: '#EF4444',
                          icon: <AlertCircle className="h-5 w-5 text-[#DC2626]" />,
                          glow: '0 0 0 4px rgba(239, 68, 68, 0.25)',
                          labelColor: 'var(--fnrc-text-dark)',
                          descColor: '#DC2626',
                          opacity: 1
                        };
                      case 'pending':
                      default:
                        return {
                          bg: 'white',
                          border: 'var(--fnrc-border-gray)',
                          icon: <Clock className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />,
                          glow: 'none',
                          labelColor: 'var(--fnrc-text-muted)',
                          descColor: 'var(--fnrc-text-muted)',
                          opacity: 0.6
                        };
                    }
                  };

                  const theme = getStepTheme(step.status);

                  return (
                    <div key={step.index} className="flex flex-col items-center" style={{ flex: 1 }}>
                      {/* Step circle */}
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 z-10 transition-all duration-300"
                        style={{
                          backgroundColor: theme.bg,
                          borderColor: theme.border,
                          boxShadow: theme.glow
                        }}
                      >
                        {theme.icon}
                      </div>
                      {/* Step label & description */}
                      <div className="mt-2 text-center max-w-[120px]" style={{ opacity: theme.opacity }}>
                        <div 
                          className="text-[11px] font-semibold leading-snug"
                          style={{ 
                            color: theme.labelColor
                          }}
                        >
                          {step.label}
                        </div>
                        <div 
                          className="text-[9px] mt-0.5 leading-tight font-medium"
                          style={{ 
                            color: theme.descColor
                          }}
                        >
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Latest Evaluation Remarks integrated here */}
            {proposalState.remarks && (
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4" style={{ color: 'var(--fnrc-accent-gold)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Latest Evaluation Remarks</span>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: '#FEF3C7' }}>
                  <p className="text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>{proposalState.remarks}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SECTION 3: ACTIVITY & DECISION LOG (ALWAYS VISIBLE) */}
      {(viewMode === 'all' || viewMode === 'status') && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Activity Log</CardTitle>
            <CardDescription>Complete history of actions performed on this proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                    <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
                    <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Performed By</TableHead>
                    <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Date & Time</TableHead>
                    <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((log, idx) => (
                    <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <TableCell className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                        {log.action}
                      </TableCell>
                      <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                        {log.performedBy}
                      </TableCell>
                      <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                        {log.date} {log.time}
                      </TableCell>
                      <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                        {log.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}