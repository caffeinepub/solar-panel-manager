import { useState } from 'react';
import { FilterState } from '@/components/DashboardFilters';

export function useProjectFilters() {
  const [filters, setFilters] = useState<FilterState>({});

  const applyFilters = (data: any[], activeFilters: FilterState) => {
    return data.filter((item) => {
      if (activeFilters.panelCompany && activeFilters.panelCompany !== 'all') {
        if (item.panelCompany !== activeFilters.panelCompany) return false;
      }

      if (activeFilters.minKw !== undefined && activeFilters.maxKw !== undefined) {
        if (item.kwSize < activeFilters.minKw || item.kwSize > activeFilters.maxKw) return false;
      }

      if (activeFilters.projectStage && activeFilters.projectStage !== 'all') {
        if (item.stage !== activeFilters.projectStage) return false;
      }

      return true;
    });
  };

  const resetFilters = () => {
    setFilters({});
  };

  return { filters, setFilters, applyFilters, resetFilters };
}
