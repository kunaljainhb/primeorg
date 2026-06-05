import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Database, Plus, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { vendorCategories, documentTypes } from '@/app/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/status-badge';

export default function AdminMasterData() {
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const renderSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
    }
    return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDocTypeDialog, setShowDocTypeDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'category' | 'doctype', value: string } | null>(null);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  const mockDeclarations = [
    {
      id: 'D001',
      title: 'Vendor Registration Declaration',
      type: 'Registration',
      lastUpdated: '10/05/2026',
      status: 'Active',
      content: 'I hereby declare that all information provided in this vendor registration form is true and accurate. I understand that any false information may lead to rejection or blacklisting.'
    },
    {
      id: 'D002',
      title: 'Tender Submission Terms & Conditions',
      type: 'Tender',
      lastUpdated: '01/03/2026',
      status: 'Active',
      content: 'By submitting this proposal, the vendor agrees to abide by the terms set forth in the Tender document, including pricing validity and timeline commitments.'
    },
    {
      id: 'D003',
      title: 'Anti-Bribery & Corruption Declaration',
      type: 'Compliance',
      lastUpdated: '15/01/2026',
      status: 'Active',
      content: 'The vendor confirms compliance with all anti-bribery and corruption laws applicable in the UAE and the internal policies of FNRC.'
    }
  ];

  const [showDeclarationDialog, setShowDeclarationDialog] = useState(false);
  const [activeDeclaration, setActiveDeclaration] = useState(mockDeclarations[0]);

  const handleEditDeclaration = (declaration: any) => {
    setActiveDeclaration(declaration);
    setShowDeclarationDialog(true);
  };

  const [ratingQueries, setRatingQueries] = useState([
    { id: 'Q1', sequence: 1, question: "How would you rate the vendor's technical capability?", status: 'Active' },
    { id: 'Q2', sequence: 2, question: 'Does the vendor have relevant experience in the required domain?', status: 'Active' },
    { id: 'Q3', sequence: 3, question: "Rate the vendor's financial stability.", status: 'Active' },
  ]);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [queryForm, setQueryForm] = useState({ id: '', sequence: 1, question: '', status: 'Active' });
  const [isEditingQuery, setIsEditingQuery] = useState(false);

  const handleEditQuery = (query: any) => {
    setQueryForm(query);
    setIsEditingQuery(true);
    setShowQueryDialog(true);
  };

  const handleAddQuery = () => {
    setQueryForm({ id: `Q${ratingQueries.length + 1}`, sequence: ratingQueries.length + 1, question: '', status: 'Active' });
    setIsEditingQuery(false);
    setShowQueryDialog(true);
  };

  const handleSaveQuery = () => {
    if (!queryForm.question) {
      toast.error('Please enter the question');
      return;
    }
    if (isEditingQuery) {
      setRatingQueries(ratingQueries.map(q => q.id === queryForm.id ? queryForm : q));
      toast.success('Question updated successfully');
    } else {
      setRatingQueries([...ratingQueries, queryForm]);
      toast.success('Question added successfully');
    }
    setShowQueryDialog(false);
  };

  const [docTypeForm, setDocTypeForm] = useState({
    name: '',
    mandatory: 'no',
    applicableTo: 'vendor',
    status: 'active'
  });

  const handleAddCategory = () => {
    if (!categoryForm.name) {
      toast.error('Please enter category name');
      return;
    }
    toast.success('Category added successfully');
    setShowCategoryDialog(false);
    setCategoryForm({ name: '', description: '', status: 'active' });
  };

  const handleAddDocType = () => {
    if (!docTypeForm.name) {
      toast.error('Please enter document type name');
      return;
    }
    toast.success('Document type added successfully');
    setShowDocTypeDialog(false);
    setDocTypeForm({ name: '', mandatory: 'no', applicableTo: 'vendor', status: 'active' });
  };

  const handleEditCategory = (category: string) => {
    setEditingItem({ type: 'category', value: category });
    setCategoryForm({ name: category, description: '', status: 'active' });
    setShowEditDialog(true);
  };

  const handleEditDocType = (docType: any) => {
    setEditingItem({ type: 'doctype', value: docType.name });
    setDocTypeForm({ name: docType.name, mandatory: docType.mandatory.toLowerCase(), applicableTo: docType.type.toLowerCase(), status: docType.status.toLowerCase() });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    toast.success(`${editingItem?.type === 'category' ? 'Category' : 'Document type'} updated successfully`);
    setShowEditDialog(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Master Data Configuration
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Vendor Service Categories */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5 flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Database className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                Service Categories
              </CardTitle>

            </div>
            <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} className="gap-1 font-semibold" onClick={() => setShowCategoryDialog(true)}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}><div className="flex items-center gap-1.5">Category Registry Name {renderSortIcon('name')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}><div className="flex items-center gap-1.5">Created Date {renderSortIcon('date')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}><div className="flex items-center gap-1.5">Status {renderSortIcon('status')}</div></TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorCategories.map((category, idx) => (
                  <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-gray-800">{category}</TableCell>
                    <TableCell className="font-medium text-gray-500 text-sm">
                      {new Date(2025, 0, 1 + idx).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="active" />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditCategory(category)} title="Edit Category">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">10</span> of <span className="font-bold text-gray-900">10</span> entries
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="font-semibold"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
                <div className="flex items-center gap-1 mx-2">
                  <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                </div>
                <Button variant="outline" size="sm" disabled className="font-semibold">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          </CardContent>
        </Card>

        {/* Document Types */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5 flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Document Type</CardTitle>

            </div>
            <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} className="gap-1 font-semibold" onClick={() => setShowDocTypeDialog(true)}>
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('type')}><div className="flex items-center gap-1.5">Type {renderSortIcon('type')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('docTitle')}><div className="flex items-center gap-1.5">Required Document Title {renderSortIcon('docTitle')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('mandatory')}><div className="flex items-center gap-1.5">Mandatory {renderSortIcon('mandatory')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.map((doc, idx) => (
                  <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">{doc.type}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{doc.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={doc.mandatory === 'Yes' ? 'mandatory' : 'optional'} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status.toLowerCase()} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditDocType(doc)} title="Edit Document">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">10</span> of <span className="font-bold text-gray-900">10</span> entries
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="font-semibold"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
                <div className="flex items-center gap-1 mx-2">
                  <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                </div>
                <Button variant="outline" size="sm" disabled className="font-semibold">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-8">
        {/* Declaration Contexts */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5">
            <CardTitle className="text-lg font-bold text-gray-900">Declaration Legal Frameworks</CardTitle>

          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('legalTitle')}><div className="flex items-center gap-1.5">Legal Clause Title {renderSortIcon('legalTitle')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('lastUpdated')}><div className="flex items-center gap-1.5">Last Updated {renderSortIcon('lastUpdated')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeclarations.map((decl, idx) => (
                  <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-gray-800">{decl.title}</TableCell>
                    <TableCell className="text-xs font-semibold text-gray-500">{decl.lastUpdated}</TableCell>
                    <TableCell>
                      <StatusBadge status={decl.status.toLowerCase()} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditDeclaration(decl)} title="Edit Declaration Framework">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">10</span> of <span className="font-bold text-gray-900">10</span> entries
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="font-semibold"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
                <div className="flex items-center gap-1 mx-2">
                  <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                </div>
                <Button variant="outline" size="sm" disabled className="font-semibold">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          </CardContent>
        </Card>

        {/* Vendor Rating Queries */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5 flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Evaluation Review Rubrics</CardTitle>

            </div>
            <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} className="gap-1 font-semibold" onClick={handleAddQuery}>
              <Plus className="h-4 w-4" />
              Add Rubric
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 w-12 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('seq')}><div className="flex items-center gap-1.5">Seq {renderSortIcon('seq')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('rubric')}><div className="flex items-center gap-1.5">Rubric Question {renderSortIcon('rubric')}</div></TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4 w-24 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('queryStatus')}><div className="flex items-center gap-1.5">Status {renderSortIcon('queryStatus')}</div></TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6 w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratingQueries.sort((a,b) => a.sequence - b.sequence).map((query, idx) => (
                  <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="font-bold text-gray-400">{query.sequence}</TableCell>
                    <TableCell className="font-semibold text-gray-800 text-xs sm:text-sm">{query.question}</TableCell>
                    <TableCell>
                      <StatusBadge status={query.status.toLowerCase()} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditQuery(query)} title="Edit Rubric Question">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          {true && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">10</span> of <span className="font-bold text-gray-900">10</span> entries
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="font-semibold"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
                <div className="flex items-center gap-1 mx-2">
                  <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                </div>
                <Button variant="outline" size="sm" disabled className="font-semibold">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}

          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="category-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Add Service Category</DialogTitle>
          </DialogHeader>
          <div id="category-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-semibold text-gray-700">Category Name *</Label>
              <Input
                id="category-name"
                placeholder="e.g. Mechanical Equipment Supply"
                value={categoryForm.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-status" className="text-sm font-semibold text-gray-700">Status *</Label>
              <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Type Dialog */}
      <Dialog open={showDocTypeDialog} onOpenChange={setShowDocTypeDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="doctype-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Add Document</DialogTitle>
          </DialogHeader>
          <div id="doctype-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doctype-name" className="text-sm font-semibold text-gray-700">Document Name *</Label>
              <Input
                id="doctype-name"
                placeholder="e.g. ISO 9001 Certificate"
                value={docTypeForm.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-mandatory" className="text-sm font-semibold text-gray-700">Mandatory *</Label>
              <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-applicable" className="text-sm font-semibold text-gray-700">Applicable To *</Label>
              <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor Setup</SelectItem>
                  <SelectItem value="tender">Tender Published</SelectItem>
                  <SelectItem value="proposal">Bid Submission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-status" className="text-sm font-semibold text-gray-700">Status *</Label>
              <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowDocTypeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDocType}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="edit-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Edit {editingItem?.type === 'category' ? 'Category' : 'Document Type'}</DialogTitle>
          </DialogHeader>
          <div id="edit-dialog-description" className="space-y-4 py-4">
            {editingItem?.type === 'category' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name" className="text-sm font-semibold text-gray-700">Category Name *</Label>
                  <Input
                    id="edit-category-name"
                    placeholder="Enter category name"
                    value={categoryForm.name}
                    className="rounded-xl border-gray-200"
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category-status" className="text-sm font-semibold text-gray-700">Status *</Label>
                  <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-name" className="text-sm font-semibold text-gray-700">Document Name *</Label>
                  <Input
                    id="edit-doctype-name"
                    placeholder="Enter document type name"
                    value={docTypeForm.name}
                    className="rounded-xl border-gray-200"
                    onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-mandatory" className="text-sm font-semibold text-gray-700">Mandatory *</Label>
                  <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-applicable" className="text-sm font-semibold text-gray-700">Applicable To *</Label>
                  <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">Vendor Setup</SelectItem>
                      <SelectItem value="tender">Tender Published</SelectItem>
                      <SelectItem value="proposal">Bid Submission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-status" className="text-sm font-semibold text-gray-700">Status *</Label>
                  <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Declaration Dialog */}
      <Dialog open={showDeclarationDialog} onOpenChange={setShowDeclarationDialog}>
        <DialogContent className="sm:max-w-2xl p-8">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">Edit Declaration Context</DialogTitle>
            <DialogDescription>Modify the legal text presented to vendors during setup gates</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Declaration Title</Label>
              <Input value={activeDeclaration.title} className="rounded-xl border-gray-200" onChange={(e) => setActiveDeclaration({...activeDeclaration, title: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                Declaration Clause Context
                <span className="text-xs font-semibold text-gray-400">Section details</span>
              </Label>
              <Textarea 
                className="min-h-[160px] leading-relaxed text-sm resize-none font-medium text-gray-800 rounded-xl border-gray-200 p-4" 
                value={activeDeclaration.content} 
                onChange={(e) => setActiveDeclaration({...activeDeclaration, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Status</Label>
              <Select value={activeDeclaration.status.toLowerCase()} onValueChange={(val) => setActiveDeclaration({...activeDeclaration, status: val === 'active' ? 'Active' : 'Inactive'})}>
                <SelectTrigger className="w-[200px] rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowDeclarationDialog(false)}>
              Cancel
            </Button>
            <Button
              className="text-white font-semibold px-8"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={() => {
                toast.success('Declaration context updated successfully');
                setShowDeclarationDialog(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query Dialog */}
      <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="query-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">{isEditingQuery ? 'Edit Evaluation Question' : 'Add Evaluation Question'}</DialogTitle>
          </DialogHeader>
          <div id="query-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="query-question" className="text-sm font-semibold text-gray-700">Question *</Label>
              <Textarea
                id="query-question"
                placeholder="e.g. Does the vendor demonstrate compliance with green excavation guidelines?"
                value={queryForm.question}
                className="rounded-xl border-gray-200 p-3 resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="query-sequence" className="text-sm font-semibold text-gray-700">Sequence Order Number *</Label>
              <Input
                id="query-sequence"
                type="number"
                placeholder="1"
                value={queryForm.sequence}
                className="rounded-xl border-gray-200"
                onChange={(e) => setQueryForm({ ...queryForm, sequence: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="query-status" className="text-sm font-semibold text-gray-700">Status *</Label>
              <Select value={queryForm.status.toLowerCase()} onValueChange={(value) => setQueryForm({ ...queryForm, status: value === 'active' ? 'Active' : 'Inactive' })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowQueryDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuery}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}