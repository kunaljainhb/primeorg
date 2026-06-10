import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { useTranslation } from '@/app/context/LanguageContext';

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('Terms of Service')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">{t('Placeholder for the terms of service content. Replace with actual legal text.')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
