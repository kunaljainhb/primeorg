import { useState } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { mockEmployees, roles, mockAdminUsers } from '@/app/data/mockData';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AdminUserCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    role: '',
    status: 'active' as const,
  });

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.error(t('Please select an employee'));
      return;
    }
    if (!formData.role) {
      toast.error(t('Please select a role'));
      return;
    }

    // Generate a new sequential/random ID
    const newId = `ADM-${String(mockAdminUsers.length + 1).padStart(3, '0')}`;

    mockAdminUsers.push({
      id: newId,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      createdDate: new Date().toISOString().split('T')[0],
    } as any);

    toast.success(t('Admin user created successfully'));
    navigate('/admin/users');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-bold text-gray-900">{t('Create New Administrator')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Employee selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('Employee Name *')}</Label>
              <Select value={formData.employeeId} onValueChange={handleEmployeeSelect}>
                <SelectTrigger className="rounded-xl border-gray-200">
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
              <Label className="text-sm font-semibold text-gray-700">{t('Employee Code')}</Label>
              <Input value={formData.employeeId} placeholder={t('Auto-filled')} disabled className="rounded-xl border-gray-200 bg-gray-50" />
            </div>

            {/* Email (disabled) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('Email Address')}</Label>
              <Input type="email" value={formData.email} placeholder={t('Auto-filled')} disabled className="rounded-xl border-gray-200 bg-gray-50" />
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('Privilege Role *')}</Label>
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
              <Label className="text-sm font-semibold text-gray-700">{t('Account Status *')}</Label>
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
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 mt-6">
              <Button type="button" variant="outline" className="font-semibold" onClick={() => navigate('/admin/users')}>
                {t('Cancel')}
              </Button>
              <Button type="submit" className="text-white font-semibold" style={{ backgroundColor: 'var(--fnrc-primary-green)' }}>
                {t('Create Account')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
