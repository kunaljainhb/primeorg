import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Database, Plus, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';
import { vendorCategories, documentTypes } from '@/app/data/mockData';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { SearchFilterBar } from '@/app/components/ui/search-filter-bar';
import { useTranslation } from '@/app/context/LanguageContext';

interface AdminMasterDataProps {
  defaultTab?: 'category' | 'doctype' | 'declaration' | 'rubric';
}

export default function AdminMasterData({ defaultTab = 'category' }: AdminMasterDataProps) {
  const { t, language } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery('');
  }, [defaultTab]);
  
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
      content: 'The vendor confirms compliance with all anti-bribery and corruption laws applicable in the UAE and the internal policies of Prime Organization.'
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
      toast.error(t('Please enter the question'));
      return;
    }
    if (isEditingQuery) {
      setRatingQueries(ratingQueries.map(q => q.id === queryForm.id ? queryForm : q));
      toast.success(t('Question updated successfully'));
    } else {
      setRatingQueries([...ratingQueries, queryForm]);
      toast.success(t('Question added successfully'));
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
      toast.error(t('Please enter category name'));
      return;
    }
    toast.success(t('Category added successfully'));
    setShowCategoryDialog(false);
    setCategoryForm({ name: '', description: '', status: 'active' });
  };

  const handleAddDocType = () => {
    if (!docTypeForm.name) {
      toast.error(t('Please enter document type name'));
      return;
    }
    toast.success(t('Document type added successfully'));
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
    toast.success(t(`${editingItem?.type === 'category' ? 'Category' : 'Document type'} updated successfully`));
    setShowEditDialog(false);
    setEditingItem(null);
  };

  const filteredCategories = vendorCategories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocTypes = documentTypes.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeclarations = mockDeclarations.filter(decl =>
    decl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    decl.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQueries = ratingQueries.filter(query =>
    query.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabNames = {
    category: 'Service Category',
    doctype: 'Document Type',
    declaration: 'Declaration Context',
    rubric: 'Vendor Rating Question'
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 pt-1">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight leading-tight text-start">
            {t(tabNames[defaultTab])}
          </h1>
        </div>
        {/* Action Button on the top right next to the title */}
        {defaultTab === 'category' && (
          <Button 
            className="gap-1 text-white shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5 font-semibold" 
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }} 
            onClick={() => setShowCategoryDialog(true)}
          >
            <Plus className="h-4 w-4" />
            {t('Add Category')}
          </Button>
        )}
        {defaultTab === 'doctype' && (
          <Button 
            className="gap-1 text-white shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5 font-semibold" 
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }} 
            onClick={() => setShowDocTypeDialog(true)}
          >
            <Plus className="h-4 w-4" />
            {t('Add Document')}
          </Button>
        )}
        {defaultTab === 'rubric' && (
          <Button 
            className="gap-1 text-white shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5 font-semibold" 
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }} 
            onClick={handleAddQuery}
          >
            <Plus className="h-4 w-4" />
            {t('Add Rating Question')}
          </Button>
        )}
      </div>

      <Tabs key={defaultTab} defaultValue={defaultTab}>
        <TabsContent value="category" className="space-y-8 focus:outline-none">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('Search category...')}
          />
          {/* Vendor Service Categories */}
          <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('name')}><div className="flex items-center gap-1.5">{t('Category Registry Name')} {renderSortIcon('name')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('date')}><div className="flex items-center gap-1.5">{t('Created Date')} {renderSortIcon('date')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('status')}><div className="flex items-center gap-1.5">{t('Status')} {renderSortIcon('status')}</div></TableHead>
                    <TableHead className="text-end font-bold text-black text-sm py-4 pe-6">{t('Action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category, idx) => (
                    <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-normal text-gray-800 text-start">{t(category)}</TableCell>
                      <TableCell className="font-normal text-gray-500 text-sm text-start">
                        {new Date(2025, 0, 1 + idx).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-start">
                        <StatusBadge status="active" />
                      </TableCell>
                      <TableCell className="text-end py-3 pe-6">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditCategory(category)} title={t('Edit Category')}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500 font-medium">
                  {t('Showing')} <span className="font-bold text-black">{filteredCategories.length > 0 ? 1 : 0}</span> {t('to')} <span className="font-bold text-black">{filteredCategories.length}</span> {t('of')} <span className="font-bold text-black">{filteredCategories.length}</span> {t('entries')}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-1 mr-0 scale-x-[-1]' : 'mr-1'}`} />
                    {t('Previous')}
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                  </div>
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    {t('Next')}
                    <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'mr-1 ml-0 scale-x-[-1]' : 'ml-1'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctype" className="space-y-8 focus:outline-none">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('Search document...')}
          />
          {/* Document Types */}
          <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('type')}><div className="flex items-center gap-1.5">{t('Type')} {renderSortIcon('type')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('docTitle')}><div className="flex items-center gap-1.5">{t('Required Document Title')} {renderSortIcon('docTitle')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('mandatory')}><div className="flex items-center gap-1.5">{t('Mandatory')} {renderSortIcon('mandatory')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 text-start">{t('Status')}</TableHead>
                    <TableHead className="text-end font-bold text-black text-sm py-4 pe-6">{t('Action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocTypes.map((doc, idx) => (
                    <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-normal text-[var(--fnrc-primary-green)] text-start">{t(doc.type)}</TableCell>
                      <TableCell className="font-normal text-gray-800 text-start">{t(doc.name)}</TableCell>
                      <TableCell className="text-start">
                        <StatusBadge status={doc.mandatory === 'Yes' ? 'mandatory' : 'optional'} />
                      </TableCell>
                      <TableCell className="text-start">
                        <StatusBadge status={doc.status.toLowerCase()} />
                      </TableCell>
                      <TableCell className="text-end py-3 pe-6">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditDocType(doc)} title={t('Edit Document')}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500 font-medium">
                  {t('Showing')} <span className="font-bold text-black">{filteredDocTypes.length > 0 ? 1 : 0}</span> {t('to')} <span className="font-bold text-black">{filteredDocTypes.length}</span> {t('of')} <span className="font-bold text-black">{filteredDocTypes.length}</span> {t('entries')}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-1 mr-0 scale-x-[-1]' : 'mr-1'}`} />
                    {t('Previous')}
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                  </div>
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    {t('Next')}
                    <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'mr-1 ml-0 scale-x-[-1]' : 'ml-1'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declaration" className="space-y-8 focus:outline-none">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('Search declaration...')}
          />
          {/* Declaration Contexts */}
          <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('legalTitle')}><div className="flex items-center gap-1.5">{t('Declaration Name')} {renderSortIcon('legalTitle')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('lastUpdated')}><div className="flex items-center gap-1.5">{t('Last Updated')} {renderSortIcon('lastUpdated')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 text-start">{t('Status')}</TableHead>
                    <TableHead className="text-end font-bold text-black text-sm py-4 pe-6">{t('Action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeclarations.map((decl, idx) => (
                    <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-normal text-gray-800 text-start">{t(decl.title)}</TableCell>
                      <TableCell className="text-xs font-normal text-gray-500 text-start">{decl.lastUpdated}</TableCell>
                      <TableCell className="text-start">
                        <StatusBadge status={decl.status.toLowerCase()} />
                      </TableCell>
                      <TableCell className="text-end py-3 pe-6">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditDeclaration(decl)} title={t('Edit Declaration Framework')}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500 font-medium">
                  {t('Showing')} <span className="font-bold text-black">{filteredDeclarations.length > 0 ? 1 : 0}</span> {t('to')} <span className="font-bold text-black">{filteredDeclarations.length}</span> {t('of')} <span className="font-bold text-black">{filteredDeclarations.length}</span> {t('entries')}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-1 mr-0 scale-x-[-1]' : 'mr-1'}`} />
                    {t('Previous')}
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                  </div>
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    {t('Next')}
                    <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'mr-1 ml-0 scale-x-[-1]' : 'ml-1'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-8 focus:outline-none">
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('Search question...')}
          />
          {/* Vendor Rating Queries */}
          <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-black text-sm py-4 w-12 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('seq')}><div className="flex items-center gap-1.5">{t('Seq')} {renderSortIcon('seq')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('rubric')}><div className="flex items-center gap-1.5">{t('Rating Question')} {renderSortIcon('rubric')}</div></TableHead>
                    <TableHead className="font-bold text-black text-sm py-4 w-24 cursor-pointer hover:bg-gray-100 transition-colors text-start" onClick={() => handleSort('queryStatus')}><div className="flex items-center gap-1.5">{t('Status')} {renderSortIcon('queryStatus')}</div></TableHead>
                    <TableHead className="text-end font-bold text-black text-sm py-4 pe-6 w-24">{t('Action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.sort((a,b) => a.sequence - b.sequence).map((query, idx) => (
                    <TableRow key={idx} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                      <TableCell className="font-normal text-gray-400 text-start">{query.sequence}</TableCell>
                      <TableCell className="font-normal text-gray-800 text-xs sm:text-sm text-start">{t(query.question)}</TableCell>
                      <TableCell className="text-start">
                        <StatusBadge status={query.status.toLowerCase()} />
                      </TableCell>
                      <TableCell className="text-end py-3 pe-6">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditQuery(query)} title={t('Edit Rating Question')}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500 font-medium">
                  {t('Showing')} <span className="font-bold text-black">{filteredQueries.length > 0 ? 1 : 0}</span> {t('to')} <span className="font-bold text-black">{filteredQueries.length}</span> {t('of')} <span className="font-bold text-black">{filteredQueries.length}</span> {t('entries')}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-1 mr-0 scale-x-[-1]' : 'mr-1'}`} />
                    {t('Previous')}
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    <button className="h-8 w-8 rounded-md text-sm font-bold transition-colors bg-[var(--fnrc-primary-green)] text-white">1</button>
                  </div>
                  <Button variant="outline" size="sm" disabled className="font-semibold">
                    {t('Next')}
                    <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'mr-1 ml-0 scale-x-[-1]' : 'ml-1'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="category-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black text-start">{t('Add Service Category')}</DialogTitle>
          </DialogHeader>
          <div id="category-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2 text-start">
              <Label htmlFor="category-name" className="text-sm font-semibold text-gray-700">{t('Category Name *')}</Label>
              <Input
                id="category-name"
                placeholder={t('e.g. Mechanical Equipment Supply')}
                value={categoryForm.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2 text-start">
              <Label htmlFor="category-status" className="text-sm font-semibold text-gray-700">{t('Status *')}</Label>
              <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowCategoryDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleAddCategory}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              {t('Save Category')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Type Dialog */}
      <Dialog open={showDocTypeDialog} onOpenChange={setShowDocTypeDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="doctype-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black text-start">{t('Add Document')}</DialogTitle>
          </DialogHeader>
          <div id="doctype-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2 text-start">
              <Label htmlFor="doctype-name" className="text-sm font-semibold text-gray-700">{t('Document Name *')}</Label>
              <Input
                id="doctype-name"
                placeholder={t('e.g. ISO 9001 Certificate')}
                value={docTypeForm.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2 text-start">
              <Label htmlFor="doctype-mandatory" className="text-sm font-semibold text-gray-700">{t('Mandatory *')}</Label>
              <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select option')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t('Yes')}</SelectItem>
                  <SelectItem value="no">{t('No')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-start">
              <Label htmlFor="doctype-applicable" className="text-sm font-semibold text-gray-700">{t('Applicable To *')}</Label>
              <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select option')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">{t('Vendor Setup')}</SelectItem>
                  <SelectItem value="tender">{t('Tender Published')}</SelectItem>
                  <SelectItem value="proposal">{t('Bid Submission')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-start">
              <Label htmlFor="doctype-status" className="text-sm font-semibold text-gray-700">{t('Status *')}</Label>
              <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowDocTypeDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleAddDocType}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              {t('Save Document')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="edit-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black text-start">
              {t('Edit')} {editingItem?.type === 'category' ? t('Category') : t('Document Type')}
            </DialogTitle>
          </DialogHeader>
          <div id="edit-dialog-description" className="space-y-4 py-4">
            {editingItem?.type === 'category' ? (
              <>
                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-category-name" className="text-sm font-semibold text-gray-700">{t('Category Name *')}</Label>
                  <Input
                    id="edit-category-name"
                    placeholder={t('Enter category name')}
                    value={categoryForm.name}
                    className="rounded-xl border-gray-200"
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-category-status" className="text-sm font-semibold text-gray-700">{t('Status *')}</Label>
                  <Select value={categoryForm.status} onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t('Select status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('Active')}</SelectItem>
                      <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-doctype-name" className="text-sm font-semibold text-gray-700">{t('Document Name *')}</Label>
                  <Input
                    id="edit-doctype-name"
                    placeholder={t('Enter document type name')}
                    value={docTypeForm.name}
                    className="rounded-xl border-gray-200"
                    onChange={(e) => setDocTypeForm({ ...docTypeForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-doctype-mandatory" className="text-sm font-semibold text-gray-700">{t('Mandatory *')}</Label>
                  <Select value={docTypeForm.mandatory} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, mandatory: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t('Select option')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t('Yes')}</SelectItem>
                      <SelectItem value="no">{t('No')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-doctype-applicable" className="text-sm font-semibold text-gray-700">{t('Applicable To *')}</Label>
                  <Select value={docTypeForm.applicableTo} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, applicableTo: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t('Select option')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">{t('Vendor Setup')}</SelectItem>
                      <SelectItem value="tender">{t('Tender Published')}</SelectItem>
                      <SelectItem value="proposal">{t('Bid Submission')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-start">
                  <Label htmlFor="edit-doctype-status" className="text-sm font-semibold text-gray-700">{t('Status *')}</Label>
                  <Select value={docTypeForm.status} onValueChange={(value) => setDocTypeForm({ ...docTypeForm, status: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder={t('Select status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('Active')}</SelectItem>
                      <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowEditDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              {t('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Declaration Dialog */}
      <Dialog open={showDeclarationDialog} onOpenChange={setShowDeclarationDialog}>
        <DialogContent className="sm:max-w-2xl p-8">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-black text-start">{t('Edit Declaration Context')}</DialogTitle>
            <DialogDescription className="text-start">{t('Modify the legal text presented to vendors during setup gates')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4 text-start">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('Declaration Title')}</Label>
              <Input value={activeDeclaration.title} className="rounded-xl border-gray-200" onChange={(e) => setActiveDeclaration({...activeDeclaration, title: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                {t('Declaration Clause Context')}
                <span className="text-xs font-semibold text-gray-400">{t('Section details')}</span>
              </Label>
              <Textarea 
                className="min-h-[160px] leading-relaxed text-sm resize-none font-medium text-gray-800 rounded-xl border-gray-200 p-4" 
                value={activeDeclaration.content} 
                onChange={(e) => setActiveDeclaration({...activeDeclaration, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('Status')}</Label>
              <Select value={activeDeclaration.status.toLowerCase()} onValueChange={(val) => setActiveDeclaration({...activeDeclaration, status: val === 'active' ? 'Active' : 'Inactive'})}>
                <SelectTrigger className="w-[200px] rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowDeclarationDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              className="text-white font-semibold px-8"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
              onClick={() => {
                toast.success(t('Declaration Context updated successfully'));
                setShowDeclarationDialog(false);
              }}
            >
              {t('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query Dialog */}
      <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="query-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black text-start">
              {isEditingQuery ? t('Edit Vendor Rating Question') : t('Add Vendor Rating Question')}
            </DialogTitle>
          </DialogHeader>
          <div id="query-dialog-description" className="space-y-4 py-4 text-start">
            <div className="space-y-2">
              <Label htmlFor="query-question" className="text-sm font-semibold text-gray-700">{t('Question *')}</Label>
              <Textarea
                id="query-question"
                placeholder={t('e.g. Does the vendor demonstrate compliance with green excavation guidelines?')}
                value={queryForm.question}
                className="rounded-xl border-gray-200 p-3 resize-none"
                rows={3}
                onChange={(e) => setQueryForm({ ...queryForm, question: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="query-sequence" className="text-sm font-semibold text-gray-700">{t('Sequence Order Number *')}</Label>
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
              <Label htmlFor="query-status" className="text-sm font-semibold text-gray-700">{t('Status *')}</Label>
              <Select value={queryForm.status.toLowerCase()} onValueChange={(value) => setQueryForm({ ...queryForm, status: value === 'active' ? 'Active' : 'Inactive' })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowQueryDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleSaveQuery}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              {t('Save Question')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}