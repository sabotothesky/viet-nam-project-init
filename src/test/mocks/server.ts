import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock Supabase API endpoints
export const handlers = [
  // Auth endpoints
  rest.post('*/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
          full_name: 'Test User',
        },
      })
    );
  }),

  // Tournament endpoints
  rest.get('*/rest/v1/tournaments', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
      ])
    );
  }),

  // User profile endpoints
  rest.get('*/rest/v1/profiles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 'user-1',
          full_name: 'Test User',
          email: 'test@example.com',
          current_rank: 'Gold',
          ranking_points: 1500,
          wins: 25,
          losses: 10,
        },
      ])
    );
  }),

  // Payment endpoints
  rest.post('*/api/payments/create', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        payment_url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?test=1',
        payment_id: 'test-payment-123',
      })
    );
  }),

  // VNPAY callback
  rest.get('*/api/webhooks/vnpay-return', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        payment_id: 'test-payment-123',
        amount: 100000,
      })
    );
  }),

  // Real-time subscription (mock)
  rest.get('*/rest/v1/realtime', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        connected: true,
        subscriptions: ['ranking_updates', 'tournament_updates'],
      })
    );
  }),
];

export const server = setupServer(...handlers); 