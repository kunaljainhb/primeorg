import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Calendar, Clock, FileText, Download, ArrowLeft, Send, MessageSquare, Award, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockRFPs, mockProposals, mockERPDocuments, mockVendorReviews } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

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

export default function VendorRFPDetail() {
  const navigate = useNavigate();
  const { rfpId } = useParams();
  const rfp = mockRFPs.find(r => r.id === rfpId);
  
  // Check if there's a proposal for this RFP
  const existingProposal = mockProposals.find(p => p.rfpId === rfpId && p.vendorId === 'VEN-001');
  
  // Check if vendor is shortlisted or rejected to show additional tabs (Case 5 & Case 3)
  const isShortlisted = existingProposal?.status === 'shortlisted';
  const showReviews = isShortlisted || existingProposal?.status === 'rejected';
  
  // Filter ERP documents and reviews for this vendor and RFP
  const erpDocuments = mockERPDocuments.filter(doc => doc.rfpId === rfpId && doc.vendorId === 'VEN-001');
  const vendorReviews = mockVendorReviews.filter(review => review.rfpId === rfpId && review.vendorId === 'VEN-001');
  
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
    return <div>Vendor not found</div>;
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
      approved: { bg: '#D1FAE5', text: 'var(--fnrc-success)' },
      paid: { bg: '#DBEAFE', text: 'var(--fnrc-info)' },
      delivered: { bg: '#E0E7FF', text: '#6366F1' }
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/vendor/rfps')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to RFPs
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
              {rfp.title}
            </h1>
            <Badge style={{ backgroundColor: 'var(--fnrc-success)', color: 'white' }}>
              Published
            </Badge>
            <Badge 
              className="px-2 py-0.5" 
              style={{ 
                backgroundColor: new Date(rfp.submissionDeadline) < new Date('2026-05-15') ? 'var(--fnrc-border-gray)' : 'var(--fnrc-primary-green)',
                color: 'white'
              }}
            >
              {new Date(rfp.submissionDeadline) < new Date('2026-05-15') ? 'Closed' : 'Open'}
            </Badge>
          </div>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>
            {rfp.id}
          </p>
        </div>
      </div>

      {/* Clean Tab Structure */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
          <TabsTrigger 
            value="details" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
            style={{ 
              borderBottomColor: activeTab === 'details' ? 'var(--fnrc-primary-green)' : 'transparent',
              color: activeTab === 'details' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
            }}
          >
            RFP Details
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
            style={{ 
              borderBottomColor: activeTab === 'messages' ? 'var(--fnrc-primary-green)' : 'transparent',
              color: activeTab === 'messages' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
            }}
          >
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="proposal" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
            style={{ 
              borderBottomColor: activeTab === 'proposal' ? 'var(--fnrc-primary-green)' : 'transparent',
              color: activeTab === 'proposal' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
            }}
          >
            Proposal
          </TabsTrigger>
          
          {/* Conditional tabs for shortlisted/rejected vendors */}
          {isShortlisted && (
            <TabsTrigger 
              value="documents" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
              style={{ 
                borderBottomColor: activeTab === 'documents' ? 'var(--fnrc-primary-green)' : 'transparent',
                color: activeTab === 'documents' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
              }}
            >
              Documents
            </TabsTrigger>
          )}
          {showReviews && (
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
              style={{ 
                borderBottomColor: activeTab === 'reviews' ? 'var(--fnrc-primary-green)' : 'transparent',
                color: activeTab === 'reviews' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
              }}
            >
              Reviews
            </TabsTrigger>
          )}
        </TabsList>

        {/* TAB 1: RFP DETAILS */}
        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Submission Deadline
                    </div>
                    <div className="mt-1 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {formatDate(rfp.submissionDeadline)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Project Timeline
                    </div>
                    <div className="mt-1 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {rfp.timeline}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5" style={{ color: 'var(--fnrc-info)' }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Category
                    </div>
                    <div className="mt-1 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                      {rfp.category.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RFP Overview */}
          <Card>
            <CardHeader>
              <CardTitle>RFP Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Description
                </h3>
                <p style={{ color: 'var(--fnrc-text-muted)' }}>{rfp.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Scope of Work
                </h3>
                <p style={{ color: 'var(--fnrc-text-muted)' }}>{rfp.scopeOfWork}</p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
              <CardDescription>Requirements for submission</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rfp.eligibilityCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--fnrc-primary-green)' }}></div>
                    <span style={{ color: 'var(--fnrc-text-dark)' }}>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Download RFP documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rfp.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                    style={{ borderColor: 'var(--fnrc-border-gray)' }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                      <span style={{ color: 'var(--fnrc-text-dark)' }}>{attachment.name}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* TAB 2: CHAT */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                RFP Chat
              </CardTitle>
              <CardDescription>Direct communication with FNRC procurement team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                {/* Chat Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isVendor ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${msg.isVendor ? 'rounded-br-none' : 'rounded-bl-none'}`}
                           style={{ backgroundColor: msg.isVendor ? 'var(--fnrc-primary-green)' : 'white', color: msg.isVendor ? 'white' : 'var(--fnrc-text-dark)' }}>
                        <p className="text-xs font-medium mb-1" style={{ opacity: 0.9 }}>
                          {msg.sender}
                        </p>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="text-white"
                    style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PROPOSAL */}
        <TabsContent value="proposal" className="mt-6">
          {!existingProposal ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-16 w-16 mb-4" style={{ color: 'var(--fnrc-text-muted)' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                  No Proposal Submitted Yet
                </h3>
                <p className="mb-6" style={{ color: 'var(--fnrc-text-muted)' }}>
                  You haven't submitted a proposal for this RFP. Click below to submit your proposal.
                </p>
                <Button
                  size="lg"
                  className="text-white"
                  style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                  onClick={() => navigate(`/vendor/rfps/${rfpId}/submit`)}
                >
                  Submit Proposal
                </Button>
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
        {/* TAB 5: DOCUMENTS (Only visible if shortlisted) */}
        {isShortlisted && (
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>ERP Documents</CardTitle>
                <CardDescription>LPO, Invoices, and other ERP synced documents (Read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                {erpDocuments.length > 0 ? (
                  <div className="rounded-lg border" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Type</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Number</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Date</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Amount</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                          <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {erpDocuments.map((doc) => {
                          const statusColor = getStatusColor(doc.status);
                          return (
                            <TableRow key={doc.id} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                              <TableCell className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.documentType}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.documentNumber}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-muted)' }}>
                                {formatDate(doc.date)}
                              </TableCell>
                              <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>
                                {doc.amount ? `AED ${doc.amount.toLocaleString()}` : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary"
                                  className="text-xs"
                                  style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                                >
                                  {formatStatus(doc.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
                    <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--fnrc-border-gray)' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                      No documents available
                    </p>
                    <p className="text-sm">
                      ERP documents will appear here once they are synced
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 6: REVIEWS (Only visible if shortlisted or rejected) */}
        {showReviews && (
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
                  Performance Reviews
                </CardTitle>
                <CardDescription>Reviews from FNRC procurement team (Read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                {vendorReviews.length > 0 ? (
                  <div className="space-y-4">
                    {vendorReviews.map((review) => (
                      <div 
                        key={review.id} 
                        className="rounded-lg border p-6" 
                        style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: 'var(--fnrc-bg-light)' }}
                      >
                        {/* Header with RFP Reference and Overall Rating */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                                RFP Reference:
                              </span>
                              <span className="font-semibold" style={{ color: 'var(--fnrc-primary-green)' }}>
                                {review.rfpTitle}
                              </span>
                            </div>
                            <div className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Reviewed by {review.reviewedBy} on {formatDate(review.reviewDate)}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-5 w-5 fill-current" style={{ color: 'var(--fnrc-accent-gold)' }} />
                              <span className="text-2xl font-bold" style={{ color: 'var(--fnrc-accent-gold)' }}>
                                {review.overallRating.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Overall Rating
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Category-wise Ratings */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                            <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Quality
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-current" style={{ color: 'var(--fnrc-accent-gold)' }} />
                              <span className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {review.qualityRating}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>/5</span>
                            </div>
                          </div>
                          
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                            <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Timeliness
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-current" style={{ color: 'var(--fnrc-accent-gold)' }} />
                              <span className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {review.timelinessRating}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>/5</span>
                            </div>
                          </div>
                          
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                            <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Communication
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-current" style={{ color: 'var(--fnrc-accent-gold)' }} />
                              <span className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {review.communicationRating}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>/5</span>
                            </div>
                          </div>
                          
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                            <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>
                              Compliance
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-current" style={{ color: 'var(--fnrc-accent-gold)' }} />
                              <span className="font-semibold text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                                {review.complianceRating}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>/5</span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Comments */}
                        <div>
                          <div className="text-sm font-medium mb-2" style={{ color: 'var(--fnrc-text-muted)' }}>
                            Admin Comments
                          </div>
                          <div className="text-sm leading-relaxed" style={{ color: 'var(--fnrc-text-dark)' }}>
                            {review.comments}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center" style={{ color: 'var(--fnrc-text-muted)' }}>
                    <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--fnrc-border-gray)' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
                      No reviews yet
                    </p>
                    <p className="text-sm">
                      Reviews from FNRC will appear here once your performance is evaluated
                    </p>
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