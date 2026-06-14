import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    public?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public auth routes ──────────────────────────────────────────────────
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: 'Sign in' },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: { title: 'Create account' },
        },
        {
          path: 'callback',
          name: 'auth-callback',
          component: () => import('@/views/auth/CallbackView.vue'),
          meta: { title: 'Signing you in…' },
        },
      ],
    },

    // ── Protected app routes ────────────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/projects',
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/views/app/ProjectsView.vue'),
          meta: { title: 'Projects', requiresAuth: true },
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: () => import('@/views/app/ProjectDetailView.vue'),
          meta: { title: 'Project detail', requiresAuth: true },
        },
      ],
    },

    // ── Fallback ────────────────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// ── Global navigation guard ─────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Wait until session is bootstrapped before making auth decisions
  if (auth.initializing) return true

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.public && auth.isAuthenticated) {
    return { name: 'projects' }
  }

  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} — My App`
  }

  return true
})

export default router
