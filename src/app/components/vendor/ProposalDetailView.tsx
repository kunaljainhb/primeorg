import { useState, useEffect } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Download, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, DollarSign, UploadCloud, AlertTriangle, Paperclip, RefreshCw, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { toast } from 'sonner';
import { mockProposals, saveProposalsToStorage, mockTenders } from '@/app/data/mockData';
import { ProgressTimeline, TimelineStage } from '@/app/components/ui/progress-timeline';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useTranslation } from '@/app/context/LanguageContext';

interface ProposalDetailViewProps {
  proposal: {
    id: string;
    tenderId: string;
    tenderTitle: string;
    status: string;
    submissionDate: string;
    commercialAmount: number;
    technicalProposal: string;
    remarks?: string;
    paymentTerms?: string;
    technicalStatus?: string;
    commercialStatus?: string;
    technicalReviewer?: string;
    commercialReviewer?: string;
    technicalRemark?: string;
    commercialRemark?: string;
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
  const { t } = useTranslation();

  const getReviewStatusBadge = (status?: string) => {
    const norm = status || 'pending';
    const config: Record<string, { label: string; bg: string; text: string }> = {
      pending: { label: t('Pending'), bg: '#F3F4F6', text: '#6B7280' },
      submitted: { label: t('Submitted'), bg: '#E0F2FE', text: '#0369A1' },
      under_review: { label: t('Under Review'), bg: '#DBEAFE', text: '#1E40AF' },
      technical_review_started: { label: t('Technical Review Started'), bg: '#DBEAFE', text: '#1E40AF' },
      commercial_review_started: { label: t('Commercial Review Started'), bg: '#DBEAFE', text: '#1E40AF' },
      approved: { label: t('Approved'), bg: '#D1FAE5', text: '#065F46' },
      technical_approved: { label: t('Technical Approved'), bg: '#D1FAE5', text: '#065F46' },
      commercial_approved: { label: t('Commercial Approved'), bg: '#D1FAE5', text: '#065F46' },
      technical_proposal_resubmits: { label: t('Technical Proposal Resubmits'), bg: '#DBEAFE', text: '#1E40AF' },
      technical_correction_resubmitted: { label: t('Technical Correction Resubmitted'), bg: '#DBEAFE', text: '#1E40AF' },
      rejected: { label: t('Rejected'), bg: '#FEE2E2', text: '#991B1B' },
      correction_requested: { label: t('Correction Requested'), bg: '#FEF3C7', text: '#92400E' }
    };
    const c = config[norm] || config.pending;
    return (
      <Badge style={{ backgroundColor: c.bg, color: c.text }} className="px-3 py-1 font-semibold rounded-full border-none">
        {c.label}
      </Badge>
    );
  };

  // Local state for proposal data and resubmission interaction
  const [proposalState, setProposalState] = useState(proposal);
  const tender = mockTenders.find(t => t.id === proposalState.tenderId);
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
      selected: { bg: '#D1FAE5', text: 'var(--fnrc-success)' }
    };
    return colors[status] || colors.submitted;
  };

  const statusColor = getStatusColor(proposalState.status);

  const techCardStatus = proposalState.status === 'submitted' 
    ? 'submitted' 
    : (!proposalState.technicalStatus || proposalState.technicalStatus === 'pending')
      ? 'technical_review_started'
      : proposalState.technicalStatus;

  const commCardStatus = proposalState.status === 'submitted' 
    ? 'submitted' 
    : (!proposalState.commercialStatus || proposalState.commercialStatus === 'pending')
      ? 'commercial_review_started'
      : proposalState.commercialStatus;

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
    const isOverallApproved = ['approved', 'approved', 'selected'].includes(proposalState.status);

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
    } else if (['approved', 'approved', 'selected'].includes(proposalState.status)) {
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
        performedBy: 'Vendor',
        date: proposalState.submissionDate,
        time: '10:30 AM',
        remarks: '—'
      }
    ];

    if (proposalState.status === 'submitted') return logs;

    if (proposalState.status === 'commercial_review_started') {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
      logs.push({
        action: 'Commercial Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-16',
        time: '11:00 AM',
        remarks: 'Commercial proposal under evaluation'
      });
      return logs;
    }

    if (proposalState.status === 'technical_correction_requested') {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
      logs.push({
        action: 'Technical Correction Requested',
        performedBy: 'Reviewer',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: proposalState.remarks || 'Clarification needed on failover mechanisms.'
      });
      return logs;
    }

    if (proposalState.id === 'PROP-102' && proposalState.status === 'technical_review') {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
      logs.push({
        action: 'Technical Correction Requested',
        performedBy: 'Reviewer',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: 'Clarification needed on failover mechanisms.'
      });
      logs.push({
        action: 'Technical Proposal Resubmitted',
        performedBy: 'Vendor',
        date: '2026-05-20',
        time: '06:50 PM',
        remarks: 'Resubmitted with updated multi-zone failover architecture description and document.'
      });
      return logs;
    }

    if (proposalState.id === 'PROP-105') {
      logs.push(
        {
          action: 'Commercial Review Started',
          performedBy: 'Reviewer',
          date: '2026-04-16',
          time: '11:00 AM',
          remarks: 'Commercial proposal under evaluation'
        },
        {
          action: 'Commercial Proposal Approved',
          performedBy: 'Reviewer',
          date: '2026-04-18',
          time: '04:30 PM',
          remarks: 'Pricing aligned with budget. Recommended for shortlisting'
        }
      );
      return logs;
    }

    logs.push({
      action: 'Technical Review Started',
      performedBy: 'Reviewer',
      date: '2026-02-12',
      time: '09:00 AM',
      remarks: 'Technical proposal review initiated'
    });

    if (proposalState.status === 'technical_review') return logs;

    if (proposalState.status === 'rejected') {
      logs.push({
        action: 'Proposal Rejected',
        performedBy: 'Procurement Admin',
        date: '2026-02-20',
        time: '11:45 AM',
        remarks: proposalState.remarks || 'Proposal did not meet requirements'
      });
      return logs;
    }

    // Approved status
    logs.push(
      {
        action: 'Technical Proposal Approved',
        performedBy: 'Reviewer',
        date: '2026-02-15',
        time: '02:45 PM',
        remarks: 'All technical requirements met. Score: 85/100'
      },
      {
        action: 'Commercial Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-16',
        time: '11:00 AM',
        remarks: 'Commercial proposal under evaluation'
      },
      {
        action: 'Commercial Proposal Approved',
        performedBy: 'Reviewer',
        date: '2026-02-18',
        time: '04:30 PM',
        remarks: 'Pricing aligned with budget. Recommended for shortlisting'
      },
      {
        action: 'Proposal Approved',
        performedBy: 'Procurement Admin',
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
      approved: 'Congratulations! Your proposal has been approved',
      rejected: 'Your proposal was not selected for this Tender'
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
      {/* SECTION 2: VISUAL STATUS PROGRESS */}
      {(viewMode === 'all' || viewMode === 'status') && (
        <Card className="gap-0 h-auto">
          <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
            <CardTitle className="text-lg font-bold text-gray-900">{t('Evaluation Progress')}</CardTitle>
          </CardHeader>
          <CardContent className="!pt-4 px-6 pb-4">
            {/* Step-based Progress Tracker */}
            {(() => {
              const isFinal = ['approved', 'selected', 'rejected'].includes(proposalState.status);
              const hasReviewActivity = 
                (proposalState.technicalReviewer && proposalState.technicalReviewer !== '') ||
                (proposalState.commercialReviewer && proposalState.commercialReviewer !== '') ||
                (proposalState.technicalStatus && !['pending', 'submitted'].includes(proposalState.technicalStatus)) ||
                (proposalState.commercialStatus && !['pending', 'submitted'].includes(proposalState.commercialStatus));
              const isUnderReview = !isFinal && (proposalState.status !== 'submitted' || hasReviewActivity);

              let finalLabel = 'Final Decision';
              if (proposalState.id === 'PROP-105') {
                finalLabel = 'Completed';
              } else if (proposalState.status === 'rejected') {
                finalLabel = 'Rejected';
              } else if (['approved', 'selected'].includes(proposalState.status)) {
                finalLabel = 'Approved';
              }

              const stages: TimelineStage[] = [
                { key: 'submitted', label: t('Submitted') },
                { key: 'under_review', label: t('Under Review') },
                { key: 'final_decision', label: t(finalLabel) }
              ];

              let currentStageKey = 'submitted';
              let completedStageKeys: string[] = [];

              if (proposalState.status === 'submitted' && !hasReviewActivity) {
                currentStageKey = 'submitted';
                completedStageKeys = [];
              } else if (isUnderReview) {
                currentStageKey = 'under_review';
                completedStageKeys = ['submitted'];
              } else if (isFinal) {
                currentStageKey = 'final_decision';
                completedStageKeys = ['submitted', 'under_review', 'final_decision'];
              }

              return (
                <ProgressTimeline 
                  stages={stages} 
                  currentStageKey={currentStageKey} 
                  completedStageKeys={completedStageKeys} 
                />
              );
            })()}

          </CardContent>
        </Card>
      )}

      {/* Technical and Commercial Review overview cards */}
      {(viewMode === 'all' || viewMode === 'status') && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Technical Review Card */}
          {tender?.technicalProposalRequired !== 'no' && (
            <Card className="gap-0 h-auto">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-green-50 text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{t('Technical Status')}</h3>
                    </div>
                  </div>
                  {getReviewStatusBadge(techCardStatus === 'approved' ? 'technical_approved' : techCardStatus)}
                </div>
                {proposalState.technicalRemark && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-md border border-gray-100 mt-1">
                    <span className="font-semibold block text-gray-700 mb-0.5">{t('Remarks')}:</span>
                    <p className="italic font-normal">"{proposalState.technicalRemark}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Commercial Review Card */}
          <Card className="gap-0 h-auto">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{t('Commercial Status')}</h3>
                  </div>
                </div>
                {getReviewStatusBadge(commCardStatus === 'approved' ? 'commercial_approved' : commCardStatus)}
              </div>
              {proposalState.commercialRemark && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-md border border-gray-100 mt-1">
                  <span className="font-semibold block text-gray-700 mb-0.5">{t('Remarks')}:</span>
                  <p className="italic font-normal">"{proposalState.commercialRemark}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 1: PROPOSAL SUMMARY (Always show in both) */}
      <Card className="gap-0 h-auto" style={{ borderColor: isRejected ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)', borderWidth: '2px' }}>
        <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
          <CardTitle className="text-lg font-bold text-gray-900">{t('Proposal Summary')}</CardTitle>
        </CardHeader>
        <CardContent className="!pt-4 !pb-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <span className="text-sm font-bold text-black block">Proposal ID</span>
              <span 
                className="text-base font-normal text-[var(--fnrc-primary-green)] mt-1 block cursor-pointer hover:underline" 
                onClick={() => navigate(`/vendor/proposals/${proposalState.id}`)}
              >
                {proposalState.id}
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-black block">Tender Number - Tender Title</span>
              <span className="text-base font-normal text-gray-800 mt-1 block">{proposalState.tenderId} - {proposalState.tenderTitle}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-black block">Status</span>
              <div className="mt-1">
                <StatusBadge status={proposalState.status} />
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <span className="text-sm font-bold text-black block">Proposal Date</span>
              <span className="text-base font-normal text-gray-800 mt-1 block">{new Date(proposalState.submissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-black block">Commercial Amount</span>
              <span className="text-base font-normal text-gray-800 mt-1 block">AED {proposalState.commercialAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION: WHAT WAS SUBMITTED CONTENT (Proposal Details) */}
      {(viewMode === 'all' || viewMode === 'submitted') && (
        <div className="space-y-6">
          {/* Technical Proposal Card - conditional editor zone */}
          {tender?.technicalProposalRequired !== 'no' && (
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">
                Technical Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="!pt-3 px-6 pb-4">
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
                        backgroundColor: '#F7F9FC'
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
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-black block mb-1">Approach</h4>
                    <div className="rounded-lg border p-4 bg-gray-50" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <p className="text-base font-normal text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {proposalState.technicalProposal}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Commercial Proposal */}
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">
                Commercial Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="!pt-3 px-6 pb-4 space-y-4">
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
                    <div className="border rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <Table>
                        <TableHeader className="bg-gray-50/60 backdrop-blur-xs">
                          <TableRow className="border-b" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 pl-6 w-[40%]">Description</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-[20%]">Unit Price (AED)</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-center w-[20%]">Quantity</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-[20%] pr-6">Amount (AED)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                          {[
                            { desc: 'Core Services & Implementation (70%)', amt: editedAmount * 0.7 },
                            { desc: 'Support & Maintenance (Annual) (20%)', amt: editedAmount * 0.2 },
                            { desc: 'Contingency & Other Expenses (10%)', amt: editedAmount * 0.1 }
                          ].map((item, i) => (
                            <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                              <TableCell className="py-4 pl-6 font-medium text-sm text-gray-800">
                                {item.desc}
                              </TableCell>
                              <TableCell className="py-4 text-right text-sm text-gray-600 tabular-nums">
                                {item.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="py-4 text-center text-sm text-gray-600 font-medium">
                                1
                              </TableCell>
                              <TableCell className="py-4 text-right pr-6 font-semibold text-sm text-gray-800 tabular-nums">
                                {item.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="p-5 border-t bg-gray-50/50 flex justify-end items-center gap-6" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                        <span className="font-bold text-sm text-gray-600">Total Proposal Amount</span>
                        <span className="font-extrabold text-xl text-[var(--fnrc-primary-green)] tracking-tight">
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
                  <div className="space-y-6">
                    <div>
                      <span className="text-sm font-bold text-black block">Total Proposed Amount</span>
                      <span className="text-base font-normal text-gray-800 mt-1 block">
                        AED {proposalState.commercialAmount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-black block">Payment Terms</span>
                      <span className="text-base font-normal text-gray-800 mt-1 block">
                        {proposalState.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-black block mb-2">Cost Breakdown</h4>
                    <div className="border rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                      <Table>
                        <TableHeader className="bg-gray-50/60 backdrop-blur-xs">
                          <TableRow className="border-b" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 pl-6 w-[40%]">Description</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-[20%]">Unit Price (AED)</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-center w-[20%]">Quantity</TableHead>
                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-[20%] pr-6">Amount (AED)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                          {[
                            { desc: 'Core Services & Implementation', amt: proposalState.commercialAmount * 0.7 },
                            { desc: 'Support & Maintenance (Annual)', amt: proposalState.commercialAmount * 0.2 },
                            { desc: 'Contingency & Other Expenses', amt: proposalState.commercialAmount * 0.1 }
                          ].map((item, i) => (
                            <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                              <TableCell className="py-4 pl-6 font-medium text-sm text-gray-800">
                                {item.desc}
                              </TableCell>
                              <TableCell className="py-4 text-right text-sm text-gray-600 tabular-nums">
                                {item.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="py-4 text-center text-sm text-gray-600 font-medium">
                                1
                              </TableCell>
                              <TableCell className="py-4 text-right pr-6 font-semibold text-sm text-gray-800 tabular-nums">
                                {item.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="p-5 border-t bg-gray-50/50 flex justify-end items-center gap-6" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                        <span className="font-bold text-sm text-gray-600">Total Proposal Amount</span>
                        <span className="font-extrabold text-xl text-[var(--fnrc-primary-green)] tracking-tight">
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
              <CardTitle className="text-lg font-bold text-gray-900">
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



      {/* SECTION 3: ACTIVITY & DECISION LOG (ALWAYS VISIBLE) */}
      {(viewMode === 'all' || viewMode === 'status') && (
        <Card className="gap-0 h-auto">
          <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
            <CardTitle className="text-lg font-bold text-gray-900">Detailed Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC] border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start">{t('Action')}</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start">{t('Role')}</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start">{t('Date & Time')}</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm py-4 px-6 text-start">{t('Remarks')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((log, idx) => (
                    <TableRow key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                      <TableCell className="text-start font-medium text-gray-900 text-sm py-4 px-6">
                        {t(log.action)}
                      </TableCell>
                      <TableCell className="text-start font-normal text-gray-600 text-sm py-4 px-6">
                        {t(log.performedBy)}
                      </TableCell>
                      <TableCell className="text-start text-gray-500 font-normal text-sm py-4 px-6">
                        {log.date.includes('-') ? log.date.split('-').reverse().join('/') : new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {log.time}
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
      )}
    </div>
  );
}