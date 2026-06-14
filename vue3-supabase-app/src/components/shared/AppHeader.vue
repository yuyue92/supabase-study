<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const { signOut } = useAuth()
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
    <div class="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
      <RouterLink to="/projects" class="flex items-center gap-2 font-semibold text-gray-900">
        <div class="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        My App
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink to="/projects" class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          Projects
        </RouterLink>

        <div class="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
          <span class="text-sm text-gray-500 hidden sm:inline">{{ authStore.user?.email }}</span>
          <button @click="signOut" class="btn-ghost text-sm">
            Sign out
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>
