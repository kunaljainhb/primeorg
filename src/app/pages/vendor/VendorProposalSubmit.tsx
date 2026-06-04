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
    { id: '1', description: 'Core Services & Implementation', unitPrice: 0, quantity: 1, amount: 0 },
  ]);

  const addCostItem = () => {
    setCostItems([
      ...costItems,
      { id: Date.now().toString(), description: '', unitPrice: 0, quantity: 1, amount: 0 }
    ]);
  };

  const removeCostItem = (id: string) => {
    if (costItems.length > 1) {
      setCostItems(costItems.filter(item => item.id !== id));
    }
  };

  const updateCostItem = (id: string, field: 'description' | 'unitPrice' | 'quantity', value: any) => {
    setCostItems(costItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if unitPrice or quantity changes
        const price = field === 'unitPrice' ? Number(value) : Number(item.unitPrice || 0);
        const qty = field === 'quantity' ? Number(value) : Number(item.quantity || 0);
        updatedItem.amount = price * qty;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const totalAmount = costItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  if (!rfp) {
    return <div>RFP not found</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(`/vendor/rfps/${rfpId}`)}
          className="gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to RFP Details
        </Button>
      </div>

      <div className="bg-white p-8 rounded-card shadow-card border border-gray-100/50">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
          Submit Proposal Bid
        </h1>
        <p className="text-sm font-semibold tracking-wider text-[var(--fnrc-primary-green)] uppercase">
          {rfp.title} ({rfp.id})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="technical" className="space-y-6">
          <TabsList className="flex w-full bg-white border border-gray-100 p-1.5 rounded-xl max-w-xl">
            <TabsTrigger 
              value="technical"
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
            >
              Technical Specification
            </TabsTrigger>
            <TabsTrigger 
              value="commercial"
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
            >
              Commercial Specification
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500 hover:text-gray-800"
            >
              Supporting Files
            </TabsTrigger>
          </TabsList>

          {/* Technical Proposal */}
          <TabsContent value="technical" className="space-y-6 focus:outline-none">
            <Card>
              <CardHeader className="border-b border-gray-50 pb-5">
                <CardTitle className="text-lg font-bold text-gray-900">Technical Methodology</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="technicalDescription" className="text-sm font-bold text-gray-700">Methodology & Approach *</Label>
                  <Textarea
                    id="technicalDescription"
                    rows={8}
                    className="rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 resize-none text-sm p-4"
                    placeholder="Describe your step-by-step methodology, project milestones, quality assurance practices, and how your team aligns with FNRC expectations..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicalDoc" className="text-sm font-bold text-gray-700">Detailed Technical Document (PDF) *</Label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-all duration-200 flex flex-col items-center justify-center text-center">
                    <input 
                      id="technicalDoc" 
                      type="file" 
                      accept=".pdf" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="h-12 w-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Upload your technical file</span>
                    <span className="text-xs text-gray-400 mt-1">PDF format (Maximum file size: 10MB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commercial Proposal */}
          <TabsContent value="commercial" className="space-y-6 focus:outline-none">
            <Card>
              <CardHeader className="border-b border-gray-50 pb-5">
                <CardTitle className="text-lg font-bold text-gray-900">Commercial Specifications</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-bold text-gray-700 mb-4 block">Itemized Cost Breakdown (AED) *</Label>
                  <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-[45%] font-bold text-gray-800 text-sm py-4">Description</TableHead>
                          <TableHead className="text-right w-[20%] font-bold text-gray-800 text-sm py-4">Unit Price (AED)</TableHead>
                          <TableHead className="text-right w-[12%] font-bold text-gray-800 text-sm py-4">Quantity</TableHead>
                          <TableHead className="text-right w-[18%] font-bold text-gray-800 text-sm py-4">Amount (AED)</TableHead>
                          <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50/20">
                            <TableCell className="py-3">
                              <Input 
                                placeholder="e.g. Core Hardware, Service Integration..."
                                value={item.description}
                                onChange={(e) => updateCostItem(item.id, 'description', e.target.value)}
                                className="h-10 text-sm border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30"
                                required
                              />
                            </TableCell>
                            <TableCell className="py-3">
                              <Input 
                                type="number"
                                className="text-right h-10 text-sm border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30"
                                placeholder="0.00"
                                min={0}
                                value={item.unitPrice || ''}
                                onChange={(e) => updateCostItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </TableCell>
                            <TableCell className="py-3">
                              <Input 
                                type="number"
                                className="text-right h-10 text-sm border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30"
                                placeholder="1"
                                min={1}
                                step={1}
                                value={item.quantity || ''}
                                onChange={(e) => updateCostItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                required
                              />
                            </TableCell>
                            <TableCell className="py-3 text-right">
                              <span className="text-sm font-semibold text-gray-800 pr-2">
                                {item.amount > 0 ? item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 text-center">
                              {costItems.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeCostItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={5} className="py-4 px-4 bg-gray-50/20">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2 font-semibold hover:-translate-y-0.5 transition-transform"
                              onClick={addCostItem}
                              style={{ color: 'var(--fnrc-primary-green)', borderColor: 'var(--fnrc-primary-green)' }}
                            >
                              <Plus className="h-4 w-4" />
                              Add Service Row
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50 border-t border-gray-100 hover:bg-gray-50">
                          <TableCell colSpan={3} className="font-bold text-right text-gray-900 py-4" style={{ color: 'var(--fnrc-text-dark)' }}>
                            Total Quote Sum (Exclusive of VAT)
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-base text-[var(--fnrc-primary-green)] py-4 pr-2">
                            AED {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-2">
                  <Label htmlFor="commercialDoc" className="text-sm font-bold text-gray-700">Detailed Commercial Document (PDF) *</Label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-all duration-200 flex flex-col items-center justify-center text-center">
                    <input 
                      id="commercialDoc" 
                      type="file" 
                      accept=".pdf" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="h-12 w-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Upload your commercial/BOQ file</span>
                    <span className="text-xs text-gray-400 mt-1">PDF format (Maximum file size: 10MB)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms" className="text-sm font-bold text-gray-700">Payment Milestones & Terms *</Label>
                  <Textarea
                    id="paymentTerms"
                    rows={3}
                    className="rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 resize-none text-sm p-4"
                    placeholder="Specify project stage payments (e.g. 20% on Mobilization, 40% on Delivery...)"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supporting Documents */}
          <TabsContent value="documents" className="space-y-6 focus:outline-none">
            <Card>
              <CardHeader className="border-b border-gray-50 pb-5">
                <CardTitle className="text-lg font-bold text-gray-900">Supporting Records</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyProfile" className="text-sm font-bold text-gray-700">Company Overview Brochure</Label>
                    <div className="flex items-center gap-2">
                      <Input id="companyProfile" type="file" accept=".pdf" className="rounded-xl border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousProjects" className="text-sm font-bold text-gray-700">Past Project Case Studies</Label>
                    <div className="flex items-center gap-2">
                      <Input id="previousProjects" type="file" accept=".pdf" className="rounded-xl border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications" className="text-sm font-bold text-gray-700">ISO/Quality Credentials</Label>
                    <div className="flex items-center gap-2">
                      <Input id="certifications" type="file" accept=".pdf" multiple className="rounded-xl border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDocs" className="text-sm font-bold text-gray-700">Other Appendices</Label>
                    <div className="flex items-center gap-2">
                      <Input id="otherDocs" type="file" accept=".pdf" multiple className="rounded-xl border-gray-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 font-semibold"
            onClick={() => navigate(`/vendor/rfps/${rfpId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-white h-11 px-8 font-semibold shadow-lg shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            Submit Formal Bid
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="success-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">Bid Submitted Successfully</DialogTitle>
          </DialogHeader>
          <div id="success-dialog-description" className="space-y-4 py-6">
            <div className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Your proposal has been officially registered in the FNRC system. The procurement panel will begin technical evaluation reviews.
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccess(false);
                navigate('/vendor/proposals');
              }}
              className="text-white w-full h-11 font-semibold shadow-md"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Go to Proposal Panel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}