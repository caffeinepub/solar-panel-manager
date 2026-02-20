import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '@/hooks/useQueries';
import LoadingState from '@/components/LoadingState';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentList from '@/components/DocumentList';
import { formatDistanceToNow } from 'date-fns';

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/customers/$customerId' });
  const { data: customer, isLoading } = useCustomer(customerId);

  if (isLoading) {
    return <LoadingState message="Loading customer details..." />;
  }

  if (!customer) {
    return (
      <div className="container py-6 px-4">
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 pb-20 md:pb-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </span>
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </span>
              )}
              {customer.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {customer.address}
                </span>
              )}
            </div>
          </div>
          <Badge className="text-base">{customer.stage}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Solar System Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">System Type</span>
                    <span className="font-medium">{customer.systemType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">System Size</span>
                    <span className="font-medium">{customer.kwSize} kW</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Panel Company</span>
                    <span className="font-medium">{customer.panelCompany}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {customer.notes || 'No notes added yet'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {customer.tasks.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No tasks assigned</p>
                </Card>
              ) : (
                customer.tasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due {formatDistanceToNow(task.deadline, { addSuffix: true })}
                        </div>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentUploader
                customerId={customerId}
                onUploadComplete={() => {
                  // Refresh documents
                }}
              />
              <DocumentList
                documents={customer.documents}
                onDelete={(id) => {
                  // Handle delete
                }}
              />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              {customer.timeline.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No activity yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {customer.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {index < customer.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-border" />
                        )}
                      </div>
                      <Card className="flex-1 p-4">
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </p>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Add Task</Button>
              <Button variant="outline" className="w-full">
                Update Status
              </Button>
              <Button variant="outline" className="w-full">
                Add Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Files Uploaded',
                  'Bank',
                  'Loan Passed',
                  'Feasibility',
                  'Product Arrived',
                  'Installation Completed',
                  'KSEB Registration',
                  'MNRE Form',
                ].map((stage, index) => (
                  <div
                    key={stage}
                    className={`rounded-md p-2 text-sm ${
                      stage === customer.stage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stage}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
