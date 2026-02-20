import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  panelCompany?: string;
  minKw?: number;
  maxKw?: number;
  projectStage?: string;
}

const PROJECT_STAGES = [
  'Files Uploaded',
  'Bank',
  'Loan Passed',
  'Feasibility',
  'Product Arrived',
  'Installation Completed',
  'KSEB Registration',
  'MNRE Form',
];

const PANEL_COMPANIES = ['Tata Power Solar', 'Adani Solar', 'Vikram Solar', 'Waaree', 'Luminous'];

export default function DashboardFilters({ onFilterChange, activeFilters }: DashboardFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters);
  const [kwRange, setKwRange] = useState<number[]>([localFilters.minKw || 0, localFilters.maxKw || 20]);

  const handleApplyFilters = () => {
    onFilterChange({
      ...localFilters,
      minKw: kwRange[0],
      maxKw: kwRange[1],
    });
  };

  const handleResetFilters = () => {
    const emptyFilters: FilterState = {};
    setLocalFilters(emptyFilters);
    setKwRange([0, 20]);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    (key) => activeFilters[key as keyof FilterState] !== undefined
  ).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Projects</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Panel Company</Label>
            <Select
              value={localFilters.panelCompany}
              onValueChange={(value) => setLocalFilters({ ...localFilters, panelCompany: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {PANEL_COMPANIES.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>System Size (kW)</Label>
            <div className="pt-2">
              <Slider
                value={kwRange}
                onValueChange={setKwRange}
                max={20}
                step={0.5}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{kwRange[0]} kW</span>
                <span>{kwRange[1]} kW</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project Stage</Label>
            <Select
              value={localFilters.projectStage}
              onValueChange={(value) => setLocalFilters({ ...localFilters, projectStage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {PROJECT_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleResetFilters} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
