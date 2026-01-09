<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInviteController } from '@/controllers/useInviteController'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import DataTable from '@/components/core/DataTable.vue'
import { Plus, CheckCircle } from 'lucide-vue-next'

const controller = useInviteController()
const tableRef = ref()

const columns = [
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdAt', label: 'Sent Date', sortable: true, formatter: (val: unknown) => new Date(val as string).toLocaleDateString() },
]

const filters: any[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'Pending', label: 'Pending' },
            { value: 'Accepted', label: 'Accepted' },
            { value: 'Revoked', label: 'Revoked' },
            { value: 'Expired', label: 'Expired' }
        ]
    },
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
        label: 'Sent Date',
        type: 'date'
    }
]

const invitesEndpoint = computed(() => {
    console.log("COMPANY ID", controller.currentCompany.value)
    return controller.currentCompany.value?.companyId
        ? `/Companies/${controller.currentCompany.value.companyId}/invites`
        : ''
})

const refreshTable = () => {
    tableRef.value?.refresh()
}

// Hook into controller's success to refresh table
// We might need to modify controller to accept a callback or watch something,
// but for now we can't easily hook into "sendInvite" success without modifying controller
// or watching a side effect.
// A simple way is to watch controller.showInviteDialog. If it goes false and loading is false...
// easier: Modify controller to expose a 'refreshTrigger' or just rely on manual refresh if needed?
// Better: The controller mainly handles the *form*. The list is now DataTable.
// Let's rely on the user refreshing or just refetching when dialog closes?
// Actually, I can pass a callback to sendInvite if I refactor controller, or just manual refresh.
// Let's assume for now valid submission triggers a refresh if I can.
// I'll watch strict change of showInviteDialog: if it closes, maybe refresh?
// But it closes on cancel too.
// Let's implement a 'onInviteSuccess' in the template if possible, or just watch invites length in controller? No, controller won't have invites anymore.
// I will just use `tableRef` and expose a method to refresh if needed, but for now standard Table behavior.
</script>

<template>
  <div>
    <div class="page-header mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Team Invites</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Manage invitations and team access</p>
        </div>
    </div>

    <DataTable
      ref="tableRef"
      :api-url="invitesEndpoint"
      :columns="columns"
      :filters="filters"
      searchable
      title="Invites"
    >
        <template #header-actions>
            <button
                @click="controller.openInviteDialog"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
                <Plus class="w-4 h-4 mr-2" />
                Invite Member
            </button>
        </template>

        <template #cell-status="{ row }">
            <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': row.status === 'Pending',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': row.status === 'Accepted',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': row.status === 'Revoked'
                }"
            >
                {{ row.status }}
            </span>
        </template>
    </DataTable>

    <!-- Invite Dialog -->
    <BaseDialog
        :show="controller.showInviteDialog.value"
        title="Invite New Member"
        @close="controller.showInviteDialog.value = false"
    >
        <form @submit.prevent="async () => { await controller.sendInvite(); refreshTable(); }" id="inviteForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                    v-model="controller.inviteForm.value.email"
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
            </div>

            <div>
                 <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                 <select
                    v-model="controller.inviteForm.value.role"
                    class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                 >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                    <option value="Viewer">Viewer</option>
                 </select>
            </div>

            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg flex items-start gap-3">
                <div class="mt-0.5 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle class="w-4 h-4" />
                </div>
                <p class="text-xs text-indigo-700 dark:text-indigo-300">
                    An invitation email will be sent to this address with instructions to join
                    <span class="font-medium">{{ controller.currentCompany.value?.name }}</span>.
                </p>
            </div>
        </form>
        <template #footer>
            <button class="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" @click="controller.showInviteDialog.value = false">Cancel</button>
            <button
                type="submit"
                form="inviteForm"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[80px]"
                :disabled="controller.inviteLoading.value"
            >
                <div v-if="controller.inviteLoading.value" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span v-else>Send Invite</span>
            </button>
        </template>
    </BaseDialog>
  </div>
</template>
