import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterState } from './DashboardFilters';

interface ActiveFilterBadgesProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

export default function ActiveFilterBadges({ filters, onRemoveFilter }: ActiveFilterBadgesProps) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== undefined);

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (key: string, value: any) => {
    if (key === 'minKw' || key === 'maxKw') {
      const minKw = filters.minKw || 0;
      const maxKw = filters.maxKw || 20;
      return `${minKw}-${maxKw} kW`;
    }
    return value;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(([key, value]) => {
        if (key === 'maxKw') return null; // Skip maxKw as it's combined with minKw
        return (
          <Badge key={key} variant="secondary" className="gap-1 pr-1">
            {getFilterLabel(key, value)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onRemoveFilter(key as keyof FilterState)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
