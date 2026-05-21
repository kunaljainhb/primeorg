import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Bell } from 'lucide-react';



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

      {/* Document Expiry Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" style={{ color: 'var(--fnrc-primary-green)' }} />
            Document Expiry Highlights
          </CardTitle>
          <CardDescription>Configure notifications and visual highlights prior to document expiration dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-md">
            <div className="space-y-2">
              <Label htmlFor="expiryAlert" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                Document Expiry Alert Threshold (Days)
              </Label>
              <Input id="expiryAlert" type="number" defaultValue="30" />
              <p className="text-xs text-muted-foreground font-medium">Set the number of days prior to document expiration to trigger notifications and dashboard highlights</p>
            </div>
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
