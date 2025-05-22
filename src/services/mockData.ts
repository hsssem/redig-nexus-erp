
// Customer Data Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  address: string;
  createdAt: string;
  notes?: string;
}

// Task Data Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  project?: string;
  createdAt: string;
}

// Meeting Data Types
export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  description?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

// Invoice Data Types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

// Project Data Types
export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget?: number;
  progress: number;
  manager: string;
  team: string[];
}

// Team Member Data Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

// Mock data - Customers
export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 555-123-4567',
    company: 'TechCorp Inc.',
    status: 'active',
    address: '123 Main St, San Francisco, CA 94105',
    createdAt: '2023-01-15',
    notes: 'Key enterprise client'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@innovate.co',
    phone: '+1 555-987-6543',
    company: 'Innovate Co',
    status: 'active',
    address: '456 Market St, New York, NY 10001',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@dataflow.com',
    phone: '+1 555-567-8901',
    company: 'DataFlow Systems',
    status: 'inactive',
    address: '789 Park Ave, Chicago, IL 60601',
    createdAt: '2023-03-10',
    notes: 'Reactivate in Q3'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@webworks.net',
    phone: '+1 555-234-5678',
    company: 'WebWorks',
    status: 'active',
    address: '321 Oak St, Seattle, WA 98101',
    createdAt: '2023-04-05'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@globaltech.com',
    phone: '+1 555-345-6789',
    company: 'Global Technologies',
    status: 'active',
    address: '555 Pine St, Austin, TX 78701',
    createdAt: '2023-05-12',
    notes: 'Potential for expansion'
  }
];

// Mock data - Tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q2 Reports',
    description: 'Complete quarterly financial reports for all clients',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-30',
    assignedTo: 'Alice Cooper',
    project: 'Financial Reporting',
    createdAt: '2023-06-01'
  },
  {
    id: '2',
    title: 'Client Onboarding: TechCorp',
    description: 'Complete onboarding process for new client TechCorp',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-07-15',
    assignedTo: 'Bob Thompson',
    project: 'Client Onboarding',
    createdAt: '2023-06-10'
  },
  {
    id: '3',
    title: 'Website Redesign',
    description: 'Update company website with new branding elements',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-07-20',
    assignedTo: 'Charlie Martinez',
    project: 'Marketing',
    createdAt: '2023-06-05'
  },
  {
    id: '4',
    title: 'Staff Training Session',
    description: 'Organize training session on new ERP features',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-08-01',
    assignedTo: 'Dana Johnson',
    createdAt: '2023-06-15'
  },
  {
    id: '5',
    title: 'Server Maintenance',
    description: 'Scheduled maintenance for main database server',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-06-25',
    assignedTo: 'Evan Williams',
    project: 'IT Infrastructure',
    createdAt: '2023-06-20'
  }
];

// Mock data - Meetings
export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Q2 Review with TechCorp',
    date: '2023-07-05',
    startTime: '10:00',
    endTime: '11:30',
    attendees: ['John Smith', 'Alice Cooper', 'Bob Thompson'],
    description: 'Review Q2 performance and discuss Q3 goals',
    location: 'Conference Room A',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'New Product Planning',
    date: '2023-07-10',
    startTime: '14:00',
    endTime: '16:00',
    attendees: ['Charlie Martinez', 'Dana Johnson', 'Evan Williams'],
    description: 'Brainstorming session for new product features',
    location: 'Meeting Room 2',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'HR Policy Update',
    date: '2023-06-28',
    startTime: '11:00',
    endTime: '12:00',
    attendees: ['Dana Johnson', 'Frank Miller', 'Grace Lee'],
    status: 'completed'
  },
  {
    id: '4',
    title: 'Client Demo: WebWorks',
    date: '2023-07-15',
    startTime: '13:00',
    endTime: '14:30',
    attendees: ['Emily Davis', 'Charlie Martinez', 'Alice Cooper'],
    description: 'Demo of new features for WebWorks team',
    location: 'Virtual (Zoom)',
    status: 'scheduled'
  },
  {
    id: '5',
    title: 'Budget Planning FY24',
    date: '2023-08-01',
    startTime: '09:00',
    endTime: '12:00',
    attendees: ['Alice Cooper', 'Bob Thompson', 'Dana Johnson'],
    description: 'Annual budget planning session',
    location: 'Conference Room B',
    status: 'scheduled'
  }
];

// Mock data - Invoices
export const invoices: Invoice[] = [
  {
    id: 'INV-2023-001',
    customer: 'TechCorp Inc.',
    date: '2023-06-01',
    dueDate: '2023-07-01',
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Consulting Services - May',
        quantity: 40,
        unitPrice: 150,
        total: 6000
      },
      {
        id: '2',
        description: 'Software License',
        quantity: 1,
        unitPrice: 2000,
        total: 2000
      }
    ],
    subtotal: 8000,
    tax: 800,
    total: 8800,
    notes: 'Net 30 terms'
  },
  {
    id: 'INV-2023-002',
    customer: 'Innovate Co',
    date: '2023-05-15',
    dueDate: '2023-06-15',
    status: 'paid',
    items: [
      {
        id: '1',
        description: 'Web Development',
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      }
    ],
    subtotal: 5000,
    tax: 500,
    total: 5500
  },
  {
    id: 'INV-2023-003',
    customer: 'DataFlow Systems',
    date: '2023-06-10',
    dueDate: '2023-07-10',
    status: 'draft',
    items: [
      {
        id: '1',
        description: 'Data Migration Services',
        quantity: 1,
        unitPrice: 3500,
        total: 3500
      },
      {
        id: '2',
        description: 'Training Session',
        quantity: 2,
        unitPrice: 750,
        total: 1500
      }
    ],
    subtotal: 5000,
    tax: 500,
    total: 5500
  },
  {
    id: 'INV-2023-004',
    customer: 'WebWorks',
    date: '2023-05-01',
    dueDate: '2023-06-01',
    status: 'overdue',
    items: [
      {
        id: '1',
        description: 'Server Maintenance',
        quantity: 10,
        unitPrice: 200,
        total: 2000
      }
    ],
    subtotal: 2000,
    tax: 200,
    total: 2200
  },
  {
    id: 'INV-2023-005',
    customer: 'Global Technologies',
    date: '2023-06-20',
    dueDate: '2023-07-20',
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Consulting Services',
        quantity: 20,
        unitPrice: 150,
        total: 3000
      },
      {
        id: '2',
        description: 'Equipment',
        quantity: 5,
        unitPrice: 500,
        total: 2500
      }
    ],
    subtotal: 5500,
    tax: 550,
    total: 6050
  }
];

// Mock data - Projects
export const projects: Project[] = [
  {
    id: '1',
    name: 'TechCorp Website Redesign',
    description: 'Complete overhaul of company website with new branding',
    client: 'TechCorp Inc.',
    status: 'active',
    startDate: '2023-05-01',
    endDate: '2023-08-31',
    budget: 25000,
    progress: 60,
    manager: 'Charlie Martinez',
    team: ['Alice Cooper', 'Bob Thompson', 'Dana Johnson']
  },
  {
    id: '2',
    name: 'Innovate Co App Development',
    description: 'Mobile application development for client management',
    client: 'Innovate Co',
    status: 'active',
    startDate: '2023-04-15',
    budget: 50000,
    progress: 35,
    manager: 'Bob Thompson',
    team: ['Evan Williams', 'Frank Miller', 'Grace Lee']
  },
  {
    id: '3',
    name: 'DataFlow Systems Integration',
    description: 'Integration of new data processing systems',
    client: 'DataFlow Systems',
    status: 'on-hold',
    startDate: '2023-03-01',
    endDate: '2023-09-30',
    budget: 75000,
    progress: 25,
    manager: 'Alice Cooper',
    team: ['Charlie Martinez', 'Dana Johnson', 'Evan Williams']
  },
  {
    id: '4',
    name: 'WebWorks Infrastructure Update',
    description: 'Server upgrades and cloud migration',
    client: 'WebWorks',
    status: 'completed',
    startDate: '2023-01-15',
    endDate: '2023-04-30',
    budget: 30000,
    progress: 100,
    manager: 'Evan Williams',
    team: ['Frank Miller', 'Grace Lee']
  },
  {
    id: '5',
    name: 'Global Technologies Training Program',
    description: 'Development of employee training materials',
    client: 'Global Technologies',
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2023-10-31',
    budget: 15000,
    progress: 10,
    manager: 'Dana Johnson',
    team: ['Alice Cooper', 'Grace Lee']
  }
];

// Mock data - Team Members
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Cooper',
    role: 'Senior Project Manager',
    email: 'alice@redigerp.com',
    phone: '+1 555-111-2222',
    department: 'Project Management',
    joiningDate: '2020-03-15',
    status: 'active',
    avatar: '/avatar_female_1.png'
  },
  {
    id: '2',
    name: 'Bob Thompson',
    role: 'Lead Developer',
    email: 'bob@redigerp.com',
    phone: '+1 555-333-4444',
    department: 'Development',
    joiningDate: '2020-05-10',
    status: 'active',
    avatar: '/avatar_male_1.png'
  },
  {
    id: '3',
    name: 'Charlie Martinez',
    role: 'UI/UX Designer',
    email: 'charlie@redigerp.com',
    phone: '+1 555-555-6666',
    department: 'Design',
    joiningDate: '2021-01-20',
    status: 'active',
    avatar: '/avatar_male_2.png'
  },
  {
    id: '4',
    name: 'Dana Johnson',
    role: 'HR Manager',
    email: 'dana@redigerp.com',
    phone: '+1 555-777-8888',
    department: 'Human Resources',
    joiningDate: '2019-11-05',
    status: 'on-leave',
    avatar: '/avatar_female_2.png'
  },
  {
    id: '5',
    name: 'Evan Williams',
    role: 'System Administrator',
    email: 'evan@redigerp.com',
    phone: '+1 555-999-0000',
    department: 'IT',
    joiningDate: '2022-02-28',
    status: 'active',
    avatar: '/avatar_male_3.png'
  },
  {
    id: '6',
    name: 'Frank Miller',
    role: 'Sales Manager',
    email: 'frank@redigerp.com',
    phone: '+1 555-123-3456',
    department: 'Sales',
    joiningDate: '2021-07-12',
    status: 'active',
    avatar: '/avatar_male_4.png'
  },
  {
    id: '7',
    name: 'Grace Lee',
    role: 'Financial Analyst',
    email: 'grace@redigerp.com',
    phone: '+1 555-789-1234',
    department: 'Finance',
    joiningDate: '2022-01-10',
    status: 'inactive',
    avatar: '/avatar_female_3.png'
  }
];

// Dashboard statistics
export const statistics = {
  totalCustomers: customers.length,
  activeCustomers: customers.filter(c => c.status === 'active').length,
  totalProjects: projects.length,
  activeProjects: projects.filter(p => p.status === 'active').length,
  totalInvoices: invoices.length,
  invoiceValue: invoices.reduce((acc, inv) => acc + inv.total, 0),
  pendingTasks: tasks.filter(t => t.status !== 'completed').length,
  teamMembers: teamMembers.length,
  recentActivity: [
    { id: '1', type: 'invoice', action: 'created', entity: 'INV-2023-005', user: 'Alice Cooper', timestamp: '2023-06-20 09:15' },
    { id: '2', type: 'customer', action: 'added', entity: 'Global Technologies', user: 'Bob Thompson', timestamp: '2023-06-19 11:30' },
    { id: '3', type: 'project', action: 'updated', entity: 'TechCorp Website Redesign', user: 'Charlie Martinez', timestamp: '2023-06-18 14:45' },
    { id: '4', type: 'task', action: 'completed', entity: 'Server Maintenance', user: 'Evan Williams', timestamp: '2023-06-17 16:20' },
    { id: '5', type: 'meeting', action: 'scheduled', entity: 'Budget Planning FY24', user: 'Dana Johnson', timestamp: '2023-06-16 10:00' }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 16000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 20000 },
    { month: 'Jul', revenue: 0 },
    { month: 'Aug', revenue: 0 },
    { month: 'Sep', revenue: 0 },
    { month: 'Oct', revenue: 0 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dec', revenue: 0 }
  ],
  projectStatus: [
    { status: 'Active', count: projects.filter(p => p.status === 'active').length },
    { status: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { status: 'On Hold', count: projects.filter(p => p.status === 'on-hold').length }
  ]
};
