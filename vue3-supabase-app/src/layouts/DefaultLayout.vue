<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    <main class="flex-1 container mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
