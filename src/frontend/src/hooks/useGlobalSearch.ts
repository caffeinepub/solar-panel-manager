import { useState, useEffect } from 'react';
import { useCustomers } from './useQueries';

export function useGlobalSearch(query: string) {
  const { data: customers } = useCustomers();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();

    const results = customers?.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.phone.includes(query) ||
        customer.panelCompany.toLowerCase().includes(lowerQuery) ||
        customer.kwSize.toString().includes(query)
    ) || [];

    setSearchResults(results);
    setIsSearching(false);
  }, [query, customers]);

  return { searchResults, isSearching };
}
