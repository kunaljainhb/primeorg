import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Users, Shield, Eye, Mail, Check, Calendar, Activity, Plus, Pencil } from 'lucide-react';
import { mockAdminUsers, roles } from '@/app/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { toast } from 'sonner';
import { StatusBadge } from '@/app/components/ui/status-badge';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const mockEmployees = [
  { id: 'EMP-001', name: 'John Doe', email: 'john.doe@fnrc.gov.ae' },
  { id: 'EMP-002', name: 'Jane Smith', email: 'jane.smith@fnrc.gov.ae' },
  { id: 'EMP-003', name: 'Ahmed Ali', email: 'ahmed.ali@fnrc.gov.ae' }
];

export default function AdminUserManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: '',
    status: 'active'
  });

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Admin user created successfully');
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
    toast.success('User updated successfully');
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
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            User & Roles Management
          </h1>
        </div>
        <Button
          className="text-white gap-2 shadow-md shadow-[var(--fnrc-primary-green)]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Create Admin User
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Admin Users Table */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-5">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Users className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              Administrative personnel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Employee ID</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Email</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Role</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Created Date</TableHead>
                  <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 text-sm py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[var(--fnrc-primary-green)]/[0.04] transition-colors border-b border-gray-100 last:border-0 cursor-pointer" onClick={() => handleViewDetails(user)}>
                    <TableCell className="font-bold text-[var(--fnrc-primary-green)]">{user.id}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{user.name}</TableCell>
                    <TableCell className="text-gray-500 font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-50 text-gray-600 border border-gray-100 rounded-md font-semibold">
                        {user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-medium text-xs">
                      {formatDate(user.createdDate || new Date())}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 justify-center items-center font-semibold" onClick={() => handleEditUser(user)} title="Edit User">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Roles & Permissions */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Shield className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
              Role Permissions Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {roles.map((role) => (
              <div key={role.value} className="rounded-xl border border-gray-100 p-4 bg-gray-50/20 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-sm">{role.name}</div>
                  <div className="mt-1.5 text-xs text-gray-400 font-semibold leading-relaxed">
                    Privileges: {role.permissions.map(p => p.split('_').join(' ')).join(', ')}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="font-semibold shrink-0 justify-center w-full sm:w-auto"
                  onClick={() => {
                    setSelectedUser({ role: role.value, permissions: role.permissions });
                    setShowUserDrawer(true);
                  }}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View Matrix Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="create-user-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Create New Administrator</DialogTitle>
          </DialogHeader>
          <div id="create-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Select Employee *</Label>
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
                  <SelectValue placeholder="Choose government employee..." />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-semibold text-gray-700">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Auto-filled"
                value={formData.employeeId}
                className="rounded-xl border-gray-200 bg-gray-50"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Auto-filled"
                value={formData.email}
                className="rounded-xl border-gray-200 bg-gray-50"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-700">Privilege Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Choose privilege level..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Account Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select account state..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md p-8" aria-describedby="edit-user-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Edit Admin User Configuration</DialogTitle>
          </DialogHeader>
          <div id="edit-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                className="rounded-xl border-gray-200"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@fnrc.gov.ae"
                value={formData.email}
                className="rounded-xl border-gray-200"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-sm font-semibold text-gray-700">Privilege Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Choose privilege level..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-sm font-semibold text-gray-700">Account Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select account state..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" className="font-semibold" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="text-white font-semibold"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User / Role Details Drawer */}
      <Sheet open={showUserDrawer} onOpenChange={setShowUserDrawer}>
        <SheetContent className="w-[450px] sm:w-[540px] overflow-y-auto border-l border-gray-105">
          <SheetHeader className="pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--fnrc-primary-green)]/10 flex items-center justify-center">
                {selectedUser?.name ? (
                  <Users className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
                ) : (
                  <Shield className="h-5 w-5 text-[var(--fnrc-accent-gold)]" />
                )}
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-gray-800">
                  {selectedUser?.name ? 'User Profile Details' : 'Role Authorization Details'}
                </SheetTitle>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedUser?.name 
                    ? 'Administrative account configurations and permissions' 
                    : 'System privileges and access level specifications'}
                </p>
              </div>
            </div>
          </SheetHeader>

          {selectedUser && (
            <div className="mt-6 space-y-6">
              {selectedUser.name && (
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Account Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">Full Name</div>
                        <div className="text-sm font-bold text-gray-800">{selectedUser.name}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">Email Address</div>
                        <div className="text-sm font-semibold text-gray-700">{selectedUser.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Role Information</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400">Assigned Role</div>
                      <div className="text-sm font-bold text-gray-800 capitalize">
                        {(selectedUser.role || '').replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  {selectedUser.status && (
                    <StatusBadge status={selectedUser.status} />
                  )}
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Assigned Permissions Scopes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getUserPermissions(selectedUser.role).map((permission: string) => (
                    <div key={permission} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-150 bg-white">
                      <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[var(--fnrc-success)]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 capitalize">{permission.replace('_', ' ')}</span>
                    </div>
                  ))}
                  {getUserPermissions(selectedUser.role).length === 0 && (
                    <div className="col-span-2 text-xs font-medium text-gray-500 italic p-3 text-center">
                      No authorization privileges configured.
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.status && (
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Security & Activity Log</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400">Created Date</div>
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
                        <div className="text-[10px] font-bold text-gray-400">Last Active Session</div>
                        <div className="text-xs font-semibold text-gray-700">
                          {formatDate(new Date())} • Active
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
    </div>
  );
}