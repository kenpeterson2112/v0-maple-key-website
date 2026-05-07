export interface Resource {
  id: number
  grade: string
  subject: string
  type: string
  title: string
  description: string
  rating: number
  reviews: number
  province?: string
  topic?: string
  url?: string
  resource_type?: string | string[]
  accessibility_rating?: string
  is_paid?: boolean
  publisher?: string
  year_published?: number
  curriculum_expectations?: string[]
}

export interface Filters {
  province: string
  grade: string
  subject: string
  strand: string
  topic: string
  learningType: string
}
