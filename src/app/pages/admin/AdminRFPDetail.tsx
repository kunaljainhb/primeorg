import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import {
  ArrowLeft,
  CalendarIcon,
  FileText,
  Check,
  X as XIcon,
  Clock,
  DollarSign,
  Download,
  Building2,
  Globe,
  Lock,
  Eye,
  Briefcase,
  Brain,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { mockRFPs, mockProposals, mockERPDocuments } from '@/app/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Calendar } from '@/app/components/ui/calendar';
import { Checkbox } from '@/app/components/ui/checkbox';

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

export default function AdminRFPDetail() {
  const navigate = useNavigate();
  const { rfpId } = useParams();
  const location = useLocation();
  const rfp = mockRFPs.find(r => r.id === rfpId) || mockRFPs[0];

  // Redirect to edit/create page if in draft status
  useEffect(() => {
    if (rfp && rfp.status.toLowerCase() === 'draft') {
      navigate(`/admin/rfps/edit/${rfp.id}`);
    }
  }, [rfp, navigate]);

  const defaultTab = location.pathname.includes('tab=chats') ? 'chats' : 'overview';

  const relatedProposals = mockProposals.filter(p => p.rfpId === rfp.id);
  const shortlistedProposals = relatedProposals.filter(p => p.status === 'shortlisted');

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(new Date(rfp.submissionDeadline));
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [showAIComparisonDialog, setShowAIComparisonDialog] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  const handleAIComparison = () => {
    if (selectedProposals.length >= 2 && selectedProposals.length <= 3) {
      setShowAIComparisonDialog(true);
      setIsAIAnalyzing(true);
      setTimeout(() => setIsAIAnalyzing(false), 2500); // Simulate AI loading
    }
  };

  // Chat database state for 2-3 vendors
  const [vendorChats, setVendorChats] = useState<Record<string, {
    vendorName: string;
    unreadCount: number;
    messages: Array<{ id: number; sender: 'vendor' | 'admin'; text: string; timestamp: string; unread: boolean }>;
  }>>({
    'proposal-1': {
      vendorName: 'TechCorp Solutions',
      unreadCount: 2,
      messages: [
        { id: 1, sender: 'vendor', text: 'Hello Admin, we have uploaded our technical document. Could you confirm if it was successfully received?', timestamp: '10:30 AM', unread: true },
        { id: 2, sender: 'vendor', text: 'Also, we wanted to request a short extension if possible. Please let us know.', timestamp: '10:32 AM', unread: true },
      ]
    },
    'proposal-2': {
      vendorName: 'Global InfraGroup',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'admin', text: 'Hello Global InfraGroup, we noticed a minor math mismatch in your commercial proposal sheet.', timestamp: 'Yesterday', unread: false },
        { id: 2, sender: 'vendor', text: 'Apologies for that. We have rectified the calculation and uploaded the new sheet. Please check.', timestamp: 'Yesterday', unread: false },
      ]
    },
    'proposal-3': {
      vendorName: 'Apex Systems',
      unreadCount: 1,
      messages: [
        { id: 1, sender: 'vendor', text: 'Dear Admin, is there a local presence requirement for the installation team?', timestamp: '11:15 AM', unread: true },
      ]
    }
  });

  const [activeVendorId, setActiveVendorId] = useState<string>('proposal-1');
  const [chatInputText, setChatInputText] = useState('');
  const [vendorTypingState, setVendorTypingState] = useState<Record<string, boolean>>({
    'proposal-1': false,
    'proposal-2': false,
    'proposal-3': false
  });

  const handleSelectVendor = (vendorId: string) => {
    setActiveVendorId(vendorId);
    setVendorChats(prev => {
      if (!prev[vendorId]) return prev;
      return {
        ...prev,
        [vendorId]: {
          ...prev[vendorId],
          unreadCount: 0,
          messages: prev[vendorId].messages.map(m => ({ ...m, unread: false }))
        }
      };
    });
  };

  const handleSendVendorMessage = () => {
    if (!chatInputText.trim() || !activeVendorId) return;

    const activeChat = vendorChats[activeVendorId];
    if (!activeChat) return;

    const adminMessage = {
      id: Date.now(),
      sender: 'admin' as const,
      text: chatInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false
    };

    setVendorChats(prev => ({
      ...prev,
      [activeVendorId]: {
        ...prev[activeVendorId],
        messages: [...prev[activeVendorId].messages, adminMessage]
      }
    }));
    setChatInputText('');

    setVendorTypingState(prev => ({ ...prev, [activeVendorId]: true }));

    setTimeout(() => {
      setVendorTypingState(prev => ({ ...prev, [activeVendorId]: false }));

      const vendorReply = {
        id: Date.now() + 1,
        sender: 'vendor' as const,
        text: `Thank you for the update. The team from ${activeChat.vendorName} is on standby and will proceed as directed.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: false
      };

      setVendorChats(prev => ({
        ...prev,
        [activeVendorId]: {
          ...prev[activeVendorId],
          messages: [...prev[activeVendorId].messages, vendorReply]
        }
      }));

      toast.info(`New message received from ${activeChat.vendorName}`);
    }, 2000);
  };

  const handleSelectProposal = (proposalId: string, checked: boolean) => {
    if (checked) {
      if (selectedProposals.length >= 3) {
        toast.error('You can only select up to 3 proposals for comparison.');
        return;
      }
      setSelectedProposals([...selectedProposals, proposalId]);
    } else {
      setSelectedProposals(selectedProposals.filter(id => id !== proposalId));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      draft: { bg: '#E5E7EB', text: 'var(--fnrc-text-muted)' },
      published: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      closed: { bg: '#FEE2E2', text: 'var(--fnrc-error)' },
      cancelled: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status] || colors.draft;
  };

  const getProposalStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      submitted: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      technical_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      commercial_review_started: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      technical_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      commercial_review_completed: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      shortlisted: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      rejected: { bg: '#FEE2E2', text: 'var(--fnrc-error)' }
    };
    return colors[status] || colors.submitted;
  };

  const handleCloseRFP = () => {
    toast.success('RFP closed successfully');
    setShowCloseDialog(false);
    navigate('/admin/rfps');
  };

  const handleCancelRFP = () => {
    toast.success('RFP cancelled successfully');
    setShowCancelDialog(false);
    navigate('/admin/rfps');
  };

  const handleChangeDeadline = () => {
    if (newDeadline) {
      toast.success('Submission deadline updated successfully');
      setShowDeadlineDialog(false);
    }
  };

  const totalUnreadChats = Object.values(vendorChats).reduce((sum, chat) => sum + chat.unreadCount, 0);

  const statusColor = getStatusColor(rfp.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/rfps')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>{rfp.title}</h1>
              <Badge variant="secondary" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                {formatStatus(rfp.status)}
              </Badge>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(rfp.status !== 'closed' && rfp.status !== 'cancelled') && (
            <>
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 h-9 font-bold text-xs" onClick={() => setShowCancelDialog(true)}>
                <XIcon className="mr-2 h-3.5 w-3.5" />
                Cancel RFP
              </Button>
              <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 h-9 font-bold text-xs" onClick={() => setShowDeadlineDialog(true)}>
                <Clock className="mr-2 h-3.5 w-3.5" />
                Change Deadline
              </Button>
              <Button className="text-white h-9 px-6 font-bold text-xs" style={{ backgroundColor: 'var(--fnrc-primary-green)' }} onClick={() => setShowCloseDialog(true)}>
                <Check className="mr-2 h-3.5 w-3.5" />
                Close RFP
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-1.5">
            Vendor Chats
            {totalUnreadChats > 0 && (
              <span className="bg-red-500 text-white font-bold text-[9px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full border-none leading-none animate-pulse">
                {totalUnreadChats}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="proposals">Proposals Received ({relatedProposals.length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted Vendors ({shortlistedProposals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3 border-b mb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">RFP Category</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {rfp.category.map((cat, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 border-none font-bold text-[10px]">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Description</Label>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {rfp.description}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Eligibility Criteria</Label>
                  <ul className="space-y-1.5">
                    {rfp.eligibilityCriteria.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <div className="h-1 w-1 rounded-full bg-gray-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Estimated Budget</Label>
                  <div className="text-xl font-black text-[var(--fnrc-primary-green)]">
                    AED 500,000
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Submission Deadline</Label>
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    {formatDate(rfp.submissionDeadline)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope of Work */}
          <Card>
            <CardHeader className="pb-3 border-b mb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Scope of Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label className="text-sm font-bold capitalize text-muted-foreground">Scope of Work</Label>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {rfp.scopeOfWork}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t pt-6">
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Project Start Date</Label>
                  <div className="font-bold text-sm flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    01/06/2026
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Project End Date</Label>
                  <div className="font-bold text-sm flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    31/12/2026
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Label className="text-sm font-bold capitalize text-muted-foreground">Milestones</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Project Initiation', date: '15/06/2026' },
                    { title: 'Intermediate Review', date: '01/09/2026' },
                    { title: 'Final Handover', date: '20/12/2026' }
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-3 bg-gray-50/50 border rounded-lg">
                      <span className="text-[10px] font-black text-gray-450 tracking-wide">Milestone 0{i + 1}</span>
                      <span className="text-sm font-bold text-gray-800">{m.title}</span>
                      <span className="text-[11px] font-bold text-[var(--fnrc-primary-green)]">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments & Visibility */}
          <div className="grid grid-cols-1 gap-6">
            {/* RFP Attachments */}
            <Card>
              <CardHeader className="pb-3 border-b mb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  RFP Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {rfp.attachments.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[var(--fnrc-primary-green)] transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="text-sm font-bold text-gray-800">{file.name}</div>
                          <div className="text-[10px] text-muted-foreground font-bold">PDF • 2.4 MB</div>
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

            {/* Tender Visibility */}
            <Card>
              <CardHeader className="pb-3 border-b mb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  Tender Visibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-800">Open Tender</div>
                    <p className="text-sm text-muted-foreground font-medium">This tender is publicly visible to all registered vendors across all service categories.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar Vendor List */}
            <Card className="md:col-span-4 border border-gray-150">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  Vendor Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {Object.entries(vendorChats).map(([id, chat]) => {
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    const isActive = activeVendorId === id;
                    return (
                      <div
                        key={id}
                        onClick={() => handleSelectVendor(id)}
                        className={`p-4 cursor-pointer transition-all flex items-center justify-between hover:bg-gray-50/50 ${
                          isActive ? 'bg-green-50/30 border-l-4 border-[var(--fnrc-primary-green)]' : ''
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-850 truncate">{chat.vendorName}</h4>
                            <span className="text-[9px] font-semibold text-gray-400 shrink-0">
                              {lastMsg ? lastMsg.timestamp : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium truncate">
                            {lastMsg ? lastMsg.text : 'No messages yet'}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-red-505 text-white font-bold text-[9px] h-5 w-5 flex items-center justify-center rounded-full border-none shrink-0"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Chat Box */}
            <Card className="md:col-span-8 border border-gray-150 flex flex-col">
              {activeVendorId && vendorChats[activeVendorId] ? (
                <>
                  <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-855 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                      Clarification Thread • {vendorChats[activeVendorId].vendorName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col space-y-4">
                    {/* Scrollable chat log */}
                    <div className="border border-gray-100 rounded-xl bg-gray-50/30 p-4 h-[350px] overflow-y-auto space-y-3 flex flex-col scrollbar-thin scrollbar-thumb-gray-200">
                      {vendorChats[activeVendorId].messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col max-w-[80%] ${msg.sender === 'admin' ? 'align-end ml-auto' : 'align-start mr-auto'}`}
                        >
                          <span className={`text-[10px] font-bold mb-1 text-gray-400 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                            {msg.sender === 'admin' ? 'Government Admin' : vendorChats[activeVendorId].vendorName}
                          </span>
                          <div 
                            className={`p-3 rounded-2xl text-xs font-medium shadow-sm relative ${
                              msg.sender === 'admin' 
                                ? 'bg-[var(--fnrc-primary-green)] text-white rounded-tr-none' 
                                : 'bg-white text-gray-855 border border-gray-100 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                            {msg.unread && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] font-semibold mt-1 text-gray-400 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      ))}

                      {vendorTypingState[activeVendorId] && (
                        <div className="flex flex-col max-w-[80%] align-start mr-auto">
                          <span className="text-[10px] font-bold mb-1 text-gray-400">
                            {vendorChats[activeVendorId].vendorName} is typing
                          </span>
                          <div className="bg-white text-gray-800 border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat input bar */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder={`Type your reply to ${vendorChats[activeVendorId].vendorName}...`}
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendVendorMessage()}
                        className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-855 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white"
                      />
                      <Button 
                        onClick={handleSendVendorMessage}
                        className="text-white h-10 px-6 font-bold text-xs rounded-xl shrink-0"
                        style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                      >
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="p-12 text-center text-sm font-medium text-gray-500 flex flex-col items-center justify-center h-full">
                  <Building2 className="h-8 w-8 text-gray-300 mb-3" />
                  Select a vendor conversation to begin clarifying requirements.
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            {selectedProposals.length > 0 ? (
              <div className="bg-blue-50 border-b p-4 px-6 flex items-center justify-between">
                <span className="text-sm font-bold text-blue-800">
                  {selectedProposals.length} proposal{selectedProposals.length > 1 ? 's' : ''} selected for comparison
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-8 text-xs transition-all gap-1.5 shadow-md shadow-purple-500/20"
                    disabled={selectedProposals.length < 2 || selectedProposals.length > 3}
                    onClick={handleAIComparison}
                  >
                    <Brain className="h-3.5 w-3.5" />
                    AI Comparison
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50/50 border-b p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-gray-855">Select 3 vendors proposal for AI comparison</h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {selectedProposals.length} proposal{selectedProposals.length > 1 ? 's' : ''} selected for comparison</p>
                </div>
                <Button
                  className="bg-gray-200 text-gray-400 font-bold h-8 text-xs cursor-not-allowed border border-gray-300"
                  disabled
                >
                  AI Comparison
                </Button>
              </div>
            )}
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="py-4 pl-6 w-[50px]"></TableHead>
                    <TableHead className="font-bold text-xs capitalize text-gray-600">Proposal ID</TableHead>
                    <TableHead className="font-bold text-xs capitalize text-gray-600">Vendor Name</TableHead>
                    <TableHead className="font-bold text-xs capitalize text-gray-600">Proposal Date</TableHead>
                    <TableHead className="font-bold text-xs capitalize text-gray-600 text-right">Commercial (AED)</TableHead>
                    <TableHead className="font-bold text-xs capitalize text-gray-600">Proposal Status</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-xs capitalize text-gray-600">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedProposals.map((proposal) => {
                    const statusColor = getProposalStatusColor(proposal.status);
                    return (
                      <TableRow key={proposal.id} className="hover:bg-gray-50/30">
                        <TableCell className="py-4 pl-6">
                          <Checkbox
                            checked={selectedProposals.includes(proposal.id)}
                            onCheckedChange={(checked) => handleSelectProposal(proposal.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="text-sm font-bold text-gray-500">
                          {proposal.id}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-sm text-gray-800">{proposal.vendorName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 font-medium">{formatDate(proposal.submissionDate)}</span>
                        </TableCell>
                        <TableCell className="text-right font-black text-sm text-[var(--fnrc-primary-green)]">
                          {proposal.commercialAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-black text-[9px] px-2 py-0.5" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                            {formatStatus(proposal.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="outline" size="sm" className="h-8 font-bold text-[10px]" onClick={() => navigate(`/admin/proposals/${proposal.id}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-6">
          {shortlistedProposals.length > 0 ? (
            shortlistedProposals.map((proposal) => {
              const vendorDocs = mockERPDocuments.filter(d => d.rfpId === rfp.id && d.vendorId === proposal.vendorId);

              return (
                <Card key={proposal.id} className="overflow-hidden">
                  <div className="bg-gray-50/50 border-b p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1">Vendor Name</p>
                          <p className="text-sm font-bold text-gray-900">{proposal.vendorName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1">Proposal ID</p>
                          <p className="text-sm font-bold text-gray-900">{proposal.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1">Proposal Date</p>
                          <p className="text-sm font-bold text-gray-900">{formatDate(proposal.submissionDate)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-wide mb-1">Approved Date</p>
                          <p className="text-sm font-bold text-gray-900">
                            {proposal.shortlistedDate ? formatDate(proposal.shortlistedDate) : formatDate(new Date())}
                          </p>
                        </div>
                      </div>
                      <Button className="shrink-0 bg-[var(--fnrc-primary-green)] text-white hover:bg-green-700 font-bold text-xs" onClick={() => navigate(`/admin/proposals/${proposal.id}`)}>
                        View Proposal Details
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="px-6 py-4 border-b bg-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                      <h3 className="font-bold text-sm text-gray-800">ERP Documents</h3>
                    </div>
                    {vendorDocs.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/30 hover:bg-gray-50/30 border-b-gray-100">
                            <TableHead className="py-3 pl-6 font-bold text-xs text-gray-600">Document Name</TableHead>
                            <TableHead className="font-bold text-xs text-gray-600">Date</TableHead>
                            <TableHead className="font-bold text-xs text-gray-600">Status</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-xs text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vendorDocs.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-gray-50/50">
                              <TableCell className="py-3 pl-6">
                                <div className="font-bold text-sm text-gray-800">{doc.documentType}</div>
                                <div className="text-[10px] text-muted-foreground font-bold">{doc.documentNumber}</div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 font-medium">
                                {formatDate(doc.date)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="capitalize text-[10px] font-bold px-2 py-0.5 border-none" style={{
                                  backgroundColor: doc.status === 'approved' || doc.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                                  color: doc.status === 'approved' || doc.status === 'paid' ? 'var(--fnrc-success)' : 'var(--fnrc-warning)'
                                }}>
                                  {formatStatus(doc.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="p-8 text-center text-sm font-medium text-gray-500">
                        No ERP documents available for this vendor yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-sm font-medium text-gray-500">
                No shortlisted vendors found for this RFP.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close RFP?</AlertDialogTitle>
            <AlertDialogDescription>Closing the RFP will stop any further submissions. This action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseRFP} style={{ backgroundColor: 'var(--fnrc-primary-green)' }}>Confirm Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel RFP?</AlertDialogTitle>
            <AlertDialogDescription>Cancelling the RFP will notify all participating vendors and halt the process. This action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelRFP} className="bg-red-600 hover:bg-red-700 text-white">Confirm Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Extend Deadline</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Calendar mode="single" selected={newDeadline} onSelect={setNewDeadline} className="rounded-md border" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeadlineDialog(false)}>Cancel</Button>
            <Button className="text-white" style={{ backgroundColor: 'var(--fnrc-primary-green)' }} onClick={handleChangeDeadline}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Comparison Dialog */}
      <Dialog open={showAIComparisonDialog} onOpenChange={setShowAIComparisonDialog}>
        <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-purple-900">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Proposal Analysis & Comparison
            </DialogTitle>
          </DialogHeader>

          {isAIAnalyzing ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Brain className="h-16 w-16 text-purple-600 animate-pulse" />
                <Sparkles className="h-6 w-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-bold text-purple-900">AI is analyzing proposals...</h3>
                <p className="text-sm font-medium text-gray-500 max-w-sm">Extracting commercial details, verifying technical compliance, and calculating weighted scores.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="overflow-x-auto border rounded-xl border-gray-200 shadow-sm">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow>
                      <TableHead className="font-bold text-gray-700 w-1/4 align-bottom pb-4">Comparison Parameters</TableHead>
                      {selectedProposals.map((id, index) => {
                         const proposal = relatedProposals.find(p => p.id === id);
                         return (
                           <TableHead key={id} className="font-bold text-gray-900 w-1/4 text-center">
                             <div className="flex flex-col items-center">
                               {index === 0 && <Badge className="mb-2 bg-amber-100 text-amber-700 border border-amber-200"><Sparkles className="h-3 w-3 inline mr-1" /> AI Recommended</Badge>}
                               <span className="text-sm">{proposal?.vendorName || `Vendor ${index + 1}`}</span>
                               <span className="text-xs font-normal text-gray-500 mt-1">Score: {92 - (index * 4)}/100</span>
                             </div>
                           </TableHead>
                         );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold text-gray-600 bg-gray-50/30">Commercial (AED)</TableCell>
                      {selectedProposals.map((id) => {
                         const proposal = relatedProposals.find(p => p.id === id);
                         return <TableCell key={id} className="text-center font-bold text-green-600">{proposal?.commercialAmount.toLocaleString()}</TableCell>;
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-gray-600 bg-gray-50/30">Technical Highlights</TableCell>
                      {selectedProposals.map((id, index) => (
                         <TableCell key={id} className="text-sm">
                           <ul className="list-disc pl-4 text-left space-y-1 marker:text-purple-500">
                             {index === 0 ? (
                               <><li>Exceeds performance benchmarks</li><li>Cloud-native architecture</li></>
                             ) : index === 1 ? (
                               <><li>Fully compliant with core reqs</li><li>Offers 24/7 localized support</li></>
                             ) : (
                               <><li>Meets basic requirements</li><li>Standard architecture</li></>
                             )}
                           </ul>
                         </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-gray-600 bg-gray-50/30">Timeline & Warranty</TableCell>
                      {selectedProposals.map((id, index) => (
                         <TableCell key={id} className="text-sm text-center">
                           <div className="space-y-1">
                             <div className="font-medium">{60 - index * 15} days</div>
                             <div className="text-gray-500 text-xs">{index + 1}-year warranty</div>
                           </div>
                         </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-gray-600 bg-gray-50/30">Payment Terms</TableCell>
                      {selectedProposals.map((id, index) => (
                         <TableCell key={id} className="text-sm text-center font-medium">
                           {50 - index * 20}% advance
                         </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* AI Recommendation Summary */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" /> AI Recommendation Summary
                </h4>
                <p className="text-sm font-medium text-purple-800 leading-relaxed">
                  Based on the predefined evaluation criteria (60% Technical / 40% Commercial), <strong>{relatedProposals.find(p => p.id === selectedProposals[0])?.vendorName || "the recommended vendor"}</strong> is the most suitable vendor. Their architectural approach exceeds requirements and provides a significantly better TCO (Total Cost of Ownership).
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowAIComparisonDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}