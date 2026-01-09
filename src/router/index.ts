import { createRouter, createWebHistory } from 'vue-router'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      alias: '/admin/login',
      meta: { guest: true, title: 'Login' },
    },
    {
      path: '/signup',
      name: 'signup',
      alias: '/admin/signup',
      component: () => import('@/views/auth/SignupView.vue'),
      meta: { title: 'Sign Up' },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        authStore.logout()
        next()
      },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('@/views/auth/OtpVerificationView.vue'),
      meta: { title: 'Verify OTP' },
    },
    {
      path: '/select-company',
      name: 'select-company',
      component: () => import('@/views/auth/CompanySelectionView.vue'),
      meta: { requiresAuth: true, title: 'Select Business' },
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/Dashboard.vue'),
          meta: { title: 'Dashboard' },
        },

        {
          path: 'invites',
          name: 'invites',
          component: () => import('@/views/invites/InvitesView.vue'),
          meta: { title: 'Invites' },
        },
        {
          path: 'documents',
          name: 'documents',
          component: () => import('@/views/company/DocumentsView.vue'),
          meta: { title: 'Documents' },
        },
        {
          path: 'users',
          name: 'company-users',
          component: () => import('@/views/company/CompanyUsersView.vue'),
          meta: { title: 'Team Members' },
        },
      ],
    },
  ],
})

const DEFAULT_TITLE = 'PayPlan Business'

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE

  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth) {
    const companyStore = useCompanyStore()
    if (!companyStore.hasCompany && to.name !== 'select-company') {
      next('/select-company')
    } else {
      next()
    }
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
