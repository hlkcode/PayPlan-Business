<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompanyUsersController } from '@/controllers/useCompanyUsersController'
import DataTable from '@/components/core/DataTable.vue'
import { Shield, Calendar } from 'lucide-vue-next'

const controller = useCompanyUsersController()
const tableRef = ref()

const columns = [
  { key: 'surname', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'createdAt', label: 'Joined', sortable: true, formatter: (val: unknown) => new Date(val as string).toLocaleDateString() },
  { key: 'statusInCompany', label: 'Status', sortable: true },
]

const filters: any[] = [
    {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
            { value: 'Admin', label: 'Admin' },
            { value: 'Employee', label: 'Employee' },
            { value: 'Viewer', label: 'Viewer' }
        ]
    },
    {
        key: 'createdAt',
        label: 'Joined Date',
        type: 'date'
    }
]

const usersEndpoint = computed(() => {
    return controller.currentCompany.value?.companyId
        ? `/Companies/${controller.currentCompany.value.companyId}/users`
        : ''
})
</script>

<template>
  <div>
    <div class="page-header mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">People with access to {{ controller.currentCompany.value?.name }}</p>
        </div>
        <!-- Invite button or link could go here via slot if needed -->
    </div>

    <DataTable
      ref="tableRef"
      :api-url="usersEndpoint"
      :columns="columns"
      :filters="filters"
      searchable
      title="Team Members"
    >
        <template #cell-surname="{ row }">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                    {{ (row as any).surname?.charAt(0) }}
                </div>
                <div>
                    <div class="font-medium text-slate-900 dark:text-slate-100">{{ (row as any).surname }} {{ (row as any).otherNames }}</div>
                    <div class="text-slate-500 dark:text-slate-400 text-xs">{{ (row as any).email }}</div>
                </div>
            </div>
        </template>

        <template #cell-role="{ row }">
            <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Shield class="w-4 h-4 text-slate-400" />
                {{ (row as any).role }}
            </div>
        </template>

        <template #cell-createdAt="{ row }">
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar class="w-4 h-4 text-slate-400" />
                {{ new Date((row as any).createdAt).toLocaleDateString() }}
            </div>
        </template>

        <template #cell-statusInCompany="{ row }">
            <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="(row as any).statusInCompany ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'"
            >
                {{ (row as any).statusInCompany ? 'Active' : 'Inactive' }}
            </span>
        </template>
    </DataTable>
  </div>
</template>
