import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRealtime } from '@/composables/useRealtime'
import { useProjectsStore } from '@/stores/projects.store'
import { useAuthStore } from '@/stores/auth.store'
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/app.types'

export function useProjects() {
  const store = useProjectsStore()
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      store.setProjects(data ?? [])
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  // ── Create ─────────────────────────────────────────────────────────────────
  async function createProject(payload: Omit<ProjectInsert, 'user_id'>) {
    const userId = authStore.user?.id
    if (!userId) throw new Error('Not authenticated')

    const { data, error: err } = await supabase
      .from('projects')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()

    if (err) throw err
    // Realtime will handle adding it to the store
    return data
  }

  // ── Update ─────────────────────────────────────────────────────────────────
  async function updateProject(id: string, payload: ProjectUpdate) {
    const { data, error: err } = await supabase
      .from('projects')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    return data
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteProject(id: string) {
    const { error: err } = await supabase.from('projects').delete().eq('id', id)
    if (err) throw err
  }

  // ── Realtime subscription ──────────────────────────────────────────────────
  const { subscribe } = useRealtime<Project>({
    channelName: 'projects-changes',
    table: 'projects',
    event: '*',
    // Scope to current user's rows only
    filter: `user_id=eq.${authStore.user?.id}`,
    onInsert: (record) => store.addProject(record),
    onUpdate: (record) => store.updateProject(record),
    onDelete: (record) => record.id && store.removeProject(record.id),
  })

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMounted(async () => {
    await fetchProjects()
    subscribe()
  })

  return {
    loading,
    error,
    projects: store.projectList,
    activeProjects: store.activeProjects,
    totalCount: store.totalCount,
    projectById: store.projectById,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
