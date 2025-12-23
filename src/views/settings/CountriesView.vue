<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import { useCountryController } from '@/controllers/useCountryController'
import { Lock, Unlock, FileText } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const controller = useCountryController()
const tableRef = ref()
const toast = useToastStore()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'code', label: 'Code', sortable: true },
  { key: 'currency', label: 'Currency', sortable: true },
  { key: 'isActive', label: 'Status', sortable: false }, // if available
]

const refreshTable = () => {
    tableRef.value?.refresh()
}

const handleActivation = async (id: number, currentStatus: boolean) => {
    const result = await controller.toggleActivation(id, currentStatus)
    if (result.success) {
        refreshTable()
        toast.add({
            type: 'success',
            title: currentStatus ? 'Deactivated' : 'Activated',
            message: result.message || `Country successfully ${currentStatus ? 'deactivated' : 'activated'}.`
        })
    } else {
        toast.add({
            type: 'error',
            title: 'Error',
            message: result.message || `Failed to ${currentStatus ? 'deactivate' : 'activate'} country.`
        })
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Countries</h1>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/Countries"
      :columns="columns"
      searchable
      title="Countries"
    >
        <template #cell-isActive="{ row }">
            <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
                {{ row.isActive !== false ? 'Active' : 'Inactive' }} <!-- Default to active if missing for now, or check API -->
            </span>
        </template>

        <template #actions="{ row }">
            <div class="actions-flex">
                <button class="icon-action" title="Documents" @click="controller.fetchDocumentTypes(row.id as number)">
                    <FileText :size="16" />
                </button>
                <button
                    class="icon-action"
                    :title="row.isActive !== false ? 'Deactivate' : 'Activate'"
                    @click="handleActivation(row.id as number, !!row.isActive)"
                >
                    <Unlock v-if="row.isActive === false" :size="16" />
                    <Lock v-else :size="16" />
                </button>
            </div>
        </template>
    </DataTable>

    <!-- Documents Dialog (Read Only List) -->
    <BaseDialog
        :show="controller.showDocsDialog.value"
        title="Country Documents"
        @close="controller.showDocsDialog.value = false"
    >
        <div v-if="controller.docsLoading.value">Loading...</div>
        <div v-else>
            <table v-if="controller.documentTypesView.value.length" class="docs-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Expire?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="doc in controller.documentTypesView.value" :key="doc.id">
                        <td>{{ doc.title }}</td>
                        <td>{{ doc.documentTypeName }}</td>
                        <td>{{ doc.canExpire ? 'Yes' : 'No' }}</td>
                    </tr>
                </tbody>
            </table>
             <p v-else>No documents linked.</p>
        </div>
        <template #footer>
            <button class="cancel-btn" @click="controller.showDocsDialog.value = false">Close</button>
        </template>
    </BaseDialog>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; }
.actions-flex { display: flex; gap: 0.5rem; }
.icon-action { background: none; border: 1px solid var(--color-border); border-radius: 6px; padding: 6px; cursor: pointer; color: var(--color-text-secondary); }
.status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.inactive { background: #fee2e2; color: #991b1b; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); padding: 0.5rem 1rem; border: none; cursor: pointer; }

.docs-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.docs-table th, .docs-table td { text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-border); }
.docs-table th { font-weight: 600; color: var(--color-text-secondary); font-size: 0.875rem; }
</style>
