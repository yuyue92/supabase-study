<script setup lang="ts">
import { ref } from 'vue'
import { useProjects } from '@/composables/features/useProjects'
import type { ProjectInsert } from '@/types/app.types'

const { projects, loading, error, totalCount, createProject, deleteProject } = useProjects()

const showForm = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)

async function handleCreate() {
  if (!newTitle.value.trim()) return
  submitting.value = true
  formError.value = null
  try {
    const payload: Omit<ProjectInsert, 'user_id'> = {
      title: newTitle.value.trim(),
      description: newDescription.value.trim() || null,
      status: 'active',
    }
    await createProject(payload)
    newTitle.value = ''
    newDescription.value = ''
    showForm.value = false
  } catch (e) {
    formError.value = (e as Error).message
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Delete this project? This cannot be undone.')) return
  await deleteProject(id)
}

const statusColors: Record<string, string> = {
  active:   'bg-green-100 text-green-800',
  draft:    'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-600',
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Projects</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ totalCount }} total · updates in real time</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ New project' }}
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showForm" class="card p-6 mb-6">
      <h2 class="font-medium text-gray-900 mb-4">New project</h2>
      <form @submit.prevent="handleCreate" class="space-y-3">
        <input v-model="newTitle" class="input" placeholder="Project title" required />
        <textarea v-model="newDescription" class="input resize-none" rows="2" placeholder="Description (optional)" />
        <div v-if="formError" class="text-sm text-red-600">{{ formError }}</div>
        <div class="flex gap-2">
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? 'Creating…' : 'Create project' }}
          </button>
          <button type="button" class="btn-ghost" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div class="h-3 bg-gray-100 rounded w-full mb-1" />
        <div class="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="!projects.length" class="text-center py-20 text-gray-400">
      <div class="text-5xl mb-4">📂</div>
      <p class="font-medium text-gray-600">No projects yet</p>
      <p class="text-sm mt-1">Create your first project to get started.</p>
    </div>

    <!-- Project grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="card p-5 hover:shadow-md transition-shadow group block"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-medium text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {{ project.title }}
          </h3>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            :class="statusColors[project.status]">
            {{ project.status }}
          </span>
        </div>
        <p class="text-sm text-gray-500 line-clamp-2 mb-4">
          {{ project.description || 'No description.' }}
        </p>
        <div class="flex items-center justify-between">
          <time class="text-xs text-gray-400">
            {{ new Date(project.created_at).toLocaleDateString() }}
          </time>
          <button
            class="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.prevent="handleDelete(project.id)"
          >
            Delete
          </button>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
