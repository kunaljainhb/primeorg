import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
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
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { mockRFPs, mockProposals } from '@/app/data/mockData';
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

export default function AdminRFPDetail() {
  const navigate = useNavigate();
  const { rfpId } = useParams();
  const rfp = mockRFPs.find(r => r.id === rfpId) || mockRFPs[0];

  const relatedProposals = mockProposals.filter(p => p.rfpId === rfp.id);

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(new Date(rfp.submissionDeadline));

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
      under_review: { bg: '#FEF3C7', text: 'var(--fnrc-warning)' },
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

  const handleChangeDeadline = () => {
    if (newDeadline) {
      toast.success('Submission deadline updated successfully');
      setShowDeadlineDialog(false);
    }
  };

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
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fnrc-text-dark)' }}>{rfp.title}</h1>
              <Badge variant="secondary" className="capitalize text-[10px] font-bold" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                {rfp.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold mt-1" style={{ color: 'var(--fnrc-text-muted)' }}>{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 h-9 font-bold text-xs" onClick={() => setShowDeadlineDialog(true)}>
            <Clock className="mr-2 h-3.5 w-3.5" />
            Change Deadline
          </Button>
          <Button className="text-white h-9 px-6 font-bold text-xs" style={{ backgroundColor: 'var(--fnrc-primary-green)' }} onClick={() => setShowCloseDialog(true)}>
            <Check className="mr-2 h-3.5 w-3.5" />
            Close RFP
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals Received ({relatedProposals.length})</TabsTrigger>
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
                    {new Date(rfp.submissionDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                    01 June 2026
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-bold capitalize text-muted-foreground">Project End Date</Label>
                  <div className="font-bold text-sm flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    31 Dec 2026
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Label className="text-sm font-bold capitalize text-muted-foreground">Milestones</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Project Initiation', date: '15 June 2026' },
                    { title: 'Intermediate Review', date: '01 Sept 2026' },
                    { title: 'Final Handover', date: '20 Dec 2026' }
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-3 bg-gray-50/50 border rounded-lg">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Milestone 0{i + 1}</span>
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

        <TabsContent value="proposals">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="py-4 pl-6 font-bold text-xs capitalize text-gray-600">Proposal ID</TableHead>
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
                        <TableCell className="py-4 pl-6 text-sm font-bold text-gray-500">
                          {proposal.id}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-sm text-gray-800">{proposal.vendorName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 font-medium">{new Date(proposal.submissionDate).toLocaleDateString()}</span>
                        </TableCell>
                        <TableCell className="text-right font-black text-sm text-[var(--fnrc-primary-green)]">
                          {proposal.commercialAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-black text-[9px] capitalize px-2 py-0.5" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                            {proposal.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="outline" size="sm" className="h-8 font-bold text-[10px] uppercase" onClick={() => navigate(`/admin/proposals/${proposal.id}`)}>
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
    </div>
  );
}