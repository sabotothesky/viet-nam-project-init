
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Supabase API endpoints
export const handlers = [
  // Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
      },
    });
  }),

  // Tournament endpoints
  http.get('*/rest/v1/tournaments', () => {
    return HttpResponse.json([
      {
        id: 'tournament-1',
        name: 'Test Tournament',
        description: 'Test tournament description',
        prize_pool: 1000000,
        max_participants: 32,
        current_participants: 16,
        status: 'registration_open',
        start_date: '2024-12-01T00:00:00Z',
      },
    ]);
  }),

  // User profile endpoints
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'user-1',
        full_name: 'Test User',
        email: 'test@example.com',
        current_rank: 'Gold',
        ranking_points: 1500,
        wins: 25,
        losses: 10,
      },
    ]);
  }),

  // Payment endpoints
  http.post('*/api/payments/create', () => {
    return HttpResponse.json({
      payment_url:
        'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?test=1',
      payment_id: 'test-payment-123',
    });
  }),

  // VNPAY callback
  http.get('*/api/webhooks/vnpay-return', () => {
    return HttpResponse.json({
      status: 'success',
      payment_id: 'test-payment-123',
      amount: 100000,
    });
  }),

  // Real-time subscription (mock)
  http.get('*/rest/v1/realtime', () => {
    return HttpResponse.json({
      connected: true,
      subscriptions: ['ranking_updates', 'tournament_updates'],
    });
  }),
];

export const server = setupServer(...handlers);
