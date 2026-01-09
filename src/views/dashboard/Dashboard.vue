<script setup lang="ts">
import { useDashboardController } from '@/controllers/useDashboardController'
import { Building, Mail, Users, ArrowRight } from 'lucide-vue-next'

const controller = useDashboardController()
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <router-link to="/invites" class="text-sm text-indigo-600 font-medium hover:text-indigo-500 flex items-center">
            Manage Team <ArrowRight class="w-4 h-4 ml-1" />
        </router-link>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Companies Card -->
       <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
         <div class="absolute top-0 right-0 p-4 opacity-10">
            <Building class="w-24 h-24 text-indigo-600" />
         </div>
         <div class="relative z-10">
             <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 w-fit rounded-lg mb-4 text-indigo-600 dark:text-indigo-400">
                <Building class="w-6 h-6" />
             </div>
             <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Companies</p>
             <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ controller.totalCompanies.value }}</h3>
         </div>
       </div>

       <!-- Pending Invites Card -->
       <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
         <div class="absolute top-0 right-0 p-4 opacity-10">
            <Mail class="w-24 h-24 text-amber-500" />
         </div>
         <div class="relative z-10">
             <div class="p-2 bg-amber-50 dark:bg-amber-900/30 w-fit rounded-lg mb-4 text-amber-600 dark:text-amber-400">
                <Mail class="w-6 h-6" />
             </div>
             <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Invites</p>
             <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ controller.pendingInvites.value }}</h3>
         </div>
       </div>

       <!-- Team Members Card -->
       <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
         <div class="absolute top-0 right-0 p-4 opacity-10">
            <Users class="w-24 h-24 text-green-600" />
         </div>
         <div class="relative z-10">
             <div class="p-2 bg-green-50 dark:bg-green-900/30 w-fit rounded-lg mb-4 text-green-600 dark:text-green-400">
                <Users class="w-6 h-6" />
             </div>
             <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Active Members</p>
             <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ controller.activeInvites.value }}</h3>
         </div>
       </div>
    </div>

    <!-- Quick Actions / Context -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
            <h2 class="text-2xl font-bold mb-2">Grow your business team</h2>
            <p class="text-indigo-100 mb-6">Invite team members to collaborate on your companies. Assign roles and manage access efficiently.</p>
            <router-link to="/invites" class="inline-flex items-center px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Send Invite
            </router-link>
        </div>
        <!-- Decorative bubbles -->
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  </div>
</template>
