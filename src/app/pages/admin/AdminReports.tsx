import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart3, Download, FileText, Calendar, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

export default function AdminReports() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            System Reports & Analytics
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Standard Reports */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <BarChart3 className="h-5 w-5 text-[var(--fnrc-primary-green)]" />
              Standard Reports
            </CardTitle>

          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/20 hover:bg-gray-50/40 transition-colors flex flex-col justify-between h-[180px]">
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    Vendor Registration Summary
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 font-medium leading-relaxed">
                    Aggregate total vendor registration applications segmented by operational categories.
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px] rounded-lg border-gray-200 h-9 text-xs">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="gap-1 h-9 font-semibold text-xs rounded-lg border-gray-200">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/20 hover:bg-gray-50/40 transition-colors flex flex-col justify-between h-[180px]">
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    RFP Activity Report
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 font-medium leading-relaxed">
                    Monitor publishing activity, submission volume, and closed/cancelled tender campaigns.
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px] rounded-lg border-gray-200 h-9 text-xs">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="gap-1 h-9 font-semibold text-xs rounded-lg border-gray-200">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/20 hover:bg-gray-50/40 transition-colors flex flex-col justify-between h-[180px]">
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    Proposal Submission Audit
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 font-medium leading-relaxed">
                    Compare technical and commercial proposal counts and pricing averages per active RFP.
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px] rounded-lg border-gray-200 h-9 text-xs">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="gap-1 h-9 font-semibold text-xs rounded-lg border-gray-200">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/20 hover:bg-gray-50/40 transition-colors flex flex-col justify-between h-[180px]">
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    Supplier Success Ratios
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 font-medium leading-relaxed">
                    Audit performance ratings, response rates, and bid-to-award conversion metrics.
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px] rounded-lg border-gray-200 h-9 text-xs">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="gap-1 h-9 font-semibold text-xs rounded-lg border-gray-200">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card className="border border-gray-100/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b border-gray-50 pb-5">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
              Active System Audit Trail
            </CardTitle>

          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[var(--fnrc-primary-green)] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-gray-800">
                  Vendor Approved: TechSolutions LLC
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10:30 AM</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 01/02/2026</span>
                  <span>By: Ahmed Al Mansoori</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[var(--fnrc-primary-green)] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-gray-800">
                  RFP Published: IT Infrastructure Modernization
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 02:15 PM</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 30/01/2026</span>
                  <span>By: Fatima Al Hammadi</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[var(--fnrc-primary-green)] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-gray-800">
                  Proposal Shortlisted: PROP-001
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 11:00 AM</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 28/01/2026</span>
                  <span>By: Mohammed Al Zaabi</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
