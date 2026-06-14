<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { signUpWithEmail } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await signUpWithEmail(email.value, password.value)
    success.value = true
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 mb-1">Create an account</h2>
    <p class="text-sm text-gray-500 mb-6">Get started for free.</p>

    <div v-if="success" class="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
      Account created! Check your email to confirm your address before signing in.
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" class="input" placeholder="you@example.com" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" class="input" placeholder="Min. 8 characters" minlength="8" required />
      </div>

      <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {{ error }}
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Creating account…' : 'Create account' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Already have an account?
      <RouterLink to="/auth/login" class="text-brand-600 hover:underline font-medium">Sign in</RouterLink>
    </p>
  </div>
</template>
