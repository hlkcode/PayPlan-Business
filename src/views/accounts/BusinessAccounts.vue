<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import axios from '@/utils/axios'
import { AxiosError } from 'axios'
import { useToastStore } from '@/stores/toast'
import { Lock, Unlock, ChevronDown } from 'lucide-vue-next'
import BaseDropdown from '@/components/core/dropdown/BaseDropdown.vue'

const toast = useToastStore()

// Assuming columns for Business Accounts based on common sense + API docs hint
const columns = [
  { key: 'surname', label: 'Name', sortable: true },
  { key: 'companyName', label: 'Company', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'country.name', label: 'Country', sortable: false },
  { key: 'isActive', label: 'Status', sortable: false },
]

const tableRef = ref()
import ConfirmDialog from '@/components/core/dialog/ConfirmDialog.vue'

// Confirm Dialog State
const showConfirmDialog = ref(false)
const confirmLoading = ref(false)
const confirmConfig = ref({
    title: '',
    message: '',
    action: null as (() => Promise<void>) | null
})

const handleConfirm = async () => {
    if (!confirmConfig.value.action) return
    confirmLoading.value = true
    try {
        await confirmConfig.value.action()
        showConfirmDialog.value = false
    } finally {
        confirmLoading.value = false
    }
}

const processingId = ref<number | null>(null)
const selectedIds = ref<(number | string)[]>([])

const toggleActivation = (row: Record<string, unknown>) => {
    const isActivating = !row.isActive
    confirmConfig.value = {
        title: isActivating ? 'Activate Account' : 'Deactivate Account',
        message: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} this account?`,
        action: async () => {
            processingId.value = row.id as number
            try {
                await axios.post('/accounts/activation', {
                    userId: row.id,
                    activate: isActivating
                })
                if (tableRef.value) {
                    tableRef.value.refresh()
                }
                toast.add({
                    type: 'success',
                    title: 'Success',
                    message: `Account ${isActivating ? 'activated' : 'deactivated'} successfully`
                })
            } catch {
                 toast.add({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update status'
                })
            } finally {
                processingId.value = null
            }
        }
    }
    showConfirmDialog.value = true
}

const onSelectionChange = (ids: (number | string)[]) => {
    selectedIds.value = ids
}

const onBulkActivate = async (activate: boolean) => {
    let successCount = 0
    let lastMessage = ''

    for (const id of selectedIds.value) {
         try {
             await axios.post('/activation', {
                userId: Number(id),
                activate: activate
             })
             successCount++
         } catch (error) {
             const e = error as AxiosError<{message: string}>
             console.error(`Failed to bulk update ${id}`, e)
             if (e.response?.data?.message) lastMessage = e.response.data.message
         }
    }

    if (successCount > 0) {
        tableRef.value?.refresh()
        selectedIds.value = []
        toast.add({
            type: 'success',
            title: activate ? 'Bulk Activate' : 'Bulk Deactivate',
            message: `Successfully ${activate ? 'activated' : 'deactivated'} ${successCount} accounts.`
        })
    } else if (lastMessage) {
        toast.add({
            type: 'error',
            title: 'Error',
            message: lastMessage
        })
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Business Accounts</h1>
        <router-link to="/admin/accounts/business/create" class="create-btn">Create Business</router-link>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/business-accounts"
      :columns="columns"
      searchable
      selectable
      @update:selection="onSelectionChange"
      title="Business Users"
    >
        <template #bulk-actions="{ selected }">
            <BaseDropdown>
                <template #trigger>
                     <button class="bulk-trigger-btn">
                         <span>Bulk Actions ({{ selected.length }})</span>
                         <ChevronDown :size="16" />
                     </button>
                </template>
                <div class="bulk-dropdown-menu">
                    <button @click="onBulkActivate(true)" class="bulk-menu-item">
                        <Unlock :size="16" class="text-success" /> Activate Selected
                    </button>
                    <button @click="onBulkActivate(false)" class="bulk-menu-item">
                        <Lock :size="16" class="text-warning" /> Deactivate Selected
                    </button>
                </div>
            </BaseDropdown>
        </template>

        <!-- Name Concatenation -->
        <template #cell-surname="{ row }">
            {{ row.surname }} {{ row.otherNames }}
        </template>

        <!-- Status Column Customization -->
        <template #cell-isActive="{ row }">
            <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
                {{ row.isActive ? 'Active' : 'Inactive' }}
            </span>
        </template>

        <!-- Actions -->
        <template #actions="{ row }">
             <button
                class="icon-action"
                :title="row.isActive ? 'Deactivate' : 'Activate'"
                @click="toggleActivation(row)"
                :disabled="processingId === row.id"
            >
                <Unlock v-if="!row.isActive" :size="16" />
                <Lock v-else :size="16" />
            </button>
        </template>
    </DataTable>

    <ConfirmDialog
        v-model:show="showConfirmDialog"
        :title="confirmConfig.title"
        :message="confirmConfig.message"
        type="warning"
        :loading="confirmLoading"
        @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-text-primary);
    font-weight: 700;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-badge.active {
    background: #dcfce7;
    color: #166534;
}

.status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
}

.create-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
    text-decoration: none;
    display: inline-block;
}

.create-btn:hover {
    background: var(--color-primary-hover);
}

/* Bulk Actions Styling */
.bulk-trigger-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
}

.bulk-trigger-btn:hover {
    filter: brightness(1.15);
}

.bulk-dropdown-menu {
    padding: 0.5rem;
    min-width: 200px;
}

.bulk-menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    background: none;
    border: none;
    text-align: left;
    color: var(--color-text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
}

.bulk-menu-item:hover {
    background: var(--color-bg-secondary);
}

/* Icon Action Styling */
.icon-action {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 6px;
    cursor: pointer;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.icon-action:hover:not(:disabled) {
    background: var(--color-bg-secondary);
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.icon-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
</style>
