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
      Brands: {
        Row: {
          created_at: string
          id: number
          imgHref: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          imgHref?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          imgHref?: string | null
          name?: string
        }
        Relationships: []
      }
      CPUs: {
        Row: {
          baseClockGHz: number | null
          boostClockGHz: number | null
          brand: number
          cache: Json | null
          cores: number
          created_at: string
          description: Json
          id: number
          model: string
          threads: number
        }
        Insert: {
          baseClockGHz?: number | null
          boostClockGHz?: number | null
          brand: number
          cache?: Json | null
          cores: number
          created_at?: string
          description: Json
          id?: number
          model: string
          threads: number
        }
        Update: {
          baseClockGHz?: number | null
          boostClockGHz?: number | null
          brand?: number
          cache?: Json | null
          cores?: number
          created_at?: string
          description?: Json
          id?: number
          model?: string
          threads?: number
        }
        Relationships: [
          {
            foreignKeyName: "CPUs_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "Brands"
            referencedColumns: ["id"]
          },
        ]
      }
      Graphics: {
        Row: {
          brand: number
          created_at: string
          displayPorts: Json | null
          frequencyMHz: number | null
          graphicCoresCU: number | null
          id: number
          integrated: boolean
          maxTOPS: number | null
          model: string
        }
        Insert: {
          brand: number
          created_at?: string
          displayPorts?: Json | null
          frequencyMHz?: number | null
          graphicCoresCU?: number | null
          id?: number
          integrated: boolean
          maxTOPS?: number | null
          model: string
        }
        Update: {
          brand?: number
          created_at?: string
          displayPorts?: Json | null
          frequencyMHz?: number | null
          graphicCoresCU?: number | null
          id?: number
          integrated?: boolean
          maxTOPS?: number | null
          model?: string
        }
        Relationships: [
          {
            foreignKeyName: "Graphics_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "Brands"
            referencedColumns: ["id"]
          },
        ]
      }
      MiniPCs: {
        Row: {
          brand: number | null
          builtinMicrophone: boolean | null
          builtinSpeakers: boolean | null
          connectivity: Json
          CPU: number
          created_at: string
          description: Json
          dimensions: Json
          fromURL: string
          graphics: number
          id: number
          mainImgUrl: string
          manualCollect: boolean
          maxRAMCapacityGB: number | null
          maxStorageCapacityGB: number | null
          model: string
          portsImgUrl: string | null
          powerConsumptionW: number | null
          releaseYear: number | null
          supportExternalDiscreteGraphicsCard: boolean | null
          weightKg: number | null
        }
        Insert: {
          brand?: number | null
          builtinMicrophone?: boolean | null
          builtinSpeakers?: boolean | null
          connectivity: Json
          CPU: number
          created_at?: string
          description: Json
          dimensions: Json
          fromURL: string
          graphics: number
          id?: number
          mainImgUrl: string
          manualCollect: boolean
          maxRAMCapacityGB?: number | null
          maxStorageCapacityGB?: number | null
          model: string
          portsImgUrl?: string | null
          powerConsumptionW?: number | null
          releaseYear?: number | null
          supportExternalDiscreteGraphicsCard?: boolean | null
          weightKg?: number | null
        }
        Update: {
          brand?: number | null
          builtinMicrophone?: boolean | null
          builtinSpeakers?: boolean | null
          connectivity?: Json
          CPU?: number
          created_at?: string
          description?: Json
          dimensions?: Json
          fromURL?: string
          graphics?: number
          id?: number
          mainImgUrl?: string
          manualCollect?: boolean
          maxRAMCapacityGB?: number | null
          maxStorageCapacityGB?: number | null
          model?: string
          portsImgUrl?: string | null
          powerConsumptionW?: number | null
          releaseYear?: number | null
          supportExternalDiscreteGraphicsCard?: boolean | null
          weightKg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "MiniPCs_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "Brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MiniPCs_CPU_fkey"
            columns: ["CPU"]
            isOneToOne: false
            referencedRelation: "CPUs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MiniPCs_graphics_fkey"
            columns: ["graphics"]
            isOneToOne: false
            referencedRelation: "Graphics"
            referencedColumns: ["id"]
          },
        ]
      }
      Variants: {
        Row: {
          created_at: string
          id: number
          mini_pc: number
          offers: Json[]
          RAM_type: string
          RAMGB: number
          storage_type: string
          storageGB: number
        }
        Insert: {
          created_at?: string
          id?: number
          mini_pc: number
          offers: Json[]
          RAM_type: string
          RAMGB: number
          storage_type: string
          storageGB: number
        }
        Update: {
          created_at?: string
          id?: number
          mini_pc?: number
          offers?: Json[]
          RAM_type?: string
          RAMGB?: number
          storage_type?: string
          storageGB?: number
        }
        Relationships: [
          {
            foreignKeyName: "Variants_mini_pc_fkey"
            columns: ["mini_pc"]
            isOneToOne: false
            referencedRelation: "MiniPCs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
