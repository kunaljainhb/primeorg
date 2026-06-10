import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@/app/context/RouterContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { mockEmployees, roles, mockAdminUsers } from '@/app/data/mockData';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AdminUserEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); // admin user id

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    role: '',
    status: 'active' as const,
  });

  // Load user data on mount
  useEffect(() => {
    const user = mockAdminUsers.find(u => u.id === id);
    if (user) {
      // Find matching employee by employeeId, email, or name
      let matchedEmp = mockEmployees.find(e => 
        (user.employeeId && e.id === user.employeeId) || 
        (user.email && e.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.name && e.name.toLowerCase() === user.name.toLowerCase())
      );

      if (!matchedEmp) {
        matchedEmp = {
          id: user.employeeId || user.id.replace('ADM', 'EMP'),
          name: user.name,
          email: user.email
        };
        mockEmployees.push(matchedEmp);
      }

      setFormData({
        employeeId: matchedEmp.id,
        name: matchedEmp.name,
        email: matchedEmp.email,
        role: user.role,
        status: user.status as any,
      });
    } else {
      toast.error(t('User not found'));
      navigate('/admin/users');
    }
  }, [id, navigate, t]);

  const handleEmployeeSelect = (value: string) => {
    const emp = mockEmployees.find(e => e.id === value);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeId: emp.id,
        name: emp.name,
        email: emp.email,
      }));
    }
  };

  const handleUpdate = () => {
    if (!formData.role) {
      toast.error(t('Please select a role'));
      return;
    }
    const idx = mockAdminUsers.findIndex(u => u.id === id);
    if (idx >= 0) {
      mockAdminUsers[idx] = {
        ...mockAdminUsers[idx],
        employeeId: formData.employeeId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };
      toast.success(t('Admin user updated successfully'));
      navigate('/admin/users');
    } else {
      toast.error(t('User not found'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">{t('Edit Administrator')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employee selector */}
          <div className="space-y-2">
            <Label>{t('Employee Name')}</Label>
            <Select disabled value={formData.employeeId} onValueChange={handleEmployeeSelect}>
              <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50">
                <SelectValue placeholder={t('Choose employee...')} />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Employee Code (disabled) */}
          <div className="space-y-2">
            <Label>{t('Employee Code')}</Label>
            <Input value={formData.employeeId} disabled />
          </div>
          {/* Email (disabled) */}
          <div className="space-y-2">
            <Label>{t('Email Address')}</Label>
            <Input type="email" value={formData.email} disabled />
          </div>
          {/* Role selector */}
          <div className="space-y-2">
            <Label>{t('Privilege Role *')}</Label>
            <Select value={formData.role} onValueChange={value => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder={t('Choose privilege level...')} />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {t(r.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Status selector */}
          <div className="space-y-2">
            <Label>{t('Account Status *')}</Label>
            <Select value={formData.status} onValueChange={value => setFormData(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder={t('Select account state...')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('Active')}</SelectItem>
                <SelectItem value="inactive">{t('Inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => navigate('/admin/users')}>{t('Cancel')}</Button>
            <Button onClick={handleUpdate}>{t('Update Account')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
