import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Separator } from '@/app/components/ui/separator';
import { Plus, Trash2, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { mockRFPs } from '@/app/data/mockData';

export default function VendorProposalSubmit() {
  const navigate = useNavigate();
  const { rfpId } = useParams();
  const rfp = mockRFPs.find(r => r.id === rfpId);
  const [showSuccess, setShowSuccess] = useState(false);
  const [costItems, setCostItems] = useState([
    { id: '1', description: 'Core Services & Implementation', amount: 0 },
  ]);

  const addCostItem = () => {
    setCostItems([
      ...costItems,
      { id: Date.now().toString(), description: '', amount: 0 }
    ]);
  };

  const removeCostItem = (id: string) => {
    if (costItems.length > 1) {
      setCostItems(costItems.filter(item => item.id !== id));
    }
  };

  const updateCostItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setCostItems(costItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalAmount = costItems.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/vendor/proposals');
  };

  if (!rfp) {
    return <div>RFP not found</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(`/vendor/rfps/${rfpId}`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to RFP Details
      </Button>

      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Submit Proposal
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          {rfp.title} ({rfp.id})
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="technical" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="technical">Technical Proposal</TabsTrigger>
            <TabsTrigger value="commercial">Commercial Proposal</TabsTrigger>
            <TabsTrigger value="documents">Supporting Documents</TabsTrigger>
          </TabsList>

          {/* Technical Proposal */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Proposal</CardTitle>
                <CardDescription>
                  Provide detailed technical approach and methodology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="technicalDescription">Technical Approach</Label>
                  <Textarea
                    id="technicalDescription"
                    rows={8}
                    placeholder="Describe your technical solution, methodology, and implementation plan..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicalDoc">Technical Proposal Document (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="technicalDoc" type="file" accept=".pdf" required />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Upload detailed technical proposal (max 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commercial Proposal */}
          <TabsContent value="commercial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commercial Proposal</CardTitle>
                <CardDescription>
                  Provide pricing and commercial terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Cost Breakdown</Label>
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                          <TableHead className="w-[70%]">Description</TableHead>
                          <TableHead className="text-right">Amount (AED)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input 
                                placeholder="Enter description (e.g. Licensing, Hardware...)"
                                value={item.description}
                                onChange={(e) => updateCostItem(item.id, 'description', e.target.value)}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  className="text-right" 
                                  placeholder="0.00"
                                  value={item.amount || ''}
                                  onChange={(e) => updateCostItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                  required
                                />
                                {costItems.length > 1 && (
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                    onClick={() => removeCostItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={2} className="pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={addCostItem}
                              style={{ color: 'var(--fnrc-primary-green)', borderColor: 'var(--fnrc-primary-green)' }}
                            >
                              <Plus className="h-4 w-4" />
                              Add Row
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50 border-t-2">
                          <TableCell className="font-bold">Total Proposal Amount</TableCell>
                          <TableCell className="text-right font-bold text-lg pr-12">
                            AED {totalAmount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="commercialDoc">Commercial Proposal Document (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="commercialDoc" type="file" accept=".pdf" required />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>
                    Upload detailed commercial proposal with BOQ (max 10MB)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    id="paymentTerms"
                    rows={3}
                    placeholder="Specify payment milestones and terms..."
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supporting Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>
                  Upload additional documents to support your proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyProfile">Company Profile</Label>
                  <div className="flex items-center gap-2">
                    <Input id="companyProfile" type="file" accept=".pdf" />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousProjects">Previous Project References</Label>
                  <div className="flex items-center gap-2">
                    <Input id="previousProjects" type="file" accept=".pdf" />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">ISO/Industry Certifications</Label>
                  <div className="flex items-center gap-2">
                    <Input id="certifications" type="file" accept=".pdf" multiple />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherDocs">Other Documents (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="otherDocs" type="file" accept=".pdf" multiple />
                    <Upload className="h-5 w-5" style={{ color: 'var(--fnrc-text-muted)' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/vendor/rfps/${rfpId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="text-white"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            Submit Proposal
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent aria-describedby="success-dialog-description">
          <DialogHeader>
            <DialogTitle>Proposal Submitted Successfully</DialogTitle>
          </DialogHeader>
          <div id="success-dialog-description" className="space-y-4 py-4">
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--fnrc-success)' }} />
              <p style={{ color: 'var(--fnrc-text-muted)' }}>
                Your proposal has been successfully submitted and is now under review.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccess(false);
                navigate('/vendor/proposals');
              }}
              className="text-white w-full"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              View My Proposals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}