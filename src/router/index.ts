import { createRouter, createWebHistory } from 'vue-router'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: { guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      alias: '/admin/signup',
      component: () => import('@/views/auth/SignupView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        authStore.logout()
        next()
      },
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
        },
        {
          path: 'accounts/personal',
          name: 'accounts-personal',
          component: () => import('@/views/accounts/PersonalAccounts.vue'),
        },
        {
          path: 'accounts/business',
          name: 'accounts-business',
          component: () => import('@/views/accounts/BusinessAccounts.vue'),
        },
        {
          path: 'accounts/management',
          name: 'accounts-management',
          component: () => import('@/views/accounts/ManagementAccounts.vue'),
        },
        {
          path: 'accounts/personal/create',
          name: 'accounts-personal-create',
          component: () => import('@/views/accounts/create/CreatePersonalAccount.vue'),
        },
        {
          path: 'accounts/business/create',
          name: 'accounts-business-create',
          component: () => import('@/views/accounts/create/CreateBusinessAccount.vue'),
        },
        {
          path: 'accounts/management/create',
          name: 'accounts-management-create',
          component: () => import('@/views/accounts/create/CreateManagementAccount.vue'),
        },
        // CRUD Routes
        {
          path: 'companies',
          name: 'companies',
          component: () => import('@/views/settings/CompaniesView.vue'),
        },
        {
          path: 'countries',
          name: 'countries',
          component: () => import('@/views/settings/CountriesView.vue'),
        },
        {
          path: 'settings/document-types',
          name: 'settings-document-types',
          component: () => import('@/views/settings/DocumentTypes.vue'),
        },
        {
          path: 'settings/country-documents',
          name: 'settings-country-documents',
          component: () => import('@/views/settings/CountryDocuments.vue'),
        },
        {
          path: 'settings/roles',
          name: 'settings-roles',
          component: () => import('@/views/settings/RolesView.vue'),
        },
        {
          path: 'requests',
          name: 'requests',
          component: () => import('@/views/requests/RequestsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
