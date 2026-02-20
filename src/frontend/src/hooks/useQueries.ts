import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FilterState } from '@/components/DashboardFilters';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  customerName: string;
  isOverdue: boolean;
  daysOverdue?: number;
  stage?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  systemType: string;
  kwSize: number;
  panelCompany: string;
  stage: string;
  notes?: string;
  tasks: Task[];
  documents: Document[];
  timeline: TimelineEvent[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

interface TimelineEvent {
  action: string;
  timestamp: Date;
}

interface DashboardStats {
  totalCustomers: number;
  completedInstallations: number;
  pendingKSEB: number;
  pendingMNRE: number;
  totalKw: number;
}

interface DashboardData {
  stats: DashboardStats;
  todayTasks: Task[];
  overdueTasks: Task[];
  highPriorityTasks: Task[];
}

// Mock data for demonstration since backend is not implemented
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    address: 'Kochi, Kerala',
    systemType: 'DCR',
    kwSize: 5.5,
    panelCompany: 'Tata Power Solar',
    stage: 'Installation Completed',
    notes: 'Customer prefers morning installation',
    tasks: [
      {
        id: 't1',
        title: 'Complete KSEB Registration',
        description: 'Submit registration documents',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        customerName: 'Rajesh Kumar',
        isOverdue: false,
        stage: 'KSEB Registration',
      },
    ],
    documents: [
      {
        id: 'd1',
        name: 'Installation Certificate.pdf',
        type: 'application/pdf',
        size: 2048000,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        url: '#',
      },
    ],
    timeline: [
      {
        action: 'Installation completed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        action: 'Product arrived',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '2',
    name: 'Priya Menon',
    phone: '+91 98765 43211',
    email: 'priya@example.com',
    address: 'Trivandrum, Kerala',
    systemType: 'Non-DCR',
    kwSize: 3.0,
    panelCompany: 'Adani Solar',
    stage: 'Feasibility',
    notes: '',
    tasks: [],
    documents: [],
    timeline: [
      {
        action: 'Feasibility study started',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Complete KSEB Registration',
    description: 'Submit registration documents for Rajesh Kumar',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    customerName: 'Rajesh Kumar',
    isOverdue: false,
    stage: 'KSEB Registration',
  },
  {
    id: 't2',
    title: 'Schedule site visit',
    description: 'Visit Priya Menon site for feasibility',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    customerName: 'Priya Menon',
    isOverdue: true,
    daysOverdue: 1,
    stage: 'Feasibility',
  },
];

export function useDashboardData(filters: FilterState) {
  const { actor, isFetching } = useActor();

  return useQuery<DashboardData>({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      // Mock implementation
      return {
        stats: {
          totalCustomers: 2,
          completedInstallations: 1,
          pendingKSEB: 1,
          pendingMNRE: 0,
          totalKw: 8.5,
        },
        todayTasks: [],
        overdueTasks: [mockTasks[1]],
        highPriorityTasks: [mockTasks[0]],
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      return mockCustomers;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomer(customerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer | undefined>({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      return mockCustomers.find((c) => c.id === customerId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTasks(sortBy: 'deadline' | 'priority') {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks', sortBy],
    queryFn: async () => {
      const sorted = [...mockTasks].sort((a, b) => {
        if (sortBy === 'deadline') {
          return a.deadline.getTime() - b.deadline.getTime();
        }
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      return sorted;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReports() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      return {
        totalCustomers: 2,
        completedInstallations: 1,
        pendingKSEB: 1,
        pendingMNRE: 0,
        totalKw: 8.5,
        avgSystemSize: 4.25,
      };
    },
    enabled: !!actor && !isFetching,
  });
}
