<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth.store'

const { initSession } = useAuth()
const authStore = useAuthStore()

onMounted(async () => {
  await initSession()
})
</script>

<template>
  <div v-if="authStore.initializing" class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center gap-3 text-gray-500">
      <svg class="animate-spin h-8 w-8 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm">Loading…</span>
    </div>
  </div>
  <RouterView v-else />
</template>
