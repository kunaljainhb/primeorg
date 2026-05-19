import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { FileText, Download, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
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
  };
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBack?: () => void;
  viewMode?: 'submitted' | 'status' | 'all';
}

export function ProposalDetailView({ 
  proposal, 
  showBackButton = true, 
  backButtonLabel = 'Back to Proposals',
  onBack,
  viewMode = 'all'
}: ProposalDetailViewProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status] || colors.submitted;
  };

  const statusColor = getStatusColor(proposal.status);

  // Determine current step index for progress
  const getCurrentStepIndex = () => {
    const statusMap: Record<string, number> = {
      submitted: 0,
      under_review: 3,
      shortlisted: 5,
      rejected: 5
    };
    
    // Case 4: Special handling for direct Commercial Review
    if (proposal.status === 'under_review' && proposal.id === 'PROP-104') {
      return 3; 
    }
    
    return statusMap[proposal.status] || 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isRejected = proposal.status === 'rejected';
  const isCommercialReviewOnly = proposal.id === 'PROP-104';

  // Step-based progress stages
  const progressSteps = isCommercialReviewOnly 
    ? [
        { label: 'Submitted', index: 0 },
        { label: 'Evaluation Started', index: 1 },
        { label: 'Commercial Review', index: 3 },
        { label: 'Commercial Approved', index: 4 },
        { label: isRejected ? 'Rejected' : 'Shortlisted', index: 5 }
      ]
    : [
        { label: 'Submitted', index: 0 },
        { label: 'Technical Review', index: 1 },
        { label: 'Technical Approved', index: 2 },
        { label: 'Commercial Review', index: 3 },
        { label: 'Commercial Approved', index: 4 },
        { label: isRejected ? 'Rejected' : 'Shortlisted', index: 5 }
      ];

  // Dynamic activity log based on status
  const getActivityLog = () => {
    const logs = [
      {
        action: 'Proposal Submitted',
        performedBy: 'System',
        date: proposal.submissionDate,
        time: '10:30 AM',
        remarks: 'Proposal successfully submitted to FNRC procurement system'
      }
    ];

    if (proposal.status === 'submitted') return logs;

    logs.push({
      action: 'Technical Review Started',
      performedBy: 'Technical Evaluator',
      date: '2026-02-12',
      time: '09:00 AM',
      remarks: 'Technical proposal review initiated'
    });

    if (proposal.status === 'under_review') return logs;

    if (proposal.status === 'rejected') {
      logs.push({
        action: 'Proposal Rejected',
        performedBy: 'Procurement Manager',
        date: '2026-02-20',
        time: '11:45 AM',
        remarks: proposal.remarks || 'Proposal did not meet requirements'
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
      under_review: 'Your proposal is currently under commercial evaluation',
      shortlisted: 'Congratulations! Your proposal has been shortlisted',
      rejected: 'Your proposal was not selected for this RFP'
    };
    return statusText[proposal.status] || 'Processing your proposal';
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
                onClick={() => navigate(`/vendor/proposals/${proposal.id}`)}
              >
                {proposal.id}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>RFP Title</div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.rfpTitle}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Status</div>
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: 
                    proposal.status === 'shortlisted' ? '#D1FAE5' : 
                    proposal.status === 'under_review' ? '#FFEDD5' : 
                    proposal.status === 'rejected' ? '#FEE2E2' : '#DBEAFE',
                  color: 
                    proposal.status === 'shortlisted' ? 'var(--fnrc-success)' : 
                    proposal.status === 'under_review' ? '#EA580C' : 
                    proposal.status === 'rejected' ? 'var(--fnrc-error)' : 'var(--fnrc-info)'
                }}
              >
                {proposal.status === 'under_review' ? 'UnderReview' : proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Submission Date</div>
              <div style={{ color: 'var(--fnrc-text-dark)' }}>{new Date(proposal.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Commercial Amount</div>
              <div className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>AED {proposal.commercialAmount.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION: WHAT WAS SUBMITTED CONTENT (Proposal Details) */}
      {(viewMode === 'all' || viewMode === 'submitted') && (
        <div className="space-y-6">
          {/* Technical Proposal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Technical Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--fnrc-text-muted)' }}>Technical Approach</h4>
                  <div className="rounded-lg border p-4 bg-gray-50" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {proposal.technicalProposal}
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Total Proposed Amount</h4>
                  <div className="text-2xl font-bold" style={{ color: 'var(--fnrc-text-dark)' }}>
                    AED {proposal.commercialAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Payment Terms</h4>
                  <p className="text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>
                    {proposal.paymentTerms || 'Standard FNRC payment terms (30 days upon invoice approval)'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>Cost Breakdown</h4>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                        <TableHead className="w-[70%]">Description</TableHead>
                        <TableHead className="text-right">Amount (AED)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Core Services & Implementation</TableCell>
                        <TableCell className="text-right">{(proposal.commercialAmount * 0.7).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Support & Maintenance (Annual)</TableCell>
                        <TableCell className="text-right">{(proposal.commercialAmount * 0.2).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Contingency & Other Expenses</TableCell>
                        <TableCell className="text-right">{(proposal.commercialAmount * 0.1).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-gray-50">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{proposal.commercialAmount.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
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
                    <span className="text-sm font-medium truncate pr-2">Technical_Proposal_v1.pdf</span>
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
                backgroundColor: 'var(--fnrc-success)', // Always success color (Case 3 request)
                width: proposal.status === 'submitted' ? '0%' : `${(currentStepIndex / (progressSteps.length - 1)) * 100}%`
              }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {progressSteps.map((step) => {
                const isCompleted = proposal.status !== 'submitted' && step.index <= currentStepIndex;
                const isCurrent = (proposal.status === 'submitted' && step.index === 0) || step.index === currentStepIndex;
                
                return (
                  <div key={step.index} className="flex flex-col items-center" style={{ flex: 1 }}>
                    {/* Step circle */}
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 z-10"
                      style={{
                        backgroundColor: isCompleted ? 'var(--fnrc-success)' : 'white',
                        borderColor: isCompleted ? 'var(--fnrc-success)' : 'var(--fnrc-border-gray)',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(11, 107, 58, 0.1)' : 'none'
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                      )}
                    </div>
                    {/* Step label */}
                    <div className="mt-2 text-center">
                      <div 
                        className="text-xs font-medium px-2"
                        style={{ 
                          color: isCompleted || isCurrent ? 'var(--fnrc-text-dark)' : 'var(--fnrc-text-muted)',
                          fontWeight: isCurrent ? '600' : '500'
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Evaluation Remarks integrated here */}
          {proposal.remarks && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4" style={{ color: 'var(--fnrc-accent-gold)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Latest Evaluation Remarks</span>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: '#FEF3C7' }}>
                <p className="text-sm" style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.remarks}</p>
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