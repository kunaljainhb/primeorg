import React from 'react';
import { cn } from './utils';
import { useTranslation } from '@/app/context/LanguageContext';

export type SystemStatus = 
  | 'approved' | 'active' | 'verified' | 'delivered' | 'paid'
  | 'pending' | 'under_review' | 'submitted' | 'technical_review_started' | 'commercial_review_started' | 'technical_review'
  | 'rejected' | 'suspended' | 'expired' | 'inactive' | 'cancelled' | 'technical_review_rejected' | 'commercial_review_rejected'
  | 'correction_requested' | 'technical_correction_requested' | 'commercial_correction_requested'
  | 'draft' | 'closed'
  | 'published' | 'open'
  | 'approved' | 'selected' | 'technical_review_completed' | 'commercial_review_completed'
  | string;

interface StatusBadgeProps {
  status: SystemStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const normStatus = (status || '').toLowerCase().trim();

  // Color mapping
  let bgClass = "bg-gray-100 text-gray-700 border-gray-200/50";
  let displayLabel = status;

  if (normStatus === 'approved' || normStatus === 'technical_approved' || normStatus === 'commercial_approved' || normStatus === 'shortlisted' || normStatus === 'active' || normStatus === 'verified' || normStatus === 'delivered' || normStatus === 'paid' || normStatus === 'receiving completed') {
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400";
    displayLabel = normStatus === 'paid' ? 'Paid' : normStatus === 'active' ? 'Active' : normStatus === 'verified' ? 'Verified' : normStatus === 'delivered' ? 'Delivered' : normStatus === 'receiving completed' ? 'Receiving Completed' : normStatus === 'technical_approved' ? 'Technical Approved' : normStatus === 'commercial_approved' ? 'Commercial Approved' : 'Approved';
  } else if (normStatus === 'pending' || normStatus === 'under_review' || normStatus === 'under_review_vendor' || normStatus === 'submitted' || normStatus === 'technical_review_started' || normStatus === 'commercial_review_started' || normStatus === 'technical_review' || normStatus === 'technical_proposal_resubmits' || normStatus === 'technical_correction_resubmitted' || normStatus === 'receiving pending') {
    bgClass = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400";
    displayLabel = (normStatus === 'under_review' || normStatus === 'under_review_vendor' || normStatus === 'commercial_review_started') ? 'Under Review' : normStatus === 'submitted' ? 'Submitted' : normStatus === 'technical_review_started' ? 'Technical Review Started' : normStatus === 'technical_review' ? 'Technical Review' : normStatus === 'technical_proposal_resubmits' ? 'Technical Proposal Resubmits' : normStatus === 'technical_correction_resubmitted' ? 'Technical Correction Resubmitted' : normStatus === 'receiving pending' ? 'Receiving Pending' : 'Pending';
  } else if (normStatus === 'rejected' || normStatus === 'not verified' || normStatus === 'not_verified' || normStatus === 'suspended' || normStatus === 'blacklisted' || normStatus === 'expired' || normStatus === 'inactive' || normStatus === 'cancelled' || normStatus.includes('rejected')) {
    bgClass = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400";
    displayLabel = normStatus === 'suspended' ? 'Suspended' : normStatus === 'blacklisted' ? 'Blacklisted' : normStatus === 'expired' ? 'Expired' : normStatus === 'inactive' ? 'Inactive' : normStatus === 'cancelled' ? 'Cancelled' : normStatus.includes('technical') ? 'Technical Rejected' : normStatus.includes('commercial') ? 'Commercial Rejected' : normStatus === 'rejected' ? 'Rejected' : 'Not Verified';
  } else if (normStatus.includes('correction_requested') || normStatus === 'correction_required' || normStatus === 'correction') {
    bgClass = "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400";
    displayLabel = normStatus.includes('technical') ? 'Technical Correction Requested' : normStatus.includes('commercial') ? 'Commercial Correction Requested' : 'Correction Required';
  } else if (normStatus === 'draft' || normStatus === 'closed') {
    bgClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400";
    displayLabel = normStatus === 'closed' ? 'Closed' : 'Draft';
  } else if (normStatus === 'published' || normStatus === 'open') {
    bgClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400";
    displayLabel = 'Open';
  } else if (normStatus === 'selected' || normStatus.includes('completed')) {
    bgClass = "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400";
    displayLabel = normStatus === 'selected' ? 'Selected' : normStatus === 'approved' ? 'Approved' : normStatus.includes('technical') ? 'Technical Completed' : 'Commercial Review Completed';
  } else {
    // Fallback: Format text elegantly
    displayLabel = status
      .split(/_|\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide w-fit whitespace-nowrap shadow-2xs select-none",
        bgClass,
        className
      )}
    >
      {t(displayLabel)}
    </span>
  );
}
