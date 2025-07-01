
// Mock Supabase client for development
const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            access_token: 'mock_token',
            user: {
              id: 'mock_user_id',
              email: 'admin@example.com',
              user_metadata: {}
            }
          }
        },
        error: null
      }),
      onAuthStateChange: (callback: any) => {
        // Mock auth state change
        const mockSession = {
          access_token: 'mock_token',
          user: {
            id: 'mock_user_id',
            email: 'admin@example.com',
            user_metadata: {}
          }
        };
        setTimeout(() => callback('SIGNED_IN', mockSession), 100);
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      },
      signInWithPassword: async (credentials: any) => ({
        data: {
          user: {
            id: 'mock_user_id',
            email: credentials.email,
            user_metadata: {}
          },
          session: {
            access_token: 'mock_token',
            user: {
              id: 'mock_user_id',
              email: credentials.email,
              user_metadata: {}
            }
          }
        },
        error: null
      }),
      signUp: async (credentials: any) => ({
        data: {
          user: {
            id: 'mock_user_id',
            email: credentials.email,
            user_metadata: {}
          },
          session: null
        },
        error: null
      }),
      signOut: async () => ({ error: null })
    },
    from: (table: string) => ({
      select: (query: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: mockData[table]?.[0] || null,
            error: null
          }),
          order: (column: string, options?: any) => ({
            range: (start: number, end: number) => ({
              select: async () => ({
                data: mockData[table] || [],
                error: null,
                count: mockData[table]?.length || 0
              })
            })
          })
        }),
        order: (column: string, options?: any) => ({
          range: (start: number, end: number) => ({
            select: async () => ({
              data: mockData[table] || [],
              error: null,
              count: mockData[table]?.length || 0
            })
          }),
          select: async () => ({
            data: mockData[table] || [],
            error: null
          })
        }),
        single: async () => ({
          data: mockData[table]?.[0] || null,
          error: null
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({
            data: { id: 'mock_id', ...data },
            error: null
          })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => ({
              data: { id: value, ...data },
              error: null
            })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          error: null
        })
      })
    }),
    rpc: async (functionName: string, params?: any) => {
      if (functionName === 'is_user_admin') {
        return { data: true, error: null };
      }
      return { data: null, error: null };
    }
  } as any;
};

// Mock data for development
const mockData: Record<string, any[]> = {
  profiles: [
    {
      id: 'mock_user_id',
      user_id: 'mock_user_id',
      full_name: 'Admin User',
      email: 'admin@example.com',
      current_rank: 'A+',
      ranking_points: 2500,
      total_matches: 150,
      wins: 120,
      losses: 30,
      elo: 1800,
      matches_played: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  tournaments: [
    {
      id: '1',
      name: 'Giải đấu mùa xuân 2024',
      description: 'Giải đấu bida chuyên nghiệp',
      tournament_type: 'single_elimination',
      game_format: '8_ball',
      max_participants: 32,
      current_participants: 15,
      entry_fee: 100000,
      prize_pool: 1000000,
      status: 'registration_open',
      tournament_start: new Date(Date.now() + 86400000 * 7).toISOString(),
      tournament_end: new Date(Date.now() + 86400000 * 10).toISOString(),
      registration_start: new Date().toISOString(),
      registration_end: new Date(Date.now() + 86400000 * 3).toISOString(),
      venue_name: 'Sảnh thi đấu chính',
      venue_address: '123 Đường ABC, Quận 1, TP.HCM',
      rules: 'Quy định thi đấu theo luật quốc tế',
      organizer_id: 'mock_user_id',
      club_id: 'mock_club_id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

export const supabase = createMockSupabaseClient();
