import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Users, Shield, Eye } from 'lucide-react';
import { mockAdminUsers, roles } from '@/app/data/mockData';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'sonner';

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
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                      {user.role.replace('_', ' ')}
                    </Badge>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* User Details Drawer */}
      <Sheet open={showUserDrawer} onOpenChange={setShowUserDrawer}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              {selectedUser.name && (
                <>
                  <div>
                    <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Full Name</div>
                    <div className="font-medium">{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Email</div>
                    <div>{selectedUser.email}</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Assigned Role</div>
                <Badge variant="secondary" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
                  {selectedUser.role?.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--fnrc-text-muted)' }}>Permissions</div>
                <div className="space-y-2">
                  {getUserPermissions(selectedUser.role).map((permission: string) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <span className="text-sm">{permission.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedUser.status && (
                <>
                  <div>
                    <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Account Status</div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: selectedUser.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: selectedUser.status === 'active' ? 'var(--fnrc-success)' : 'var(--fnrc-error)'
                      }}
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm mb-1" style={{ color: 'var(--fnrc-text-muted)' }}>Last Login</div>
                    <div>{new Date().toLocaleString()}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}