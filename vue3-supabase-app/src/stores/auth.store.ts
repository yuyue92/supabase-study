import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const session = ref<Session | null>(null)
  const initializing = ref(true)

  // ── Getters ────────────────────────────────────────────────────────────────
  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)
  const accessToken = computed(() => session.value?.access_token ?? null)

  // ── Mutations ──────────────────────────────────────────────────────────────
  function setSession(s: Session | null) {
    session.value = s
  }

  function clearSession() {
    session.value = null
  }

  function setInitializing(value: boolean) {
    initializing.value = value
  }

  return {
    session,
    initializing,
    user,
    isAuthenticated,
    accessToken,
    setSession,
    clearSession,
    setInitializing,
  }
})
