export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          code: string
          host_id: string
          status: 'lobby' | 'playing' | 'finished'
          current_round: number
          total_rounds: number
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          host_id: string
          status?: 'lobby' | 'playing' | 'finished'
          current_round?: number
          total_rounds?: number
        }
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      players: {
        Row: {
          id: string
          room_id: string
          user_id: string
          name: string
          avatar_id: number
          score: number
          is_online: boolean
          reconnect_token: string
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          name: string
          avatar_id: number
          score?: number
          is_online?: boolean
          reconnect_token?: string
        }
        Update: Partial<Database['public']['Tables']['players']['Insert']>
      }
      rounds: {
        Row: {
          id: string
          room_id: string
          round_number: number
          picker_id: string
          tiktok_url: string | null
          phase: 'picking' | 'watching' | 'guessing' | 'reveal' | 'done'
          phase_ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          round_number: number
          picker_id: string
          tiktok_url?: string | null
          phase?: 'picking' | 'watching' | 'guessing' | 'reveal' | 'done'
          phase_ends_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['rounds']['Insert']>
      }
      guesses: {
        Row: {
          id: string
          round_id: string
          player_id: string
          guessed_player_id: string
          is_correct: boolean
          guessed_at: string
        }
        Insert: {
          id?: string
          round_id: string
          player_id: string
          guessed_player_id: string
          is_correct?: boolean
        }
        Update: Partial<Database['public']['Tables']['guesses']['Insert']>
      }
    }
  }
}
