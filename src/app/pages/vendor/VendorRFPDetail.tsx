import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Calendar, Clock, FileText, Download, ArrowLeft, Send, MessageSquare, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockRFPs, mockProposals } from '@/app/data/mockData';
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

export default function VendorRFPDetail() {
  const navigate = useNavigate();
  const { rfpId } = useParams();
  const rfp = mockRFPs.find(r => r.id === rfpId);
  
  // Check if there's a proposal for this RFP
  const existingProposal = mockProposals.find(p => p.rfpId === rfpId && p.vendorId === 'VEN-001');
  
  const [activeTab, setActiveTab] = useState('details');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>(
    rfpId === 'RFP-001' 
      ? [
          { sender: 'FNRC Contact', text: 'Hello! I noticed you are viewing the Solar Energy RFP. Do you have any questions regarding the technical specifications?', time: '09:15 AM', isVendor: false },
          { sender: 'You', text: 'Yes, I was wondering about the site visit schedule mentioned in Section 4.', time: '10:05 AM', isVendor: true },
          { sender: 'FNRC Contact', text: 'The site visits are scheduled for next Tuesday at 10:00 AM. We will send a formal invite to all interested vendors.', time: '10:30 AM', isVendor: false },
        ]
      : [
          { sender: 'FNRC Contact', text: 'Hello! How can I help you with this RFP?', time: '10:30 AM', isVendor: false },
        ]
  );

  if (!rfp) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card shadow-card">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">RFP Not Found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">The RFP you are looking for does not exist.</p>
        <Button onClick={() => navigate('/vendor/rfps')} style={{ backgroundColor: 'var(--fnrc-primary-green)' }} className="text-white">
          Back to RFPs
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

  const isClosed = new Date(rfp.submissionDeadline) < new Date('2026-05-15');

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/vendor/rfps')}
          className="gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to RFPs
        </Button>
      </div>

      {/* Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-card shadow-card border border-gray-100/50">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {rfp.id.replace('-', ' - ')} {rfp.title}
            </h1>
            <StatusBadge status={isClosed ? "closed" : "published"} />
          </div>
        </div>

        {!existingProposal && !isClosed && (
          <Button
            size="lg"
            className="text-white shadow-md hover:shadow-lg shadow-[var(--fnrc-primary-green)]/15 transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            onClick={() => navigate(`/vendor/rfps/${rfp.id}/submit`)}
          >
            Submit Proposal
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="flex w-full bg-white border border-gray-100 p-1.5 rounded-xl max-w-md">
          <TabsTrigger 
            value="details" 
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
          >
            RFP Details
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
          >
            Vendor Chat
          </TabsTrigger>
          <TabsTrigger 
            value="proposal" 
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
          >
            My Proposal
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RFP DETAILS */}
        <TabsContent value="details" className="space-y-6 focus:outline-none">
          {/* Key Information */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Submission Deadline
                  </span>
                  <span className="text-base font-bold text-gray-800 mt-1 block">
                    {formatDate(rfp.submissionDeadline)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Project Timeline
                  </span>
                  <span className="text-base font-bold text-gray-800 mt-1 block">
                    {rfp.timeline}
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
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Category Sector
                  </span>
                  <span className="text-base font-bold text-gray-800 mt-1 block truncate max-w-[200px]">
                    {rfp.category.join(', ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RFP Overview */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="text-lg font-bold text-gray-900">RFP Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">
                  Description
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{rfp.description}</p>
              </div>
              <Separator className="bg-gray-100" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">
                  Scope of Work
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{rfp.scopeOfWork}</p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="text-lg font-bold text-gray-900">Eligibility Criteria</CardTitle>
              <CardDescription>Minimum qualifications required for proposal submission</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {rfp.eligibilityCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--fnrc-primary-green)] shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="text-lg font-bold text-gray-900">RFP Attachments</CardTitle>
              <CardDescription>Download official tender packages and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {rfp.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">{attachment.name}</span>
                      <span className="text-xs text-gray-400 block">PDF Document</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 font-semibold">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CLARIFICATION CHAT */}
        <TabsContent value="messages" className="focus:outline-none">
          <Card>
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MessageSquare className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                RFP Discussion Thread
              </CardTitle>
              <CardDescription>Clarify specifications directly with FNRC procurement experts</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                <div className="h-16 w-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Proposal Submitted
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  You haven't submitted a technical or commercial bid for this tender campaign. Review the scope of work and complete your draft before the submission deadline.
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
                    onClick={() => navigate(`/vendor/rfps/${rfp.id}/submit`)}
                  >
                    Start Bid Submission
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