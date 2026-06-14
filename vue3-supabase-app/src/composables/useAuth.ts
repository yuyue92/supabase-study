import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useProjectsStore } from '@/stores/projects.store'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const projectsStore = useProjectsStore()
  const router = useRouter()

  // ── Email / password ───────────────────────────────────────────────────────
  async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    authStore.setSession(data.session)
    return data
  }

  async function signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  // ── Magic link ─────────────────────────────────────────────────────────────
  async function sendMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  // ── Sign out ───────────────────────────────────────────────────────────────
  async function signOut() {
    await supabase.auth.signOut()
    authStore.clearSession()
    projectsStore.clearProjects()
    await router.push('/auth/login')
  }

  // ── Bootstrap: call once in App.vue onMounted ──────────────────────────────
  async function initSession() {
    const { data } = await supabase.auth.getSession()
    authStore.setSession(data.session)
    authStore.setInitializing(false)

    supabase.auth.onAuthStateChange((_event, session) => {
      authStore.setSession(session)
    })
  }

  return {
    signInWithEmail,
    signUpWithEmail,
    sendMagicLink,
    signOut,
    initSession,
  }
}
