<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Supabase auto-handles the token from the URL hash
  const { data } = await supabase.auth.getSession()
  authStore.setSession(data.session)
  await router.replace('/projects')
})
</script>

<template>
  <div class="text-center py-4">
    <svg class="animate-spin h-8 w-8 text-brand-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <p class="text-sm text-gray-500">Signing you in…</p>
  </div>
</template>
