import React from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AntiBriberyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-6 sm:px-8 font-sans relative">
      <div className="absolute top-4 end-4 z-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/vendor')}
          className="flex items-center gap-2 text-xs font-semibold bg-white border border-gray-300 shadow-sm rounded-full hover:bg-gray-50 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] uppercase font-bold">
            EN
          </span>
          English
        </Button>
      </div>
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader className="border-b border-gray-100 pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              {t('Anti-Bribery and Corruption Certificate')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-gray-700">
              {t('Here you can display the full Anti‑Bribery and Corruption policy document, guidelines, and any related information for the vendor to review.')}
            </p>
            {/* Insert PDF viewer or policy content here */}
          </CardContent>
          <div className="flex justify-end p-4">
            <Button variant="outline" onClick={() => navigate('/vendor')}> 
              {t('Back to Profile Setup')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
