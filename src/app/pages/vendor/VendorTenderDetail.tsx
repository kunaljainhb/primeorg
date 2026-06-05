import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Calendar, Clock, FileText, Download, ArrowLeft, Send, MessageSquare, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockTenders, mockProposals } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import { StatusBadge } from '@/app/components/ui/status-badge';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function VendorTenderDetail() {
  const navigate = useNavigate();
  const { tenderId } = useParams();
  const tender = mockTenders.find(r => r.id === tenderId);
  
  // Check if there's a proposal for this Tender
  const existingProposal = mockProposals.find(p => p.tenderId === tenderId && p.vendorId === 'VEN-001');
  
  const [activeTab, setActiveTab] = useState('details');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>(
    tenderId === 'TEND-001' 
      ? [
          { sender: 'FNRC Contact', text: 'Hello! I noticed you are viewing the Solar Energy Tender. Do you have any questions regarding the technical specifications?', time: '09:15 AM', isVendor: false },
          { sender: 'You', text: 'Yes, I was wondering about the site visit schedule mentioned in Section 4.', time: '10:05 AM', isVendor: true },
          { sender: 'FNRC Contact', text: 'The site visits are scheduled for next Tuesday at 10:00 AM. We will send a formal invite to all interested vendors.', time: '10:30 AM', isVendor: false },
        ]
      : [
          { sender: 'FNRC Contact', text: 'Hello! How can I help you with this Tender?', time: '10:30 AM', isVendor: false },
        ]
  );

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card shadow-card">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Tender Not Found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">The Tender you are looking for does not exist.</p>
        <Button onClick={() => navigate('/vendor/tenders')} style={{ backgroundColor: 'var(--fnrc-primary-green)' }} className="text-white">
          Back to Tenders
        </Button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVendor: true
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
      
      // Simulate response after 1 second
      setTimeout(() => {
        const response = {
          sender: 'FNRC Contact',
          text: 'Thank you for your message. We will review and respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVendor: false
        };
        setChatMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const isClosed = new Date(tender.submissionDeadline) < new Date('2026-05-15');

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/vendor/tenders')}
          className="gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenders
        </Button>
      </div>

      {/* Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-2">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {tender.id} - {tender.title}
            </h1>
            <StatusBadge status={isClosed ? "closed" : "published"} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="flex w-full border-b border-gray-200 gap-8 overflow-x-auto overflow-y-hidden bg-transparent scrollbar-hide">
          <TabsTrigger 
            value="details" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            Tender Details
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            Vendor Chat
          </TabsTrigger>
          <TabsTrigger 
            value="proposal" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            My Proposal
          </TabsTrigger>
        </TabsList>

                {/* TAB 1: Tender DETAILS */}
        <TabsContent value="details" className="space-y-6 focus:outline-none">
          {/* Key Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-black block">
                    Submission Deadline
                  </span>
                  <span className="text-base font-normal text-gray-800 mt-1 block">
                    {formatDate(tender.submissionDeadline)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-black block">
                    Service Category
                  </span>
                  <span className="text-base font-normal text-gray-800 mt-1 block">
                    {tender.category.join(', ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 1: Tender Overview */}
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 py-2 px-6">
              <CardTitle className="text-lg font-bold text-gray-900">Tender Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Description</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tender.description}</p>
              </div>
              <Separator className="bg-gray-100" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {tender.eligibilityCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--fnrc-primary-green)] shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator className="bg-gray-100" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Estimated Budget</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{(tender as any).estimatedBudget || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Scope and Timeline */}
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 py-2 px-6">
              <CardTitle className="text-lg font-bold text-gray-900">Scope and Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Scope of Work</h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{tender.scopeOfWork}</p>
              </div>
              <Separator className="bg-gray-100" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Project Start Date</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{formatDate((tender as any).projectStartDate || '2026-07-01')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">Project End Date</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{formatDate((tender as any).projectEndDate || '2026-12-31')}</p>
                </div>
              </div>
              <Separator className="bg-gray-100" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-wide">Milestone Details</h3>
                <div className="space-y-3">
                  {((tender as any).milestones || [
                    { title: 'Project Kickoff', date: '2026-07-15' },
                    { title: 'Mid-term Review', date: '2026-09-30' },
                    { title: 'Final Delivery & Sign-off', date: '2026-12-15' }
                  ]).map((m: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm border border-gray-100 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <span className="font-semibold text-gray-800">{m.title}</span>
                      <span className="text-gray-500 font-medium">{formatDate(m.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Tender Documents */}
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 py-2 px-6">
              <CardTitle className="text-lg font-bold text-gray-900">Tender Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-4 space-y-2">
              {tender.attachments.length > 0 ? tender.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">{attachment.name}</span>
                      <span className="text-xs text-gray-400 block mt-0.5">Document</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 font-semibold">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )) : (
                <p className="text-sm text-gray-500 italic">No documents attached.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>{/* TAB 2: CLARIFICATION CHAT */}
        <TabsContent value="messages" className="focus:outline-none">
          <Card className="gap-0 h-auto">
            <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MessageSquare className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Tender Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="!pt-2 px-6 pb-4">
              <div className="flex flex-col h-[520px]">
                {/* Chat Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-6 rounded-2xl mb-4 bg-gray-50/60 border border-gray-100">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isVendor ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.isVendor ? 'bg-[var(--fnrc-primary-green)] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                          {msg.sender}
                        </p>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className="text-[10px] mt-2 text-right opacity-60">
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type your clarification question here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={2}
                      className="resize-none rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 border-gray-200"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="text-white h-12 w-12 rounded-xl flex items-center justify-center p-0 shrink-0 shadow-md shadow-[var(--fnrc-primary-green)]/10"
                    style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PROPOSAL STATUS */}
        <TabsContent value="proposal" className="focus:outline-none">
          {!existingProposal ? (
            <Card className="border border-dashed border-gray-200">
              <CardContent className="py-16 text-center max-w-xl mx-auto flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Proposal Submitted
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  You haven't submitted a proposal yet. <br/>
                  Review the Tender details and submit your proposal before the deadline.
                </p>
                {isClosed ? (
                  <Button disabled size="lg" className="w-full sm:w-auto font-semibold">
                    Submission Period Ended
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="text-white w-full sm:w-auto font-semibold shadow-lg shadow-[var(--fnrc-primary-green)]/15"
                    style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                    onClick={() => navigate(`/vendor/tenders/${tender.id}/submit`)}
                  >
                    Submit Proposal
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <ProposalDetailView 
              proposal={existingProposal}
              showBackButton={false}
              viewMode="status"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}