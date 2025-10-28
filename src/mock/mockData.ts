export interface Project {
  id: string;
  name: string;
  incomingUrl: string;
  forwarderUrl: string;
  status: 'active' | 'inactive' | 'error';
  lastRequest: string;
  totalRequests: number;
  createdAt: string;
  config: {
    retries: boolean;
    maxRetries: number;
    retryDelay: number;
    rateLimit: boolean;
    maxRPM: number;
    logRetention: string;
    authentication: {
      enabled: boolean;
      headerName: string;
      secretValue: string;
    };
  };
}

export interface Request {
  id: string;
  projectId: string;
  timestamp: string;
  method: string;
  path: string;
  incomingStatus: number;
  outgoingStatus: number;
  duration: number;
  event: string;
  incomingHeaders: Record<string, string>;
  incomingBody: any;
  outgoingHeaders: Record<string, string>;
  outgoingBody: any;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: any;
}

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Production Webhooks',
    incomingUrl: 'https://webhook.forward.app/wh/abc123def456',
    forwarderUrl: 'https://api.myapp.com/webhooks',
    status: 'active',
    lastRequest: '2 minutes ago',
    totalRequests: 15847,
    createdAt: '2024-01-15T10:30:00Z',
    config: {
      retries: true,
      maxRetries: 3,
      retryDelay: 5000,
      rateLimit: true,
      maxRPM: 100,
      logRetention: '30d',
      authentication: {
        enabled: true,
        headerName: 'X-Webhook-Secret',
        secretValue: 'sk_prod_abc123',
      },
    },
  },
  {
    id: 'proj_2',
    name: 'GitHub Integration',
    incomingUrl: 'https://webhook.forward.app/wh/gh789xyz012',
    forwarderUrl: 'https://api.myapp.com/integrations/github',
    status: 'active',
    lastRequest: '15 minutes ago',
    totalRequests: 8234,
    createdAt: '2024-02-20T14:22:00Z',
    config: {
      retries: true,
      maxRetries: 2,
      retryDelay: 3000,
      rateLimit: false,
      maxRPM: 60,
      logRetention: '7d',
      authentication: {
        enabled: false,
        headerName: '',
        secretValue: '',
      },
    },
  },
  {
    id: 'proj_3',
    name: 'Stripe Payments',
    incomingUrl: 'https://webhook.forward.app/wh/stripe345abc',
    forwarderUrl: 'https://payments.myapp.com/stripe',
    status: 'error',
    lastRequest: '3 hours ago',
    totalRequests: 3421,
    createdAt: '2024-03-10T09:15:00Z',
    config: {
      retries: true,
      maxRetries: 5,
      retryDelay: 10000,
      rateLimit: true,
      maxRPM: 50,
      logRetention: '30d',
      authentication: {
        enabled: true,
        headerName: 'Authorization',
        secretValue: 'Bearer sk_live_xyz',
      },
    },
  },
  {
    id: 'proj_4',
    name: 'Slack Notifications',
    incomingUrl: 'https://webhook.forward.app/wh/slack678def',
    forwarderUrl: 'https://hooks.slack.com/services/T00/B00/XXX',
    status: 'inactive',
    lastRequest: '2 days ago',
    totalRequests: 456,
    createdAt: '2024-04-05T16:45:00Z',
    config: {
      retries: false,
      maxRetries: 0,
      retryDelay: 0,
      rateLimit: false,
      maxRPM: 30,
      logRetention: '7d',
      authentication: {
        enabled: false,
        headerName: '',
        secretValue: '',
      },
    },
  },
];

export const mockRequests: Request[] = [
  {
    id: 'req_1',
    projectId: 'proj_1',
    timestamp: '2025-10-26T10:28:00Z',
    method: 'POST',
    path: '/user/created',
    incomingStatus: 200,
    outgoingStatus: 200,
    duration: 145,
    event: 'user.created',
    incomingHeaders: {
      'content-type': 'application/json',
      'user-agent': 'WebhookService/1.0',
      'x-webhook-id': 'wh_abc123',
    },
    incomingBody: {
      event: 'user.created',
      user: {
        id: 'usr_123456',
        email: 'john@example.com',
        name: 'John Doe',
        created_at: '2025-10-26T10:28:00Z',
      },
    },
    outgoingHeaders: {
      'content-type': 'application/json',
      'x-webhook-secret': 'sk_prod_abc123',
    },
    outgoingBody: {
      event: 'user.created',
      user: {
        id: 'usr_123456',
        email: 'john@example.com',
        name: 'John Doe',
        created_at: '2025-10-26T10:28:00Z',
      },
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json',
    },
    responseBody: {
      success: true,
      message: 'Webhook processed successfully',
    },
  },
  {
    id: 'req_2',
    projectId: 'proj_1',
    timestamp: '2025-10-26T10:15:00Z',
    method: 'POST',
    path: '/payment/succeeded',
    incomingStatus: 200,
    outgoingStatus: 200,
    duration: 234,
    event: 'payment.succeeded',
    incomingHeaders: {
      'content-type': 'application/json',
      'user-agent': 'WebhookService/1.0',
    },
    incomingBody: {
      event: 'payment.succeeded',
      payment: {
        id: 'pay_789',
        amount: 4999,
        currency: 'usd',
      },
    },
    outgoingHeaders: {
      'content-type': 'application/json',
      'x-webhook-secret': 'sk_prod_abc123',
    },
    outgoingBody: {
      event: 'payment.succeeded',
      payment: {
        id: 'pay_789',
        amount: 4999,
        currency: 'usd',
      },
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json',
    },
    responseBody: {
      success: true,
    },
  },
  {
    id: 'req_3',
    projectId: 'proj_2',
    timestamp: '2025-10-26T10:13:00Z',
    method: 'POST',
    path: '/push',
    incomingStatus: 200,
    outgoingStatus: 500,
    duration: 5234,
    event: 'push',
    incomingHeaders: {
      'content-type': 'application/json',
      'x-github-event': 'push',
    },
    incomingBody: {
      ref: 'refs/heads/main',
      commits: [
        {
          id: 'abc123',
          message: 'Fix bug in authentication',
          author: 'developer@example.com',
        },
      ],
    },
    outgoingHeaders: {
      'content-type': 'application/json',
    },
    outgoingBody: {
      ref: 'refs/heads/main',
      commits: [
        {
          id: 'abc123',
          message: 'Fix bug in authentication',
          author: 'developer@example.com',
        },
      ],
    },
    responseStatus: 500,
    responseHeaders: {
      'content-type': 'application/json',
    },
    responseBody: {
      error: 'Internal server error',
    },
  },
  {
    id: 'req_4',
    projectId: 'proj_3',
    timestamp: '2025-10-26T07:22:00Z',
    method: 'POST',
    path: '/charge/succeeded',
    incomingStatus: 200,
    outgoingStatus: 404,
    duration: 1234,
    event: 'charge.succeeded',
    incomingHeaders: {
      'content-type': 'application/json',
      'stripe-signature': 'sig_abc123',
    },
    incomingBody: {
      id: 'evt_123',
      type: 'charge.succeeded',
      data: {
        object: {
          id: 'ch_123',
          amount: 10000,
        },
      },
    },
    outgoingHeaders: {
      'content-type': 'application/json',
      'authorization': 'Bearer sk_live_xyz',
    },
    outgoingBody: {
      id: 'evt_123',
      type: 'charge.succeeded',
      data: {
        object: {
          id: 'ch_123',
          amount: 10000,
        },
      },
    },
    responseStatus: 404,
    responseHeaders: {
      'content-type': 'text/plain',
    },
    responseBody: 'Not Found',
  },
];

export const dashboardStats = {
  totalRequests: 28958,
  requestsLast24h: 1247,
  successRate: 96.8,
  avgDuration: 287,
  activeProjects: 3,
  projectsWithErrors: 1,
};

export const requestsOverTime = [
  { time: '00:00', requests: 45 },
  { time: '04:00', requests: 23 },
  { time: '08:00', requests: 89 },
  { time: '12:00', requests: 156 },
  { time: '16:00', requests: 134 },
  { time: '20:00', requests: 98 },
];

export const statusCodeDistribution = [
  { name: '2xx', value: 1200, color: '#10b981' },
  { name: '4xx', value: 234, color: '#f59e0b' },
  { name: '404', value: 156, color: '#f97316' },
  { name: '500', value: 534, color: '#ef4444' },
];
