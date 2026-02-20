import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { useCustomers } from '@/hooks/useQueries';
import LoadingState from '@/components/LoadingState';
import { TableSkeleton } from '@/components/SkeletonLoader';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: customers, isLoading } = useCustomers();

  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  ) || [];

  if (isLoading) {
    return (
      <div className="container py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 pb-20 md:pb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Link key={customer.id} to="/customers/$customerId" params={{ customerId: customer.id }}>
            <Card className="p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
                <Badge>{customer.stage}</Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">System:</span> {customer.systemType} • {customer.kwSize} kW
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Company:</span> {customer.panelCompany}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  );
}
