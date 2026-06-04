import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import { Badge } from './badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

export interface FilterDropdown {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
  selectedValues?: string[];
  isMulti?: boolean;
  onChange: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
}

export interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  filters?: FilterDropdown[];
  activeChips?: { label: string; onRemove: () => void }[];
  onClearAll?: () => void;
  className?: string;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
  filters = [],
  activeChips = [],
  onClearAll,
  className,
}: SearchFilterBarProps) {
  const hasActiveFilters = activeChips.length > 0 || searchQuery !== '';

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-input text-[15px] font-normal transition-all duration-150 outline-none focus:border-[var(--fnrc-primary-green)] focus:ring-[3px] focus:ring-[var(--fnrc-primary-green)]/15 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {filters.map((filter) => {
              const isFiltered = filter.isMulti 
                ? (filter.selectedValues && filter.selectedValues.length > 0)
                : (filter.selectedValue && filter.selectedValue !== 'all' && filter.selectedValue !== '');

              return (
                <DropdownMenu key={filter.key}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 px-4 rounded-input border border-gray-200 bg-white hover:bg-gray-50 text-[14px] font-medium transition-all gap-2 flex items-center shadow-xs",
                        isFiltered && "border-[var(--fnrc-primary-green)] bg-[var(--fnrc-primary-green)]/5 text-[var(--fnrc-primary-green)] hover:bg-[var(--fnrc-primary-green)]/10"
                      )}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>
                        {filter.label}: {
                          filter.isMulti
                            ? (!filter.selectedValues || filter.selectedValues.length === 0
                              ? 'All'
                              : filter.selectedValues.length === 1
                                ? filter.selectedValues[0]
                                : `${filter.selectedValues.length} Selected`)
                            : (filter.options.find(o => o.value === filter.selectedValue)?.label || 'All')
                        }
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] rounded-input p-1 border-gray-100 shadow-lg">
                    <DropdownMenuLabel className="text-xs text-gray-400 font-semibold px-2.5 py-1.5 uppercase tracking-wider">
                      Filter by {filter.label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    {filter.options.map((option) => {
                      if (filter.isMulti) {
                        const isChecked = option.value === 'all'
                          ? (!filter.selectedValues || filter.selectedValues.length === 0)
                          : (filter.selectedValues?.includes(option.value) || false);

                        return (
                          <div
                            key={option.value}
                            onClick={(e) => {
                              e.preventDefault(); // Don't close the dropdown
                              const currentSelected = filter.selectedValues || [];
                              let newSelected: string[];
                              if (option.value === 'all') {
                                newSelected = [];
                              } else {
                                if (currentSelected.includes(option.value)) {
                                  newSelected = currentSelected.filter(v => v !== option.value);
                                } else {
                                  newSelected = [...currentSelected, option.value];
                                }
                              }
                              if (filter.onMultiChange) {
                                filter.onMultiChange(newSelected);
                              }
                            }}
                            className={cn(
                              "cursor-pointer font-medium text-[14px] text-gray-700 hover:text-gray-900 focus:text-gray-900 rounded-md px-2.5 py-2 hover:bg-gray-50 focus:bg-gray-50 transition-colors flex items-center gap-2.5",
                              isChecked && "text-[var(--fnrc-primary-green)] bg-[var(--fnrc-primary-green)]/5 font-semibold"
                            )}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              readOnly 
                              className="rounded border-gray-300 text-[var(--fnrc-primary-green)] focus:ring-[var(--fnrc-primary-green)] h-4 w-4 cursor-pointer" 
                            />
                            <span className="cursor-pointer">{option.label}</span>
                          </div>
                        );
                      } else {
                        return (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => filter.onChange(option.value)}
                            className={cn(
                              "cursor-pointer font-medium text-[14px] text-gray-700 hover:text-gray-900 focus:text-gray-900 rounded-md px-2.5 py-2 hover:bg-gray-50 focus:bg-gray-50 transition-colors",
                              filter.selectedValue === option.value && "text-[var(--fnrc-primary-green)] bg-[var(--fnrc-primary-green)]/5 font-semibold hover:bg-[var(--fnrc-primary-green)]/8 focus:bg-[var(--fnrc-primary-green)]/8"
                            )}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        );
                      }
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}

            {hasActiveFilters && onClearAll && (
              <Button
                variant="ghost"
                onClick={onClearAll}
                className="h-12 px-4 text-red-600 hover:text-red-700 hover:bg-red-50/50 text-[14px] font-semibold transition-colors"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mt-1 animate-fade-in">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1">Active Filters:</span>
          {activeChips.map((chip, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="pl-3 pr-1.5 py-1 gap-1.5 rounded-full bg-[var(--fnrc-primary-green)]/5 border border-[var(--fnrc-primary-green)]/15 text-[var(--fnrc-primary-green)] font-medium text-xs shadow-xs"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="rounded-full p-0.5 hover:bg-[var(--fnrc-primary-green)]/10 text-[var(--fnrc-primary-green)] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
