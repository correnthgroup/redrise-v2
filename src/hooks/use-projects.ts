import { useCallback, useEffect, useRef, useState } from 'react'
import type { CreateProjectInput, Project, UpdateProjectInput } from '@/types/project'
import { createProject, deleteProject, loadProjects, updateProject as persistUpdateProject } from '@/lib/projects'

export function useProjects(ownerUserId?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await loadProjects(ownerUserId)
    if (mountedRef.current) {
      setProjects(data)
      setLoading(false)
    }
  }, [ownerUserId])

  useEffect(() => {
    let cancelled = false
    loadProjects(ownerUserId)
      .then((data) => {
        if (!cancelled && mountedRef.current) {
          setProjects(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled && mountedRef.current) {
          setProjects([])
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [ownerUserId])

  const addProject = useCallback(async (input: CreateProjectInput) => {
    const project = await createProject({ ...input, ownerUserId: input.ownerUserId ?? ownerUserId })
    if (project && mountedRef.current) setProjects((prev) => [project, ...prev])
    return project
  }, [ownerUserId])

  const updateProject = useCallback(async (id: string, updates: UpdateProjectInput) => {
    const project = await persistUpdateProject(id, updates)
    if (project && mountedRef.current) {
      setProjects((prev) => prev.map((item) => (item.id === id ? project : item)))
    }
    return project
  }, [])

  const removeProject = useCallback(async (id: string) => {
    const removed = await deleteProject(id)
    if (removed && mountedRef.current) setProjects((prev) => prev.filter((project) => project.id !== id))
    return removed
  }, [])

  return { projects, loading, addProject, updateProject, removeProject, refresh }
}
