export type ProjectStatus = 'active' | 'archived'

export type Project = {
  id: string
  user_id: string
  name: string
  description: string
  image_url: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export type CreateProjectInput = {
  name: string
  description: string
  image_url?: string | null
  ownerUserId?: string
}

export type UpdateProjectInput = Partial<Pick<Project, 'name' | 'description' | 'image_url' | 'status'>>
