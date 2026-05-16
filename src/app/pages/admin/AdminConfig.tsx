import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Settings } from 'lucide-react';

export default function AdminConfig() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--fnrc-text-dark)' }}>
          System Configuration
        </h1>
        <p style={{ color: 'var(--fnrc-text-muted)' }}>
          Configure system settings and preferences
        </p>
      </div>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
            Approval Workflows
          </CardTitle>
          <CardDescription>Configure vendor and proposal approval processes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>Auto-approve vendors</div>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                Automatically approve vendors meeting all criteria
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>Multi-level approval for RFPs</div>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                Require multiple approvers before RFP publication
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Email and system notification configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>Vendor approval notifications</div>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                Notify vendors when their registration is approved/rejected
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>RFP deadline reminders</div>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                Send reminders to vendors before RFP deadline
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>Proposal status updates</div>
              <p className="text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
                Notify vendors of proposal evaluation progress
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>General system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fileSize">Max File Upload Size (MB)</Label>
              <Input id="fileSize" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">System Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Dubai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Input id="language" defaultValue="English" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input id="sessionTimeout" type="number" defaultValue="30" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowedFormats">Allowed File Formats</Label>
            <Input id="allowedFormats" defaultValue="PDF, DOCX, XLSX" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="text-white"
          style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
