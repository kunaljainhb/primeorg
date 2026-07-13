import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Users, Shield, Eye, Mail, Check, Calendar, Activity, Plus, Pencil, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, Info } from 'lucide-react';
import { mockAdminUsers, roles } from '@/app/data/mockData';
import { useState, useEffect } from 'react';

const ROLE_DISPLAY: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  PROCUREMENT_ADMIN: 'Procurement Admin',
  REVIEWER: 'Reviewer',
  ITEM_MANAGER: 'Item Manager',
};
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { useNavigate } from '@/app/context/RouterContext';
import { useTranslation } from '@/app/context/LanguageContext';
import { cn } from '@/app/components/ui/utils';
import { SearchFilterBar } from '@/app/components/ui/search-filter-bar';
import { EmptyState } from '@/app/components/ui/empty-state';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const mockEmployees = [
  { id: 'EMP-001', name: 'John Doe', email: 'john.doe@prime.org' },
  { id: 'EMP-002', name: 'Jane Smith', email: 'jane.smith@prime.org' },
  { id: 'EMP-003', name: 'Ahmed Ali', email: 'ahmed.ali@prime.org' }
];

export default function AdminUserManagement() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: '',
    status: 'active'
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = mockAdminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal: any = a[key as keyof typeof a];
    let bVal: any = b[key as keyof typeof b];

    if (key === 'createdDate') {
       aVal = new Date(aVal || new Date()).getTime();
       bVal = new Date(bVal || new Date()).getTime();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    {
      key: 'status',
      label: t('Status'),
      options: [
        { label: t('All Statuses'), value: 'all' },
        { label: t('Active'), value: 'active' },
        { label: t('Inactive'), value: 'inactive' }
      ],
      selectedValue: statusFilter,
      onChange: setStatusFilter
    }
  ];

  const activeChips = statusFilter !== 'all' ? [
    {
      label: `${t('Status')}: ${t(statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))}`,
      onRemove: () => setStatusFilter('all')
    }
  ] : [];

  const handleClearAll = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error(t('Please fill all required fields'));
      return;
    }
    toast.success(t('Admin user created successfully'));
    setShowCreateDialog(false);
    setFormData({ name: '', email: '', employeeId: '', role: '', status: 'active' });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId || '',
      role: user.role,
      status: user.status
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = () => {
    toast.success(t('User updated successfully'));
    setShowEditDialog(false);
    setFormData({ name: '', email: '', employeeId: '', role: '', status: 'active' });
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowUserDrawer(true);
  };

  const getUserPermissions = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.permissions || [];
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 pt-1">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('User & Roles Management')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 transition-all font-semibold"
            onClick={() => setShowRoleDialog(true)}
          >
            <Info className="h-4 w-4 text-gray-500" />
            {t('Role Information')}
          </Button>
          <Button
            className="text-white gap-2 shadow-md shadow-[var(--prime-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--prime-primary-green)' }}
            onClick={() => navigate('/admin/users/create')}
          >
            <Plus className="h-4 w-4" />
            {t('Create Admin User')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Modern Search and Filter Bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={t('Search by user name...')}
          filters={filters}
          activeChips={activeChips}
          onClearAll={handleClearAll}
        />

        {/* Admin Users Table */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {paginatedUsers.length > 0 ? (
              <>
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                        <div className="flex items-center gap-1.5">
                          {t('Employee ID')}
                          {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-1.5">
                          {t('Name')}
                          {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('email')}>
                        <div className="flex items-center gap-1.5">
                          {t('Email')}
                          {sortConfig?.key === 'email' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('role')}>
                        <div className="flex items-center gap-1.5">
                          {t('Role')}
                          {sortConfig?.key === 'role' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('createdDate')}>
                        <div className="flex items-center gap-1.5">
                          {t('Created Date')}
                          {sortConfig?.key === 'createdDate' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-1.5">
                          {t('Status')}
                          {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pe-6">{t('Action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-[var(--prime-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0">
                        <TableCell className="font-bold text-[var(--prime-primary-green)]">{user.id}</TableCell>
                        <TableCell className="font-semibold text-gray-800">{user.name}</TableCell>
                        <TableCell className="text-gray-500 font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gray-50 text-gray-600 border border-gray-100 rounded-md font-semibold">
                            {ROLE_DISPLAY[user.role] ?? t(user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 font-medium text-xs">
                          {formatDate(user.createdDate || new Date())}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-right py-3 pe-6">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 justify-center items-center font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/users/edit/${user.id}`);
                            }}
                            title={t('Edit User')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination Controls */}
                {true && (
                  <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                    <span className="text-sm text-gray-500 font-medium">
                      {t('Showing')} <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')} <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedUsers.length)}</span> {t('of')} <span className="font-bold text-gray-900">{sortedUsers.length}</span> {t('entries')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="font-semibold"
                      >
                        <ChevronLeft className={cn("h-4 w-4 me-1", language === 'ar' && "scale-x-[-1]")} />
                        {t('Previous')}
                      </Button>
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`h-8 w-8 rounded-md text-sm font-bold transition-colors ${
                              currentPage === i + 1 
                                ? 'bg-[var(--prime-primary-green)] text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="font-semibold"
                      >
                        {t('Next')}
                        <ChevronRight className={cn("h-4 w-4 ms-1", language === 'ar' && "scale-x-[-1]")} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title={t('No Users Found')}
                description={t('No administrative users matched your search or status filter.')}
                actionLabel={t('Clear Filters')}
                onAction={handleClearAll}
              />
            )}
          </CardContent>
        </Card>

        {/* Roles & Permissions section removed from bottom */}
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="create-user-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">{t('Create New Administrator')}</DialogTitle>
          </DialogHeader>
          <div id="create-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">{t('Employee Name *')}</Label>
              <Select 
                value={formData.employeeId} 
                onValueChange={(value) => {
                  const emp = mockEmployees.find(e => e.id === value);
                  if (emp) {
                    setFormData({
                      ...formData,
                      employeeId: emp.id,
                      name: emp.name,
                      email: emp.email
                    });
                  }
                }}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Choose government employee...')} />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-semibold text-gray-700">{t('Employee ID')}</Label>
              <Input
                id="employeeId"
                placeholder={t('Auto-filled')}
                value={formData.employeeId}
                className="rounded-xl border-gray-200 bg-gray-50"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">{t('Email Address')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('Auto-filled')}
                value={formData.email}
                className="rounded-xl border-gray-200 bg-gray-50"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-700">{t('Privilege Role *')}</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Choose privilege level...')} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {t(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">{t('Account Status *')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select account state...')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowCreateDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleCreateUser}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--prime-primary-green)' }}
            >
              {t('Create Account')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="edit-user-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">{t('Edit Admin User Configuration')}</DialogTitle>
          </DialogHeader>
          <div id="edit-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">{t('Full Name *')}</Label>
              <Input
                id="edit-name"
                placeholder={t('Enter full name')}
                value={formData.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700">{t('Email Address *')}</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@prime.org"
                value={formData.email}
                className="rounded-xl border-gray-200"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-sm font-semibold text-gray-700">{t('Privilege Role *')}</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Choose privilege level...')} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {t(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-sm font-semibold text-gray-700">{t('Account Status *')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder={t('Select account state...')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowEditDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--prime-primary-green)' }}
            >
              {t('Update Account')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User / Role Details Drawer */}
      <Sheet open={showUserDrawer} onOpenChange={setShowUserDrawer}>
        <SheetContent className="w-[450px] sm:w-[540px] overflow-y-auto border-l border-gray-105">
          <SheetHeader className="pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--prime-primary-green)]/10 flex items-center justify-center">
                {selectedUser?.name ? (
                  <Users className="h-5 w-5 text-[var(--prime-primary-green)]" />
                ) : (
                  <Shield className="h-5 w-5 text-[var(--prime-accent-gold)]" />
                )}
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-gray-800">
                  {selectedUser?.name ? t('User Profile Details') : t('Role Authorization Details')}
                </SheetTitle>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedUser?.name 
                    ? t('Administrative account configurations and permissions') 
                    : t('System privileges and access level specifications')}
                </p>
              </div>
            </div>
          </SheetHeader>

          {selectedUser && (
            <div className="mt-6 space-y-6">
              {selectedUser.name && (
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{t('Account Information')}</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">{t('Full Name')}</div>
                        <div className="text-sm font-bold text-gray-800">{selectedUser.name}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">{t('Email Address')}</div>
                        <div className="text-sm font-semibold text-gray-700">{selectedUser.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{t('Role Information')}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400">{t('Assigned Role')}</div>
                      <div className="text-sm font-bold text-gray-800 capitalize">
                        {t(selectedUser.role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                      </div>
                    </div>
                  </div>
                  {selectedUser.status && (
                    <StatusBadge status={selectedUser.status} />
                  )}
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{t('Assigned Permissions Scopes')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getUserPermissions(selectedUser.role).map((permission: string) => (
                    <div key={permission} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-150 bg-white">
                      <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[var(--prime-success)]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 capitalize">{t(permission.split('_').map((word: string) => word === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}</span>
                    </div>
                  ))}
                  {getUserPermissions(selectedUser.role).length === 0 && (
                    <div className="col-span-2 text-xs font-medium text-gray-500 italic p-3 text-center">
                      {t('No authorization privileges configured.')}
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.status && (
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{t('Security & Activity Log')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">{t('Created Date')}</div>
                        <div className="text-xs font-semibold text-gray-700">
                          {formatDate(selectedUser.createdDate || '2026-01-10')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Activity className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">{t('Last Active Session')}</div>
                        <div className="text-xs font-semibold text-gray-700">
                          {formatDate(new Date())} • {t('Active')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Role & Permission Matrix Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md p-6 max-h-[80vh] overflow-y-auto" aria-describedby="role-matrix-dialog-description">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[var(--prime-accent-gold)]/10 flex items-center justify-center">
                <Shield className="h-4.5 w-4.5 text-[var(--prime-accent-gold)]" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-gray-900">
                  {t('Role & Permission Matrix')}
                </DialogTitle>
                <DialogDescription className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {t('Overview of system roles and scopes')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div id="role-matrix-dialog-description" className="py-4 space-y-4">
            {roles.map((role) => (
              <div key={role.value} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Shield className="h-3 w-3 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 capitalize">{t(role.name)}</h4>
                    <p className="text-[9px] text-gray-400 font-semibold">{t('Role Identifier')}: {role.value}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('Authorized Scopes')}</div>
                  <ul className="text-xs text-gray-600 font-medium space-y-1">
                    {role.permissions.map((permission: string) => (
                      <li key={permission} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                        <span>{t(permission.split('_').map((word: string) => word === 'and' ? 'and' : word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}</span>
                      </li>
                    ))}
                    {role.permissions.length === 0 && (
                      <li className="text-gray-400 italic text-[11px]">{t('No privileges configured.')}</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-end border-t border-gray-100 pt-3">
            <Button variant="outline" size="sm" className="font-semibold text-xs" onClick={() => setShowRoleDialog(false)}>
              {t('Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}