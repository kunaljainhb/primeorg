import { useState } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { RichTextEditor } from '@/app/components/ui/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { CalendarIcon, Plus, X, Upload, FileText, Globe, Lock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { vendorCategories, mockTenders } from '@/app/data/mockData';
import { Checkbox } from '@/app/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

interface TenderFormData {
  title: string;
  categories: string[];
  description: string;
  eligibilityCriteria: string;
  estimatedBudget: string;
  submissionDeadline: Date | undefined;
  scopeOfWork: string;
  projectStartDate: Date | undefined;
  projectEndDate: Date | undefined;
  milestones: Array<{ title: string; date: string }>;
  attachments: Array<{ name: string; size: string }>;
  visibility: 'open' | 'restricted';
  technicalProposalRequired: 'yes' | 'no';
}

export default function AdminTenderCreate() {
  const navigate = useNavigate();
  const { tenderId } = useParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TenderFormData>(() => {
    if (tenderId) {
      const draft = mockTenders.find(r => r.id === tenderId);
      if (draft) {
        return {
          title: draft.title || '',
          categories: draft.category || [],
          description: draft.description || '',
          eligibilityCriteria: draft.eligibilityCriteria?.join('\n') || '',
          estimatedBudget: '',
          submissionDeadline: draft.submissionDeadline ? new Date(draft.submissionDeadline) : undefined,
          scopeOfWork: draft.scopeOfWork || '',
          projectStartDate: undefined,
          projectEndDate: undefined,
          milestones: [],
          attachments: draft.attachments || [],
          visibility: 'open',
          technicalProposalRequired: 'yes'
        };
      }
    }
    return {
      title: '',
      categories: [],
      description: '',
      eligibilityCriteria: '',
      estimatedBudget: '',
      submissionDeadline: undefined,
      scopeOfWork: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      milestones: [],
      attachments: [],
      visibility: 'open',
      technicalProposalRequired: 'yes'
    };
  });

  const updateFormData = (field: keyof TenderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', date: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index: number, field: 'title' | 'date', value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = () => {
    const tenderData = {
      title: formData.title || 'Untitled Tender',
      category: formData.categories.length > 0 ? formData.categories : ['General'],
      description: formData.description,
      eligibilityCriteria: formData.eligibilityCriteria.split('\n').filter(Boolean),
      submissionDeadline: formData.submissionDeadline ? format(formData.submissionDeadline, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      scopeOfWork: formData.scopeOfWork,
      timeline: '3 months',
      status: 'draft' as const,
      attachments: formData.attachments.map(a => ({ name: a.name, url: '#' })),
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };

    if (tenderId) {
      const idx = mockTenders.findIndex(r => r.id === tenderId);
      if (idx !== -1) {
        mockTenders[idx] = { ...mockTenders[idx], ...tenderData };
      }
    } else {
      const newId = `TEND-00${mockTenders.length + 1}`;
      mockTenders.push({ id: newId, ...tenderData });
    }

    toast.success('Tender saved as draft successfully');
    navigate('/admin/tenders');
  };

  const handlePublish = () => {
    const tenderData = {
      title: formData.title || 'Untitled Tender',
      category: formData.categories.length > 0 ? formData.categories : ['General'],
      description: formData.description,
      eligibilityCriteria: formData.eligibilityCriteria.split('\n').filter(Boolean),
      submissionDeadline: formData.submissionDeadline ? format(formData.submissionDeadline, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      scopeOfWork: formData.scopeOfWork,
      timeline: '3 months',
      status: 'published' as const,
      attachments: formData.attachments.map(a => ({ name: a.name, url: '#' })),
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };

    if (tenderId) {
      const idx = mockTenders.findIndex(r => r.id === tenderId);
      if (idx !== -1) {
        mockTenders[idx] = { ...mockTenders[idx], ...tenderData };
      }
    } else {
      const newId = `TEND-00${mockTenders.length + 1}`;
      mockTenders.push({ id: newId, ...tenderData });
    }

    toast.success('Tender published successfully');
    navigate('/admin/tenders');
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Tender Details' },
      { number: 2, label: 'Visibility & Publish' }
    ];

    return (
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-center">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    step >= s.number
                      ? 'border-[var(--fnrc-primary-green)] bg-[var(--fnrc-primary-green)] text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {s.number}
                </div>
                <div 
                  className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${
                    step >= s.number
                      ? 'text-[var(--fnrc-primary-green)]'
                      : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </div>
              </div>
              {idx < 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 mb-6 ${
                    step > s.number ? 'bg-[var(--fnrc-primary-green)]' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 pb-2">
          {step === 1 ? (
            <Button variant="outline" onClick={() => navigate('/admin/tenders')}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          
          {step === 1 ? (
            <Button
              onClick={() => setStep(2)}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Publish Tender
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Basic Tender Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-bold">Tender Title *</Label>
          <Input
            id="title"
            placeholder="Enter Tender title"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label className="font-bold">Service Category *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50/50">
            {vendorCategories.map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${cat}`} 
                  checked={formData.categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                />
                <label
                  htmlFor={`cat-${cat}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {cat}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Select one or more service categories relevant to this Tender.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-bold">Description *</Label>
          <RichTextEditor
            id="description"
            placeholder="Enter Tender description"
            rows={4}
            value={formData.description}
            onChange={(e: any) => updateFormData('description', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eligibility" className="font-bold">Eligibility Criteria *</Label>
          <RichTextEditor
            id="eligibility"
            placeholder="Enter eligibility criteria (one per line)"
            rows={4}
            value={formData.eligibilityCriteria}
            onChange={(e: any) => updateFormData('eligibilityCriteria', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget" className="font-bold">Estimated Budget (Optional)</Label>
            <Input
              id="budget"
              placeholder="e.g., AED 500,000"
              value={formData.estimatedBudget}
              onChange={(e) => updateFormData('estimatedBudget', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Submission Deadline *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.submissionDeadline ? format(formData.submissionDeadline, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.submissionDeadline}
                  onSelect={(date) => updateFormData('submissionDeadline', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="font-bold text-sm">Technical Proposal Required *</Label>
            <RadioGroup 
              value={formData.technicalProposalRequired} 
              onValueChange={(value: 'yes' | 'no') => updateFormData('technicalProposalRequired', value)}
              className="flex gap-4"
            >
              <label 
                htmlFor="tech-yes"
                className={`flex items-center space-x-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors flex-1 ${formData.technicalProposalRequired === 'yes' ? 'border-[var(--fnrc-primary-green)] bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <RadioGroupItem value="yes" id="tech-yes" />
                <span className="font-medium text-sm w-full">Yes, Required</span>
              </label>
              <label
                htmlFor="tech-no"
                className={`flex items-center space-x-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors flex-1 ${formData.technicalProposalRequired === 'no' ? 'border-[var(--fnrc-primary-green)] bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <RadioGroupItem value="no" id="tech-no" />
                <span className="font-medium text-sm w-full">No, Not Required</span>
              </label>
            </RadioGroup>
          </div>


        </div>


      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Scope & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="scope" className="font-bold">Scope of Work *</Label>
          <RichTextEditor
            id="scope"
            placeholder="Enter detailed scope of work"
            rows={6}
            value={formData.scopeOfWork}
            onChange={(e: any) => updateFormData('scopeOfWork', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold">Project Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.projectStartDate ? format(formData.projectStartDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.projectStartDate}
                  onSelect={(date) => updateFormData('projectStartDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Project End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.projectEndDate ? format(formData.projectEndDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.projectEndDate}
                  onSelect={(date) => updateFormData('projectEndDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-bold">Milestones</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMilestone}
              style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </div>
          {formData.milestones.map((milestone, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Milestone title"
                value={milestone.title}
                onChange={(e) => updateMilestone(index, 'title', e.target.value)}
              />
              <Input
                type="date"
                value={milestone.date}
                onChange={(e) => updateMilestone(index, 'date', e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeMilestone(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>


      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
            <Upload className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--fnrc-text-muted)' }} />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>
                Click to upload
              </span>{' '}
              <span style={{ color: 'var(--fnrc-text-muted)' }}>or drag and drop</span>
            </label>
            <p className="mt-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
              PDF, DOC, DOCX, XLS, XLSX up to 10MB
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              <Label className="font-bold">Uploaded Files</Label>
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{ borderColor: 'var(--fnrc-border-gray)' }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs" style={{ color: 'var(--fnrc-text-muted)' }}>{file.size}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>


      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Tender Visibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={formData.visibility} 
          onValueChange={(value: 'open' | 'restricted') => updateFormData('visibility', value)}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 transition-colors hover:bg-gray-50/50">
            <RadioGroupItem value="open" id="open" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="open" className="flex items-center gap-2 text-base cursor-pointer font-bold">
                <Globe className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
                Open Tender
              </Label>
              <p className="text-sm text-muted-foreground">
                This tender is public and visible to all registered vendors across all service categories.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 transition-colors hover:bg-gray-50/50">
            <RadioGroupItem value="restricted" id="restricted" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="restricted" className="flex items-center gap-2 text-base cursor-pointer font-bold">
                <Lock className="h-4 w-4 text-amber-500" />
                Restricted (Service Category)
              </Label>
              <p className="text-sm text-muted-foreground">
                Only vendors registered under the selected service categories will be able to view and participate.
              </p>
            </div>
          </div>
        </RadioGroup>


      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Review & Publish</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
              <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              Basic Information
            </h3>
            <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: '#F7F9FC' }}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Tender Title</span>
                  <div className="font-medium mt-0.5">{formData.title || '-'}</div>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Deadline</span>
                  <div className="font-medium mt-0.5">
                    {formData.submissionDeadline ? format(formData.submissionDeadline, 'PPP') : '-'}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Technical Prop.</span>
                  <div className="font-medium mt-0.5 capitalize">{formData.technicalProposalRequired}</div>
                </div>

              </div>
              <div>
                <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Categories</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {formData.categories.length > 0 ? formData.categories.map(cat => (
                    <Badge key={cat} variant="secondary" className="text-[10px] bg-white border border-gray-200">
                      {cat}
                    </Badge>
                  )) : <span className="text-sm">-</span>}
                </div>
              </div>
              <div className="text-sm">
                <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Description</span>
                <div className="mt-0.5">{formData.description || '-'}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
              <CalendarIcon className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              Scope & Timeline
            </h3>
            <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: '#F7F9FC' }}>
              <div className="text-sm">
                <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Scope of Work</span>
                <div className="mt-0.5">{formData.scopeOfWork || '-'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Project Start</span>
                  <div className="font-medium mt-0.5">
                    {formData.projectStartDate ? format(formData.projectStartDate, 'PPP') : '-'}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Project End</span>
                  <div className="font-medium mt-0.5">
                    {formData.projectEndDate ? format(formData.projectEndDate, 'PPP') : '-'}
                  </div>
                </div>
              </div>
              {formData.milestones.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Milestones</span>
                  <div className="mt-1 space-y-1">
                    {formData.milestones.map((m, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 py-1">
                        <span className="font-medium">{m.title}</span>
                        <span className="text-muted-foreground">{m.date ? format(new Date(m.date), 'PPP') : '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
              <Eye className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              Tender Visibility
            </h3>
            <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: '#F7F9FC' }}>
              <div className="flex items-center gap-3">
                {formData.visibility === 'open' ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Open Tender</div>
                      <p className="text-xs text-muted-foreground italic">Publicly visible to all registered vendors.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Restricted (Service Category)</div>
                      <p className="text-xs text-muted-foreground italic">Visible only to vendors in selected categories.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold flex items-center gap-2" style={{ color: 'var(--fnrc-text-dark)' }}>
              <FileText className="h-4 w-4 text-[var(--fnrc-primary-green)]" />
              Attachments
            </h3>
            <div className="rounded-lg border p-4 space-y-2" style={{ borderColor: 'var(--fnrc-border-gray)', backgroundColor: '#F7F9FC' }}>
              {formData.attachments.length > 0 ? (
                <div className="grid gap-2">
                  {formData.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({file.size})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No attachments uploaded.</p>
              )}
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  );

  function Badge({ children, className, variant, style }: any) {
    return (
      <span 
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
        style={style}
      >
        {children}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="mb-2 text-xl font-bold" style={{ color: 'var(--fnrc-text-dark)' }}>
          {tenderId ? 'Edit Draft Tender' : 'Create New Tender'}
        </h1>
      </div>

      {renderStepIndicator()}

      {step === 1 && (
        <div className="space-y-6">
          {renderStep1()}
          {renderStep2()}
          {renderStep3()}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          {renderStep4()}
          {renderStep5()}
        </div>
      )}

    </div>
  );
}