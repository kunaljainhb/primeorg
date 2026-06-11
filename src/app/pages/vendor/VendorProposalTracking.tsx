import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { ArrowLeft, FileText, Download, Award, Star, History, RefreshCw, AlertTriangle, UploadCloud, Trash2, Paperclip, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockProposals, mockERPDocuments, saveProposalsToStorage, mockVendorReviews, mockAdminUsers } from '@/app/data/mockData';
import { ProposalDetailView } from '@/app/components/vendor/ProposalDetailView';
import { toast } from 'sonner';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useTranslation } from '@/app/context/LanguageContext';

const formatDate = (dateStr?: string | Date, lang?: string) => {
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
  if (statusStr === 'technical_correction_requested') return 'Technical Correction Requested';
  return statusStr
    .split(/_|\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function VendorProposalTracking() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const { t, language } = useTranslation();

  const getReviewerRoleName = (name: string) => {
    const admin = mockAdminUsers.find(u => u.name === name);
    if (!admin) return t('Reviewer');
    return admin.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  
  // Wrap proposal in React state to ensure UI updates instantly on resubmit or simulation
  const [proposal, setProposal] = useState(() => {
    return mockProposals.find(p => p.id === proposalId);
  });
  
  const [activeTab, setActiveTab] = useState('status');
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  // States for Vendor Supporting Documents Upload
  const [docRemarks, setDocRemarks] = useState('');
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if proposalId changes
  useEffect(() => {
    const found = mockProposals.find(p => p.id === proposalId);
    setProposal(found);
  }, [proposalId]);

  const [localRating, setLocalRating] = useState<any>(null);
  useEffect(() => {
    if (proposalId) {
      const saved = localStorage.getItem(`external_rating_${proposalId}`);
      if (saved) {
        try {
          setLocalRating(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [proposalId]);

  const handleProposalUpdate = (updatedProposal: any) => {
    setProposal(updatedProposal);
  };

  const handleStatusSimulate = (newStatus: 'technical_correction_requested' | 'technical_review') => {
    const targetIdx = mockProposals.findIndex(p => p.id === proposalId);
    if (targetIdx !== -1) {
      mockProposals[targetIdx].status = newStatus;
      if (newStatus === 'technical_correction_requested') {
        mockProposals[targetIdx].remarks = 'Technical proposal is missing detail about multi-zone failover mechanisms. Please provide specific redundant architecture details and update the technical document.';
        mockProposals[targetIdx].technicalProposal = 'Hybrid cloud solution using Azure Stack Hub'; // Reset to initial state
        mockProposals[targetIdx].technicalStatus = 'correction_requested';
      } else {
        mockProposals[targetIdx].remarks = undefined;
        mockProposals[targetIdx].technicalStatus = 'under_review';
      }
      saveProposalsToStorage(mockProposals);
      setProposal({ ...mockProposals[targetIdx] });
      toast.success(`${t('Proposal status simulated to:')} ${t(formatStatus(newStatus))}`);
    }
  };

  const handleUploadSupportingDoc = () => {
    if (!selectedDocFile) {
      toast.error(t('Please select a document file to upload.'));
      return;
    }
    
    setIsUploadingDoc(true);
    
    // Simulate API upload & saving delay
    setTimeout(() => {
      const targetIdx = mockProposals.findIndex(p => p.id === proposal.id);
      if (targetIdx !== -1) {
        const currentUploadedDocs = mockProposals[targetIdx].uploadedDocuments || [];
        
        const newDoc = {
          name: selectedDocFile.name,
          url: '#',
          remarks: docRemarks.trim() || 'No remarks provided.',
          uploadedDate: new Date().toISOString().split('T')[0]
        };
        
        const updatedDocs = [...currentUploadedDocs, newDoc];
        mockProposals[targetIdx].uploadedDocuments = updatedDocs;
        
        // Save back to localStorage
        saveProposalsToStorage(mockProposals);
        
        // Update local React states
        const updatedProposal = { ...mockProposals[targetIdx] };
        setProposal(updatedProposal);
        
        toast.success(`${t('Supporting document')} "${selectedDocFile.name}" ${t('uploaded successfully!')}`);
        
        // Reset form
        setSelectedDocFile(null);
        setDocRemarks('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(t('Failed to find proposal.'));
      }
      setIsUploadingDoc(false);
    }, 1500);
  };

  if (!proposal) {
    return <div className="p-6 text-center">{t('Proposal not found')}</div>;
  }

  // Check if vendor is approved or rejected to show additional tabs
  const isApproved = proposal.status === 'approved' || proposal.status === 'selected';
  // Filter ERP documents for this vendor and Tender
  const erpDocuments = mockERPDocuments.filter(doc => doc.tenderId === proposal.tenderId && doc.vendorId === proposal.vendorId);
  const vendorReviews = mockVendorReviews.filter(review => review.tenderId === proposal.tenderId && review.vendorId === proposal.vendorId);

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
    <div className="space-y-6 text-start">
      <Button
        variant="ghost"
        onClick={() => navigate('/vendor/proposals')}
        className="gap-2 cursor-pointer"
      >
        <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
        {t('Back to Proposals')}
      </Button>

      {proposal.id === 'PROP-102' && (
        <div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-sm"
          style={{ borderColor: 'var(--fnrc-border-gray)' }}
        >
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>{t('Demo Simulator Tool')}</div>
              <p className="text-xs text-gray-500">
                {t('Easily simulate review decisions and test the Technical Correction and resubmission workflow.')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant={proposal.status === 'technical_correction_requested' ? 'default' : 'outline'}
              onClick={() => handleStatusSimulate('technical_correction_requested')}
              style={proposal.status === 'technical_correction_requested' ? { backgroundColor: '#F59E0B', color: 'white' } : { borderColor: '#F59E0B', color: '#D97706' }}
              className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
            >
              {t('Set to Technical Correction Requested')}
            </Button>
            <Button 
              size="sm"
              variant={proposal.status === 'technical_review' ? 'default' : 'outline'}
              onClick={() => handleStatusSimulate('technical_review')}
              style={proposal.status === 'technical_review' ? { backgroundColor: 'var(--fnrc-primary-green)', color: 'white' } : { borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
              className="h-8 text-xs px-3 font-semibold transition-all hover:opacity-90"
            >
              {t('Set to Under Review (Technical)')}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--fnrc-text-dark)' }}>
            {proposal.id}
          </h1>
        </div>
      </div>

      {/* Tab Structure */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-0">
        <TabsList className="flex w-full border-b border-gray-200 gap-8 overflow-x-auto overflow-y-hidden bg-transparent scrollbar-hide">
          <TabsTrigger 
            value="submitted" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t('Proposal Details')}
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="relative py-4 text-sm font-semibold whitespace-nowrap transition-all data-[state=active]:text-[var(--fnrc-primary-green)] text-gray-500 hover:text-gray-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-[var(--fnrc-primary-green)]"
          >
            {t('Proposal Status')}
          </TabsTrigger>
          

        </TabsList>

        {/* TAB 1: PROPOSAL DETAILS */}
        <TabsContent value="submitted" className="mt-4">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="submitted"
            onProposalUpdate={handleProposalUpdate}
          />
        </TabsContent>

        {/* TAB 2: PROPOSAL STATUS */}
        <TabsContent value="status" className="mt-4">
          <ProposalDetailView 
            proposal={proposal}
            showBackButton={false}
            viewMode="status"
            onProposalUpdate={handleProposalUpdate}
          />
        </TabsContent>




      </Tabs>
    </div>
  );
}
