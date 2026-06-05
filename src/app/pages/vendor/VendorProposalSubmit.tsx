import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { RichTextEditor } from '@/app/components/ui/rich-text-editor';

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
import { mockTenders } from '@/app/data/mockData';

export default function VendorProposalSubmit() {
  const navigate = useNavigate();
  const { tenderId } = useParams();
  const tender = mockTenders.find(r => r.id === tenderId);
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

  if (!tender) {
    return <div>Tender not found</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(`/vendor/tenders/${tenderId}`)}
          className="gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tender Details
        </Button>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
          Proposal Submission
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 tracking-tight">
            {tender.id} - {tender.title}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
          {/* Technical Proposal */}
            <Card className="gap-0 h-auto">
              <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
                <CardTitle className="text-lg font-bold text-gray-900">Technical Approach</CardTitle>
              </CardHeader>
              <CardContent className="!pt-4 px-6 pb-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="technicalDescription" className="text-sm font-bold text-gray-700">Approach *</Label>
                  <RichTextEditor
                    id="technicalDescription"
                    rows={8}
                    placeholder="Describe your step-by-step methodology, project milestones, quality assurance practices, and how your team aligns with FNRC expectations..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicalDoc" className="text-sm font-bold text-gray-700">Technical Document *</Label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-5 hover:bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-all duration-200 flex flex-col items-center justify-center text-center">
                    <input 
                      id="technicalDoc" 
                      type="file" 
                      accept=".pdf" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Upload your technical file</span>
                    <span className="text-xs text-gray-400 mt-1">PDF format (Maximum file size: 10MB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          {/* Commercial Proposal */}
            <Card className="gap-0 h-auto">
              <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
                <CardTitle className="text-lg font-bold text-gray-900">Commercial Specifications</CardTitle>
              </CardHeader>
              <CardContent className="!pt-4 px-6 pb-4 space-y-6">
                <div>
                  <Label className="text-sm font-bold text-gray-700 mb-4 block">Cost Breakdown (AED) *</Label>
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader className="bg-transparent">
                        <TableRow>
                          <TableHead className="w-[45%] font-bold text-gray-800 text-xs uppercase tracking-wider py-4">Description</TableHead>
                          <TableHead className="text-right w-[20%] font-bold text-gray-800 text-xs uppercase tracking-wider py-4">Unit Price (AED)</TableHead>
                          <TableHead className="text-right w-[12%] font-bold text-gray-800 text-xs uppercase tracking-wider py-4">Quantity</TableHead>
                          <TableHead className="text-right w-[18%] font-bold text-gray-800 text-xs uppercase tracking-wider py-4">Amount (AED)</TableHead>
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
                                className="h-10 text-sm border-0 shadow-none bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 px-2"
                                required
                              />
                            </TableCell>
                            <TableCell className="py-3">
                              <Input 
                                type="number"
                                className="text-right h-10 text-sm border-0 shadow-none bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 px-2"
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
                                className="text-right h-10 text-sm border-0 shadow-none bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-[var(--fnrc-primary-green)]/30 px-2"
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
                        <TableRow className="bg-transparent border-t border-gray-200 hover:bg-transparent">
                          <TableCell colSpan={3} className="font-bold text-right text-gray-900 py-4" style={{ color: 'var(--fnrc-text-dark)' }}>
                            Total Amount
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
                  <Label htmlFor="paymentTerms" className="text-sm font-bold text-gray-700">Payment Milestones & Terms *</Label>
                  <RichTextEditor
                    id="paymentTerms"
                    rows={4}
                    placeholder="Specify project stage payments (e.g. 20% on Mobilization, 40% on Delivery...)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commercialDoc" className="text-sm font-bold text-gray-700">Commercial Document *</Label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-5 hover:bg-gray-50/50 hover:border-[var(--fnrc-primary-green)]/40 transition-all duration-200 flex flex-col items-center justify-center text-center">
                    <input 
                      id="commercialDoc" 
                      type="file" 
                      accept=".pdf" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Upload your commercial/BOQ file</span>
                    <span className="text-xs text-gray-400 mt-1">PDF format (Maximum file size: 10MB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          {/* Supporting Documents */}
            <Card className="gap-0 h-auto">
              <CardHeader className="border-b border-gray-100 pt-4 px-6 !pb-2">
                <CardTitle className="text-lg font-bold text-gray-900">Supporting Records</CardTitle>
              </CardHeader>
              <CardContent className="!pt-4 px-6 pb-4 space-y-6">
                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="suppDoc1" className="text-sm font-bold text-gray-700">Company Profile</Label>
                    <div className="flex items-center gap-2">
                      <Input id="suppDoc1" type="file" accept=".pdf" className="rounded-xl border-gray-200 flex-1" />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={() => {
                          const el = document.getElementById('suppDoc1') as HTMLInputElement;
                          if (el) el.value = '';
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suppDoc2" className="text-sm font-bold text-gray-700">Previous Work</Label>
                    <div className="flex items-center gap-2">
                      <Input id="suppDoc2" type="file" accept=".pdf" className="rounded-xl border-gray-200 flex-1" />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={() => {
                          const el = document.getElementById('suppDoc2') as HTMLInputElement;
                          if (el) el.value = '';
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="font-semibold"
            onClick={() => navigate(`/vendor/tenders/${tenderId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            Submit Proposal
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