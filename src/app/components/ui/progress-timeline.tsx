import React from 'react';
import { Check } from 'lucide-react';
import { cn } from './utils';

export interface TimelineStage {
  key: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

interface ProgressTimelineProps {
  stages: TimelineStage[];
  currentStageKey: string;
  completedStageKeys?: string[];
  className?: string;
  onStageClick?: (stageKey: string) => void;
}

export function ProgressTimeline({
  stages,
  currentStageKey,
  completedStageKeys = [],
  className,
  onStageClick,
}: ProgressTimelineProps) {
  
  // Find current stage index
  const currentStageIndex = stages.findIndex(s => s.key === currentStageKey);

  return (
    <div className={cn("w-full py-6 px-2 overflow-x-auto select-none", className)}>
      <div className="min-w-[600px] flex items-center justify-between relative py-4">
        
        {/* Unified Mathematical Track Container (aligned exactly to circle centers) */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-gray-150 rounded-full z-0 pointer-events-none">
          {/* Glowing Dynamic completed progress fill bar */}
          <div 
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: 'var(--fnrc-primary-green)',
              width: `${currentStageIndex >= 0 ? (currentStageIndex / (stages.length - 1)) * 100 : 0}%`,
              boxShadow: '0 0 10px rgba(124, 148, 64, 0.4)'
            }}
          />
        </div>

        {/* Milestones nodes */}
        {stages.map((stage, idx) => {
          const isCompleted = completedStageKeys.includes(stage.key) || idx < currentStageIndex;
          const isActive = stage.key === currentStageKey;
          const Icon = stage.icon;

          return (
            <div 
              key={stage.key} 
              className={cn(
                "flex flex-col items-center relative z-10 flex-1 transition-all duration-200",
                onStageClick && "cursor-pointer group hover:-translate-y-0.5"
              )}
              onClick={() => onStageClick && onStageClick(stage.key)}
            >
              {/* Outer Ring Circle */}
              <div 
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 relative shadow-md",
                  isCompleted && "border-[var(--fnrc-primary-green)] bg-[var(--fnrc-primary-green)] text-white shadow-lg shadow-[var(--fnrc-primary-green)]/20",
                  isActive && "border-[var(--fnrc-accent-gold)] ring-4 ring-[var(--fnrc-accent-gold)]/20 text-[var(--fnrc-accent-gold)] font-bold scale-110 shadow-lg shadow-[var(--fnrc-accent-gold)]/15",
                  !isCompleted && !isActive && "border-gray-200 text-gray-400 group-hover:border-gray-300"
                )}
              >
                {/* Active ripple glow animation */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-[var(--fnrc-accent-gold)]/10 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '2s' }} />
                )}

                {/* Content: Check icon for complete, stage icon or step number otherwise */}
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[3]" />
                ) : Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Labels block */}
              <div className="text-center mt-4 max-w-[130px] px-1">
                <p 
                  className={cn(
                    "text-xs font-black uppercase tracking-wider transition-colors duration-200",
                    isActive && "text-[var(--fnrc-accent-gold)]",
                    isCompleted && "text-[var(--fnrc-primary-green)]",
                    !isCompleted && !isActive && "text-gray-500 group-hover:text-gray-700"
                  )}
                >
                  {stage.label}
                </p>
                {stage.description && (
                  <p className="text-[10px] text-gray-400 font-semibold mt-1.5 line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
