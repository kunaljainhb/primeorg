import React from 'react';
import { FileQuestion, FolderOpen, Send, UserX, Inbox } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';

export type EmptyStateType = 'rfp' | 'vendor' | 'proposal' | 'document' | 'general';

interface EmptyStateProps {
  type?: EmptyStateType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type = 'general',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  
  // Icon selector
  const getIcon = () => {
    switch (type) {
      case 'rfp':
        return <FileQuestion className="h-12 w-12 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />;
      case 'vendor':
        return <UserX className="h-12 w-12 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />;
      case 'proposal':
        return <Send className="h-12 w-12 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />;
      case 'document':
        return <FolderOpen className="h-12 w-12 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />;
      default:
        return <Inbox className="h-12 w-12 text-[var(--fnrc-primary-green)]" strokeWidth={1.5} />;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-card bg-white border border-gray-100/50 shadow-card w-full max-w-2xl mx-auto my-6 animate-fade-in transition-all duration-200",
        className
      )}
    >
      {/* Decorative Icon Background */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--fnrc-primary-green)]/5 mb-6 relative shadow-inner">
        <div className="absolute inset-0 rounded-full bg-[var(--fnrc-primary-green)]/3 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
        {getIcon()}
      </div>

      <h3 className="text-xl font-semibold mb-2 text-gray-800 tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="text-white px-6 font-medium shadow-md transition-all duration-150 rounded-button bg-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/90 hover:shadow-lg active:scale-98"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
