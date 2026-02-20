import { useState } from 'react';
import { Plus, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import DashboardFilters, { FilterState } from '@/components/DashboardFilters';
import ActiveFilterBadges from '@/components/ActiveFilterBadges';
import { useDashboardData } from '@/hooks/useQueries';
import LoadingState from '@/components/LoadingState';
import { CardSkeleton } from '@/components/SkeletonLoader';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const { data, isLoading } = useDashboardData(filters);

  const handleRemoveFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    if (key === 'minKw') delete newFilters.maxKw;
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="container py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your solar projects</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <LoadingState message="Loading dashboard data..." />
      </div>
    );
  }

  const stats = data?.stats || {
    totalCustomers: 0,
    completedInstallations: 0,
    pendingKSEB: 0,
    pendingMNRE: 0,
    totalKw: 0,
  };

  const todayTasks = data?.todayTasks || [];
  const overdueTasks = data?.overdueTasks || [];
  const highPriorityTasks = data?.highPriorityTasks || [];

  return (
    <div className="container py-6 px-4 pb-20 md:pb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your solar projects</p>
        </div>
        <div className="flex gap-2">
          <DashboardFilters onFilterChange={setFilters} activeFilters={filters} />
          <Button asChild>
            <Link to="/customers">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      <ActiveFilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

      {/* Stats Grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Installations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedInstallations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KSEB</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingKSEB}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total kW Installed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKw} kW</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Overview */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Tasks ({todayTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due today</p>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.customerName}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Overdue Tasks ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue tasks</p>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 rounded-lg border border-destructive/50 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.customerName}</p>
                    </div>
                    <Badge variant="destructive">{task.daysOverdue}d</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* High Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              High Priority ({highPriorityTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highPriorityTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No high priority tasks</p>
            ) : (
              <div className="space-y-3">
                {highPriorityTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.customerName}</p>
                    </div>
                    <Badge>{task.stage}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
