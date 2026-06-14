<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/features/useProjects'

const route = useRoute()
const router = useRouter()
const { projectById, updateProject, deleteProject, loading } = useProjects()

const projectId = route.params.id as string
const project = computed(() => projectById.value(projectId))

async function archive() {
  await updateProject(projectId, { status: 'archived' })
}

async function handleDelete() {
  if (!confirm('Delete this project?')) return
  await deleteProject(projectId)
  router.push('/projects')
}
</script>

<template>
  <div>
    <RouterLink to="/projects" class="text-sm text-brand-600 hover:underline mb-6 inline-flex items-center gap-1">
      ← Back to projects
    </RouterLink>

    <div v-if="loading" class="animate-pulse space-y-3 mt-4">
      <div class="h-7 bg-gray-200 rounded w-1/2" />
      <div class="h-4 bg-gray-100 rounded w-full" />
    </div>

    <div v-else-if="!project" class="text-gray-500 text-sm mt-4">
      Project not found.
    </div>

    <div v-else class="mt-4">
      <div class="flex items-start justify-between gap-4 mb-4">
        <h1 class="text-2xl font-semibold text-gray-900">{{ project.title }}</h1>
        <span class="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 font-medium capitalize">
          {{ project.status }}
        </span>
      </div>

      <p class="text-gray-600 mb-8">{{ project.description || 'No description.' }}</p>

      <div class="flex gap-3">
        <button class="btn-ghost text-sm" @click="archive" v-if="project.status === 'active'">
          Archive project
        </button>
        <button class="btn text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-4 py-2"
          @click="handleDelete">
          Delete project
        </button>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-400 space-y-1">
        <p>Created {{ new Date(project.created_at).toLocaleString() }}</p>
        <p>Last updated {{ new Date(project.updated_at).toLocaleString() }}</p>
        <p>ID: <code class="font-mono">{{ project.id }}</code></p>
      </div>
    </div>
  </div>
</template>
