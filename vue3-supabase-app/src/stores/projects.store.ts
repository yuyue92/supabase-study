import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/types/app.types'

export const useProjectsStore = defineStore('projects', () => {
  // ── State: Map for O(1) updates/deletes from realtime events ──────────────
  const projectsMap = ref<Map<string, Project>>(new Map())

  // ── Getters ────────────────────────────────────────────────────────────────
  const projectList = computed<Project[]>(() =>
    [...projectsMap.value.values()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )

  const projectById = computed(
    () => (id: string): Project | null => projectsMap.value.get(id) ?? null
  )

  const activeProjects = computed<Project[]>(() =>
    projectList.value.filter((p) => p.status === 'active')
  )

  const totalCount = computed(() => projectsMap.value.size)

  // ── Mutations (called only by composables, never by components) ────────────
  function setProjects(incoming: Project[]) {
    projectsMap.value = new Map(incoming.map((p) => [p.id, p]))
  }

  function addProject(project: Project) {
    projectsMap.value.set(project.id, project)
  }

  function updateProject(project: Project) {
    if (projectsMap.value.has(project.id)) {
      projectsMap.value.set(project.id, project)
    }
  }

  function removeProject(id: string) {
    projectsMap.value.delete(id)
  }

  function clearProjects() {
    projectsMap.value.clear()
  }

  return {
    projectList,
    projectById,
    activeProjects,
    totalCount,
    setProjects,
    addProject,
    updateProject,
    removeProject,
    clearProjects,
  }
})
