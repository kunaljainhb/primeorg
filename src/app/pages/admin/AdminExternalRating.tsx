import { useState } from 'react';
import { Star, Award, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { mockProposals } from '@/app/data/mockData';

export default function AdminExternalRating() {
  const params = new URLSearchParams(window.location.search);
  const proposalId = params.get('proposalId');
  const tenderId = params.get('tenderId');

  const proposal = mockProposals.find(p => p.id === proposalId);

  const [q1Remark, setQ1Remark] = useState('');
  const [q2Remark, setQ2Remark] = useState('');
  const [q3Remark, setQ3Remark] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-red-100 shadow-xl bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Invalid Evaluation Link</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              The rating link you have followed appears to be invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <p className="text-sm text-gray-650 leading-relaxed">
              Please contact the FNRC procurement department to receive a valid departmental rating generation link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!q1Remark.trim() || !q2Remark.trim() || !q3Remark.trim()) {
      alert('Please enter remarks for all evaluation queries before submitting.');
      return;
    }
    if (!comments.trim()) {
      alert('Please enter review remarks or comments.');
      return;
    }

    const ratingData = {
      q1Remark,
      q2Remark,
      q3Remark,
      comments,
      submittedBy: 'FNRC IT Department',
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage under key for persistence
    localStorage.setItem(`external_rating_${proposal.id}`, JSON.stringify(ratingData));
    setSubmitted(true);
  };



  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-green-100 shadow-2xl bg-white p-6 space-y-6">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
              <CheckCircle className="h-8 w-8 text-[var(--fnrc-success)]" />
            </div>
            <CardTitle className="text-2xl font-black text-gray-800">Ratings Submitted</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Evaluation submitted successfully to the FNC Procurement System.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border">
              Your departmental evaluation of <strong>{proposal.vendorName}</strong> has been logged. 
              The procurement admin will see these ratings reflected instantly on their evaluation dashboard.
            </p>
            <div className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">
              You may close this window.
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
          <Award className="h-7 w-7 text-[var(--fnrc-primary-green)]" />
          <span className="text-lg font-black text-gray-800 tracking-wide uppercase">Federal National Council</span>
        </div>
        <h1 className="text-2xl font-black text-gray-800">
          Departmental Vendor Evaluation
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gray-500 mr-2">Tender Name:</span>
            <span className="text-gray-800 font-bold">{proposal.tenderTitle}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gray-500 mr-2">Proposal ID:</span>
            <span className="text-[var(--fnrc-primary-green)] font-black">{proposal.id}</span>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl w-full border border-gray-150 shadow-2xl bg-white rounded-2xl">
        <CardHeader className="border-b bg-gray-50/40 pb-4">
          <CardTitle className="text-lg font-bold text-gray-800">Vendor & Tender Context</CardTitle>
          <CardDescription>Review Tender and proposal context below before submitting scorecards</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tender Title / Agreement</span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">{proposal.tenderTitle}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Vendor Legal Name</span>
              <span className="text-sm font-extrabold text-gray-800 block mt-0.5">{proposal.vendorName}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Proposal ID Reference</span>
              <span className="text-xs font-semibold text-[var(--fnrc-primary-green)] block mt-0.5">{proposal.id}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Evaluated By</span>
              <span className="text-xs font-semibold text-gray-600 block mt-0.5">Other FNRC Department</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Vendor Rating Queries</h3>
            
            <div className="space-y-4">
              {[
                { label: "How would you rate the vendor's technical capability?", value: q1Remark, setter: setQ1Remark },
                { label: "Does the vendor have relevant experience in the required domain?", value: q2Remark, setter: setQ2Remark },
                { label: "Rate the vendor's financial stability.", value: q3Remark, setter: setQ3Remark }
              ].map((q, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">{q.label}</label>
                  <Textarea
                    placeholder="Enter your remarks here..."
                    value={q.value}
                    onChange={(e) => q.setter(e.target.value)}
                    className="w-full p-3 rounded-xl border text-sm font-medium focus-visible:ring-[var(--fnrc-primary-green)] bg-white resize-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
              Evaluation Remarks & Justification *
            </label>
            <Textarea
              rows={4}
              placeholder="Provide comments supporting your scores. What did the vendor do exceptionally well, or where do they need improvement?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 rounded-xl border text-sm font-semibold focus-visible:ring-[var(--fnrc-primary-green)] bg-white resize-none"
            />
          </div>

          {/* Submit Action */}
          <Button
            onClick={handleSubmit}
            className="w-full text-white h-11 font-extrabold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            Submit Scorecard Evaluation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
