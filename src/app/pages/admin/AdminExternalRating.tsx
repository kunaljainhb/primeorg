import { useState } from 'react';
import { Star, Award, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { mockProposals, mockTenders } from '@/app/data/mockData';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AdminExternalRating() {
  const { t, language } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const proposalId = params.get('proposalId');
  const tenderId = params.get('tenderId');

  const proposal = mockProposals.find(p => p.id === proposalId);
  const tender = mockTenders.find(t => t.id === tenderId || t.id === proposal?.tenderId);

  const [q1Remark, setQ1Remark] = useState('');
  const [q2Remark, setQ2Remark] = useState('');
  const [q3Remark, setQ3Remark] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-red-100 shadow-xl bg-white text-start">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">{t('Invalid Evaluation Link')}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {t('The rating link you have followed appears to be invalid or expired.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <p className="text-sm text-gray-605 leading-relaxed">
              {t('Please contact the Prime Organization procurement department to receive a valid departmental rating generation link.')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    const isTechRequired = tender?.technicalProposalRequired !== 'no';
    if ((isTechRequired && !q1Remark.trim()) || !q2Remark.trim() || !q3Remark.trim()) {
      alert(t('Please enter remarks for all evaluation queries before submitting.'));
      return;
    }
    if (!comments.trim()) {
      alert(t('Please enter review remarks or comments.'));
      return;
    }

    const ratingData = {
      ...(isTechRequired ? { q1Remark } : {}),
      q2Remark,
      q3Remark,
      comments,
      submittedBy: 'Prime Organization IT Department',
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage under key for persistence
    localStorage.setItem(`external_rating_${proposal.id}`, JSON.stringify(ratingData));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-green-100 shadow-2xl bg-white p-6 space-y-6 text-start">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
              <CheckCircle className="h-8 w-8 text-[var(--prime-success)]" />
            </div>
            <CardTitle className="text-2xl font-black text-gray-800">{t('Ratings Submitted')}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {t('Evaluation submitted successfully to the FNC Procurement System.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border">
              {t('Your departmental evaluation of')} <strong>{proposal.vendorName}</strong> {t('has been logged. The procurement admin will see these ratings reflected instantly on their evaluation dashboard.')}
            </p>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {t('You may close this window.')}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex flex-col items-center">
      {/* Premium Header */}
      <div className="max-w-2xl w-full mb-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Award className="h-7 w-7 text-[var(--prime-primary-green)]" />
          <span className="text-lg font-black text-gray-800 tracking-wide uppercase">{t('Federal National Council')}</span>
        </div>
        <h1 className="text-2xl font-black text-gray-800">
          {t('Departmental Vendor Evaluation')}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <span className="text-gray-500 me-2">{t('Tender Name:')}</span>
            <span className="text-gray-800 font-bold">{proposal.tenderTitle}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <span className="text-gray-500 me-2">{t('Proposal ID:')}</span>
            <span className="text-[var(--prime-primary-green)] font-black">{proposal.id}</span>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl w-full border border-gray-150 shadow-2xl bg-white rounded-2xl text-start">
        <CardHeader className="border-b bg-gray-50/40 pb-4">
          <CardTitle className="text-lg font-bold text-gray-800">{t('Vendor & Tender Context')}</CardTitle>
          <CardDescription>{t('Review Tender and proposal context below before submitting scorecards')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{t('Tender Title / Agreement')}</span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">{proposal.tenderTitle}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{t('Vendor Legal Name')}</span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">{proposal.vendorName}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{t('Proposal ID Reference')}</span>
              <span className="text-xs font-semibold text-[var(--prime-primary-green)] block mt-0.5">{proposal.id}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{t('Evaluated By')}</span>
              <span className="text-xs font-semibold text-gray-600 block mt-0.5">{t('Other Prime Organization Department')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-450 uppercase tracking-widest">{t('Vendor Rating Queries')}</h3>
            
            <div className="space-y-4">
              {[
                { label: t("How would you rate the vendor's technical capability?"), value: q1Remark, setter: setQ1Remark, isTechnical: true },
                { label: t("Does the vendor have relevant experience in the required domain?"), value: q2Remark, setter: setQ2Remark },
                { label: t("Rate the vendor's financial stability."), value: q3Remark, setter: setQ3Remark }
              ].filter(q => !q.isTechnical || tender?.technicalProposalRequired !== 'no').map((q, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">{q.label}</label>
                  <Textarea
                    placeholder={t('Enter your remarks here...')}
                    value={q.value}
                    onChange={(e) => q.setter(e.target.value)}
                    className="w-full p-3 rounded-xl border text-sm font-medium focus-visible:ring-[var(--prime-primary-green)] bg-white resize-none text-start"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
              {t('Evaluation Remarks & Justification *')}
            </label>
            <Textarea
              rows={4}
              placeholder={t('Provide comments supporting your scores. What did the vendor do exceptionally well, or where do they need improvement?')}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 rounded-xl border text-sm font-semibold focus-visible:ring-[var(--prime-primary-green)] bg-white resize-none text-start"
            />
          </div>

          {/* Submit Action */}
          <Button
            onClick={handleSubmit}
            className="w-full text-white h-11 font-extrabold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: 'var(--prime-primary-green)' }}
          >
            {t('Submit Scorecard Evaluation')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
