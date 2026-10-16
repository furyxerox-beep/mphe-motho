export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      choma_vouches: {
        Row: {
          created_at: string
          member: string
          voucher: string
        }
        Insert: {
          created_at?: string
          member: string
          voucher: string
        }
        Update: {
          created_at?: string
          member?: string
          voucher?: string
        }
        Relationships: [
          {
            foreignKeyName: "choma_vouches_member_fkey"
            columns: ["member"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "choma_vouches_voucher_fkey"
            columns: ["voucher"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      confessions: {
        Row: {
          author: string
          body: string
          created_at: string
          id: string
          kind: string
        }
        Insert: {
          author?: string
          body: string
          created_at?: string
          id?: string
          kind?: string
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          id?: string
          kind?: string
        }
        Relationships: []
      }
      cultural_preferences: {
        Row: {
          family: string
          intention: string
          language: string
          tradition: string
          updated_at: string
          user_id: string
        }
        Insert: {
          family?: string
          intention?: string
          language?: string
          tradition?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          family?: string
          intention?: string
          language?: string
          tradition?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cultural_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      date_gifts: {
        Row: {
          created_at: string
          gift: string
          id: string
          note: string
          receiver: string
          sender: string
        }
        Insert: {
          created_at?: string
          gift: string
          id?: string
          note?: string
          receiver: string
          sender: string
        }
        Update: {
          created_at?: string
          gift?: string
          id?: string
          note?: string
          receiver?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "date_gifts_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_gifts_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      date_invitations: {
        Row: {
          created_at: string
          id: string
          province: string
          receiver: string
          sender: string
          starts_at: string
          status: string
          venue: string
        }
        Insert: {
          created_at?: string
          id?: string
          province: string
          receiver: string
          sender: string
          starts_at: string
          status?: string
          venue: string
        }
        Update: {
          created_at?: string
          id?: string
          province?: string
          receiver?: string
          sender?: string
          starts_at?: string
          status?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "date_invitations_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_invitations_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number
          id: string
          region: string
          starts_at: string
          title: string
        }
        Insert: {
          capacity?: number
          id?: string
          region: string
          starts_at: string
          title: string
        }
        Update: {
          capacity?: number
          id?: string
          region?: string
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      group_date_members: {
        Row: {
          date_id: string
          user_id: string
        }
        Insert: {
          date_id: string
          user_id: string
        }
        Update: {
          date_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_date_members_date_id_fkey"
            columns: ["date_id"]
            isOneToOne: false
            referencedRelation: "group_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_date_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_dates: {
        Row: {
          cancelled: boolean
          capacity: number
          host: string
          id: string
          province: string
          starts_at: string
          title: string
          venue: string
        }
        Insert: {
          cancelled?: boolean
          capacity?: number
          host: string
          id?: string
          province: string
          starts_at: string
          title: string
          venue: string
        }
        Update: {
          cancelled?: boolean
          capacity?: number
          host?: string
          id?: string
          province?: string
          starts_at?: string
          title?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_dates_host_fkey"
            columns: ["host"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      holiday_preferences: {
        Row: {
          available_from: string
          available_until: string
          festive_mode: boolean
          province: string
          user_id: string
        }
        Insert: {
          available_from: string
          available_until: string
          festive_mode?: boolean
          province: string
          user_id: string
        }
        Update: {
          available_from?: string
          available_until?: string
          festive_mode?: boolean
          province?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "holiday_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          liked: string
          liker: string
        }
        Insert: {
          created_at?: string
          liked: string
          liker: string
        }
        Update: {
          created_at?: string
          liked?: string
          liker?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_liked_fkey"
            columns: ["liked"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_fkey"
            columns: ["liker"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_windows: {
        Row: {
          expires_at: string
          matched_at: string
          member_a: string
          member_b: string
          opened_at: string | null
        }
        Insert: {
          expires_at?: string
          matched_at?: string
          member_a: string
          member_b: string
          opened_at?: string | null
        }
        Update: {
          expires_at?: string
          matched_at?: string
          member_a?: string
          member_b?: string
          opened_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_windows_member_a_fkey"
            columns: ["member_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_windows_member_b_fkey"
            columns: ["member_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          receiver: string
          sender: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver: string
          sender: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      music_preferences: {
        Row: {
          artist: string
          genres: string[]
          playlist_url: string
          track: string
          user_id: string
        }
        Insert: {
          artist?: string
          genres?: string[]
          playlist_url?: string
          track?: string
          user_id: string
        }
        Update: {
          artist?: string
          genres?: string[]
          playlist_url?: string
          track?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_details: {
        Row: {
          created_at: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string
          phone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          bio: string | null
          birthdate: string | null
          city: string | null
          created_at: string
          display_name: string
          gender: string | null
          id: string
          interested_in: string | null
          interests: string[]
          job: string | null
          last_active: string
          lat: number | null
          lng: number | null
          province: string | null
          umshado_intent: string | null
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          birthdate?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          gender?: string | null
          id: string
          interested_in?: string | null
          interests?: string[]
          job?: string | null
          last_active?: string
          lat?: number | null
          lng?: number | null
          province?: string | null
          umshado_intent?: string | null
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          birthdate?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          gender?: string | null
          id?: string
          interested_in?: string | null
          interests?: string[]
          job?: string | null
          last_active?: string
          lat?: number | null
          lng?: number | null
          province?: string | null
          umshado_intent?: string | null
        }
        Relationships: []
      }
      relationship_milestones: {
        Row: {
          anniversary: string
          created_at: string
          id: string
          shared: boolean
          story: string
          title: string
          user_id: string
        }
        Insert: {
          anniversary: string
          created_at?: string
          id?: string
          shared?: boolean
          story?: string
          title: string
          user_id: string
        }
        Update: {
          anniversary?: string
          created_at?: string
          id?: string
          shared?: boolean
          story?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_submissions: {
        Row: {
          created_at: string
          id: string
          path: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_introductions: {
        Row: {
          duration: number
          language: string
          path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          duration: number
          language?: string
          path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          duration?: number
          language?: string
          path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_introductions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_match: { Args: { a: string; b: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
