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
  Download,
  Building2,
  Globe,
  Eye,
  Briefcase,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { mockTenders, mockProposals, mockERPDocuments } from '@/app/data/mockData';
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
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { EmptyState } from '@/app/components/ui/empty-state';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function AdminTenderDetail() {
  const navigate = useNavigate();
  const { tenderId } = useParams();
  const location = useLocation();
  const tender = mockTenders.find(r => r.id === tenderId) || mockTenders[0];

  // Redirect to edit/create page if in draft status
  useEffect(() => {
    if (tender && tender.status.toLowerCase() === 'draft') {
      navigate(`/admin/tenders/edit/${tender.id}`);
    }
  }, [tender, navigate]);

  const defaultTab = location.pathname.includes('tab=chats') ? 'chats' : 'overview';

  const relatedProposals = mockProposals.filter(p => p.tenderId === tender.id);
  const approvedProposals = relatedProposals.filter(p => p.status === 'approved');

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState<string>(tender.submissionDeadline ? String(tender.submissionDeadline).split('T')[0] : '');
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

  const handleCloseTender = () => {
    toast.success('Tender closed successfully');
    setShowCloseDialog(false);
    navigate('/admin/tenders');
  };

  const handleCancelTender = () => {
    toast.success('Tender cancelled successfully');
    setShowCancelDialog(false);
    navigate('/admin/tenders');
  };

  const handleChangeDeadline = () => {
    if (newDeadline) {
      toast.success('Submission deadline updated successfully');
      setShowDeadlineDialog(false);
    }
  };

  const totalUnreadChats = Object.values(vendorChats).reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/tenders')} className="gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Tenders
        </Button>
      </div>

      {/* Header Info Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-card shadow-card border border-gray-100/50">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {tender.title}
            </h1>
            <StatusBadge status={tender.status} />
          </div>
          <p className="text-sm font-semibold tracking-wider text-[var(--fnrc-primary-green)] uppercase">
            {tender.id}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(tender.status !== 'closed' && tender.status !== 'cancelled') && (
            <>
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 h-10 font-semibold" onClick={() => setShowCancelDialog(true)}>
                <XIcon className="mr-1.5 h-4 w-4" />
                Cancel Tender
              </Button>
              <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 h-10 font-semibold" onClick={() => setShowDeadlineDialog(true)}>
                <Clock className="mr-1.5 h-4 w-4" />
                Extend Deadline
              </Button>
              <Button className="text-white h-10 px-6 font-semibold shadow-md shadow-green-600/10" style={{ backgroundColor: 'var(--fnrc-success)' }} onClick={() => setShowCloseDialog(true)}>
                <Check className="mr-1.5 h-4 w-4" />
                Close Tender
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="flex w-full bg-white border border-gray-100 p-1.5 rounded-xl max-w-2xl">
          <TabsTrigger value="overview" className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800">
            Tender Overview
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800 flex items-center gap-1.5">
            Vendor Chats
            {totalUnreadChats > 0 && (
              <span className="bg-red-500 text-white font-bold text-[9px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full border-none leading-none animate-pulse">
                {totalUnreadChats}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800">
            Proposal Received ({relatedProposals.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800">
            Shortlist Proposal ({approvedProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 focus:outline-none">
          {/* Basic Information */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50/80 bg-gray-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <Building2 className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Tender Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tender Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {tender.category.map((cat, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none font-semibold text-xs px-3 py-1">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</Label>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {tender.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Eligibility Requirements</Label>
                  <ul className="space-y-2">
                    {tender.eligibilityCriteria.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-gray-800 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--fnrc-primary-green)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Budget Allocation</Label>
                  <div className="text-lg font-bold text-gray-900">
                    AED 500,000.00
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Period Deadline</Label>
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    {formatDate(tender.submissionDeadline)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope of Work */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50/80 bg-gray-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <Briefcase className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Scope of Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {tender.scopeOfWork}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Initiation Date</Label>
                  <div className="font-bold text-sm flex items-center gap-2 text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    01/06/2026
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Completion Date</Label>
                  <div className="font-bold text-sm flex items-center gap-2 text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    31/12/2026
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Execution Milestones</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Project Initiation', date: '15/06/2026' },
                    { title: 'Intermediate Progress Review', date: '01/09/2026' },
                    { title: 'Final Technical Handover', date: '20/12/2026' }
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col gap-2 p-5 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                      <span className="text-xs font-bold text-gray-400 tracking-wider">MILESTONE 0{i + 1}</span>
                      <span className="text-sm font-bold text-gray-900">{m.title}</span>
                      <span className="text-sm font-semibold text-[var(--fnrc-primary-green)]">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50/80 bg-gray-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Tender Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {tender.attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{file.name}</div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">Tender Document Package</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 font-semibold hover:bg-gray-100">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: VENDOR CHATS */}
        <TabsContent value="chats" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Conversations list sidebar */}
            <Card className="md:col-span-4 border border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                  Vendor Threads
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-50">
                  {Object.entries(vendorChats).map(([id, chat]) => {
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    const isActive = activeVendorId === id;
                    return (
                      <div
                        key={id}
                        onClick={() => handleSelectVendor(id)}
                        className={`p-4 cursor-pointer transition-all flex items-center justify-between hover:bg-gray-50/40 ${
                          isActive ? 'bg-[var(--fnrc-primary-green)]/[0.04] border-l-4 border-[var(--fnrc-primary-green)]' : ''
                        }`}
                      >
                        <div className="space-y-1 flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-800 truncate">{chat.vendorName}</h4>
                            <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                              {lastMsg ? lastMsg.timestamp : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-semibold truncate">
                            {lastMsg ? lastMsg.text : 'No conversations yet'}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-red-500 text-white font-bold text-[9px] h-5 w-5 flex items-center justify-center rounded-full border-none shrink-0"
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

            {/* Chat Box panel */}
            <Card className="md:col-span-8 border border-gray-100 flex flex-col min-h-[460px]">
              {activeVendorId && vendorChats[activeVendorId] ? (
                <div className="flex flex-col h-full">
                  <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                      {vendorChats[activeVendorId].vendorName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="border border-gray-100 rounded-xl bg-gray-50/40 p-4 h-[300px] overflow-y-auto space-y-3 flex flex-col scrollbar-thin scrollbar-thumb-gray-200">
                      {vendorChats[activeVendorId].messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col max-w-[80%] ${msg.sender === 'admin' ? 'align-end ml-auto' : 'align-start mr-auto'}`}
                        >
                          <span className={`text-[10px] font-bold mb-1 text-gray-400 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                            {msg.sender === 'admin' ? 'Government Admin' : vendorChats[activeVendorId].vendorName}
                          </span>
                          <div 
                            className={`p-3 rounded-2xl text-xs font-semibold shadow-2xs relative ${
                              msg.sender === 'admin' 
                                ? 'bg-[var(--fnrc-primary-green)] text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
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

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Type administrative response to ${vendorChats[activeVendorId].vendorName}...`}
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendVendorMessage()}
                        className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-850 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)] focus-visible:border-[var(--fnrc-primary-green)] bg-white"
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
                </div>
              ) : (
                <div className="p-12 text-center text-sm font-medium text-gray-500 flex flex-col items-center justify-center h-full">
                  <Building2 className="h-8 w-8 text-gray-300 mb-3" />
                  Select a vendor conversation to begin clarifying requirements.
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: PROPOSALS RECEIVED */}
        <TabsContent value="proposals" className="focus:outline-none space-y-6">
          <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Vendor proposal bids</h4>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Select 2 or 3 proposal bids for side-by-side AI Comparison matrix audit</p>
              </div>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 text-xs transition-all gap-1.5 shadow-md shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={selectedProposals.length < 2 || selectedProposals.length > 3}
                onClick={handleAIComparison}
              >
                <Brain className="h-4 w-4" />
                AI Compare ({selectedProposals.length})
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="py-4 pl-6 w-[60px]"></TableHead>
                    <TableHead className="font-bold text-gray-900 text-sm py-4">Proposal ID</TableHead>
                    <TableHead className="font-bold text-gray-900 text-sm py-4">Vendor Name</TableHead>
                    <TableHead className="font-bold text-gray-900 text-sm py-4">Deadline Date</TableHead>
                    <TableHead className="font-bold text-gray-900 text-sm py-4 text-right">Proposal Amount</TableHead>
                    <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-gray-900 text-sm py-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedProposals.map((proposal) => (
                    <TableRow key={proposal.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="py-4 pl-6">
                        <Checkbox
                          checked={selectedProposals.includes(proposal.id)}
                          onCheckedChange={(checked) => handleSelectProposal(proposal.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-bold text-gray-500">
                        {proposal.id}
                      </TableCell>
                      <TableCell className="font-bold text-gray-800">{proposal.vendorName}</TableCell>
                      <TableCell className="text-gray-500 font-medium">{formatDate(proposal.submissionDate)}</TableCell>
                      <TableCell className="text-right font-extrabold text-sm text-[var(--fnrc-primary-green)]">
                        AED {proposal.commercialAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={proposal.status} />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="outline" size="sm" className="font-semibold text-xs" onClick={() => navigate(`/admin/proposals/${proposal.id}`)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: APPROVED VENDORS */}
        <TabsContent value="approved" className="focus:outline-none space-y-6">
          {approvedProposals.length > 0 ? (
            approvedProposals.map((proposal) => {
              const vendorDocs = mockERPDocuments.filter(d => d.tenderId === tender.id && d.vendorId === proposal.vendorId);

              return (
                <Card key={proposal.id} className="overflow-hidden border border-gray-100/50 shadow-sm">
                  <div className="bg-gray-50/50 border-b border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vendor Name</p>
                          <p className="text-sm font-bold text-gray-800">{proposal.vendorName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Proposal ID</p>
                          <p className="text-sm font-bold text-gray-800">{proposal.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline Date</p>
                          <p className="text-sm font-semibold text-gray-700">{formatDate(proposal.submissionDate)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Approved Date</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {proposal.approvedDate ? formatDate(proposal.approvedDate) : formatDate(new Date())}
                          </p>
                        </div>
                      </div>
                      <Button className="shrink-0 bg-[var(--fnrc-primary-green)] text-white hover:bg-green-700 font-semibold text-xs shadow-md" onClick={() => navigate(`/admin/proposals/${proposal.id}`)}>
                        Details Audit
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)] animate-pulse" />
                      <h3 className="font-bold text-sm text-gray-800">ERP Ledger & LPO Sync Records</h3>
                    </div>
                    {vendorDocs.length > 0 ? (
                      <Table>
                        <TableHeader className="bg-gray-50/20">
                          <TableRow>
                            <TableHead className="py-3 pl-6 font-bold text-xs text-gray-600">Document Type</TableHead>
                            <TableHead className="font-bold text-xs text-gray-600">Sync Date</TableHead>
                            <TableHead className="font-bold text-xs text-gray-600">ERP Status</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-xs text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vendorDocs.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                              <TableCell className="py-3 pl-6">
                                <div className="font-bold text-sm text-gray-800">{doc.documentType}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{doc.documentNumber}</div>
                              </TableCell>
                              <TableCell className="text-sm font-medium text-gray-500">
                                {formatDate(doc.date)}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={doc.status} />
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--fnrc-primary-green)]">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--fnrc-primary-green)]">
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
                        No ERP synchronization documents available for this vendor ledger yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState
              title="No Approved Vendors"
              description="No vendors have been approved for this Tender campaign. Complete evaluation scorecard details to shortlist a supplier."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Close Tender dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent className="rounded-modal p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Close Tender Campaign?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
              Closing this Tender will immediately terminate the proposal submission window. Registered vendors will no longer be able to draft or upload specs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="font-semibold rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fnrc-success)] hover:bg-green-700 text-white font-semibold rounded-lg shadow-md" onClick={handleCloseTender}>
              Confirm Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Tender dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-modal p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600">Cancel Tender Campaign?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed font-semibold">
              This action is highly critical. Cancelling this Tender will invalidate all received proposal bids and notify active operators. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="font-semibold rounded-lg">Dismiss</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md" onClick={handleCancelTender}>
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deadline Extend Dialog */}
      <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="deadline-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Extend Submission Deadline</DialogTitle>
          </DialogHeader>
          <div id="deadline-dialog-description" className="space-y-4 py-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Choose New Expiry Date *</Label>
              <Input
                type="date"
                value={newDeadline}
                className="rounded-xl border-gray-200"
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Once saved, the portal will immediately update the deadline timers on all vendor screens.
            </p>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowDeadlineDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangeDeadline}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Extend Deadline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Comparison matrix loading modal */}
      <Dialog open={showAIComparisonDialog} onOpenChange={setShowAIComparisonDialog}>
        <DialogContent className="sm:max-w-3xl p-8" aria-describedby="ai-dialog-description">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-purple-750">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Proposal Audit Engine
            </DialogTitle>
          </DialogHeader>
          <div id="ai-dialog-description" className="py-6 space-y-6">
            {isAIAnalyzing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                <p className="text-sm font-bold text-purple-700 animate-pulse">Analyzing technical parameters and commercial pricing matrices...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl bg-purple-50/50 p-4 border border-purple-100 text-xs font-semibold text-purple-800 leading-relaxed">
                  AI Summary: The compared bids demonstrate highly competitive commercial structures. TechCorp Solutions is commercial leader but Global InfraGroup provides a longer warrantee period (24 vs 12 months). APEX Systems ranks highest on compliance credentials.
                </div>
                
                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-bold text-xs py-3 pl-4">Audit Criterion</TableHead>
                        {selectedProposals.map(id => {
                          const prop = relatedProposals.find(p => p.id === id);
                          return (
                            <TableHead key={id} className="font-bold text-xs py-3 text-center">{prop?.vendorName}</TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-gray-50 last:border-0 hover:bg-gray-50/20">
                        <TableCell className="font-bold text-xs pl-4 py-3 text-gray-700">Commercial Total</TableCell>
                        {selectedProposals.map(id => {
                          const prop = relatedProposals.find(p => p.id === id);
                          return (
                            <TableCell key={id} className="text-center font-bold text-xs text-[var(--fnrc-primary-green)]">AED {prop?.commercialAmount.toLocaleString()}</TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow className="border-b border-gray-50 last:border-0 hover:bg-gray-50/20">
                        <TableCell className="font-bold text-xs pl-4 py-3 text-gray-700">Compliance Match</TableCell>
                        {selectedProposals.map(id => (
                          <TableCell key={id} className="text-center font-semibold text-xs text-emerald-600">100% Match</TableCell>
                        ))}
                      </TableRow>
                      <TableRow className="border-b border-gray-50 last:border-0 hover:bg-gray-50/20">
                        <TableCell className="font-bold text-xs pl-4 py-3 text-gray-700">Risk Assessment</TableCell>
                        {selectedProposals.map(id => {
                          const isLead = id === 'PROP-101';
                          return (
                            <TableCell key={id} className={`text-center font-semibold text-xs ${isLead ? 'text-emerald-600' : 'text-amber-600'}`}>{isLead ? 'Minimal' : 'Low'}</TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="border-t pt-4 sm:justify-end">
            <Button variant="outline" className="font-semibold" onClick={() => setShowAIComparisonDialog(false)}>
              Close Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}