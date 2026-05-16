import { useState } from 'react';
import { useNavigate, useLocation } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Download, FileText, Check, XIcon, AlertCircle, Upload, UserCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { mockProposals, mockRFPs, mockVendors } from '@/app/data/mockData';

type DecisionLog = {
  action: string;
  timestamp: string;
  user: string;
  reason?: string;
  documentName?: string;
};

export default function AdminProposalDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const proposalId = location.pathname.split('/').pop();
  const proposal = mockProposals.find(p => p.id === proposalId) || mockProposals[0];
  
  const rfp = mockRFPs.find(r => r.id === proposal.rfpId);
  const vendor = mockVendors.find(v => v.id === proposal.vendorId);

  // State for decision flow
  const [technicalStatus, setTechnicalStatus] = useState(proposal.technicalStatus || 'pending');
  const [commercialStatus, setCommercialStatus] = useState(proposal.commercialStatus || 'pending');
  const [isShortlisted, setIsShortlisted] = useState(proposal.status === 'shortlisted');
  
  const [decisionDialog, setDecisionDialog] = useState<{
    open: boolean;
    type: 'technical-approve' | 'technical-reject' | 'commercial-approve' | 'commercial-reject' | 'shortlist' | 'reject-final' | null;
    reason: string;
    fileName: string;
  }>({ open: false, type: null, reason: '', fileName: '' });

  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([]);

  const [auditLogs, setAuditLogs] = useState<Array<{ action: string; timestamp: string; user: string }>>([ 
    { action: 'Proposal submitted by vendor', timestamp: new Date(proposal.submissionDate).toLocaleString(), user: proposal.vendorName },
    { action: 'Technical evaluation initiated', timestamp: new Date().toLocaleString(), user: 'Ahmed Al Mansoori' }
  ]);

  const getStatusColor = (status?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' },
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status || 'pending'] || colors.pending;
  };

  const openDecisionDialog = (type: 'technical-approve' | 'technical-reject' | 'commercial-approve' | 'commercial-reject' | 'shortlist' | 'reject-final') => {
    setDecisionDialog({ open: true, type, reason: '', fileName: '' });
  };

  const closeDecisionDialog = () => {
    setDecisionDialog({ open: false, type: null, reason: '', fileName: '' });
  };

  const handleDecisionConfirm = () => {
    const { type, reason, fileName } = decisionDialog;

    // Validate reason for rejection decisions
    if ((type === 'technical-reject' || type === 'commercial-reject' || type === 'reject-final') && !reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    const timestamp = new Date().toLocaleString();
    const user = 'Ahmed Al Mansoori';

    switch (type) {
      case 'technical-approve':
        setTechnicalStatus('approved');
        const techApproveLog: DecisionLog = {
          action: 'Technical Approved',
          timestamp,
          user,
          reason: reason || 'Meets all technical requirements',
          documentName: fileName || undefined
        };
        setDecisionLogs(prev => [techApproveLog, ...prev]);
        setAuditLogs(prev => [{ action: 'Technical proposal approved', timestamp, user }, ...prev]);
        toast.success('Technical proposal approved');
        break;

      case 'technical-reject':
        setTechnicalStatus('rejected');
        const techRejectLog: DecisionLog = {
          action: 'Technical Rejected',
          timestamp,
          user,
          reason,
          documentName: fileName || undefined
        };
        setDecisionLogs(prev => [techRejectLog, ...prev]);
        setAuditLogs(prev => [{ action: `Technical proposal rejected: ${reason}`, timestamp, user }, ...prev]);
        toast.success('Technical proposal rejected');
        break;

      case 'commercial-approve':
        setCommercialStatus('approved');
        const commApproveLog: DecisionLog = {
          action: 'Commercial Approved',
          timestamp,
          user,
          reason: reason || 'Pricing is competitive and acceptable',
          documentName: fileName || undefined
        };
        setDecisionLogs(prev => [commApproveLog, ...prev]);
        setAuditLogs(prev => [{ action: 'Commercial proposal approved', timestamp, user }, ...prev]);
        toast.success('Commercial proposal approved');
        break;

      case 'commercial-reject':
        setCommercialStatus('rejected');
        const commRejectLog: DecisionLog = {
          action: 'Commercial Rejected',
          timestamp,
          user,
          reason,
          documentName: fileName || undefined
        };
        setDecisionLogs(prev => [commRejectLog, ...prev]);
        setAuditLogs(prev => [{ action: `Commercial proposal rejected: ${reason}`, timestamp, user }, ...prev]);
        toast.success('Commercial proposal rejected');
        break;

      case 'shortlist':
        setIsShortlisted(true);
        const shortlistLog: DecisionLog = {
          action: 'Vendor Shortlisted',
          timestamp,
          user,
          reason: 'Passed both technical and commercial evaluations'
        };
        setDecisionLogs(prev => [shortlistLog, ...prev]);
        setAuditLogs(prev => [{ action: 'Vendor shortlisted for final selection', timestamp, user }, ...prev]);
        toast.success(`${proposal.vendorName} has been shortlisted`);
        break;

      case 'reject-final':
        setIsShortlisted(false);
        const finalRejectLog: DecisionLog = {
          action: 'Proposal Rejected',
          timestamp,
          user,
          reason,
          documentName: fileName || undefined
        };
        setDecisionLogs(prev => [finalRejectLog, ...prev]);
        setAuditLogs(prev => [{ action: `Proposal rejected: ${reason}`, timestamp, user }, ...prev]);
        toast.success('Proposal rejected');
        break;
    }

    closeDecisionDialog();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDecisionDialog(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const canShortlist = technicalStatus === 'approved' && commercialStatus === 'approved';
  const isTechnicalRejected = technicalStatus === 'rejected';
  const isCommercialRejected = commercialStatus === 'rejected';

  const techStatusColor = getStatusColor(technicalStatus);
  const commStatusColor = getStatusColor(commercialStatus);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/admin/rfps/${proposal.rfpId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
            {proposal.vendorName}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
              {proposal.id}
            </span>
            <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>•</span>
            <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
              Submitted {new Date(proposal.submissionDate).toLocaleDateString()}
            </span>
            {isShortlisted && (
              <>
                <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>•</span>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}
                >
                  Shortlisted
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full justify-start" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
          <TabsTrigger 
            value="summary"
            className="data-[state=active]:bg-white"
            style={{ 
              color: 'var(--fnrc-text-muted)',
            }}
            data-active-style={{ color: 'var(--fnrc-primary-green)' }}
          >
            Proposal Summary
          </TabsTrigger>
          <TabsTrigger 
            value="technical"
            className="data-[state=active]:bg-white"
            style={{ 
              color: 'var(--fnrc-text-muted)',
            }}
          >
            Technical Proposal
          </TabsTrigger>
          <TabsTrigger 
            value="commercial"
            className="data-[state=active]:bg-white"
            style={{ 
              color: 'var(--fnrc-text-muted)',
            }}
          >
            Commercial Proposal
          </TabsTrigger>
          <TabsTrigger 
            value="decision"
            className="data-[state=active]:bg-white"
            style={{ 
              color: 'var(--fnrc-text-muted)',
            }}
          >
            Final Decision
          </TabsTrigger>
          <TabsTrigger 
            value="audit"
            className="data-[state=active]:bg-white"
            style={{ 
              color: 'var(--fnrc-text-muted)',
            }}
          >
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Proposal Summary */}
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Vendor Name</div>
                  <div className="font-medium">{proposal.vendorName}</div>
                </div>
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Vendor ID</div>
                  <div className="font-medium">{vendor?.id}</div>
                </div>
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>RFP Reference</div>
                  <div className="font-medium">{rfp?.id}</div>
                  <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>{rfp?.title}</div>
                </div>
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Submission Date</div>
                  <div className="font-medium">{new Date(proposal.submissionDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Commercial Amount</div>
                  <div className="text-2xl font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
                    AED {proposal.commercialAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Overall Status</div>
                  <div className="flex gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: techStatusColor.bg, color: techStatusColor.text }}
                    >
                      Tech: {technicalStatus}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: commStatusColor.bg, color: commStatusColor.text }}
                    >
                      Comm: {commercialStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Technical Proposal */}
        <TabsContent value="technical" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Technical Proposal</CardTitle>
                  <p className="text-sm mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Review technical requirements and capabilities
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: techStatusColor.bg, color: techStatusColor.text }}
                  className="text-base px-4 py-1"
                >
                  {technicalStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Technical Summary
                  </div>
                  <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                    {proposal.technicalProposal}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Compliance
                    </div>
                    <div className="text-sm">{proposal.compliance || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Technical Score
                    </div>
                    <div className="text-lg font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
                      {proposal.technicalScore || 'Not evaluated'}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Experience
                    </div>
                    <div className="text-sm">{proposal.experience || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Methodology
                    </div>
                    <div className="text-sm">{proposal.methodology || 'N/A'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Resources
                  </div>
                  <div className="text-sm">{proposal.resources || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Technical Documents
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                        <div>
                          <div className="text-sm font-medium">Technical_Proposal.pdf</div>
                          <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>2.4 MB</div>
                        </div>
                      </div>
                      <Download className="h-4 w-4" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                    <div 
                      className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                        <div>
                          <div className="text-sm font-medium">Technical_Specifications.pdf</div>
                          <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>1.8 MB</div>
                        </div>
                      </div>
                      <Download className="h-4 w-4" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Approval Matrix Section */}
              <div>
                <div className="text-sm mb-3 font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Approval Matrix
                </div>
                <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                  {/* Level 1: Reviewer */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: technicalStatus === 'approved' ? 'var(--fnrc-success)' : 'var(--fnrc-primary-green)' }}>
                      {technicalStatus === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Level 1: Reviewer
                      </div>
                      <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        Mohammed Al-Rashid - Technical Reviewer
                      </div>
                      {technicalStatus === 'approved' && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge 
                            variant="secondary" 
                            style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)', fontSize: '11px', padding: '2px 8px' }}
                          >
                            ✓ Approved
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level 2: Manager */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: 'var(--fnrc-accent-gold)' }}>
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Level 2: Manager
                      </div>
                      <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        David Martinez - Procurement Manager
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: '#E5E7EB', color: 'var(--fnrc-text-muted)', fontSize: '11px', padding: '2px 8px' }}
                        >
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Technical Decision Section */}
              <div>
                <div className="text-sm mb-3 font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Technical Decision
                </div>
                {technicalStatus === 'pending' || technicalStatus === 'under_review' ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => openDecisionDialog('technical-reject')}
                      style={{ borderColor: 'var(--fnrc-error)', color: 'var(--fnrc-error)' }}
                    >
                      <XIcon className="mr-2 h-4 w-4" />
                      Reject Technical
                    </Button>
                    <Button
                      onClick={() => openDecisionDialog('technical-approve')}
                      className="text-white"
                      style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve Technical
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                    <div className="flex items-center gap-2">
                      {technicalStatus === 'approved' ? (
                        <>
                          <Check className="h-5 w-5" style={{ color: 'var(--fnrc-success)' }} />
                          <span className="font-medium" style={{ color: 'var(--fnrc-success)' }}>
                            Technical proposal approved
                          </span>
                        </>
                      ) : (
                        <>
                          <XIcon className="h-5 w-5" style={{ color: 'var(--fnrc-error)' }} />
                          <span className="font-medium" style={{ color: 'var(--fnrc-error)' }}>
                            Technical proposal rejected
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Commercial Proposal */}
        <TabsContent value="commercial" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commercial Proposal</CardTitle>
                  <p className="text-sm mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Review pricing, terms, and commercial conditions
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: commStatusColor.bg, color: commStatusColor.text }}
                  className="text-base px-4 py-1"
                >
                  {commercialStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Total Commercial Amount
                    </div>
                    <div className="text-3xl font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
                      AED {proposal.commercialAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Delivery Timeline
                    </div>
                    <div className="text-xl font-semibold">{proposal.deliveryTimeline || 'Not specified'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                    BOQ Summary
                  </div>
                  <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                    {proposal.boqSummary || 'N/A'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Payment Terms
                    </div>
                    <div className="text-sm">{proposal.paymentTerms || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Warranty / Support
                    </div>
                    <div className="text-sm">{proposal.warranty || 'N/A'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm mb-2 font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Commercial Documents
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                        <div>
                          <div className="text-sm font-medium">Commercial_Proposal.pdf</div>
                          <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>1.2 MB</div>
                        </div>
                      </div>
                      <Download className="h-4 w-4" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                    <div 
                      className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                        <div>
                          <div className="text-sm font-medium">BOQ_Breakdown.xlsx</div>
                          <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>450 KB</div>
                        </div>
                      </div>
                      <Download className="h-4 w-4" style={{ color: 'var(--fnrc-text-muted)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Approval Matrix Section */}
              <div>
                <div className="text-sm mb-3 font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Approval Matrix
                </div>
                <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                  {/* Level 1: Reviewer */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: commercialStatus === 'approved' ? 'var(--fnrc-success)' : 'var(--fnrc-primary-green)' }}>
                      {commercialStatus === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Level 1: Reviewer
                      </div>
                      <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        Emily Chen - Contract Specialist
                      </div>
                      {commercialStatus === 'approved' && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge 
                            variant="secondary" 
                            style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)', fontSize: '11px', padding: '2px 8px' }}
                          >
                            ✓ Approved
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level 2: Manager */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: 'var(--fnrc-accent-gold)' }}>
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                        Level 2: Manager
                      </div>
                      <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        David Martinez - Procurement Manager
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: '#E5E7EB', color: 'var(--fnrc-text-muted)', fontSize: '11px', padding: '2px 8px' }}
                        >
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Commercial Decision Section */}
              <div>
                <div className="text-sm mb-3 font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Commercial Decision
                </div>
                {commercialStatus === 'pending' || commercialStatus === 'under_review' ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => openDecisionDialog('commercial-reject')}
                      style={{ borderColor: 'var(--fnrc-error)', color: 'var(--fnrc-error)' }}
                    >
                      <XIcon className="mr-2 h-4 w-4" />
                      Reject Commercial
                    </Button>
                    <Button
                      onClick={() => openDecisionDialog('commercial-approve')}
                      className="text-white"
                      style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve Commercial
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}>
                    <div className="flex items-center gap-2">
                      {commercialStatus === 'approved' ? (
                        <>
                          <Check className="h-5 w-5" style={{ color: 'var(--fnrc-success)' }} />
                          <span className="font-medium" style={{ color: 'var(--fnrc-success)' }}>
                            Commercial proposal approved
                          </span>
                        </>
                      ) : (
                        <>
                          <XIcon className="h-5 w-5" style={{ color: 'var(--fnrc-error)' }} />
                          <span className="font-medium" style={{ color: 'var(--fnrc-error)' }}>
                            Commercial proposal rejected
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Final Decision */}
        <TabsContent value="decision" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shortlist Controls */}
              {!canShortlist && !isShortlisted && (
                <div className="rounded-lg border p-4 flex items-start gap-3" style={{ borderColor: 'var(--fnrc-warning)', backgroundColor: '#FEF3C7' }}>
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: 'var(--fnrc-warning)' }} />
                  <div>
                    <div className="font-medium mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                      Prerequisites Required
                    </div>
                    <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Both technical and commercial approvals are required before shortlisting.
                    </div>
                  </div>
                </div>
              )}

              {canShortlist && !isShortlisted && (
                <div className="rounded-lg border p-4 flex items-start gap-3" style={{ borderColor: 'var(--fnrc-success)', backgroundColor: '#D1FAE5' }}>
                  <Check className="h-5 w-5 mt-0.5" style={{ color: 'var(--fnrc-success)' }} />
                  <div className="flex-1">
                    <div className="font-medium mb-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                      Ready for Shortlisting
                    </div>
                    <div className="text-sm mb-3" style={{ color: 'var(--fnrc-text-muted)' }}>
                      All evaluations are complete. You can now shortlist this vendor for final selection.
                    </div>
                    <Button
                      onClick={() => openDecisionDialog('shortlist')}
                      className="text-white"
                      style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                    >
                      Shortlist Proposal
                    </Button>
                  </div>
                </div>
              )}

              {isShortlisted && (
                <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-primary-green)', backgroundColor: '#D1FAE5' }}>
                  <div className="flex items-center gap-2">
                    <Check className="h-6 w-6" style={{ color: 'var(--fnrc-primary-green)' }} />
                    <span className="text-lg font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
                      Proposal Shortlisted
                    </span>
                  </div>
                  <div className="text-sm mt-2" style={{ color: 'var(--fnrc-text-muted)' }}>
                    This vendor has been shortlisted for final selection.
                  </div>
                </div>
              )}

              {/* Decision Timeline */}
              {decisionLogs.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm mb-4 font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                      Decision Timeline
                    </div>
                    <div className="space-y-4">
                      {decisionLogs.map((log, idx) => (
                        <div 
                          key={idx} 
                          className="flex gap-4 border-l-2 pb-3 pl-4" 
                          style={{ borderColor: idx === 0 ? 'var(--fnrc-primary-green)' : 'var(--fnrc-border-gray)' }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {log.action.includes('Approved') ? (
                                <Check className="h-4 w-4" style={{ color: 'var(--fnrc-success)' }} />
                              ) : log.action.includes('Rejected') ? (
                                <XIcon className="h-4 w-4" style={{ color: 'var(--fnrc-error)' }} />
                              ) : (
                                <Check className="h-4 w-4" style={{ color: 'var(--fnrc-primary-green)' }} />
                              )}
                              <span className="font-medium">{log.action}</span>
                            </div>
                            {log.reason && (
                              <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                                Reason: {log.reason}
                              </div>
                            )}
                            {log.documentName && (
                              <div className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                                <FileText className="h-3 w-3" />
                                Attachment: {log.documentName}
                              </div>
                            )}
                            <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                              By {log.user} • {log.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Audit Trail */}
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <p className="text-sm mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                Complete system log of all actions (read-only)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 border-l-2 pb-3 pl-4" 
                    style={{ borderColor: idx === 0 ? 'var(--fnrc-primary-green)' : 'var(--fnrc-border-gray)' }}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        By {log.user} • {log.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Decision Dialog */}
      <Dialog open={decisionDialog.open} onOpenChange={(open) => !open && closeDecisionDialog()}>
        <DialogContent aria-describedby="decision-dialog-description">
          <DialogHeader>
            <DialogTitle>
              {decisionDialog.type === 'technical-approve' && 'Technical Decision'}
              {decisionDialog.type === 'technical-reject' && 'Technical Decision'}
              {decisionDialog.type === 'commercial-approve' && 'Commercial Decision'}
              {decisionDialog.type === 'commercial-reject' && 'Commercial Decision'}
              {decisionDialog.type === 'shortlist' && 'Shortlist Proposal'}
              {decisionDialog.type === 'reject-final' && 'Reject Proposal'}
            </DialogTitle>
            <DialogDescription id="decision-dialog-description">
              {decisionDialog.type === 'technical-approve' && 'Approve this proposal for technical evaluation'}
              {decisionDialog.type === 'technical-reject' && 'Reject this proposal at technical stage'}
              {decisionDialog.type === 'commercial-approve' && 'Approve this proposal for commercial evaluation'}
              {decisionDialog.type === 'commercial-reject' && 'Reject this proposal at commercial stage'}
              {decisionDialog.type === 'shortlist' && 'Add this proposal to the shortlist'}
              {decisionDialog.type === 'reject-final' && 'Reject this proposal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {decisionDialog.type !== 'shortlist' && (
              <>
                <div>
                  <Label htmlFor="decision-type">Decision Type</Label>
                  <Input
                    id="decision-type"
                    value={
                      decisionDialog.type === 'technical-approve' ? 'Approve Technical' :
                      decisionDialog.type === 'technical-reject' ? 'Reject Technical' :
                      decisionDialog.type === 'commercial-approve' ? 'Approve Commercial' :
                      'Reject Commercial'
                    }
                    disabled
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="reason">
                    Reason {(decisionDialog.type === 'technical-reject' || decisionDialog.type === 'commercial-reject' || decisionDialog.type === 'reject-final') && '*'}
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for decision..."
                    value={decisionDialog.reason}
                    onChange={(e) => setDecisionDialog(prev => ({ ...prev, reason: e.target.value }))}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="document">Upload Supporting Document (Optional)</Label>
                  <div className="mt-2">
                    <label 
                      htmlFor="document"
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: 'var(--fnrc-border-gray)' }}
                    >
                      <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                      <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                        {decisionDialog.fileName || 'Click to upload file'}
                      </span>
                    </label>
                    <input
                      id="document"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDecisionDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleDecisionConfirm}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}