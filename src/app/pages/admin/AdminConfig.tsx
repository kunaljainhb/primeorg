import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AdminConfig() {
  const { t } = useTranslation();

  const handleSave = () => {
    toast.success(t('System configuration saved successfully'));
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('System Configuration')}
          </h1>
        </div>
      </div>

      {/* Document Expiry Highlights */}
      <Card className="border border-gray-100/50 shadow-sm overflow-hidden max-w-2xl">
        <CardHeader className="border-b border-gray-50 pb-5">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Bell className="h-5 w-5 text-[var(--prime-primary-green)]" />
            {t('Document Expiry Thresholds')}
          </CardTitle>

        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="expiryAlert" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              {t('Document Expiry Alert Threshold (Days) *')}
            </Label>
            <Input id="expiryAlert" type="number" defaultValue="30" className="rounded-xl border-gray-200 h-10 w-full sm:w-48 text-sm" />
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              {t('Define the number of warning days before document expiration to automatically trigger email notifications to the vendor, alert the procurement board, and paint warning highlights in the admin ledger.')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end max-w-2xl pt-2">
        <Button
          onClick={handleSave}
          className="text-white h-11 px-8 font-semibold shadow-lg shadow-[var(--prime-primary-green)]/15 transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--prime-primary-green)' }}
        >
          {t('Save Configuration')}
        </Button>
      </div>
    </div>
  );
}
