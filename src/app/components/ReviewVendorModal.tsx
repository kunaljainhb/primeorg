import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewVendorModalProps {
  open: boolean;
  onClose: () => void;
  vendorName: string;
  rfpTitle: string;
  rfpId: string;
  vendorId: string;
}

export function ReviewVendorModal({ open, onClose, vendorName, rfpTitle }: ReviewVendorModalProps) {
  const [qualityRating, setQualityRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [complianceRating, setComplianceRating] = useState(0);
  const [comments, setComments] = useState('');

  const overallRating = (qualityRating + timelinessRating + communicationRating + complianceRating) / 4;

  const handleSubmit = () => {
    if (qualityRating === 0 || timelinessRating === 0 || communicationRating === 0 || complianceRating === 0) {
      toast.error('Please provide ratings for all categories');
      return;
    }

    if (!comments.trim()) {
      toast.error('Please provide overall comments');
      return;
    }

    // In real app, save to backend
    toast.success('Vendor review submitted successfully');
    onClose();
    
    // Reset form
    setQualityRating(0);
    setTimelinessRating(0);
    setCommunicationRating(0);
    setComplianceRating(0);
    setComments('');
  };

  const RatingRow = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (rating: number) => void;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-current'
                  : ''
              }`}
              style={{
                color: star <= value ? 'var(--fnrc-accent-gold)' : 'var(--fnrc-border-gray)'
              }}
            />
          </button>
        ))}
        <span className="ml-2 text-sm" style={{ color: 'var(--fnrc-text-muted)' }}>
          {value > 0 ? `${value}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" aria-describedby="review-vendor-description">
        <DialogHeader>
          <DialogTitle>Review Vendor</DialogTitle>
        </DialogHeader>

        <div id="review-vendor-description" className="space-y-6 py-4">
          {/* Vendor Info */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--fnrc-text-muted)' }}>Vendor Name:</span>
                <div className="font-medium mt-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                  {vendorName}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--fnrc-text-muted)' }}>RFP Reference:</span>
                <div className="font-medium mt-1" style={{ color: 'var(--fnrc-text-dark)' }}>
                  {rfpTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="space-y-4">
            <RatingRow 
              label="Quality of Work" 
              value={qualityRating} 
              onChange={setQualityRating} 
            />
            <RatingRow 
              label="Timeliness" 
              value={timelinessRating} 
              onChange={setTimelinessRating} 
            />
            <RatingRow 
              label="Communication" 
              value={communicationRating} 
              onChange={setCommunicationRating} 
            />
            <RatingRow 
              label="Compliance" 
              value={complianceRating} 
              onChange={setComplianceRating} 
            />
          </div>

          {/* Overall Rating Display */}
          {overallRating > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: 'var(--fnrc-text-dark)' }}>
                  Overall Rating
                </span>
                <div className="flex items-center gap-2">
                  <Star 
                    className="h-5 w-5 fill-current" 
                    style={{ color: 'var(--fnrc-accent-gold)' }} 
                  />
                  <span className="font-medium text-lg" style={{ color: 'var(--fnrc-text-dark)' }}>
                    {overallRating.toFixed(2)} / 5
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Overall Comments *</Label>
            <Textarea
              id="comments"
              placeholder="Provide detailed feedback about the vendor's performance..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white"
            style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}