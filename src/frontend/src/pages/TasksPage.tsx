import { useState } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/hooks/useQueries';
import LoadingState from '@/components/LoadingState';
import { ListSkeleton } from '@/components/SkeletonLoader';
import { formatDistanceToNow } from 'date-fns';

export default function TasksPage() {
  const [sortBy, setSortBy] = useState<'deadline' | 'priority'>('deadline');
  const { data: tasks, isLoading } = useTasks(sortBy);

  if (isLoading) {
    return (
      <div className="container py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <ListSkeleton items={8} />
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 pb-20 md:pb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">By Deadline</SelectItem>
              <SelectItem value="priority">By Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks?.map((task) => (
          <Card key={task.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  {task.isOverdue && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {formatDistanceToNow(task.deadline, { addSuffix: true })}
                      </span>
                      <span>•</span>
                      <span>{task.customerName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                  {task.priority}
                </Badge>
                {task.isOverdue && <Badge variant="destructive">Overdue</Badge>}
              </div>
            </div>
          </Card>
        ))}

        {tasks?.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
