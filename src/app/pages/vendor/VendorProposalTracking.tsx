import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { ArrowLeft, FileText, Download, Award, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockProposals, mockERPDocuments, mockVendorReviews } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

export default function VendorProposalTracking() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const proposal = mockProposals.find(p => p.id === proposalId);
  
  const [activeTab, setActiveTab] = useState('status');

  if (!proposal) {
    return <div>Proposal not found</div>;
  }

  // Check if vendor is shortlisted or rejected to show additional tabs
  const isShortlisted = proposal.status === 'shortlisted';
  const showReviews = isShortlisted || proposal.status === 'rejected';
  
  // Filter ERP documents and reviews for this vendor and RFP
  const erpDocuments = mockERPDocuments.filter(doc => doc.rfpId === proposal.rfpId && doc.vendorId === proposal.vendorId);
  const vendorReviews = mockVendorReviews.filter(review => review.rfpId === proposal.rfpId && review.vendorId === proposal.vendorId);

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
        onClick={() => navigate('/vendor/proposals')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Proposals
      </Button>

      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          {proposal.rfpTitle}
        </h1>
        <p className="text-lg" style={{ color: 'var(--fnrc-text-muted)' }}>
          Proposal Details & Tracking
        </p>
      </div>

      {/* Tab Structure */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
          <TabsTrigger 
            value="submitted" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
            style={{ 
              borderBottomColor: activeTab === 'submitted' ? 'var(--fnrc-primary-green)' : 'transparent',
              color: activeTab === 'submitted' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
            }}
          >
            Proposal Details
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 px-6 py-3"
            style={{ 
              borderBottomColor: activeTab === 'status' ? 'var(--fnrc-primary-green)' : 'transparent',
              color: activeTab === 'status' ? 'var(--fnrc-primary-green)' : 'var(--fnrc-text-muted)'
            }}
          >
            Proposal Status
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

        {/* TAB 1: PROPOSAL DETAILS */}
        <TabsContent value="submitted" className="mt-6">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="submitted"
          />
        </TabsContent>

        {/* TAB 2: PROPOSAL STATUS */}
        <TabsContent value="status" className="mt-6">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="status"
          />
        </TabsContent>

        {/* TAB 2: DOCUMENTS (Only visible if shortlisted) */}
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
                                {new Date(doc.date).toLocaleDateString()}
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
                                  {doc.status}
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

        {/* TAB 3: REVIEWS (Only visible if shortlisted or rejected) */}
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
                              Reviewed by {review.reviewedBy} on {new Date(review.reviewDate).toLocaleDateString()}
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
