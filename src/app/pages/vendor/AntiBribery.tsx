import { useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AntiBribery() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-6 font-sans">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">{t('Anti-Bribery and Corruption Certificate')}</h1>
        <p className="text-gray-700 mb-6">{t('Insert the full Anti‑Bribery and Corruption Certificate text here.')}</p>
        <Button
          type="button"
          onClick={() => { window.history.back(); } }
          className="bg-[var(--fnrc-primary-green)] text-white hover:bg-[var(--fnrc-primary-green-dark)]"
        >
          {t('Back')}
        </Button>
      </div>
    </div>
  );
}
