import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, FileText, Check, Download, Clock, Award, ShieldCheck, Users, Briefcase, X, History, Plus, Star, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { mockProposals, mockAdminUsers, mockTenders, saveProposalsToStorage } from '@/app/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { ProgressTimeline } from '@/app/components/ui/progress-timeline';
import { useTranslation } from '@/app/context/LanguageContext';
import { cn } from '@/app/components/ui/utils';
import { Separator } from '@/app/components/ui/separator';


const formatDate = (dateStr?: string | Date) => {
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

const getProposalRevisions = (proposal: any) => {
  const baseAmount = proposal?.commercialAmount || 420000;
  
  const defaultRevisions = {
    latest: {
      label: 'Revision 2',
      technicalProposal: proposal?.technicalProposal || "No technical proposal text.",
      methodology: proposal?.methodology || "No methodology text.",
      technicalDocs: [
        'Technical Specification_Latest.pdf',
        'Implementation Plan_Latest.docx',
        'System Architecture_Latest.png'
      ],
      commercialAmount: baseAmount,
      commercialBreakdown: [
        { item: 'Hardware Components & Infrastructure upgrade', amount: Math.round(baseAmount * 0.6) },
        { item: 'Software Licensing & Cloud setup fees', amount: Math.round(baseAmount * 0.25) },
        { item: 'Integration, UAT support & handovers', amount: Math.round(baseAmount * 0.15) }
      ],
      paymentTerms: proposal?.paymentTerms || 'Milestone-based payments: 20% advance, 40% intermediate, and 40% upon final delivery sign-off.',
      commercialDoc: 'Commercial Proposal_Latest.pdf',
      supportingDocs: [
        { id: 'doc1', name: 'Company Profile.pdf', category: 'Company Profile', date: '2026-05-01', status: 'approved' },
        { id: 'doc2', name: 'Financial Statements.xlsx', category: 'Financial Statements', date: '2026-04-20', status: 'approved' },
        { id: 'doc3', name: 'Compliance Certificate.pdf', category: 'Other', date: '2026-03-15', status: 'pending' }
      ]
    },
    rev1: {
      label: 'Revision 1',
      technicalProposal: `[Revision 1 - Addressed Review Comments]\n\n` + 
        (proposal?.id === 'PROP-102'
          ? `1. Cloud Strategy Overview\nWe recommend a Hybrid Cloud architecture utilizing Microsoft Azure Stack Hub to ensure data sovereignty.\n\n2. Migration Methodology\n- Phase 1: Assessment and Discovery using Azure Migrate.\n- Phase 2: Foundation setup.\n\n3. Redundancy & Continuity\n- Active-Passive Disaster Recovery setup.`
          : `1. Technical Proposal Overview\nUpdated proposal matching technical compliance guidelines. Focus on enterprise-grade hardware components.`),
      methodology: "Phased project rollout: Kickoff -> Delivery -> Inspection -> Handover.",
      technicalDocs: [
        'Technical Specification_Rev1.pdf',
        'Implementation Plan_Rev1.docx'
      ],
      commercialAmount: Math.round(baseAmount * 1.05),
      commercialBreakdown: [
        { item: 'Hardware Components', amount: Math.round(baseAmount * 1.05 * 0.7) },
        { item: 'Integration & Setup Services', amount: Math.round(baseAmount * 1.05 * 0.3) }
      ],
      paymentTerms: 'Payment Terms: 30% advance, 70% upon successful delivery.',
      commercialDoc: 'Commercial Proposal_Rev1.pdf',
      supportingDocs: [
        { id: 'doc1', name: 'Company Profile.pdf', category: 'Company Profile', date: '2026-05-01', status: 'approved' },
        { id: 'doc2', name: 'Financial Statements.xlsx', category: 'Financial Statements', date: '2026-04-20', status: 'approved' }
      ]
    },
    original: {
      label: 'Original Submission',
      technicalProposal: `[Original Submission - Pre-Correction]\n\n` + 
        (proposal?.id === 'PROP-102'
          ? `1. Cloud Strategy Overview\nWe propose general virtual server hosting on-premise or in public cloud.\n\n2. Migration Methodology\n- Manual database backup and restore.\n- Reinstallation of applications.\n\n3. Redundancy\n- Manual weekly snapshots.`
          : `1. Technical Proposal Overview\nInitial concept proposal for the requested services and supply. Standard scope applies.`),
      methodology: "Standard delivery lifecycle. No onsite support included.",
      technicalDocs: [
        'Technical Specification_Original.pdf'
      ],
      commercialAmount: Math.round(baseAmount * 1.15),
      commercialBreakdown: [
        { item: 'IT Hardware supply bundle', amount: Math.round(baseAmount * 1.15) }
      ],
      paymentTerms: 'Payment Terms: 100% advance payment prior to dispatch.',
      commercialDoc: 'Commercial Proposal_Original.pdf',
      supportingDocs: [
        { id: 'doc1', name: 'Company Profile.pdf', category: 'Company Profile', date: '2026-05-01', status: 'approved' }
      ]
    }
  };

  return defaultRevisions;
};

export default function AdminProposalDetail() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const { t, language } = useTranslation();
  const [selectedRevision, setSelectedRevision] = useState<'latest' | 'rev1' | 'original'>('latest');

  const getMappedStatus = (status: string): 'submitted' | 'under_review_vendor' | 'approved' | 'rejected' => {
    const norm = (status || '').toLowerCase().trim();
    if (norm === 'submitted') return 'submitted';
    if (norm === 'approved' || norm === 'selected') return 'approved';
    if (norm === 'rejected') return 'rejected';
    return 'under_review_vendor';
  };

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

  const proposal = mockProposals.find(p => p.id === proposalId) || mockProposals[0];
  const tender = mockTenders.find(r => r.id === proposal.tenderId) || mockTenders[0];
  const reviewers = mockAdminUsers.filter(u => u.role === 'reviewer' || u.role === 'technical_department' || u.role === 'commercial_department');

  const revisions = getProposalRevisions(proposal);
  const currentRevisionData = revisions[selectedRevision];

  const isFieldUpdated = (fieldName: string) => {
    if (selectedRevision === 'original') return false;
    const originalVal = revisions.original[fieldName];
    const currentVal = currentRevisionData[fieldName];
    if (typeof originalVal === 'object') {
      return JSON.stringify(originalVal) !== JSON.stringify(currentVal);
    }
    return originalVal !== currentVal;
  };



  const isInitiallyRejected = proposal.status === 'rejected';
  const isInitiallyApproved = proposal.status === 'approved';
  const [proposalRemark, setProposalRemark] = useState(
    proposal.id === 'PROP-101'
      ? ''
      : isInitiallyRejected
      ? 'The commercial proposal exceeded the allocated Tender budget limits.'
      : isInitiallyApproved
      ? 'Highly qualified vendor meeting all technical specs and commercial constraints.'
      : ''
  );
  const [overallStatus, setOverallStatus] = useState(proposal.status);
  const [decisionCompleted, setDecisionCompleted] = useState(
    proposal.id === 'PROP-101' ? !!proposal.remarks : ['approved', 'selected', 'rejected'].includes(proposal.status)
  );
  const [q1Remark, setQ1Remark] = useState<string>('');
  const [q2Remark, setQ2Remark] = useState<string>('');
  const [q3Remark, setQ3Remark] = useState<string>('');
  const [q1Rating, setQ1Rating] = useState<number>(0);
  const [q2Rating, setQ2Rating] = useState<number>(0);
  const [q3Rating, setQ3Rating] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [ratingRemark, setRatingRemark] = useState('');
  const [isRatingSaved, setIsRatingSaved] = useState(false);

  useEffect(() => {
    let sum = 0;
    let count = 0;
    if (q1Rating > 0) { sum += q1Rating; count++; }
    if (q2Rating > 0) { sum += q2Rating; count++; }
    if (q3Rating > 0) { sum += q3Rating; count++; }
    
    if (count > 0) {
      setOverallRating(Math.round(sum / count));
    } else {
      setOverallRating(0);
    }
  }, [q1Rating, q2Rating, q3Rating]);

  const handleSaveRatings = () => {
    if (!ratingRemark.trim()) {
      toast.error('Please enter comments or remarks before saving ratings.');
      return;
    }
    const ratingData = {
      q1Remark, q1Rating,
      q2Remark, q2Rating,
      q3Remark, q3Rating,
      overallRating,
      comments: ratingRemark,
      submittedBy: 'Admin',
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem(`external_rating_${proposal.id}`, JSON.stringify(ratingData));
    setIsRatingSaved(true);
    toast.success('Vendor performance ratings saved successfully!');
  };
  const [technicalReviewer, setTechnicalReviewer] = useState(
    isInitiallyRejected ? 'Mohammed Al Zaabi' : (isInitiallyApproved ? 'Mohammed Al Zaabi' : '')
  );
  const [commercialReviewer, setCommercialReviewer] = useState(
    isInitiallyRejected ? 'Mohammed Al Zaabi' : (isInitiallyApproved ? 'Mohammed Al Zaabi' : '')
  );
  const [technicalStatus, setTechnicalStatus] = useState(
    proposal.technicalStatus || (isInitiallyRejected ? 'approved' : (isInitiallyApproved ? 'approved' : 'pending'))
  );
  const [commercialStatus, setCommercialStatus] = useState(
    proposal.commercialStatus || (isInitiallyRejected ? 'rejected' : (isInitiallyApproved ? 'approved' : 'pending'))
  );

  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  // Reviewer remarks for technical and commercial evaluations
  const [technicalRemark, setTechnicalRemark] = useState(
    isInitiallyApproved ? 'All technical requirements met. Score: 85/100' : 
    isInitiallyRejected ? 'Technical approach does not meet the minimum compliance requirements.' : ''
  );
  const [commercialRemark, setCommercialRemark] = useState(
    isInitiallyApproved ? 'Pricing aligned with budget. Recommended for shortlisting.' : 
    isInitiallyRejected ? 'Pricing exceeds the maximum allocated budget and payment terms are unacceptable.' : ''
  );

  useEffect(() => {
    const savedExternalRating = localStorage.getItem(`external_rating_${proposal.id}`);
    if (savedExternalRating) {
      try {
        const data = JSON.parse(savedExternalRating);
        setQ1Remark(data.q1Remark || '');
        setQ2Remark(data.q2Remark || '');
        setQ3Remark(data.q3Remark || '');
        setRatingRemark(data.comments);
        setIsRatingSaved(true);
      } catch (e) {
        console.error("Error parsing external rating", e);
      }
    }
  }, [proposal.id]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'vendor', text: 'Hello, we have uploaded the consolidated technical specifications. Please review and let us know if you need further clarifications.', timestamp: '10:30 AM', unread: true },
    { id: 2, sender: 'vendor', text: 'Could you please confirm if the intermediate delivery milestone of 3 months fits the schedule?', timestamp: '11:15 AM', unread: true },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [newMessageText, setNewMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    
    setUnreadCount(0);
    const updatedMessages = messages.map(msg => ({ ...msg, unread: false }));

    const userMessage = {
      id: Date.now(),
      sender: 'admin',
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false
    };

    setMessages([...updatedMessages, userMessage]);
    setNewMessageText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const vendorReply = {
        id: Date.now() + 1,
        sender: 'vendor',
        text: 'Thank you for the update. We appreciate the fast feedback and will compile any additional documentation immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: false
      };
      setMessages(prev => [...prev, vendorReply]);
      toast.info('New message received from ' + proposal.vendorName);
    }, 2000);
  };

  const rfpFeedbacks = [
    {
      tenderId: 'TEND-2025-089',
      tenderTitle: t('Office IT Equipment Supply'),
      tenderDate: '12 Jan 2025',
      proposalId: 'PROP-2025-089-A',
      proposalDate: '02 Feb 2025',
      overallRating: 4.5,
      departments: [
        {
          department: t('IT Department'),
          evaluator: 'Ahmed Al Mansoori',
          avatar: 'AA',
          role: t('Technical Lead'),
          date: '16/03/2025',
          overallComments: t('The vendor delivered high-quality hardware within the requested timeframe.'),
          questions: [
            {
              question: t("How would you rate the hardware technical specifications and compliance?"),
              answer: t("All Dell Latitude laptops matched our corporate specs exactly, including the security TPM 2.0 module."),
              rating: 5
            },
            {
              question: t("Did the vendor complete user data migration on schedule?"),
              answer: t("Migration was completed, but had a slight delay due to lack of standard automation scripts."),
              rating: 4
            },
            {
              question: t("Rate the quality of technical documentation and user manuals."),
              answer: t("Provided standard manufacturer booklets, but custom deployment guides were missing."),
              rating: 4
            }
          ]
        },
        {
          department: t('Procurement Department'),
          evaluator: 'Sarah Al Hashmi',
          avatar: 'SH',
          role: t('Commercial Director'),
          date: '17/03/2025',
          overallComments: t('The vendor was highly compliant with terms and quick in negotiations.'),
          questions: [
            {
              question: t("Rate the vendor's transparency in pricing and BOQ breakdown."),
              answer: t("The itemized price list was extremely detailed, clear, and matched market baselines."),
              rating: 5
            },
            {
              question: t("How satisfied are you with their response to delivery SLA queries?"),
              answer: t("Delivered replies within 24 hours with concrete shipping schedules."),
              rating: 5
            },
            {
              question: t("Was the bank guarantee and compliance documentation submitted on time?"),
              answer: t("Submitted within 3 days of LPO issuance, which was within our expected timeline."),
              rating: 4
            }
          ]
        }
      ]
    },
    {
      tenderId: 'TEND-2024-112',
      tenderTitle: t('Network Security Audit'),
      tenderDate: '05 Sep 2024',
      proposalId: 'PROP-2024-112-C',
      proposalDate: '20 Sep 2024',
      overallRating: 2.0,
      departments: [
        {
          department: t('Security Department'),
          evaluator: 'Mohammed Khalid',
          avatar: 'MK',
          role: t('Chief Information Security Officer'),
          date: '12/11/2024',
          overallComments: t('The vendor team lacked experience and failed to deliver an acceptable audit report.'),
          questions: [
            {
              question: t("Rate the quality and depth of the penetration testing methodology?"),
              answer: t("Only automated Nessus scans were run; zero manual testing or exploitation was performed."),
              rating: 2
            },
            {
              question: t("Did the vendor deliver audit deliverables on schedule?"),
              answer: t("Missed the initial audit draft deadline by two weeks, delaying our compliance certification."),
              rating: 1
            },
            {
              question: t("Rate the professionalism and certification level of onsite resources."),
              answer: t("Onsite consultants were junior and lacked necessary certifications like OSCP or CEH."),
              rating: 2
            }
          ]
        },
        {
          department: t('Finance Department'),
          evaluator: 'Khalid Al Jaber',
          avatar: 'KA',
          role: t('Accounts Manager'),
          date: '14/11/2024',
          overallComments: t('Billing was confusing and they requested advance payments not in contract.'),
          questions: [
            {
              question: t("Rate their adherence to the commercial billing and invoicing terms."),
              answer: t("Sent commercial invoices before milestone completion and repeatedly called accounts receivable."),
              rating: 2
            },
            {
              question: t("How satisfied are you with their financial transparency?"),
              answer: t("Did not disclose third-party tool licensing costs until final billing."),
              rating: 2
            },
            {
              question: t("Did the vendor match the original contract value?"),
              answer: t("Attempted to raise change requests for standard firewall scans."),
              rating: 3
            }
          ]
        }
      ]
    }
  ];

  const handleChatFocus = () => {
    setUnreadCount(0);
    setMessages(prev => prev.map(msg => ({ ...msg, unread: false })));
  };

  const handleSaveTechnicalApproval = (val: string) => {
    setTechnicalReviewer(val);
    proposal.technicalReviewer = val;
    proposal.status = 'technical_review_started';
    proposal.technicalStatus = 'under_review';
    setOverallStatus('technical_review_started');
    setTechnicalStatus('under_review');
    saveProposalsToStorage(mockProposals);
    toast.success(`Technical reviewer ${val} assigned. Status set to Technical Review Started.`);
  };

  const handleSaveCommercialApproval = (val: string) => {
    setCommercialReviewer(val);
    proposal.commercialReviewer = val;
    proposal.status = 'commercial_review_started';
    proposal.commercialStatus = 'under_review';
    setOverallStatus('commercial_review_started');
    setCommercialStatus('under_review');
    saveProposalsToStorage(mockProposals);
    toast.success(`Commercial reviewer ${val} assigned. Status set to Commercial Review Started.`);
  };

  const handleTechnicalStatusUpdate = (status: 'approved' | 'rejected' | 'correction_requested') => {
    if (!technicalReviewer.trim()) {
      toast.error('Please select a Technical Reviewer first.');
      return;
    }
    if (!technicalRemark.trim()) {
      toast.error('Please enter a remark before submitting the Technical evaluation decision.');
      return;
    }
    proposal.technicalStatus = status;
    proposal.technicalReviewer = technicalReviewer;
    // Save remarks to proposal so vendor portal can display them
    proposal.remarks = technicalRemark;
    setTechnicalStatus(status);
    
    if (status === 'rejected') {
      proposal.status = 'technical_review_rejected';
      setOverallStatus('technical_review_rejected');
      saveProposalsToStorage(mockProposals);
      toast.error('Technical evaluation Rejected.');
    } else if (status === 'correction_requested') {
      proposal.status = 'technical_correction_requested';
      setOverallStatus('technical_correction_requested');
      saveProposalsToStorage(mockProposals);
      toast.warning('Technical Correction Requested.');
    } else {
      proposal.status = 'technical_review_completed';
      setOverallStatus('technical_review_completed');
      saveProposalsToStorage(mockProposals);
      toast.success('Technical Review Completed (Approved).');
    }
  };

  const handleCommercialStatusUpdate = (status: 'approved' | 'rejected' | 'correction_requested') => {
    if (!commercialReviewer.trim()) {
      toast.error('Please select a Commercial Reviewer first.');
      return;
    }
    if (!commercialRemark.trim()) {
      toast.error('Please enter a remark before submitting the Commercial evaluation decision.');
      return;
    }
    proposal.commercialStatus = status;
    proposal.commercialReviewer = commercialReviewer;
    // Save remarks to proposal so vendor portal can display them
    proposal.remarks = commercialRemark;
    setCommercialStatus(status);

    if (status === 'rejected') {
      proposal.status = 'commercial_review_rejected';
      setOverallStatus('commercial_review_rejected');
      saveProposalsToStorage(mockProposals);
      toast.error('Commercial evaluation Rejected.');
    } else if (status === 'correction_requested') {
      proposal.status = 'commercial_correction_requested';
      setOverallStatus('commercial_correction_requested');
      saveProposalsToStorage(mockProposals);
      toast.warning('Commercial Correction Requested.');
    } else {
      proposal.status = 'commercial_review_completed';
      setOverallStatus('commercial_review_completed');
      saveProposalsToStorage(mockProposals);
      toast.success('Commercial Review Completed (Approved).');
    }
  };

  const handleApproveProposalAction = () => {
    if (!proposalRemark.trim()) {
      toast.error('Please enter a remark or justification before approving.');
      return;
    }
    proposal.status = 'approved';
    proposal.remarks = proposalRemark;
    setOverallStatus('approved');
    setDecisionCompleted(true);
    saveProposalsToStorage(mockProposals);
    toast.success('Proposal Approved successfully!');
  };

  const handleRejectProposalAction = () => {
    if (!proposalRemark.trim()) {
      toast.error('Please enter a remark or justification before rejecting.');
      return;
    }
    proposal.status = 'rejected';
    proposal.remarks = proposalRemark;
    setOverallStatus('rejected');
    setDecisionCompleted(true);
    setTechnicalReviewer('Technical Reviewer');
    setCommercialReviewer('Commercial Reviewer');
    setTechnicalStatus('approved');
    setCommercialStatus('rejected');
    saveProposalsToStorage(mockProposals);
    toast.error('Proposal Rejected successfully! Remarks saved.');
  };

  const handleCorrectionProposalAction = () => {
    if (!proposalRemark.trim()) {
      toast.error('Please enter a remark or justification before requesting correction.');
      return;
    }
    proposal.status = 'correction_requested';
    setOverallStatus('correction_requested');
    setTechnicalStatus('correction_requested');
    setCommercialStatus('correction_requested');
    saveProposalsToStorage(mockProposals);
    toast.warning('Correction Requested! Vendor has been notified to edit and resubmit.');
  };
  const technicalDocs = currentRevisionData.technicalDocs;
  const commercialBreakdown = currentRevisionData.commercialBreakdown;
  const supportingDocs = currentRevisionData.supportingDocs;


  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_correction_requested: { bg: '#FEF3C7', text: '#EA580C' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      correction_requested: { bg: '#FEF3C7', text: '#F59E0B' },
    };
    return colors[status] || colors.submitted;
  };

  const statusColor = getStatusColor(overallStatus);

  const auditLogs = [
    {
      date: formatDate(proposal.submissionDate),
      time: '09:00 AM',
      action: 'Proposal Submitted',
      name: proposal.vendorName,
      status: 'submitted',
      remarks: 'Proposal successfully submitted by vendor.'
    }
  ];

  if (proposal.technicalReviewer) {
    auditLogs.push({
      date: formatDate(proposal.submissionDate),
      time: '10:15 AM',
      action: 'Technical Review Assigned',
      name: proposal.technicalReviewer,
      status: 'assigned',
      remarks: 'Assigned for technical evaluation.'
    });
  }

  if (proposal.commercialReviewer) {
    auditLogs.push({
      date: formatDate(proposal.submissionDate),
      time: '10:30 AM',
      action: 'Commercial Review Assigned',
      name: proposal.commercialReviewer,
      status: 'assigned',
      remarks: 'Assigned for commercial evaluation.'
    });
  }

  if (technicalStatus === 'approved' || technicalStatus === 'rejected') {
    auditLogs.push({
      date: formatDate(proposal.submissionDate),
      time: '11:45 AM',
      action: 'Technical Evaluation',
      name: proposal.technicalReviewer || 'System',
      status: technicalStatus,
      remarks: proposal.remarks || 'Evaluation completed.'
    });
  }

  if (commercialStatus === 'approved' || commercialStatus === 'rejected') {
    auditLogs.push({
      date: formatDate(proposal.submissionDate),
      time: '14:20 PM',
      action: 'Commercial Evaluation',
      name: proposal.commercialReviewer || 'System',
      status: commercialStatus,
      remarks: proposal.remarks || 'Evaluation completed.'
    });
  }

  if (overallStatus === 'approved') {
    auditLogs.push({
      date: formatDate(proposal.approvedDate || new Date()),
      time: '16:00 PM',
      action: 'Proposal Approved',
      name: 'System',
      status: 'approved',
      remarks: 'Proposal successfully approved for further stages.'
    });
  }

  const getAdminActivityLog = () => {
    const logs = [
      {
        action: 'Proposal Submitted',
        performedBy: 'Vendor',
        date: proposal.submissionDate,
        time: '10:30 AM',
        remarks: '—'
      }
    ];

    if (overallStatus === 'submitted') return logs;

    if (proposal.id === 'PROP-105') {
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

    if (overallStatus === 'commercial_review_started') {
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

    if (proposal.technicalReviewer || ['technical_review_started', 'technical_review_completed', 'technical_correction_requested', 'commercial_review_started', 'commercial_review_completed', 'commercial_correction_requested', 'approved', 'selected', 'rejected'].includes(overallStatus)) {
      logs.push({
        action: 'Technical Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-12',
        time: '09:00 AM',
        remarks: 'Technical proposal review initiated'
      });
    }

    if (overallStatus === 'technical_correction_requested') {
      logs.push({
        action: 'Technical Correction Requested',
        performedBy: 'Reviewer',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: proposal.remarks || 'Clarification needed on failover mechanisms.'
      });
      return logs;
    }

    if (proposal.id === 'PROP-102' && overallStatus === 'technical_review') {
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

    if (technicalStatus === 'approved' || ['technical_review_completed', 'commercial_review_started', 'commercial_review_completed', 'commercial_correction_requested', 'approved', 'selected', 'rejected'].includes(overallStatus)) {
      logs.push({
        action: 'Technical Proposal Approved',
        performedBy: 'Reviewer',
        date: '2026-02-15',
        time: '02:45 PM',
        remarks: 'All technical requirements met. Score: 85/100'
      });
    }

    if (proposal.commercialReviewer || ['commercial_review_started', 'commercial_review_completed', 'commercial_correction_requested', 'approved', 'selected', 'rejected'].includes(overallStatus)) {
      logs.push({
        action: 'Commercial Review Started',
        performedBy: 'Reviewer',
        date: '2026-02-16',
        time: '11:00 AM',
        remarks: 'Commercial proposal under evaluation'
      });
    }

    if (overallStatus === 'commercial_correction_requested') {
      logs.push({
        action: 'Commercial Correction Requested',
        performedBy: 'Reviewer',
        date: '2026-05-18',
        time: '02:30 PM',
        remarks: proposal.remarks || 'Clarification needed on pricing model.'
      });
      return logs;
    }

    if (commercialStatus === 'approved' || ['commercial_review_completed', 'approved', 'selected', 'rejected'].includes(overallStatus)) {
      logs.push({
        action: 'Commercial Proposal Approved',
        performedBy: 'Reviewer',
        date: '2026-02-18',
        time: '04:30 PM',
        remarks: 'Pricing aligned with budget. Recommended for shortlisting'
      });
    }

    if (overallStatus === 'rejected') {
      logs.push({
        action: 'Proposal Rejected',
        performedBy: 'Procurement Admin',
        date: '2026-02-20',
        time: '11:45 AM',
        remarks: proposalRemark || 'Proposal did not meet requirements'
      });
    } else if (['approved', 'selected'].includes(overallStatus)) {
      logs.push({
        action: 'Proposal Approved',
        performedBy: 'Procurement Admin',
        date: '2026-02-20',
        time: '10:00 AM',
        remarks: proposalRemark || 'Selected for final evaluation round'
      });
    }

    return logs;
  };


  const isFinal = ['approved', 'selected', 'rejected'].includes(overallStatus);
  const hasReviewActivity = 
    (technicalReviewer && technicalReviewer !== '') ||
    (commercialReviewer && commercialReviewer !== '') ||
    (technicalStatus && !['pending', 'submitted'].includes(technicalStatus)) ||
    (commercialStatus && !['pending', 'submitted'].includes(commercialStatus));
  const isUnderReview = !isFinal && (overallStatus !== 'submitted' || hasReviewActivity);

  let finalLabel = 'Final Decision';
  if (proposal.id === 'PROP-105') {
    finalLabel = 'Completed';
  } else if (overallStatus === 'rejected') {
    finalLabel = 'Rejected';
  } else if (['approved', 'selected'].includes(overallStatus)) {
    finalLabel = 'Approved';
  }

  const timelineStages = [
    { key: 'submitted', label: t('Submitted') },
    { key: 'under_review', label: t('Under Review') },
    { key: 'final_decision', label: t(finalLabel) }
  ];

  let currentStageKey = 'submitted';
  let completedStageKeys: string[] = [];

  if (overallStatus === 'submitted' && !hasReviewActivity) {
    currentStageKey = 'submitted';
    completedStageKeys = [];
  } else if (isUnderReview) {
    currentStageKey = 'under_review';
    completedStageKeys = ['submitted'];
  } else if (isFinal) {
    currentStageKey = 'final_decision';
    completedStageKeys = ['submitted', 'under_review', 'final_decision'];
  }

  const techCardStatus = overallStatus === 'submitted' 
    ? 'submitted' 
    : (!technicalStatus || technicalStatus === 'pending')
      ? 'technical_review_started'
      : technicalStatus;

  const commCardStatus = overallStatus === 'submitted' 
    ? 'submitted' 
    : (!commercialStatus || commercialStatus === 'pending')
      ? 'commercial_review_started'
      : commercialStatus;

  return (
    <div className="space-y-6 p-4 font-sans">
      {/* Header back button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/tenders/${proposal.tenderId}`)} className="rounded-full">
            <ArrowLeft className={cn("h-5 w-5", language === 'ar' && "scale-x-[-1]")} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>{proposal.id}</h1>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>{t("Vendor")}: {proposal.vendorName}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="flex w-full border-b border-gray-200 gap-8 overflow-x-auto overflow-y-hidden bg-transparent scrollbar-hide">
          <TabsTrigger 
            value="summary"
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t("Proposal Summary")}
          </TabsTrigger>
          {tender?.technicalProposalRequired !== 'no' && (
            <TabsTrigger 
              value="technical"
              className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
            >
              {t("Technical Proposal")}
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="commercial"
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t("Commercial Proposal")}
          </TabsTrigger>
          <TabsTrigger 
            value="supporting"
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t("Supporting Documents")}
          </TabsTrigger>
          <TabsTrigger 
            value="feedback"
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t("Vendor Feedback")}
          </TabsTrigger>
          {(tender.status === 'published') && (
            <TabsTrigger 
              value="action"
              disabled={
                !(tender?.technicalProposalRequired === 'no' 
                  ? commercialStatus === 'approved' 
                  : (technicalStatus === 'approved' && commercialStatus === 'approved')) 
                && !['approved', 'approved', 'rejected'].includes(overallStatus)
              }
              className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {t("Proposal Action")}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {/* Progress Timeline */}
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">{t('Evaluation Progress')}</CardTitle>
            </CardHeader>
            <CardContent className="!pt-4 px-6 pb-4">
              <ProgressTimeline 
                stages={timelineStages}
                currentStageKey={currentStageKey}
                completedStageKeys={completedStageKeys}
              />
            </CardContent>
          </Card>

          {/* Technical and Commercial Review overview cards */}
          <div className="space-y-3">
            <div className="border-l-4 border-[var(--fnrc-accent-gold)] pl-3">
              <h2 className="text-lg font-bold text-gray-850">
                {t('Under Review Status')}
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                {t('The overall Under Review stage consists of two parts: Technical and Commercial evaluation')}
              </p>
            </div>
            <div className={cn("grid gap-6", tender?.technicalProposalRequired === 'no' ? "grid-cols-1" : "md:grid-cols-2")}>
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
                    {technicalRemark && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-md border border-gray-100 mt-1">
                        <span className="font-semibold block text-gray-700 mb-0.5">{t('Remarks')}:</span>
                        <p className="italic font-normal">"{technicalRemark}"</p>
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
                  {commercialRemark && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-md border border-gray-100 mt-1">
                      <span className="font-semibold block text-gray-700 mb-0.5">{t('Remarks')}:</span>
                      <p className="italic font-normal">"{commercialRemark}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="gap-0 h-auto" style={{ borderColor: overallStatus === 'rejected' ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)', borderWidth: '2px' }}>
            <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">{t('Proposal Summary')}</CardTitle>
            </CardHeader>
            <CardContent className="!pt-4 !pb-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm font-bold text-black block">{t('Proposal ID')}</span>
                  <span 
                    className="text-base font-normal text-[var(--fnrc-primary-green)] mt-1 block cursor-pointer hover:underline" 
                    onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                  >
                    {proposal.id}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-bold text-black block">{t('Tender Number - Tender Title')}</span>
                  <span className="text-base font-normal text-gray-800 mt-1 block">{proposal.tenderId} - {proposal.tenderTitle}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-black block">{t('Status')}</span>
                  <div className="mt-1">
                    <StatusBadge status={getMappedStatus(overallStatus)} />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <div>
                  <span className="text-sm font-bold text-black block">{t('Proposal Date')}</span>
                  <span className="text-base font-normal text-gray-800 mt-1 block">{formatDate(proposal.submissionDate)}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-black block">{t('Commercial Amount')}</span>
                  <span className="text-base font-normal text-gray-800 mt-1 block">AED {proposal.commercialAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Activity */}
          <Card className="mt-6">
            <CardHeader className="pt-5 pb-1 px-6 border-none bg-transparent">
              <CardTitle className="text-lg font-bold text-gray-900">{t("Detailed Activity")}</CardTitle>
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
                    {getAdminActivityLog().map((log, idx) => (
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
        </TabsContent>

        {tender?.technicalProposalRequired !== 'no' && (
        <TabsContent value="technical" className="space-y-6">
          {/* Technical Approach */}
          <Card>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                <Briefcase className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                {t("Technical Approach")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">{t("Revision History")}:</span>
                <Select value={selectedRevision} onValueChange={(val: any) => setSelectedRevision(val)}>
                  <SelectTrigger className="w-[200px] h-8 border-gray-200 text-xs font-semibold text-gray-750 bg-white rounded-md shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest" className="font-semibold text-xs text-gray-700">{t(revisions.latest.label)}</SelectItem>
                    <SelectItem value="rev1" className="font-semibold text-xs text-gray-700">{t(revisions.rev1.label)}</SelectItem>
                    <SelectItem value="original" className="font-semibold text-xs text-gray-700">{t(revisions.original.label)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6 space-y-4">
              <div className={cn(
                "p-5 rounded-xl border space-y-4 transition-all duration-300",
                isFieldUpdated('technicalProposal')
                  ? "bg-emerald-50/10 border-emerald-200/80 shadow-sm"
                  : "bg-gray-50/50 border-gray-100"
              )}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-black block">{t("Approach")}</h4>
                    {isFieldUpdated('technicalProposal') && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide animate-pulse">
                        {t("Updated Field")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-normal text-gray-800 leading-relaxed whitespace-pre-line">
                    {currentRevisionData.technicalProposal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Documents */}
          <Card className={cn(
            "transition-all duration-300",
            isFieldUpdated('technicalDocs')
              ? "bg-emerald-50/10 border-emerald-200/80 shadow-sm"
              : ""
          )}>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                {t("Submitted Technical Documents")}
              </CardTitle>
              {isFieldUpdated('technicalDocs') && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                  {t("Updated Field")}
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {technicalDocs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[var(--fnrc-primary-green)] transition-all bg-white">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-xs font-normal text-gray-800">{doc}</div>
                        <div className="text-[9px] text-muted-foreground font-bold">PDF • 1.8 MB</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[var(--fnrc-primary-green)]">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Approval Matrix */}
          <Card>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                <ShieldCheck className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                {t("Technical Approval Matrix")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6 space-y-5">
              <div className="max-w-md w-full">
                <label className="text-sm font-bold text-black block mb-1">{t("Technical Reviewer Name")}</label>
                <Select value={technicalReviewer} onValueChange={handleSaveTechnicalApproval}>
                  <SelectTrigger className="w-full h-9 border-gray-200 text-sm font-normal text-gray-800 bg-white">
                    <SelectValue placeholder={t("Select Technical Reviewer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.id} value={reviewer.name} className="font-semibold text-xs text-gray-700">
                        {reviewer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {/* Remarks textarea */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-black flex items-center gap-1 mb-1">
                    {t("Reviewer Remarks")}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={t("Enter Remarks")}
                    value={technicalRemark}
                    onChange={(e) => setTechnicalRemark(e.target.value)}
                    className="min-h-[90px] text-sm border-gray-200 bg-white resize-none focus:border-[var(--fnrc-primary-green)] focus:ring-[var(--fnrc-primary-green)] font-normal text-gray-800"
                  />
                </div>

                {/* Decision buttons */}
                {(overallStatus !== 'approved' && overallStatus !== 'rejected') && (
                  <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleTechnicalStatusUpdate('approved')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      technicalStatus === 'approved'
                        ? 'border-transparent text-white'
                        : 'border-green-200 text-green-700 hover:bg-green-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: technicalStatus === 'approved' ? 'var(--fnrc-success)' : undefined
                    }}
                  >
                    <Check className={`h-4 w-4 ${technicalStatus === 'approved' ? 'text-white' : 'text-green-600'}`} />
                    {t("Approved")}
                  </Button>
                  <Button
                    onClick={() => handleTechnicalStatusUpdate('rejected')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      technicalStatus === 'rejected'
                        ? 'border-transparent text-white'
                        : 'border-red-200 text-red-700 hover:bg-red-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: technicalStatus === 'rejected' ? '#EF4444' : undefined
                    }}
                  >
                    <X className={`h-4 w-4 ${technicalStatus === 'rejected' ? 'text-white' : 'text-red-500'}`} />
                    {t("Rejected")}
                  </Button>
                  <Button
                    onClick={() => handleTechnicalStatusUpdate('correction_requested')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      technicalStatus === 'correction_requested'
                        ? 'border-transparent text-white'
                        : 'border-amber-200 text-amber-700 hover:bg-amber-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: technicalStatus === 'correction_requested' ? '#F59E0B' : undefined
                    }}
                  >
                    <Clock className={`h-4 w-4 ${technicalStatus === 'correction_requested' ? 'text-white' : 'text-amber-500'}`} />
                    {t("Correction Requested")}
                  </Button>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        <TabsContent value="commercial" className="space-y-6">
          {/* Commercial Details Card */}
          <Card>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                <Briefcase className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                {t("Commercial Proposal")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">{t("Revision History")}:</span>
                <Select value={selectedRevision} onValueChange={(val: any) => setSelectedRevision(val)}>
                  <SelectTrigger className="w-[200px] h-8 border-gray-200 text-xs font-semibold text-gray-700 bg-white rounded-md shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest" className="font-semibold text-xs text-gray-700">{t(revisions.latest.label)}</SelectItem>
                    <SelectItem value="rev1" className="font-semibold text-xs text-gray-700">{t(revisions.rev1.label)}</SelectItem>
                    <SelectItem value="original" className="font-semibold text-xs text-gray-700">{t(revisions.original.label)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6 space-y-4">
              <div className={cn(
                "p-5 rounded-xl border space-y-4 transition-all duration-300",
                isFieldUpdated('commercialBreakdown') || isFieldUpdated('paymentTerms') || isFieldUpdated('commercialDoc')
                  ? "bg-emerald-50/10 border-emerald-200/80 shadow-sm"
                  : "bg-gray-50/50 border-gray-100"
              )}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-black block">{t("Cost Breakdown Details")}</h4>
                    {isFieldUpdated('commercialBreakdown') && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                        {t("Updated Field")}
                      </span>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow className="border-b border-gray-250 hover:bg-gray-50/80">
                          <TableHead className="font-bold text-[10px] text-black uppercase tracking-wider w-[40%]">{t("Description")}</TableHead>
                          <TableHead className="font-bold text-[10px] text-black uppercase tracking-wider text-center w-[20%]">{t("Unit Price (AED)")}</TableHead>
                          <TableHead className="font-bold text-[10px] text-black uppercase tracking-wider text-center w-[20%]">{t("Quantity")}</TableHead>
                          <TableHead className="font-bold text-[10px] text-black uppercase tracking-wider text-right w-[20%] pe-4">{t("Amount (AED)")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commercialBreakdown.map((entry, i) => (
                          <TableRow key={i} className="border-b border-gray-100 bg-white hover:bg-white">
                            <TableCell className="p-3 text-sm font-normal text-gray-800">
                              {entry.item}
                            </TableCell>
                            <TableCell className="p-3 text-sm text-center font-normal text-gray-600">
                              {entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="p-3 text-sm text-center font-normal text-gray-600">
                              1
                            </TableCell>
                            <TableCell className="p-3 text-sm text-right font-normal text-gray-800">
                              {entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-end items-center gap-6">
                      <span className="font-bold text-sm text-black">{t("Total Proposal Amount")}</span>
                      <span className="font-bold text-lg text-[var(--fnrc-primary-green)]">
                        AED {commercialBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-black block">{t("Payment Milestones & Terms")}</h4>
                    {isFieldUpdated('paymentTerms') && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                        {t("Updated Field")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-855 font-normal leading-relaxed whitespace-pre-line bg-white p-4 border rounded-xl border-gray-150">
                    {currentRevisionData.paymentTerms}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-black block">{t("Commercial Document")}</h4>
                    {isFieldUpdated('commercialDoc') && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                        {t("Updated Field")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-155 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="text-xs font-normal text-gray-800">{currentRevisionData.commercialDoc}</div>
                        <div className="text-[10px] text-gray-400 font-bold">PDF • 3.1 MB</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[var(--fnrc-primary-green)]">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial Approval Matrix */}
          <Card>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                <ShieldCheck className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                {t("Commercial Approval Matrix")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6 space-y-5">
              <div className="max-w-md w-full">
                <label className="text-sm font-bold text-black block mb-1">{t("Commercial Reviewer Name")}</label>
                <Select value={commercialReviewer} onValueChange={handleSaveCommercialApproval}>
                  <SelectTrigger className="w-full h-9 border-gray-200 text-sm font-normal text-gray-800 bg-white">
                    <SelectValue placeholder={t("Select Commercial Reviewer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.id} value={reviewer.name} className="font-semibold text-xs text-gray-700">
                        {reviewer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {/* Remarks textarea */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-black flex items-center gap-1 mb-1">
                    {t("Reviewer Remarks")}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={t("Enter Remarks")}
                    value={commercialRemark}
                    onChange={(e) => setCommercialRemark(e.target.value)}
                    className="min-h-[90px] text-sm border-gray-200 bg-white resize-none focus:border-[var(--fnrc-primary-green)] focus:ring-[var(--fnrc-primary-green)] font-normal text-gray-800"
                  />
                </div>

                {/* Decision buttons */}
                {(overallStatus !== 'approved' && overallStatus !== 'rejected') && (
                  <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleCommercialStatusUpdate('approved')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      commercialStatus === 'approved'
                        ? 'border-transparent text-white'
                        : 'border-green-200 text-green-700 hover:bg-green-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: commercialStatus === 'approved' ? 'var(--fnrc-success)' : undefined
                    }}
                  >
                    <Check className={`h-4 w-4 ${commercialStatus === 'approved' ? 'text-white' : 'text-green-600'}`} />
                    {t("Approved")}
                  </Button>
                  <Button
                    onClick={() => handleCommercialStatusUpdate('rejected')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      commercialStatus === 'rejected'
                        ? 'border-transparent text-white'
                        : 'border-red-200 text-red-700 hover:bg-red-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: commercialStatus === 'rejected' ? '#EF4444' : undefined
                    }}
                  >
                    <X className={`h-4 w-4 ${commercialStatus === 'rejected' ? 'text-white' : 'text-red-500'}`} />
                    {t("Rejected")}
                  </Button>
                  <Button
                    onClick={() => handleCommercialStatusUpdate('correction_requested')}
                    className={`h-9 px-4 font-bold text-xs flex items-center gap-1.5 border transition-all ${
                      commercialStatus === 'correction_requested'
                        ? 'border-transparent text-white'
                        : 'border-amber-200 text-amber-700 hover:bg-amber-50/50 bg-white'
                    }`}
                    style={{ 
                      backgroundColor: commercialStatus === 'correction_requested' ? '#F59E0B' : undefined
                    }}
                  >
                    <Clock className={`h-4 w-4 ${commercialStatus === 'correction_requested' ? 'text-white' : 'text-amber-500'}`} />
                    {t("Correction Requested")}
                  </Button>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supporting" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t("Supporting Documents")}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">{t("Select Revision")}:</span>
              <Select value={selectedRevision} onValueChange={(val: any) => setSelectedRevision(val)}>
                <SelectTrigger className="w-[200px] h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">{t("Revision 2")}</SelectItem>
                  <SelectItem value="rev1">{t("Revision 1")}</SelectItem>
                  <SelectItem value="original">{t("Original Submission")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className={cn(
            "transition-all duration-300",
            isFieldUpdated('supportingDocs')
              ? "bg-emerald-50/10 border-emerald-200/80 shadow-sm"
              : ""
          )}>
            <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6">
              <CardTitle className="text-lg font-bold flex items-center justify-between text-black">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  {t("Supporting Documents")}
                </div>
                {isFieldUpdated('supportingDocs') && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 uppercase tracking-wide text-[10px] font-bold">
                    {t("Updated Field")}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-bold text-xs text-black">{t("Document Name")}</TableHead>
                    <TableHead className="font-bold text-xs text-black">{t("Document Category")}</TableHead>
                    <TableHead className="font-bold text-xs text-black">{t("Upload Date")}</TableHead>
                    <TableHead className="text-right pe-4 font-bold text-xs text-black">{t("Action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportingDocs.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-gray-50/30">
                      <TableCell className="font-normal text-sm text-gray-800 py-3">{doc.name}</TableCell>
                      <TableCell className="font-normal text-xs text-gray-600 py-3">{doc.category}</TableCell>
                      <TableCell className="font-normal text-xs text-gray-600 py-3">
                        {formatDate(doc.date)}
                      </TableCell>
                      <TableCell className="text-right pe-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--fnrc-primary-green)]">
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

        {tender.status === 'published' && (
          <TabsContent value="action" className="space-y-6">
            
            {/* CARD 1: Proposal Action */}
            <Card>
              <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                  <Award className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  {t("Proposal Action")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1 px-6 pb-6 space-y-4">
                {decisionCompleted ? (
                  overallStatus === 'rejected' ? (
                    <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl space-y-3.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="rejected" />
                        <span className="text-[10px] text-gray-500 font-bold">{t("Decision Completed")}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-black mb-1 block">{t("Final Remarks:")}</span>
                        <p className="text-sm font-normal text-gray-800 bg-white p-3 rounded-lg border border-gray-150 leading-relaxed">
                          {proposalRemark || "The commercial proposal exceeded the allocated Tender budget limits."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl space-y-3.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="approved" />
                        <span className="text-[10px] text-gray-500 font-bold">{t("Decision Completed")}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-black mb-1 block">{t("Final Remarks:")}</span>
                        <p className="text-sm font-normal text-gray-800 bg-white p-3 rounded-lg border border-gray-150 leading-relaxed">
                          {proposalRemark || "Highly qualified vendor meeting all technical specs and commercial constraints."}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  // Pending decision — show Approve / Reject only
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="remark" className="text-sm font-bold text-black block mb-1">{t("Remarks")} <span className="text-red-500">*</span></label>
                      <textarea
                        id="remark"
                        rows={3}
                        placeholder={t("Enter Remarks")}
                        value={proposalRemark}
                        onChange={(e) => setProposalRemark(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm font-normal text-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApproveProposalAction}
                        className="text-white h-9 px-6 font-bold text-xs flex items-center gap-2"
                        style={{ backgroundColor: 'var(--fnrc-success)' }}
                      >
                        <Check className="h-4 w-4" />
                        {t("Approve")}
                      </Button>
                      <Button
                        onClick={handleRejectProposalAction}
                        className="text-white h-9 px-6 font-bold text-xs flex items-center gap-2"
                        style={{ backgroundColor: '#EF4444' }}
                      >
                        <X className="h-4 w-4" />
                        {t("Reject")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CARD 2: Vendor reviews and ratings - displayed below */}
            <Card>
              <CardHeader className="border-none bg-transparent pt-5 pb-1 px-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                      <Award className="h-5 w-5 text-amber-500" />
                      {t("Vendor Rating")}
                    </CardTitle>
                    <div className="flex flex-col gap-1.5 bg-white p-3 rounded-md border shadow-sm">
                      <div className="text-sm">
                        <span className="font-bold text-black me-2 text-xs">{t("TENDER NAME:")}</span> 
                        <span className="text-gray-800 font-normal">{tender.title}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-black me-2 text-xs">{t("PROPOSAL ID:")}</span>
                        <span className="text-[var(--fnrc-primary-green)] font-normal">{proposal.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs font-bold border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors h-9 flex items-center gap-1.5 shadow-sm"
                      onClick={() => setShowShareModal(true)}
                    >
                      <Award className="h-3.5 w-3.5" />
                      {t("Generate Rating Link")}
                    </Button>
                    {isRatingSaved && (overallStatus !== 'approved' && overallStatus !== 'rejected') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs font-bold border-gray-250 text-gray-600 hover:bg-gray-55 h-9 shadow-sm"
                        onClick={() => setIsRatingSaved(false)}
                      >
                        {t("Edit Ratings")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-1 px-6 pb-6 space-y-6">
                {isRatingSaved ? (
                  <div className="bg-white space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="text-[11px] text-gray-400 font-normal">
                        {t("Reviewed by Fatima Al Hammadi on 18/02/2026")}
                      </div>
                    </div>

                    {/* Ratings List */}
                    <div className="space-y-4">
                      {[
                        { label: t("How would you rate the vendor's technical capability?"), value: q1Remark, rating: q1Rating, isTechnical: true },
                        { label: t("Does the vendor have relevant experience in the required domain?"), value: q2Remark, rating: q2Rating },
                        { label: t("Rate the vendor's financial stability."), value: q3Remark, rating: q3Rating }
                      ].filter(q => !q.isTechnical || tender?.technicalProposalRequired !== 'no').map((q, i) => (
                        <div key={i} className="flex flex-col p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-black">{q.label}</span>
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-bold text-gray-800">{q.rating || '-'} / 5</span>
                            </div>
                          </div>
                          <span className="text-sm font-normal text-gray-800 bg-white p-3 rounded-md border border-gray-100">{q.value || t("No remarks provided.")}</span>
                        </div>
                      ))}
                    </div>

                    {/* Admin Comments */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold text-black mb-1">{t("Overall Comments & Rating")}</h4>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-bold text-amber-700">{overallRating || '-'} / 5</span>
                        </div>
                      </div>
                      <p className="text-sm font-normal text-gray-800 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        {ratingRemark || "Outstanding technical proposal with comprehensive documentation. Team demonstrated excellent understanding of requirements. All compliance criteria met. Recommended for shortlisting."}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Interactive Star Rating Form */
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-black flex items-center gap-1.5 mb-1">
                        <Award className="h-4 w-4 text-amber-500" />
                        {t("Vendor Rating Matrix")}
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { label: t("How would you rate the vendor's technical capability?"), value: q1Remark, setter: setQ1Remark, rating: q1Rating, setRating: setQ1Rating, isTechnical: true },
                          { label: t("Does the vendor have relevant experience in the required domain?"), value: q2Remark, setter: setQ2Remark, rating: q2Rating, setRating: setQ2Rating },
                          { label: t("Rate the vendor's financial stability."), value: q3Remark, setter: setQ3Remark, rating: q3Rating, setRating: setQ3Rating }
                        ].filter(q => !q.isTechnical || tender?.technicalProposalRequired !== 'no').map((q, i) => (
                          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col gap-4">
                            <span className="text-sm font-bold text-black">{q.label}</span>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-black uppercase tracking-wide">{t("Answer")}</label>
                              <Textarea
                                placeholder={t("Enter your answer here...")}
                                value={q.value}
                                onChange={(e) => q.setter(e.target.value)}
                                className="w-full text-sm resize-none focus-visible:ring-[var(--fnrc-primary-green)] font-normal text-gray-800"
                                rows={2}
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-xs font-bold text-black uppercase tracking-wide">{t("Rating (out of 5)")}</label>
                              <Select value={q.rating ? q.rating.toString() : ''} onValueChange={(val) => q.setRating(Number(val))}>
                                <SelectTrigger className="w-32 h-9 border-gray-200 font-bold focus:ring-[var(--fnrc-primary-green)] text-gray-800">
                                  <SelectValue placeholder={t("Select")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map(num => (
                                    <SelectItem key={num} value={num.toString()} className="font-bold">{num} / 5</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dedicated Remarks for Vendor Rating system */}
                      <div className="space-y-3 pt-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <label htmlFor="ratingRemarkInput" className="text-sm font-bold text-black block mb-1">{t("Overall Vendor Rating & Justification")}</label>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-normal text-gray-600">{t("Calculated Overall Rating:")}</span>
                            <div className="flex items-center gap-1.5 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 shadow-sm">
                               <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                               <span className="text-sm font-bold text-amber-700">{overallRating > 0 ? overallRating : '-'} / 5</span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          id="ratingRemarkInput"
                          rows={3}
                          placeholder={t("Enter specific remarks regarding this vendor's performance...")}
                          value={ratingRemark}
                          onChange={(e) => setRatingRemark(e.target.value)}
                          className="w-full p-4 rounded-xl border border-gray-200 text-sm font-normal text-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end pt-4 border-t border-gray-100">
                        <Button
                          onClick={handleSaveRatings}
                          className="text-white h-10 px-8 font-bold text-sm flex items-center gap-2 rounded-xl"
                          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                        >
                          <Check className="h-4 w-4" />
                          {t("Save Ratings")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="shadow-sm border border-gray-200/80 rounded-xl overflow-hidden bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 py-5 px-6 flex flex-row items-center justify-between">
              <div className="space-y-1 text-start">
                <CardTitle className="flex items-center gap-2.5 text-lg font-extrabold text-black">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  {t("Historical Vendor Feedback")}
                </CardTitle>
                <p className="text-xs text-gray-500 font-medium">{t("RFP wise Feedbacks")}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/60 shadow-xs">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{t("Overall Average")}</span>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-amber-200/50 shadow-xs">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-amber-600">3.3 / 5</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {rfpFeedbacks.map((rfp) => (
                <div key={rfp.tenderId} className="border border-gray-200/80 rounded-2xl bg-white shadow-xs overflow-hidden">
                  {/* RFP Header */}
                  <div className="bg-amber-50/80 border-l-4 border-l-amber-500 p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1.5 text-start">
                      <h4 className="font-extrabold text-gray-900 text-[15px]">{rfp.tenderId}: {rfp.tenderTitle}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-semibold">
                        <span>{t("Tender Date:")} <span className="text-gray-700">{rfp.tenderDate}</span></span>
                        <span className="text-gray-300">|</span>
                        <span>{t("Proposal Number:")} <span className="font-mono text-gray-700">{rfp.proposalId}</span></span>
                        <span className="text-gray-300">|</span>
                        <span>{t("Proposal Date:")} <span className="text-gray-700">{rfp.proposalDate}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/60 shadow-xs shrink-0 self-start sm:self-auto">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-gray-800">{rfp.overallRating} / 5</span>
                    </div>
                  </div>

                  {/* Departments List */}
                  <div className="divide-y divide-gray-100">
                    {rfp.departments.map((dept) => (
                      <div key={dept.department} className="p-6 space-y-6 hover:bg-gray-50/10 transition-colors text-start">
                        {/* Department & Evaluator Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 text-start">
                            <div className="h-9 w-9 rounded-full bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)] flex items-center justify-center text-xs font-black shadow-xs">
                              {dept.avatar}
                            </div>
                            <div className="space-y-0.5 text-start">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-gray-900">{dept.evaluator}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)] border border-[var(--fnrc-primary-green)]/10">
                                  {dept.department}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 font-semibold">
                                {dept.role} • {t("Rated on")} {dept.date}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Overall Comments */}
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 relative text-start">
                          <p className="text-xs italic text-gray-600 leading-relaxed font-semibold">
                            &ldquo;{dept.overallComments}&rdquo;
                          </p>
                        </div>

                        {/* Questions & Feedbacks Grid */}
                        <div className="space-y-3 text-start">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("Questions & Feedbacks List")}</h5>
                          <div className="grid gap-4 md:grid-cols-1">
                            {dept.questions.map((q, qIdx) => (
                              <div key={qIdx} className="bg-white p-4 rounded-xl border border-gray-150/80 shadow-xs hover:border-gray-300 transition-colors flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div className="space-y-2 text-start">
                                  <div className="text-xs font-bold text-gray-800">{q.question}</div>
                                  <div className="bg-gray-50/30 p-2.5 rounded-lg border border-gray-100 text-xs font-normal text-gray-600">
                                    <span className="font-bold text-[var(--fnrc-primary-green)] me-1.5">{t("Answer")}:</span>
                                    {q.answer}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50/80 px-2.5 py-1 rounded-lg border border-gray-150/60 shadow-xs shrink-0 self-start sm:self-auto">
                                  <Star className={`h-3 w-3 fill-amber-500 ${q.rating >= 3 ? 'text-amber-500' : 'text-gray-400'}`} />
                                  <span className={`text-[11px] font-black ${
                                    q.rating >= 4 ? 'text-emerald-600' : q.rating === 3 ? 'text-amber-600' : 'text-rose-600'
                                  }`}>
                                    {q.rating} / 5
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={showAuditHistory} onOpenChange={setShowAuditHistory}>
        <DialogContent className="sm:max-w-4xl bg-white max-h-[80vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <History className={cn("h-5 w-5 text-[var(--fnrc-primary-green)]", language === 'ar' && "scale-x-[-1]")} />
              {t("Audit History")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-bold whitespace-nowrap">{t("Date & Time")}</TableHead>
                    <TableHead className="text-xs font-bold">{t("Action")}</TableHead>
                    <TableHead className="text-xs font-bold">{t("Name")}</TableHead>
                    <TableHead className="text-xs font-bold">{t("Status")}</TableHead>
                    <TableHead className="text-xs font-bold">{t("Remarks")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow key={index} className="bg-white hover:bg-gray-50/50">
                      <TableCell className="text-xs font-medium text-gray-500 whitespace-nowrap">
                        {log.date}<br />
                        <span className="text-[10px] text-gray-400">{log.time}</span>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-gray-800">{t(log.action)}</TableCell>
                      <TableCell className="text-xs font-semibold text-gray-600">{log.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={log.status} />
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{t(log.remarks)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md bg-white font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <Award className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              {t("Generate Rating Link")}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {t("Generate a secure departmental evaluation link to share with other Prime Organization departments.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-400">{t("VENDOR")}</span>
                <span className="font-extrabold text-gray-700">{proposal.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-400">{t("Tender TITLE")}</span>
                <span className="font-extrabold text-gray-700 truncate max-w-[200px]">{proposal.tenderTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-400">{t("PROPOSAL REF")}</span>
                <span className="font-semibold text-[var(--fnrc-primary-green)]">{proposal.id}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">{t("Departmental Rating Link")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/rating/external-review?proposalId=${proposal.id}&tenderId=${proposal.tenderId}`}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold text-gray-600 bg-gray-50/50 focus:outline-none"
                />
                <Button
                  size="sm"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  className="text-white text-xs font-bold shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/rating/external-review?proposalId=${proposal.id}&tenderId=${proposal.tenderId}`);
                    toast.success(t('Rating link copied to clipboard successfully!'));
                  }}
                >
                  {t("Copy Link")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}