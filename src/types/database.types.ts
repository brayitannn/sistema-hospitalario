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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      detallesexamenes: {
        Row: {
          detalleexamenid: number
          indicaciones: string
          nombreexamen: string
          ordenexamenid: number
          tipoexamen: string
        }
        Insert: {
          detalleexamenid?: never
          indicaciones: string
          nombreexamen: string
          ordenexamenid: number
          tipoexamen: string
        }
        Update: {
          detalleexamenid?: never
          indicaciones?: string
          nombreexamen?: string
          ordenexamenid?: number
          tipoexamen?: string
        }
        Relationships: [
          {
            foreignKeyName: "detallesexamenes_ordenexamenid_fkey"
            columns: ["ordenexamenid"]
            isOneToOne: false
            referencedRelation: "orden_examenes"
            referencedColumns: ["ordenexamenid"]
          },
        ]
      }
      detallesformulas: {
        Row: {
          detalleid: number
          formulaid: number
          medicamentoid: number
          periodicidaduso: string
          periodouso: string
          posologia: string
          presentacion: string
        }
        Insert: {
          detalleid?: never
          formulaid: number
          medicamentoid: number
          periodicidaduso: string
          periodouso: string
          posologia: string
          presentacion: string
        }
        Update: {
          detalleid?: never
          formulaid?: number
          medicamentoid?: number
          periodicidaduso?: string
          periodouso?: string
          posologia?: string
          presentacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "detallesformulas_formulaid_fkey"
            columns: ["formulaid"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["formulaid"]
          },
          {
            foreignKeyName: "detallesformulas_medicamentoid_fkey"
            columns: ["medicamentoid"]
            isOneToOne: false
            referencedRelation: "medicamentos"
            referencedColumns: ["medicamentoid"]
          },
        ]
      }
      detallesincapacidades: {
        Row: {
          descripcion: string
          detalleid: number
          fechafin: string
          fechainicio: string
          incapacidadid: number
          numerodias: number
        }
        Insert: {
          descripcion: string
          detalleid?: never
          fechafin: string
          fechainicio: string
          incapacidadid: number
          numerodias: number
        }
        Update: {
          descripcion?: string
          detalleid?: never
          fechafin?: string
          fechainicio?: string
          incapacidadid?: number
          numerodias?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallesincapacidades_incapacidadid_fkey"
            columns: ["incapacidadid"]
            isOneToOne: false
            referencedRelation: "incapacidades"
            referencedColumns: ["incapacidadid"]
          },
        ]
      }
      detallesvisitas: {
        Row: {
          detallevisitaid: number
          diagnostico: string
          motivoid: number
          visitaid: number
        }
        Insert: {
          detallevisitaid?: never
          diagnostico: string
          motivoid: number
          visitaid: number
        }
        Update: {
          detallevisitaid?: never
          diagnostico?: string
          motivoid?: number
          visitaid?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallesvisitas_motivoid_fkey"
            columns: ["motivoid"]
            isOneToOne: false
            referencedRelation: "motivosvisitas"
            referencedColumns: ["motivoid"]
          },
          {
            foreignKeyName: "detallesvisitas_visitaid_fkey"
            columns: ["visitaid"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["visitaid"]
          },
        ]
      }
      especialidades: {
        Row: {
          especialidadid: number
          nombre: string
        }
        Insert: {
          especialidadid?: never
          nombre: string
        }
        Update: {
          especialidadid?: never
          nombre?: string
        }
        Relationships: []
      }
      formulas: {
        Row: {
          fecha: string
          formulaid: number
          tratamientoid: number
        }
        Insert: {
          fecha: string
          formulaid?: never
          tratamientoid: number
        }
        Update: {
          fecha?: string
          formulaid?: never
          tratamientoid?: number
        }
        Relationships: [
          {
            foreignKeyName: "formulas_tratamientoid_fkey"
            columns: ["tratamientoid"]
            isOneToOne: false
            referencedRelation: "tratamientos"
            referencedColumns: ["tratamientoid"]
          },
        ]
      }
      hospitales: {
        Row: {
          direccion: string
          hospitalid: number
          nit: string
          nombre: string
          telefono: string
        }
        Insert: {
          direccion: string
          hospitalid?: never
          nit: string
          nombre: string
          telefono: string
        }
        Update: {
          direccion?: string
          hospitalid?: never
          nit?: string
          nombre?: string
          telefono?: string
        }
        Relationships: []
      }
      incapacidades: {
        Row: {
          fecha: string
          incapacidadid: number
          tratamientoid: number
        }
        Insert: {
          fecha: string
          incapacidadid?: never
          tratamientoid: number
        }
        Update: {
          fecha?: string
          incapacidadid?: never
          tratamientoid?: number
        }
        Relationships: [
          {
            foreignKeyName: "incapacidades_tratamientoid_fkey"
            columns: ["tratamientoid"]
            isOneToOne: false
            referencedRelation: "tratamientos"
            referencedColumns: ["tratamientoid"]
          },
        ]
      }
      medicamentos: {
        Row: {
          cantidad: number
          descripcion: string | null
          medicamentoid: number
          nombre: string
          prescripcion: string
          unidades: string
        }
        Insert: {
          cantidad: number
          descripcion?: string | null
          medicamentoid?: never
          nombre: string
          prescripcion: string
          unidades: string
        }
        Update: {
          cantidad?: number
          descripcion?: string | null
          medicamentoid?: never
          nombre?: string
          prescripcion?: string
          unidades?: string
        }
        Relationships: []
      }
      medicos: {
        Row: {
          apellido: string
          correoelectronico: string
          especialidadid: number
          hospitalid: number
          medicoid: number
          nombre: string
          telefono: string
        }
        Insert: {
          apellido: string
          correoelectronico: string
          especialidadid: number
          hospitalid: number
          medicoid?: never
          nombre: string
          telefono: string
        }
        Update: {
          apellido?: string
          correoelectronico?: string
          especialidadid?: number
          hospitalid?: number
          medicoid?: never
          nombre?: string
          telefono?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicos_especialidadid_fkey"
            columns: ["especialidadid"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["especialidadid"]
          },
          {
            foreignKeyName: "medicos_hospitalid_fkey"
            columns: ["hospitalid"]
            isOneToOne: false
            referencedRelation: "hospitales"
            referencedColumns: ["hospitalid"]
          },
        ]
      }
      motivosvisitas: {
        Row: {
          descripcion: string
          motivoid: number
        }
        Insert: {
          descripcion: string
          motivoid?: never
        }
        Update: {
          descripcion?: string
          motivoid?: never
        }
        Relationships: []
      }
      orden_examenes: {
        Row: {
          fecha: string
          ordenexamenid: number
          visitaid: number
        }
        Insert: {
          fecha: string
          ordenexamenid?: never
          visitaid: number
        }
        Update: {
          fecha?: string
          ordenexamenid?: never
          visitaid?: number
        }
        Relationships: [
          {
            foreignKeyName: "orden_examenes_visitaid_fkey"
            columns: ["visitaid"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["visitaid"]
          },
        ]
      }
      pacientes: {
        Row: {
          apellido: string
          correoelectronico: string
          direccion: string
          fechanacimiento: string
          nombre: string
          pacienteid: number
          sexo: string
          telefono: string
        }
        Insert: {
          apellido: string
          correoelectronico: string
          direccion: string
          fechanacimiento: string
          nombre: string
          pacienteid?: never
          sexo: string
          telefono: string
        }
        Update: {
          apellido?: string
          correoelectronico?: string
          direccion?: string
          fechanacimiento?: string
          nombre?: string
          pacienteid?: never
          sexo?: string
          telefono?: string
        }
        Relationships: []
      }
      signosvitales: {
        Row: {
          frecuenciacardiaca: number
          frecuenciarespiratoria: number
          presionarterial: string
          saturacionoxigeno: number
          signovitalid: number
          temperatura: number
          visitaid: number
        }
        Insert: {
          frecuenciacardiaca: number
          frecuenciarespiratoria: number
          presionarterial: string
          saturacionoxigeno: number
          signovitalid?: never
          temperatura: number
          visitaid: number
        }
        Update: {
          frecuenciacardiaca?: number
          frecuenciarespiratoria?: number
          presionarterial?: string
          saturacionoxigeno?: number
          signovitalid?: never
          temperatura?: number
          visitaid?: number
        }
        Relationships: [
          {
            foreignKeyName: "signosvitales_visitaid_fkey"
            columns: ["visitaid"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["visitaid"]
          },
        ]
      }
      tratamientos: {
        Row: {
          fechafin: string
          fechainicio: string
          tratamientoid: number
          visitaid: number
        }
        Insert: {
          fechafin: string
          fechainicio: string
          tratamientoid?: never
          visitaid: number
        }
        Update: {
          fechafin?: string
          fechainicio?: string
          tratamientoid?: never
          visitaid?: number
        }
        Relationships: [
          {
            foreignKeyName: "tratamientos_visitaid_fkey"
            columns: ["visitaid"]
            isOneToOne: false
            referencedRelation: "visitas"
            referencedColumns: ["visitaid"]
          },
        ]
      }
      visitas: {
        Row: {
          fecha: string
          hora: string
          medicoid: number
          pacienteid: number
          visitaid: number
        }
        Insert: {
          fecha: string
          hora: string
          medicoid: number
          pacienteid: number
          visitaid?: never
        }
        Update: {
          fecha?: string
          hora?: string
          medicoid?: number
          pacienteid?: number
          visitaid?: never
        }
        Relationships: [
          {
            foreignKeyName: "visitas_medicoid_fkey"
            columns: ["medicoid"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["medicoid"]
          },
          {
            foreignKeyName: "visitas_pacienteid_fkey"
            columns: ["pacienteid"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["pacienteid"]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
