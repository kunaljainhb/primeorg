import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Users, Shield, Eye, Mail, Check, Calendar, Activity } from 'lucide-react';
import { mockAdminUsers, roles } from '@/app/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'sonner';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AdminUserManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    setFormData({ name: '', email: '', role: '', status: 'active' });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = () => {
    toast.success('User updated successfully');
    setShowEditDialog(false);
    setFormData({ name: '', email: '', role: '', status: 'active' });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
            User & Role Management
          </h1>
          <p style={{ color: 'var(--fnrc-text-muted)' }}>
            Manage admin users and permissions
          </p>
        </div>
        <Button
          className="text-white"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          onClick={() => setShowCreateDialog(true)}
        >
          Create Admin User
        </Button>
      </div>

      {/* Admin Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
            Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdminUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewDetails(user)}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-600 text-xs">
                    {formatDate(user.createdDate || new Date())}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: user.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: user.status === 'active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)'
                      }}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
            Roles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.value} className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>{role.name}</div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                      Permissions: {role.permissions.join(', ')}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedUser({ role: role.value, permissions: role.permissions });
                    setShowUserDrawer(true);
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent aria-describedby="create-user-dialog-description">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <DialogDescription id="create-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@fnrc.gov.ae"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent aria-describedby="edit-user-dialog-description">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
          </DialogHeader>
          <DialogDescription id="edit-user-dialog-description" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@fnrc.gov.ae"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
              <Label htmlFor="edit-status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="text-white"
              style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User / Role Details Drawer */}
      <Sheet open={showUserDrawer} onOpenChange={setShowUserDrawer}>
        <SheetContent className="w-[450px] sm:w-[540px] overflow-y-auto border-l border-gray-150">
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
              {/* Account Details Card */}
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

              {/* Role Configuration Card */}
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
                    <Badge
                      variant="secondary"
                      className="capitalize font-bold text-[10px] border-none px-2.5 py-0.5"
                      style={{
                        backgroundColor: selectedUser.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: selectedUser.status === 'active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)'
                      }}
                    >
                      {selectedUser.status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Permissions Scopes Card */}
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

              {/* Activity / Logging Card */}
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