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

  const handleEditDocType = (docType: string) => {
    setEditingItem({ type: 'doctype', value: docType });
    setDocTypeForm({ name: docType, mandatory: 'no', applicableTo: 'vendor', status: 'active' });
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
          <div className="flex flex-wrap gap-2">
            {vendorCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer px-3 py-1.5"
                style={{ backgroundColor: 'var(--fnrc-bg-light)', color: 'var(--fnrc-text-dark)' }}
                onClick={() => handleEditCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
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
          <div className="flex flex-wrap gap-2">
            {documentTypes.map((docType) => (
              <Badge
                key={docType}
                variant="secondary"
                className="cursor-pointer px-3 py-1.5"
                style={{ backgroundColor: 'var(--fnrc-bg-light)', color: 'var(--fnrc-text-dark)' }}
                onClick={() => handleEditDocType(docType)}
              >
                {docType}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Masters */}
      <Card>
        <CardHeader>
          <CardTitle>Status Masters</CardTitle>
          <CardDescription>System status definitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                Vendor Status
              </div>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: '#FEF3C7', color: 'var(--fnrc-warning)' }}>Pending</Badge>
                <Badge style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>Approved</Badge>
                <Badge style={{ backgroundColor: '#FEE2E2', color: 'var(--fnrc-error)' }}>Rejected</Badge>
                <Badge style={{ backgroundColor: '#E5E7EB', color: 'var(--fnrc-text-muted)' }}>Suspended</Badge>
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                RFP Status
              </div>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: '#E5E7EB', color: 'var(--fnrc-text-muted)' }}>Draft</Badge>
                <Badge style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>Published</Badge>
                <Badge style={{ backgroundColor: '#FEE2E2', color: 'var(--fnrc-error)' }}>Closed</Badge>
                <Badge style={{ backgroundColor: '#FEE2E2', color: 'var(--fnrc-error)' }}>Cancelled</Badge>
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium" style={{ color: 'var(--fnrc-text-muted)' }}>
                Proposal Status
              </div>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: '#DBEAFE', color: 'var(--fnrc-info)' }}>Submitted</Badge>
                <Badge style={{ backgroundColor: '#FEF3C7', color: 'var(--fnrc-warning)' }}>Under Review</Badge>
                <Badge style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>Shortlisted</Badge>
                <Badge style={{ backgroundColor: '#D1FAE5', color: 'var(--fnrc-success)' }}>Selected</Badge>
                <Badge style={{ backgroundColor: '#FEE2E2', color: 'var(--fnrc-error)' }}>Rejected</Badge>
              </div>
            </div>
          </div>
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
              <Label htmlFor="category-desc">Description</Label>
              <Textarea
                id="category-desc"
                placeholder="Enter category description"
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
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
                  <Label htmlFor="edit-category-desc">Description</Label>
                  <Textarea
                    id="edit-category-desc"
                    placeholder="Enter category description"
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
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
    </div>
  );
}