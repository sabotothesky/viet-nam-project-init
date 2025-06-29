export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      current_season: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          season_name: string
          season_year: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          season_name: string
          season_year: number
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          season_name?: string
          season_year?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      season_history: {
        Row: {
          created_at: string | null
          final_rank: number
          id: string
          nickname: string
          ranking_points: number
          season_name: string
          season_year: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          final_rank: number
          id?: string
          nickname: string
          ranking_points: number
          season_name: string
          season_year: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          final_rank?: number
          id?: string
          nickname?: string
          ranking_points?: number
          season_name?: string
          season_year?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      challenge_history: {
        Row: {
          created_at: string | null
          id: string
          last_match_date: string | null
          player1_id: string | null
          player1_wins: number | null
          player2_id: string | null
          player2_wins: number | null
          total_matches: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_match_date?: string | null
          player1_id?: string | null
          player1_wins?: number | null
          player2_id?: string | null
          player2_wins?: number | null
          total_matches?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_match_date?: string | null
          player1_id?: string | null
          player1_wins?: number | null
          player2_id?: string | null
          player2_wins?: number | null
          total_matches?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_history_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenge_history_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      challenges: {
        Row: {
          bet_points: number
          challenged_id: string
          challenged_score: number | null
          challenger_id: string
          challenger_score: number | null
          confirmed_club_id: string | null
          confirmed_datetime: string | null
          created_at: string | null
          id: string
          message: string | null
          proposed_club_id: string | null
          proposed_datetime: string | null
          status: string | null
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          bet_points: number
          challenged_id: string
          challenged_score?: number | null
          challenger_id: string
          challenger_score?: number | null
          confirmed_club_id?: string | null
          confirmed_datetime?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          proposed_club_id?: string | null
          proposed_datetime?: string | null
          status?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          bet_points?: number
          challenged_id?: string
          challenged_score?: number | null
          challenger_id?: string
          challenger_score?: number | null
          confirmed_club_id?: string | null
          confirmed_datetime?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          proposed_club_id?: string | null
          proposed_datetime?: string | null
          status?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenges_confirmed_club_id_fkey"
            columns: ["confirmed_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_proposed_club_id_fkey"
            columns: ["proposed_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_bookings: {
        Row: {
          booking_datetime: string
          booking_fee: number | null
          challenge_id: string
          club_id: string
          club_notified: boolean | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          players_notified: boolean | null
          status: string | null
          table_number: number | null
          updated_at: string | null
        }
        Insert: {
          booking_datetime: string
          booking_fee?: number | null
          challenge_id: string
          club_id: string
          club_notified?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          players_notified?: boolean | null
          status?: string | null
          table_number?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_datetime?: string
          booking_fee?: number | null
          challenge_id?: string
          club_id?: string
          club_notified?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          players_notified?: boolean | null
          status?: string | null
          table_number?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_bookings_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_bookings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_registrations: {
        Row: {
          address: string
          club_name: string
          club_type: string
          created_at: string | null
          description: string | null
          district_id: string | null
          email: string | null
          existing_club_id: string | null
          hourly_rate: number | null
          id: string
          phone: string
          province_id: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          table_count: number | null
          updated_at: string | null
          user_id: string | null
          ward_id: string | null
        }
        Insert: {
          address: string
          club_name: string
          club_type: string
          created_at?: string | null
          description?: string | null
          district_id?: string | null
          email?: string | null
          existing_club_id?: string | null
          hourly_rate?: number | null
          id?: string
          phone: string
          province_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          table_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          ward_id?: string | null
        }
        Update: {
          address?: string
          club_name?: string
          club_type?: string
          created_at?: string | null
          description?: string | null
          district_id?: string | null
          email?: string | null
          existing_club_id?: string | null
          hourly_rate?: number | null
          id?: string
          phone?: string
          province_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          table_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          ward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_registrations_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_registrations_existing_club_id_fkey"
            columns: ["existing_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_registrations_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_registrations_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      club_tables: {
        Row: {
          club_id: string | null
          created_at: string | null
          features: Json | null
          hourly_rate: number | null
          id: string
          status: string | null
          table_number: number
          table_type: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          features?: Json | null
          hourly_rate?: number | null
          id?: string
          status?: string | null
          table_number: number
          table_type?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          features?: Json | null
          hourly_rate?: number | null
          id?: string
          status?: string | null
          table_number?: number
          table_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_tables_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string
          available_tables: number | null
          created_at: string
          description: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          is_sabo_owned: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          monthly_payment: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          priority_score: number | null
          province_id: string | null
          status: string | null
          table_count: number | null
          updated_at: string
        }
        Insert: {
          address: string
          available_tables?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_sabo_owned?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          monthly_payment?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          priority_score?: number | null
          province_id?: string | null
          status?: string | null
          table_count?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          available_tables?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_sabo_owned?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          monthly_payment?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          priority_score?: number | null
          province_id?: string | null
          status?: string | null
          table_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          achievements: string[] | null
          available_times: Json | null
          bio: string | null
          certification_level: string | null
          created_at: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          rating: number | null
          specializations: string[] | null
          status: string | null
          total_students: number | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          achievements?: string[] | null
          available_times?: Json | null
          bio?: string | null
          certification_level?: string | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          rating?: number | null
          specializations?: string[] | null
          status?: string | null
          total_students?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          achievements?: string[] | null
          available_times?: Json | null
          bio?: string | null
          certification_level?: string | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          rating?: number | null
          specializations?: string[] | null
          status?: string | null
          total_students?: number | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      coaching_sessions: {
        Row: {
          club_id: string | null
          coach_id: string | null
          created_at: string | null
          duration_hours: number | null
          focus_areas: string[] | null
          homework: string | null
          hourly_rate: number | null
          id: string
          payment_status: string | null
          session_date: string
          session_notes: string | null
          session_type: string | null
          status: string | null
          student_id: string | null
          total_cost: number | null
        }
        Insert: {
          club_id?: string | null
          coach_id?: string | null
          created_at?: string | null
          duration_hours?: number | null
          focus_areas?: string[] | null
          homework?: string | null
          hourly_rate?: number | null
          id?: string
          payment_status?: string | null
          session_date: string
          session_notes?: string | null
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          total_cost?: number | null
        }
        Update: {
          club_id?: string | null
          coach_id?: string | null
          created_at?: string | null
          duration_hours?: number | null
          focus_areas?: string[] | null
          homework?: string | null
          hourly_rate?: number | null
          id?: string
          payment_status?: string | null
          session_date?: string
          session_notes?: string | null
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_sessions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          commentable_id: string
          commentable_type: string | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commentable_id: string
          commentable_type?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commentable_id?: string
          commentable_type?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_events: {
        Row: {
          created_at: string | null
          description: string | null
          duration_hours: number | null
          entry_fee: number | null
          event_date: string
          event_type: string | null
          featured_image: string | null
          id: string
          max_participants: number | null
          organizer_id: string | null
          skill_level: string | null
          status: string | null
          tags: string[] | null
          title: string
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          entry_fee?: number | null
          event_date: string
          event_type?: string | null
          featured_image?: string | null
          id?: string
          max_participants?: number | null
          organizer_id?: string | null
          skill_level?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          entry_fee?: number | null
          event_date?: string
          event_type?: string | null
          featured_image?: string | null
          id?: string
          max_participants?: number | null
          organizer_id?: string | null
          skill_level?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
          province_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          province_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          province_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attendance_status: string | null
          event_id: string | null
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          registration_date: string | null
          user_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          event_id?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          event_id?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          order_index: number | null
          question: string
          status: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          question: string
          status?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          question?: string
          status?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          likeable_id: string
          likeable_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          likeable_id: string
          likeable_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          likeable_id?: string
          likeable_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      live_streams: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          match_id: string | null
          max_viewers: number | null
          started_at: string | null
          status: string | null
          stream_type: string | null
          stream_url: string | null
          streamer_id: string | null
          thumbnail_url: string | null
          title: string
          tournament_id: string | null
          viewer_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          match_id?: string | null
          max_viewers?: number | null
          started_at?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          streamer_id?: string | null
          thumbnail_url?: string | null
          title: string
          tournament_id?: string | null
          viewer_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          match_id?: string | null
          max_viewers?: number | null
          started_at?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          streamer_id?: string | null
          thumbnail_url?: string | null
          title?: string
          tournament_id?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_streams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          points: number
          source: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points: number
          source?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points?: number
          source?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          points_required: number
          reward_type: string | null
          reward_value: number | null
          stock_quantity: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          points_required: number
          reward_type?: string | null
          reward_value?: number | null
          stock_quantity?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          points_required?: number
          reward_type?: string | null
          reward_value?: number | null
          stock_quantity?: number | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          brand: string | null
          category: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          favorites_count: number | null
          id: string
          images: string[] | null
          location: string | null
          model: string | null
          original_price: number | null
          price: number
          seller_id: string | null
          specifications: Json | null
          status: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          location?: string | null
          model?: string | null
          original_price?: number | null
          price: number
          seller_id?: string | null
          specifications?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          location?: string | null
          model?: string | null
          original_price?: number | null
          price?: number
          seller_id?: string | null
          specifications?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      marketplace_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          review_type: string | null
          reviewee_id: string | null
          reviewer_id: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewee_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewee_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_transactions: {
        Row: {
          buyer_id: string | null
          commission_amount: number | null
          completed_at: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_method: string | null
          id: string
          item_id: string | null
          payment_method: string | null
          seller_id: string | null
          status: string | null
          tracking_number: string | null
          transaction_amount: number
        }
        Insert: {
          buyer_id?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          id?: string
          item_id?: string | null
          payment_method?: string | null
          seller_id?: string | null
          status?: string | null
          tracking_number?: string | null
          transaction_amount: number
        }
        Update: {
          buyer_id?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          id?: string
          item_id?: string | null
          payment_method?: string | null
          seller_id?: string | null
          status?: string | null
          tracking_number?: string | null
          transaction_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      match_media: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          likes_count: number | null
          match_id: string | null
          media_type: string | null
          media_url: string
          uploader_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          match_id?: string | null
          media_type?: string | null
          media_url: string
          uploader_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          match_id?: string | null
          media_type?: string | null
          media_url?: string
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_media_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_statistics: {
        Row: {
          average_shot_time: number | null
          break_shots: number | null
          created_at: string | null
          fouls_committed: number | null
          id: string
          longest_run: number | null
          match_duration_minutes: number | null
          match_id: string | null
          player_id: string | null
          pressure_situations: number | null
          pressure_success: number | null
          safety_shots: number | null
          successful_shots: number | null
          time_at_table_seconds: number | null
          total_shots: number | null
        }
        Insert: {
          average_shot_time?: number | null
          break_shots?: number | null
          created_at?: string | null
          fouls_committed?: number | null
          id?: string
          longest_run?: number | null
          match_duration_minutes?: number | null
          match_id?: string | null
          player_id?: string | null
          pressure_situations?: number | null
          pressure_success?: number | null
          safety_shots?: number | null
          successful_shots?: number | null
          time_at_table_seconds?: number | null
          total_shots?: number | null
        }
        Update: {
          average_shot_time?: number | null
          break_shots?: number | null
          created_at?: string | null
          fouls_committed?: number | null
          id?: string
          longest_run?: number | null
          match_duration_minutes?: number | null
          match_id?: string | null
          player_id?: string | null
          pressure_situations?: number | null
          pressure_success?: number | null
          safety_shots?: number | null
          successful_shots?: number | null
          time_at_table_seconds?: number | null
          total_shots?: number | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          match_date: string | null
          match_number: number | null
          notes: string | null
          player1_id: string | null
          player2_id: string | null
          round_number: number | null
          score_player1: number | null
          score_player2: number | null
          status: string | null
          tournament_id: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          match_number?: number | null
          notes?: string | null
          player1_id?: string | null
          player2_id?: string | null
          round_number?: number | null
          score_player1?: number | null
          score_player2?: number | null
          status?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          match_number?: number | null
          notes?: string | null
          player1_id?: string | null
          player2_id?: string | null
          round_number?: number | null
          score_player1?: number | null
          score_player2?: number | null
          status?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          membership_type: string | null
          price: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          membership_type?: string | null
          price?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          membership_type?: string | null
          price?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          challenge_notifications: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          marketing_notifications: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          tournament_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_notifications?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_notifications?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          tournament_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_notifications?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_notifications?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          tournament_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          challenge_id: string | null
          club_id: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          challenge_id?: string | null
          club_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          challenge_id?: string | null
          club_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          membership_id: string | null
          payment_method: string | null
          status: string | null
          transaction_ref: string
          updated_at: string | null
          user_id: string
          vnpay_response_code: string | null
          vnpay_transaction_no: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          membership_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_ref: string
          updated_at?: string | null
          user_id: string
          vnpay_response_code?: string | null
          vnpay_transaction_no?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          membership_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_ref?: string
          updated_at?: string | null
          user_id?: string
          vnpay_response_code?: string | null
          vnpay_transaction_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          age: number | null
          avatar_url: string | null
          bio: string | null
          club_id: string | null
          created_at: string
          current_rank: string | null
          current_streak: number | null
          date_of_birth: string | null
          experience_years: number | null
          full_name: string
          gender: string | null
          id: string
          location: string | null
          losses: number | null
          matches_played: number | null
          matches_won: number | null
          max_bet_points: number | null
          min_bet_points: number | null
          nickname: string | null
          phone: string | null
          preferred_club_id: string | null
          preferred_play_times: string[] | null
          province_id: string | null
          ranking_points: number | null
          role: string | null
          total_matches: number | null
          updated_at: string
          user_id: string
          win_rate: number | null
          wins: number | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          club_id?: string | null
          created_at?: string
          current_rank?: string | null
          current_streak?: number | null
          date_of_birth?: string | null
          experience_years?: number | null
          full_name: string
          gender?: string | null
          id?: string
          location?: string | null
          losses?: number | null
          matches_played?: number | null
          matches_won?: number | null
          max_bet_points?: number | null
          min_bet_points?: number | null
          nickname?: string | null
          phone?: string | null
          preferred_club_id?: string | null
          preferred_play_times?: string[] | null
          province_id?: string | null
          ranking_points?: number | null
          role?: string | null
          total_matches?: number | null
          updated_at?: string
          user_id: string
          win_rate?: number | null
          wins?: number | null
        }
        Update: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          club_id?: string | null
          created_at?: string
          current_rank?: string | null
          current_streak?: number | null
          date_of_birth?: string | null
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          location?: string | null
          losses?: number | null
          matches_played?: number | null
          matches_won?: number | null
          max_bet_points?: number | null
          min_bet_points?: number | null
          nickname?: string | null
          phone?: string | null
          preferred_club_id?: string | null
          preferred_play_times?: string[] | null
          province_id?: string | null
          ranking_points?: number | null
          role?: string | null
          total_matches?: number | null
          updated_at?: string
          user_id?: string
          win_rate?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_preferred_club_id_fkey"
            columns: ["preferred_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          region: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      rank_registrations: {
        Row: {
          club_id: string | null
          created_at: string | null
          id: string
          reason: string
          requested_rank: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          requested_rank: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          requested_rank?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_registrations_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_history: {
        Row: {
          created_at: string | null
          id: string
          new_points: number | null
          new_rank: string | null
          old_points: number | null
          old_rank: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_points?: number | null
          new_rank?: string | null
          old_points?: number | null
          old_rank?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_points?: number | null
          new_rank?: string | null
          old_points?: number | null
          old_rank?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: unknown
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          referral_id: string | null
          reward_type: string | null
          reward_value: number | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          referral_id?: string | null
          reward_type?: string | null
          reward_value?: number | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          referral_id?: string | null
          reward_type?: string | null
          reward_value?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          reward_amount: number | null
          reward_type: string | null
          rewarded_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      rules: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          effective_date: string | null
          id: string
          title: string
          version: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          title: string
          version?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          effective_date?: string | null
          id?: string
          title?: string
          version?: string | null
        }
        Relationships: []
      }
      shot_tracking: {
        Row: {
          created_at: string | null
          cue_ball_position: Json | null
          difficulty_rating: number | null
          id: string
          match_id: string | null
          notes: string | null
          object_ball_position: Json | null
          player_id: string | null
          pocket: string | null
          result_position: Json | null
          shot_number: number | null
          shot_time_seconds: number | null
          shot_type: string | null
          success: boolean | null
          target_ball: number | null
        }
        Insert: {
          created_at?: string | null
          cue_ball_position?: Json | null
          difficulty_rating?: number | null
          id?: string
          match_id?: string | null
          notes?: string | null
          object_ball_position?: Json | null
          player_id?: string | null
          pocket?: string | null
          result_position?: Json | null
          shot_number?: number | null
          shot_time_seconds?: number | null
          shot_type?: string | null
          success?: boolean | null
          target_ball?: number | null
        }
        Update: {
          created_at?: string | null
          cue_ball_position?: Json | null
          difficulty_rating?: number | null
          id?: string
          match_id?: string | null
          notes?: string | null
          object_ball_position?: Json | null
          player_id?: string | null
          pocket?: string | null
          result_position?: Json | null
          shot_number?: number | null
          shot_time_seconds?: number | null
          shot_type?: string | null
          success?: boolean | null
          target_ball?: number | null
        }
        Relationships: []
      }
      stream_comments: {
        Row: {
          created_at: string | null
          id: string
          likes_count: number | null
          message: string
          stream_id: string | null
          timestamp_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          likes_count?: number | null
          message: string
          stream_id?: string | null
          timestamp_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          likes_count?: number | null
          message?: string
          stream_id?: string | null
          timestamp_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_comments_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_date: string | null
          metric_name: string | null
          metric_value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string | null
          metric_name?: string | null
          metric_value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string | null
          metric_name?: string | null
          metric_value?: number | null
        }
        Relationships: []
      }
      table_bookings: {
        Row: {
          booking_date: string
          club_id: string | null
          created_at: string | null
          discount_applied: number | null
          duration_hours: number | null
          end_time: string
          id: string
          payment_status: string | null
          special_requests: string | null
          start_time: string
          status: string | null
          table_number: number
          total_cost: number | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          club_id?: string | null
          created_at?: string | null
          discount_applied?: number | null
          duration_hours?: number | null
          end_time: string
          id?: string
          payment_status?: string | null
          special_requests?: string | null
          start_time: string
          status?: string | null
          table_number: number
          total_cost?: number | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          club_id?: string | null
          created_at?: string | null
          discount_applied?: number | null
          duration_hours?: number | null
          end_time?: string
          id?: string
          payment_status?: string | null
          special_requests?: string | null
          start_time?: string
          status?: string | null
          table_number?: number
          total_cost?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_bookings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          payment_status: string | null
          registration_date: string | null
          status: string | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
          status?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
          status?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_image: string | null
          bracket_type: string | null
          club_id: string | null
          contact_info: Json | null
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string | null
          eligible_ranks: string[] | null
          end_date: string
          entry_fee: number | null
          first_prize: number | null
          first_prize_percent: number | null
          game_format: string | null
          id: string
          max_participants: number | null
          max_rank: string | null
          min_rank: string | null
          name: string
          prize_pool: number | null
          registration_deadline: string | null
          registration_start: string | null
          rules: string | null
          second_prize: number | null
          second_prize_percent: number | null
          start_date: string
          status: string | null
          third_prize: number | null
          third_prize_percent: number | null
          tournament_type: string | null
          updated_at: string | null
          venue_address: string | null
        }
        Insert: {
          banner_image?: string | null
          bracket_type?: string | null
          club_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          eligible_ranks?: string[] | null
          end_date: string
          entry_fee?: number | null
          first_prize?: number | null
          first_prize_percent?: number | null
          game_format?: string | null
          id?: string
          max_participants?: number | null
          max_rank?: string | null
          min_rank?: string | null
          name: string
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_start?: string | null
          rules?: string | null
          second_prize?: number | null
          second_prize_percent?: number | null
          start_date: string
          status?: string | null
          third_prize?: number | null
          third_prize_percent?: number | null
          tournament_type?: string | null
          updated_at?: string | null
          venue_address?: string | null
        }
        Update: {
          banner_image?: string | null
          bracket_type?: string | null
          club_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          eligible_ranks?: string[] | null
          end_date?: string
          entry_fee?: number | null
          first_prize?: number | null
          first_prize_percent?: number | null
          game_format?: string | null
          id?: string
          max_participants?: number | null
          max_rank?: string | null
          min_rank?: string | null
          name?: string
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_start?: string | null
          rules?: string | null
          second_prize?: number | null
          second_prize_percent?: number | null
          start_date?: string
          status?: string | null
          third_prize?: number | null
          third_prize_percent?: number | null
          tournament_type?: string | null
          updated_at?: string | null
          venue_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          active: boolean | null
          coach_id: string | null
          created_at: string | null
          curriculum: Json | null
          description: string | null
          duration_weeks: number | null
          id: string
          max_students: number | null
          program_name: string
          sessions_per_week: number | null
          skill_level: string | null
          total_cost: number | null
        }
        Insert: {
          active?: boolean | null
          coach_id?: string | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          max_students?: number | null
          program_name: string
          sessions_per_week?: number | null
          skill_level?: string | null
          total_cost?: number | null
        }
        Update: {
          active?: boolean | null
          coach_id?: string | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          max_students?: number | null
          program_name?: string
          sessions_per_week?: number | null
          skill_level?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_club_interactions: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          interaction_count: number | null
          interaction_score: number | null
          interaction_type: string
          last_interaction: string | null
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          interaction_score?: number | null
          interaction_type: string
          last_interaction?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          interaction_score?: number | null
          interaction_type?: string
          last_interaction?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_club_interactions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video_highlights: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          likes_count: number | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          uploader_id: string | null
          video_url: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          likes_count?: number | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          uploader_id?: string | null
          video_url: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          likes_count?: number | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          uploader_id?: string | null
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          reference_id: string | null
          status: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference_id?: string | null
          status?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference_id?: string | null
          status?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wards: {
        Row: {
          code: string | null
          created_at: string | null
          district_id: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "wards_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      season_stats: {
        Row: {
          average_points: number | null
          highest_points: number | null
          lowest_points: number | null
          season_name: string | null
          season_year: number | null
          total_players: number | null
          total_ranks: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_club_priority: {
        Args: {
          club_row: Database["public"]["Tables"]["clubs"]["Row"]
          user_lat?: number
          user_lng?: number
        }
        Returns: number
      }
      check_rate_limit: {
        Args: {
          ip_addr: unknown
          endpoint_name: string
          max_requests?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      create_payment_transaction: {
        Args: { p_user_id: string; p_amount: number; p_transaction_ref: string }
        Returns: string
      }
      generate_tournament_bracket: {
        Args: { tournament_uuid: string }
        Returns: boolean
      }
      get_current_season: {
        Args: Record<PropertyKey, never>
        Returns: {
          season_name: string
          season_year: number
          start_date: string
          end_date: string
          status: string
          days_remaining: number
        }[]
      }
      get_season_progress: {
        Args: {
          season_name: string
          season_year: number
        }
        Returns: {
          total_days: number
          days_elapsed: number
          days_remaining: number
          progress_percentage: number
        }[]
      }
      get_user_best_season: {
        Args: {
          user_nickname: string
        }
        Returns: {
          season_name: string
          season_year: number
          ranking_points: number
          final_rank: number
        }[]
      }
      increment_interaction: {
        Args: {
          p_user_id: string
          p_club_id: string
          p_interaction_type: string
          p_score_increment: number
        }
        Returns: undefined
      }
      increment_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      update_match_result: {
        Args: {
          match_uuid: string
          p1_score: number
          p2_score: number
          winner_uuid: string
        }
        Returns: boolean
      }
      update_user_ranking: {
        Args: {
          user_uuid: string
          new_rank: string
          new_points: number
          reason_text: string
        }
        Returns: undefined
      }
      upgrade_membership_after_payment: {
        Args: {
          p_user_id: string
          p_transaction_ref: string
          p_membership_type?: string
        }
        Returns: boolean
      }
      validate_email: {
        Args: { email: string }
        Returns: boolean
      }
      validate_phone: {
        Args: { phone: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
