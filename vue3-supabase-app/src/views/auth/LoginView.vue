<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { signInWithEmail, sendMagicLink } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const magicLinkSent = ref(false)
const mode = ref<'password' | 'magic'>('password')

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    if (mode.value === 'magic') {
      await sendMagicLink(email.value)
      magicLinkSent.value = true
    } else {
      await signInWithEmail(email.value, password.value)
      const redirect = (route.query.redirect as string) || '/projects'
      await router.push(redirect)
    }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 mb-1">Welcome back</h2>
    <p class="text-sm text-gray-500 mb-6">Sign in to your account to continue.</p>

    <div v-if="magicLinkSent" class="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
      Check your email — we sent a magic sign-in link to <strong>{{ email }}</strong>.
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" class="input" placeholder="you@example.com" required />
      </div>

      <div v-if="mode === 'password'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" class="input" placeholder="••••••••" required />
      </div>

      <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {{ error }}
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ mode === 'magic' ? 'Send magic link' : 'Sign in' }}
      </button>

      <button type="button" class="w-full text-sm text-brand-600 hover:underline"
        @click="mode = mode === 'password' ? 'magic' : 'password'">
        {{ mode === 'password' ? 'Sign in with magic link instead' : 'Sign in with password instead' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      No account?
      <RouterLink to="/auth/register" class="text-brand-600 hover:underline font-medium">Create one</RouterLink>
    </p>
  </div>
</template>
