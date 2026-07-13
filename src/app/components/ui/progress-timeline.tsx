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
    <div className={cn("w-full py-2 select-none", className)}>
      <div className="flex items-start justify-between relative px-2">
        
        {/* Unified Mathematical Track Container */}
        <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-gray-200 rounded-full z-0 pointer-events-none">
          {/* Glowing Dynamic completed progress fill bar */}
          <div 
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: 'var(--prime-primary-green)',
              width: `${currentStageIndex >= 0 ? (currentStageIndex / (stages.length - 1)) * 100 : 0}%`,
              boxShadow: '0 0 10px rgba(124, 148, 64, 0.4)'
            }}
          />
        </div>

        {/* Milestones nodes */}
        {stages.map((stage, idx) => {
          const isCompleted = completedStageKeys.includes(stage.key) || idx < currentStageIndex;
          const isActive = stage.key === currentStageKey && !isCompleted;
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
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 relative shadow-sm",
                  isCompleted && "border-[var(--prime-primary-green)] bg-[var(--prime-primary-green)] text-white shadow-md shadow-[var(--prime-primary-green)]/20",
                  isActive && "border-[var(--prime-accent-gold)] ring-4 ring-[var(--prime-accent-gold)]/20 text-[var(--prime-accent-gold)] font-bold scale-110 shadow-md shadow-[var(--prime-accent-gold)]/15",
                  !isCompleted && !isActive && "border-gray-200 text-gray-400 group-hover:border-gray-300"
                )}
              >
                {/* Active ripple glow animation */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-[var(--prime-accent-gold)]/10 animate-ping opacity-75 pointer-events-none" style={{ animationDuration: '2s' }} />
                )}

                {/* Content: Check icon for complete, stage icon or step number otherwise */}
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : Icon ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Labels block */}
              <div className="text-center mt-3 px-1">
                <p 
                  className={cn(
                    "text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors duration-200",
                    isActive && "text-[var(--prime-accent-gold)]",
                    isCompleted && "text-[var(--prime-primary-green)]",
                    !isCompleted && !isActive && "text-gray-500 group-hover:text-gray-700"
                  )}
                >
                  {stage.label}
                </p>
                {stage.description && (
                  <p className="text-[10px] text-gray-400 font-semibold mt-1 line-clamp-2 leading-relaxed">
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
