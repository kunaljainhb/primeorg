import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart3, Download, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          Reports & Audit
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Generate system reports and view audit logs
        </p>
      </div>

      {/* Standard Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
            Standard Reports
          </CardTitle>
          <CardDescription>Pre-configured system reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="mb-3">
                <div className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Vendor Registration Report
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Summary of vendor registrations by status and category
                </p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="mb-3">
                <div className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  RFP Activity Report
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Overview of RFPs published and closed
                </p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="mb-3">
                <div className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Proposal Submission Report
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Analysis of proposals by status and vendor
                </p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="mb-3">
                <div className="font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Vendor Performance Report
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                  Evaluation of vendor proposal success rates
                </p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: 'var(--fnrc-accent-gold)' }} />
            Audit Logs
          </CardTitle>
          <CardDescription>Track system changes and admin actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Vendor Approved: TechSolutions LLC
                  </div>
                  <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                    By: Ahmed Al Mansoori • February 1, 2026 10:30 AM
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                    RFP Published: IT Infrastructure Modernization
                  </div>
                  <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                    By: Fatima Al Hammadi • January 30, 2026 2:15 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                    Proposal Shortlisted: PROP-001
                  </div>
                  <p className="mt-1 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                    By: Mohammed Al Zaabi • January 28, 2026 11:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
