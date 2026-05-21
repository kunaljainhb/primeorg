import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Database, Plus } from 'lucide-react';
import { vendorCategories, documentTypes } from '@/app/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { toast } from 'sonner';

export default function AdminMasterData() {
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
      title: 'RFP Submission Terms & Conditions',
      type: 'RFP',
      lastUpdated: '01/03/2026',
      status: 'Active',
      content: 'By submitting this proposal, the vendor agrees to abide by the terms set forth in the RFP document, including pricing validity and timeline commitments.'
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
    { id: 'Q1', question: "How would you rate the vendor's technical capability?", status: 'Active' },
    { id: 'Q2', question: 'Does the vendor have relevant experience in the required domain?', status: 'Active' },
    { id: 'Q3', question: "Rate the vendor's financial stability.", status: 'Active' },
  ]);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [queryForm, setQueryForm] = useState({ id: '', question: '', status: 'Active' });
  const [isEditingQuery, setIsEditingQuery] = useState(false);

  const handleEditQuery = (query: any) => {
    setQueryForm(query);
    setIsEditingQuery(true);
    setShowQueryDialog(true);
  };

  const handleAddQuery = () => {
    setQueryForm({ id: `Q${ratingQueries.length + 1}`, question: '', status: 'Active' });
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
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Master Data Management
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Manage system reference data and categories
        </p>
      </div>

      {/* Vendor Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
                Vendor Categories
              </CardTitle>
              <CardDescription>Service categories for vendor classification</CardDescription>
            </div>
            <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} onClick={() => setShowCategoryDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Category Name</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorCategories.map((category, idx) => (
                <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <TableCell className="font-bold" style={{ color: 'var(--fnrc-text-dark)' }}>{category}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors" onClick={() => handleEditCategory(category)}>
                      Edit Category
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Types</CardTitle>
              <CardDescription>Required document types for vendors</CardDescription>
            </div>
            <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} onClick={() => setShowDocTypeDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Document Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Type</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Document Name</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Mandatory</TableHead>
                <TableHead className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Status</TableHead>
                <TableHead className="text-right font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentTypes.map((doc, idx) => (
                <TableRow key={idx} style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                  <TableCell className="font-medium" style={{ color: 'var(--fnrc-primary-green)' }}>{doc.type}</TableCell>
                  <TableCell style={{ color: 'var(--fnrc-text-dark)' }}>{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: doc.mandatory === 'Yes' ? '#FEF3C7' : '#E5E7EB', color: doc.mandatory === 'Yes' ? 'var(--fnrc-warning)' : 'var(--fnrc-text-muted)' }}>
                      {doc.mandatory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: doc.status === 'Active' ? '#D1FAE5' : '#FEE2E2', color: doc.status === 'Active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)' }}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors" onClick={() => handleEditDocType(doc)}>
                      Edit Action
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Declaration Contexts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle>Declaration Contexts</CardTitle>
            <CardDescription>Manage legal texts and declarations for vendors</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-bold text-gray-700">Declaration Title</TableHead>
                <TableHead className="font-bold text-gray-700">Last Updated</TableHead>
                <TableHead className="font-bold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-bold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDeclarations.map((decl, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50/30">
                  <TableCell className="font-bold text-gray-800">{decl.title}</TableCell>
                  <TableCell className="text-sm font-medium text-gray-500">{decl.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: decl.status === 'Active' ? '#D1FAE5' : '#FEE2E2', color: decl.status === 'Active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)' }}>
                      {decl.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors" onClick={() => handleEditDeclaration(decl)}>
                      Edit Context
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Rating System Queries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle>Vendor Rating System Queries</CardTitle>
            <CardDescription>Manage questions asked from the FNRC department for vendor rating</CardDescription>
          </div>
          <Button size="sm" style={{ backgroundColor: 'var(--fnrc-primary-green)', color: 'white' }} onClick={handleAddQuery}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-bold text-gray-700 w-16">ID</TableHead>
                <TableHead className="font-bold text-gray-700">Question</TableHead>
                <TableHead className="font-bold text-gray-700 w-32">Status</TableHead>
                <TableHead className="text-right font-bold text-gray-700 w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratingQueries.map((query, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50/30">
                  <TableCell className="font-bold text-gray-800">{query.id}</TableCell>
                  <TableCell className="font-medium text-gray-800">{query.question}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: query.status === 'Active' ? '#D1FAE5' : '#FEE2E2', color: query.status === 'Active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)' }}>
                      {query.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-[var(--fnrc-primary-green)] text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)] hover:text-white transition-colors" onClick={() => handleEditQuery(query)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent aria-describedby="category-dialog-description">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div id="category-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-status">Status *</Label>
              <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Type Dialog */}
      <Dialog open={showDocTypeDialog} onOpenChange={setShowDocTypeDialog}>
        <DialogContent aria-describedby="doctype-dialog-description">
          <DialogHeader>
            <DialogTitle>Add Document Type</DialogTitle>
          </DialogHeader>
          <div id="doctype-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doctype-name">Document Name *</Label>
              <Input
                id="doctype-name"
                placeholder="Enter document type name"
                value={docTypeForm.name}
                onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-mandatory">Mandatory *</Label>
              <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-applicable">Applicable To *</Label>
              <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="rfp">RFP</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctype-status">Status *</Label>
              <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocTypeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDocType}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent aria-describedby="edit-dialog-description">
          <DialogHeader>
            <DialogTitle>Edit {editingItem?.type === 'category' ? 'Category' : 'Document Type'}</DialogTitle>
          </DialogHeader>
          <div id="edit-dialog-description" className="space-y-4 py-4">
            {editingItem?.type === 'category' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Category Name *</Label>
                  <Input
                    id="edit-category-name"
                    placeholder="Enter category name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category-status">Status *</Label>
                  <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                    <SelectTrigger>
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
                  <Label htmlFor="edit-doctype-name">Document Name *</Label>
                  <Input
                    id="edit-doctype-name"
                    placeholder="Enter document type name"
                    value={docTypeForm.name}
                    onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-mandatory">Mandatory *</Label>
                  <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-applicable">Applicable To *</Label>
                  <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="rfp">RFP</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-doctype-status">Status *</Label>
                  <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                    <SelectTrigger>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Declaration Dialog */}
      <Dialog open={showDeclarationDialog} onOpenChange={setShowDeclarationDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold" style={{ color: 'var(--fnrc-text-dark)' }}>Edit Declaration Context</DialogTitle>
            <DialogDescription>Modify the legal text presented to vendors</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase text-gray-500">Declaration Title</Label>
              <Input value={activeDeclaration.title} onChange={(e) => setActiveDeclaration({...activeDeclaration, title: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold text-sm text-gray-700 flex items-center justify-between">
                Declaration Context
                <span className="text-xs font-medium text-gray-400">Rich text editor</span>
              </Label>
              <Textarea 
                className="min-h-[250px] leading-relaxed text-sm resize-none font-medium text-gray-800" 
                value={activeDeclaration.content} 
                onChange={(e) => setActiveDeclaration({...activeDeclaration, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase text-gray-500">Status</Label>
              <Select value={activeDeclaration.status.toLowerCase()} onValueChange={(val) => setActiveDeclaration({...activeDeclaration, status: val === 'active' ? 'Active' : 'Inactive'})}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowDeclarationDialog(false)}>
              Cancel
            </Button>
            <Button
              className="text-white font-bold px-8"
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
        <DialogContent aria-describedby="query-dialog-description">
          <DialogHeader>
            <DialogTitle>{isEditingQuery ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div id="query-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="query-question">Question *</Label>
              <Textarea
                id="query-question"
                placeholder="Enter rating question"
                value={queryForm.question}
                onChange={(e) => setQueryForm({ ...queryForm, question: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="query-status">Status *</Label>
              <Select value={queryForm.status.toLowerCase()} onValueChange={(value) => setQueryForm({ ...queryForm, status: value === 'active' ? 'Active' : 'Inactive' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQueryDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuery}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}