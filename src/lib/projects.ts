import { supabase } from './supabase'
import { logAuditEvent } from './audit-logs'
import type { CreateProjectInput, Project, UpdateProjectInput } from '@/types/project'

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = 'p'
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

async function isIdUnique(id: string): Promise<boolean> {
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('id', id)
  return count === 0
}

async function generateUniqueId(): Promise<string> {
  let id = generateShortId()
  let attempts = 0
  while (attempts < 10) {
    if (await isIdUnique(id)) return id
    id = generateShortId()
    attempts++
  }
  return id
}

export async function loadProjects(ownerUserId?: string): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (ownerUserId) query = query.eq('user_id', ownerUserId)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as Project[]
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data as Project | null
}

export async function createProject(input: CreateProjectInput): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const id = await generateUniqueId()
  const ownerUserId = input.ownerUserId || user.id

  const { data, error } = await supabase
    .from('projects')
    .insert({
      id,
      user_id: ownerUserId,
      name: input.name || 'New Project',
      description: input.description || '',
      image_url: input.image_url || null,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error

  await logAuditEvent({
    action: 'create',
    entityType: 'project',
    entityId: id,
    entityName: input.name,
    details: { ownerUserId },
  })

  return data as Project
}

export async function updateProject(id: string, updates: UpdateProjectInput): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await logAuditEvent({
    action: 'update',
    entityType: 'project',
    entityId: id,
    entityName: data.name,
    details: { fields: Object.keys(updates) },
  })

  return data as Project
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error

  await logAuditEvent({
    action: 'delete',
    entityType: 'project',
    entityId: id,
  })

  return true
}
