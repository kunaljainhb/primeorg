import { useState } from 'react';
import { useParams, useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, FileText, Check, Download, Clock, Award, ShieldCheck, Users, Briefcase, X } from 'lucide-react';
import { toast } from 'sonner';
import { mockProposals, mockAdminUsers, mockRFPs } from '@/app/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

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
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminProposalDetail() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const proposal = mockProposals.find(p => p.id === proposalId) || mockProposals[0];
  const rfp = mockRFPs.find(r => r.id === proposal.rfpId) || mockRFPs[0];
  const reviewers = mockAdminUsers.filter(u => u.role === 'reviewer');

  const isInitiallyRejected = proposal.status === 'rejected';
  const isInitiallyShortlisted = proposal.status === 'shortlisted';
  const [proposalRemark, setProposalRemark] = useState(
    isInitiallyRejected
      ? 'The commercial proposal exceeded the allocated RFP budget limits.'
      : isInitiallyShortlisted
      ? 'Highly qualified vendor meeting all technical specs and commercial constraints.'
      : ''
  );
  const [overallStatus, setOverallStatus] = useState(proposal.status);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(4);
  const [complianceRating, setComplianceRating] = useState<number>(5);
  const [ratingRemark, setRatingRemark] = useState(
    isInitiallyRejected || isInitiallyShortlisted
      ? 'Outstanding technical proposal with comprehensive documentation. Team demonstrated excellent understanding of requirements. All compliance criteria met. Recommended for shortlisting.'
      : ''
  );
  const [isRatingSaved, setIsRatingSaved] = useState(isInitiallyRejected || isInitiallyShortlisted);

  const handleSaveRatings = () => {
    if (!ratingRemark.trim()) {
      toast.error('Please enter comments or remarks before saving ratings.');
      return;
    }
    setIsRatingSaved(true);
    toast.success('Vendor performance ratings saved successfully!');
  };
  const [technicalReviewer, setTechnicalReviewer] = useState(
    isInitiallyRejected ? 'Technical Reviewer' : (isInitiallyShortlisted ? 'Mohammed Al Zaabi' : '')
  );
  const [commercialReviewer, setCommercialReviewer] = useState(
    isInitiallyRejected ? 'Commercial Reviewer' : (isInitiallyShortlisted ? 'Mohammed Al Zaabi' : '')
  );
  const [technicalStatus, setTechnicalStatus] = useState(
    isInitiallyRejected ? 'approved' : (isInitiallyShortlisted ? 'approved' : (proposal.technicalStatus || 'pending'))
  );
  const [commercialStatus, setCommercialStatus] = useState(
    isInitiallyRejected ? 'rejected' : (isInitiallyShortlisted ? 'approved' : (proposal.commercialStatus || 'pending'))
  );

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

  const handleChatFocus = () => {
    setUnreadCount(0);
    setMessages(prev => prev.map(msg => ({ ...msg, unread: false })));
  };

  const handleSaveTechnicalApproval = (val: string) => {
    setTechnicalReviewer(val);
    proposal.status = 'technical_review_started';
    setOverallStatus('technical_review_started');
    toast.success(`Technical reviewer ${val} assigned. Status set to Technical Review Started.`);
  };

  const handleSaveCommercialApproval = (val: string) => {
    setCommercialReviewer(val);
    proposal.status = 'commercial_review_started';
    setOverallStatus('commercial_review_started');
    toast.success(`Commercial reviewer ${val} assigned. Status set to Commercial Review Started.`);
  };

  const handleTechnicalStatusUpdate = (status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      setTechnicalStatus('approved');
      setCommercialStatus('rejected');
      proposal.status = 'rejected';
      setOverallStatus('rejected');
      if (!technicalReviewer.trim()) setTechnicalReviewer('Technical Reviewer');
      if (!commercialReviewer.trim()) setCommercialReviewer('Commercial Reviewer');
      toast.error('Proposal Rejected: Technical set to Approved, Commercial set to Rejected, Overall set to Rejected.');
    } else {
      setTechnicalStatus('approved');
      proposal.status = 'technical_review_completed';
      setOverallStatus('technical_review_completed');
      toast.success('Technical Review Completed (Approved).');
    }
  };

  const handleCommercialStatusUpdate = (status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      setTechnicalStatus('approved');
      setCommercialStatus('rejected');
      proposal.status = 'rejected';
      setOverallStatus('rejected');
      if (!technicalReviewer.trim()) setTechnicalReviewer('Technical Reviewer');
      if (!commercialReviewer.trim()) setCommercialReviewer('Commercial Reviewer');
      toast.error('Proposal Rejected: Technical set to Approved, Commercial set to Rejected, Overall set to Rejected.');
    } else {
      setCommercialStatus('approved');
      proposal.status = 'commercial_review_completed';
      setOverallStatus('commercial_review_completed');
      toast.success('Commercial Review Completed (Approved).');
    }
  };

  const handleShortlistVendor = () => {
    proposal.status = 'shortlisted';
    setOverallStatus('shortlisted');
    setTechnicalReviewer('Mohammed Al Zaabi');
    setCommercialReviewer('Mohammed Al Zaabi');
    setTechnicalStatus('approved');
    setCommercialStatus('approved');
    toast.success('Vendor shortlisted successfully! ERP integration active: LPO and Invoice generated.');
  };

  const handleApproveProposalAction = () => {
    if (!proposalRemark.trim()) {
      toast.error('Please enter a remark or justification before approving.');
      return;
    }
    proposal.status = 'shortlisted';
    setOverallStatus('shortlisted');
    setTechnicalReviewer('Mohammed Al Zaabi');
    setCommercialReviewer('Mohammed Al Zaabi');
    setTechnicalStatus('approved');
    setCommercialStatus('approved');
    toast.success('Proposal Approved! Status updated to Shortlisted. Remarks saved.');
  };

  const handleRejectProposalAction = () => {
    if (!proposalRemark.trim()) {
      toast.error('Please enter a remark or justification before rejecting.');
      return;
    }
    proposal.status = 'rejected';
    setOverallStatus('rejected');
    setTechnicalReviewer('Technical Reviewer');
    setCommercialReviewer('Commercial Reviewer');
    setTechnicalStatus('approved');
    setCommercialStatus('rejected');
    toast.error('Proposal Rejected! Status updated to Rejected. Remarks saved.');
  };
  const technicalDocs = [
    'Technical Specification.pdf',
    'Implementation Plan.docx',
    'System Architecture.png'
  ];
  const commercialBreakdown = [
    { item: 'Hardware', amount: 250000 },
    { item: 'Software Licenses', amount: 100000 },
    { item: 'Installation Services', amount: 70000 }
  ];
  const supportingDocs = [
    { id: 'doc1', name: 'Company Profile.pdf', category: 'Company Profile', date: '2026-05-01', status: 'approved' },
    { id: 'doc2', name: 'Financial Statements.xlsx', category: 'Financial Statements', date: '2026-04-20', status: 'approved' },
    { id: 'doc3', name: 'Compliance Certificate.pdf', category: 'Other', date: '2026-03-15', status: 'pending' }
  ];


  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
    };
    return colors[status] || colors.submitted;
  };

  const statusColor = getStatusColor(overallStatus);

  return (
    <div className="space-y-6 p-4">
      {/* Header back button */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/rfps/${proposal.rfpId}`)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal Details</h1>
              <Badge variant="secondary" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                {formatStatus(overallStatus)}
              </Badge>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>Vendor: {proposal.vendorName}</p>
          </div>
        </div>

        {overallStatus !== 'shortlisted' && overallStatus !== 'rejected' && (
          <Button
            onClick={handleShortlistVendor}
            className="text-white h-9 px-5 font-bold text-xs shrink-0"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            <Award className="mr-2 h-4 w-4" />
            Shortlist Vendor
          </Button>
        )}
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Proposal Summary</TabsTrigger>
          <TabsTrigger value="technical">Technical Proposal</TabsTrigger>
          <TabsTrigger value="commercial">Commercial Proposal</TabsTrigger>
          <TabsTrigger value="supporting">Supporting Documents</TabsTrigger>
          {rfp.status === 'published' && <TabsTrigger value="action">Proposal Action</TabsTrigger>}
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center justify-between">
                <span>{proposal.id}</span>
                <Badge variant="secondary" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                  {formatStatus(overallStatus)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-medium text-gray-600">Proposal Date</p>
                <p className="text-sm">{formatDate(proposal.submissionDate)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Vendor Name</p>
                <p className="text-sm">{proposal.vendorName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">RFP ID</p>
                <p className="text-sm">{proposal.rfpId}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">RFP Title</p>
                <p className="text-sm">{proposal.rfpTitle}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Commercial Amount (AED)</p>
                <p className="text-sm font-bold text-[var(--fnrc-primary-green)]">{proposal.commercialAmount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Clarification Chat */}
          <Card className="mt-6">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <Users className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Vendor Clarifications Chat
              </CardTitle>
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border-none animate-pulse"
                >
                  {unreadCount} Unread
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-4" onClick={handleChatFocus}>
              {/* Message scroll container */}
              <div className="border border-gray-100 rounded-xl bg-gray-50/30 p-4 h-[300px] overflow-y-auto space-y-3 flex flex-col scrollbar-thin scrollbar-thumb-gray-200">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] ${msg.sender === 'admin' ? 'align-end ml-auto' : 'align-start mr-auto'}`}
                  >
                    {/* Sender Label */}
                    <span className={`text-[10px] font-bold mb-1 text-gray-400 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {msg.sender === 'admin' ? 'Government Admin' : proposal.vendorName}
                    </span>
                    
                    {/* Message Bubble */}
                    <div 
                      className={`p-3 rounded-2xl text-sm font-medium shadow-sm relative ${
                        msg.sender === 'admin' 
                          ? 'bg-[var(--fnrc-primary-green)] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      {msg.unread && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <span className={`text-[9px] font-semibold mt-1 text-gray-400 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex flex-col max-w-[80%] align-start mr-auto">
                    <span className="text-[10px] font-bold mb-1 text-gray-400">
                      {proposal.vendorName} is typing
                    </span>
                    <div className="bg-white text-gray-800 border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                      <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Typing Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Type a message to ${proposal.vendorName}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-850 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="text-white h-10 px-6 font-bold text-xs rounded-xl shrink-0"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          {/* Technical Approach */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <Briefcase className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Technical Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-black text-gray-450 mb-1.5">Executive Summary & Proposal Statement</h4>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {proposal.technicalProposal}
                  </p>
                </div>
                {proposal.methodology && (
                  <div className="pt-4 border-t border-gray-200/60">
                    <h4 className="text-xs font-black text-gray-450 mb-1.5">Proposed Methodology & Deployment Strategy</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {proposal.methodology}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Documents */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Submitted Technical Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {technicalDocs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[var(--fnrc-primary-green)] transition-all bg-white">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-xs font-bold text-gray-800">{doc}</div>
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
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <ShieldCheck className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Technical Approval Matrix
              </CardTitle>
              <Badge 
                variant="secondary" 
                className="capitalize text-[10px] font-bold px-2.5 py-0.5 border-none animate-pulse-subtle"
                style={{
                  backgroundColor: technicalStatus === 'approved' ? '#D1FAE5' : technicalStatus === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                  color: technicalStatus === 'approved' ? 'var(--fnrc-success)' : technicalStatus === 'rejected' ? '#EF4444' : 'var(--fnrc-warning)'
                }}
              >
                {technicalStatus === 'approved' ? 'Approved' : technicalStatus === 'rejected' ? 'Rejected' : 'Pending'}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <p className="text-xs font-medium text-gray-500">
                Specify the Technical Reviewer responsible for evaluating this proposal. The reviewer will be notified to begin technical scoring and compliance assessment.
              </p>
              
              <div className="max-w-md w-full">
                <label className="text-xs font-bold text-gray-700 block mb-1">Technical Reviewer Name</label>
                <Select value={technicalReviewer} onValueChange={handleSaveTechnicalApproval}>
                  <SelectTrigger className="w-full h-9 border-gray-200 text-sm font-semibold text-gray-800 bg-white">
                    <SelectValue placeholder="Select Technical Reviewer" />
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

              {/* Status Decision Buttons */}
              <div className="pt-4 border-t border-gray-200/60 space-y-3">
                <h4 className="text-xs font-bold text-gray-700">Technical Evaluation Decision</h4>
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
                    Approved
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
                    Rejected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-6">
          {/* Commercial Details Card */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <Briefcase className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Commercial Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-black text-gray-450 mb-1.5">Commercial Breakdown</h4>
                  <ul className="space-y-2">
                    {commercialBreakdown.map((entry, i) => (
                      <li key={i} className="flex justify-between items-center text-sm font-semibold text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                        <span>{entry.item}</span>
                        <span className="text-[var(--fnrc-primary-green)] font-black">AED {entry.amount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-xs font-bold text-gray-800">Commercial Proposal.pdf</div>
                      <div className="text-[9px] text-muted-foreground font-bold">PDF • 3.1 MB</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[var(--fnrc-primary-green)]">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200/60">
                  <h4 className="text-xs font-black text-gray-450 mb-1.5">Payment Terms</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Standard payment terms apply. Milestone-based payments of 20% advance, 40% intermediate, and 40% upon final delivery sign-off.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial Approval Matrix */}
          <Card>
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <ShieldCheck className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Commercial Approval Matrix
              </CardTitle>
              <Badge 
                variant="secondary" 
                className="capitalize text-[10px] font-bold px-2.5 py-0.5 border-none animate-pulse-subtle"
                style={{
                  backgroundColor: commercialStatus === 'approved' ? '#D1FAE5' : commercialStatus === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                  color: commercialStatus === 'approved' ? 'var(--fnrc-success)' : commercialStatus === 'rejected' ? '#EF4444' : 'var(--fnrc-warning)'
                }}
              >
                {commercialStatus === 'approved' ? 'Approved' : commercialStatus === 'rejected' ? 'Rejected' : 'Pending'}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              <p className="text-xs font-medium text-gray-500">
                Specify the Commercial Reviewer responsible for evaluating this proposal. The reviewer will be notified to review pricing compliance and LPO preparation.
              </p>
              
              <div className="max-w-md w-full">
                <label className="text-xs font-bold text-gray-700 block mb-1">Commercial Reviewer Name</label>
                <Select value={commercialReviewer} onValueChange={handleSaveCommercialApproval}>
                  <SelectTrigger className="w-full h-9 border-gray-200 text-sm font-semibold text-gray-800 bg-white">
                    <SelectValue placeholder="Select Commercial Reviewer" />
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

              {/* Status Decision Buttons */}
              <div className="pt-4 border-t border-gray-200/60 space-y-3">
                <h4 className="text-xs font-bold text-gray-700">Commercial Evaluation Decision</h4>
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
                    Approved
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
                    Rejected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supporting" className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-bold text-xs text-gray-700">Document Name</TableHead>
                    <TableHead className="font-bold text-xs text-gray-700">Document Category</TableHead>
                    <TableHead className="font-bold text-xs text-gray-700">Upload Date</TableHead>
                    <TableHead className="font-bold text-xs text-gray-700">Verification Status</TableHead>
                    <TableHead className="text-right pr-4 font-bold text-xs text-gray-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportingDocs.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-gray-50/30">
                      <TableCell className="font-semibold text-sm text-gray-800 py-3">{doc.name}</TableCell>
                      <TableCell className="font-medium text-xs text-gray-500 py-3">{doc.category}</TableCell>
                      <TableCell className="font-medium text-xs text-gray-500 py-3">
                        {formatDate(doc.date)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] font-bold px-2.5 py-0.5 border-none" 
                          style={{
                            backgroundColor: doc.status === 'approved' ? '#D1FAE5' : '#FEF3C7',
                            color: doc.status === 'approved' ? 'var(--fnrc-success)' : 'var(--fnrc-warning)'
                          }}
                        >
                          {formatStatus(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3">
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

        {rfp.status === 'published' && (
          <TabsContent value="action" className="space-y-6">
            
            {/* CARD 1: Proposal Action Decision */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                  <Award className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  Proposal Action Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {overallStatus === 'rejected' ? (
                  <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white font-bold text-[10px] py-1 px-3 border-none capitalize">
                        Rejected
                      </Badge>
                      <span className="text-[10px] text-gray-500 font-bold">Decision Completed</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-black text-gray-700 block">Final Remarks:</span>
                      <p className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-gray-150 leading-relaxed">
                        {proposalRemark || "The commercial proposal exceeded the allocated RFP budget limits."}
                      </p>
                    </div>
                  </div>
                ) : overallStatus === 'shortlisted' ? (
                  <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--fnrc-success)] text-white font-bold text-[10px] py-1 px-3 border-none capitalize">
                        Approved
                      </Badge>
                      <span className="text-[10px] text-gray-500 font-bold">Decision Completed</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-black text-gray-700 block">Final Remarks:</span>
                      <p className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-gray-150 leading-relaxed">
                        {proposalRemark || "Highly qualified vendor meeting all technical specs and commercial constraints."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs font-medium text-gray-500">
                      Take a final decision on this vendor's proposal. Approving will transition the proposal to Shortlisted and generate ERP documents, while Rejecting will reject the proposal.
                    </p>
                    <div className="space-y-1.5">
                      <label htmlFor="remark" className="text-xs font-bold text-gray-700 block">Remarks & Decision Comments</label>
                      <textarea
                        id="remark"
                        rows={3}
                        placeholder="Enter remarks or justification for this decision..."
                        value={proposalRemark}
                        onChange={(e) => setProposalRemark(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-855 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApproveProposalAction}
                        className="text-white h-9 px-6 font-bold text-xs flex items-center gap-2"
                        style={{ backgroundColor: 'var(--fnrc-success)' }}
                      >
                        <Check className="h-4 w-4" />
                        Approve Proposal
                      </Button>
                      <Button
                        onClick={handleRejectProposalAction}
                        className="text-white h-9 px-6 font-bold text-xs flex items-center gap-2"
                        style={{ backgroundColor: '#EF4444' }}
                      >
                        <X className="h-4 w-4" />
                        Reject Proposal
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CARD 2: Vendor reviews and ratings - displayed below */}
            <Card>
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                    <Award className="h-5 w-5 text-amber-500" />
                    Vendor Reviews
                  </CardTitle>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Performance reviews from RFP agreements</p>
                </div>
                {isRatingSaved && (overallStatus !== 'shortlisted' && overallStatus !== 'rejected') && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs font-bold border-gray-250 text-gray-600 hover:bg-gray-50 h-7"
                    onClick={() => setIsRatingSaved(false)}
                  >
                    Edit Ratings
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                {isRatingSaved ? (
                  /* Static review display matching the screenshot exactly! */
                  <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-500">
                          RFP Reference: <a href="#" className="underline font-bold text-[var(--fnrc-primary-green)] hover:opacity-85">{rfp.title}</a>
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold">
                          Reviewed by Fatima Al Hammadi on 18/02/2026
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5 text-amber-500 font-black text-xl">
                          <span>★</span>
                          <span>{((qualityRating + timelinessRating + communicationRating + complianceRating) / 4).toFixed(2)}</span>
                        </div>
                        <div className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-0.5">Overall Rating</div>
                      </div>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Quality */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center space-y-1">
                        <div className="text-xs font-bold text-gray-400">Quality</div>
                        <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-700">
                          <span className="text-amber-500">★</span>
                          <span>{qualityRating} / 5</span>
                        </div>
                      </div>

                      {/* Timeliness */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center space-y-1">
                        <div className="text-xs font-bold text-gray-400">Timeliness</div>
                        <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-700">
                          <span className="text-amber-500">★</span>
                          <span>{timelinessRating} / 5</span>
                        </div>
                      </div>

                      {/* Communication */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center space-y-1">
                        <div className="text-xs font-bold text-gray-400">Communication</div>
                        <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-700">
                          <span className="text-amber-500">★</span>
                          <span>{communicationRating} / 5</span>
                        </div>
                      </div>

                      {/* Compliance */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center space-y-1">
                        <div className="text-xs font-bold text-gray-400">Compliance</div>
                        <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-700">
                          <span className="text-amber-500">★</span>
                          <span>{complianceRating} / 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Comments */}
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-xs font-extrabold text-gray-750">Admin Comments</h4>
                      <p className="text-xs font-semibold text-gray-600 leading-relaxed bg-gray-50/20 p-4 rounded-xl border border-gray-100/70">
                        {ratingRemark || "Outstanding technical proposal with comprehensive documentation. Team demonstrated excellent understanding of requirements. All compliance criteria met. Recommended for shortlisting."}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Interactive Star Rating Form */
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <span className="text-xs text-gray-450 font-bold block uppercase tracking-wider">RFP Target Reference</span>
                        <span className="text-sm font-extrabold text-gray-800">{rfp.title}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs text-gray-450 font-bold block uppercase tracking-wider">Proposal Reference ID</span>
                        <Badge variant="secondary" className="font-bold text-xs text-[var(--fnrc-primary-green)] bg-green-50 border-none px-2.5 py-0.5 mt-0.5">
                          {proposal.id}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-gray-450 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-amber-500" />
                        Vendor Rating Matrix
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Quality Input */}
                        <div className="bg-white p-4 rounded-xl border border-gray-255 space-y-2.5">
                          <span className="text-xs font-bold text-gray-700 block">Quality</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setQualityRating(star)}
                                className="focus:outline-none transition-all hover:scale-110"
                              >
                                <span className={`text-xl ${star <= qualityRating ? 'text-amber-500 font-bold' : 'text-gray-200'}`}>★</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Timeliness Input */}
                        <div className="bg-white p-4 rounded-xl border border-gray-255 space-y-2.5">
                          <span className="text-xs font-bold text-gray-700 block">Timeliness</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setTimelinessRating(star)}
                                className="focus:outline-none transition-all hover:scale-110"
                              >
                                <span className={`text-xl ${star <= timelinessRating ? 'text-amber-500 font-bold' : 'text-gray-200'}`}>★</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Communication Input */}
                        <div className="bg-white p-4 rounded-xl border border-gray-255 space-y-2.5">
                          <span className="text-xs font-bold text-gray-700 block">Communication</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setCommunicationRating(star)}
                                className="focus:outline-none transition-all hover:scale-110"
                              >
                                <span className={`text-xl ${star <= communicationRating ? 'text-amber-500 font-bold' : 'text-gray-200'}`}>★</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Compliance Input */}
                        <div className="bg-white p-4 rounded-xl border border-gray-255 space-y-2.5">
                          <span className="text-xs font-bold text-gray-700 block">Compliance</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setComplianceRating(star)}
                                className="focus:outline-none transition-all hover:scale-110"
                              >
                                <span className={`text-xl ${star <= complianceRating ? 'text-amber-500 font-bold' : 'text-gray-200'}`}>★</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Dedicated Remarks for Vendor Rating system */}
                      <div className="space-y-1.5 pt-2">
                        <label htmlFor="ratingRemarkInput" className="text-xs font-bold text-gray-700 block">Vendor Rating Comments & Justification</label>
                        <textarea
                          id="ratingRemarkInput"
                          rows={3}
                          placeholder="Enter specific remarks regarding this vendor's quality, timeliness, communication, and compliance performance..."
                          value={ratingRemark}
                          onChange={(e) => setRatingRemark(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-855 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleSaveRatings}
                          className="text-white h-9 px-6 font-bold text-xs flex items-center gap-2"
                          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                        >
                          <Check className="h-4 w-4" />
                          Save Ratings
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}