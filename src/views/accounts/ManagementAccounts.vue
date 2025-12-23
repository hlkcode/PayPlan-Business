<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import { useManagementController } from '@/controllers/management/useManagementController'
import ConfirmDialog from '@/components/core/dialog/ConfirmDialog.vue'
import { useToastStore } from '@/stores/toast'
import { Lock, Unlock, ChevronDown, Trash2 } from 'lucide-vue-next'
import BaseDropdown from '@/components/core/dropdown/BaseDropdown.vue'

const controller = useManagementController()
const tableRef = ref()
const toast = useToastStore()
// Reset Password State removed as per requirements

// ... existing code ...

// Confirmation State
const showConfirmDialog = ref(false)
const confirmLoading = ref(false)
const confirmConfig = ref({
    title: '',
    message: '',
    action: null as (() => Promise<void>) | null
})

const columns = [
  { key: 'surname', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'verificationStatus', label: 'Verification', sortable: true },
  { key: 'phoneNumber', label: 'Phone', sortable: false },
  { key: 'isActive', label: 'Status', sortable: false },
]

const filters = computed(() => [
    {
        key: 'role',
        label: 'Role',
        type: 'select' as const,
        options: controller.roles.value.map(r => ({ value: r, label: r }))
    }
])

// Bulk Actions
const selectedIds = ref<(number | string)[]>([])
const onSelectionChange = (ids: (number | string)[]) => {
    selectedIds.value = ids
}

const triggerBulkDelete = () => {
    confirmConfig.value = {
        title: 'Delete Accounts',
        message: `Are you sure you want to permanently delete these ${selectedIds.value.length} accounts? This action cannot be undone.`,
        action: processBulkDelete
    }
    showConfirmDialog.value = true
}

const processBulkDelete = async () => {
    let successCount = 0
    let lastMessage = ''
    // Optimize: Could allow Promise.all for parallel, but sequential is safer for now
    for (const id of selectedIds.value) {
        const result = await controller.deleteAccount(Number(id))
        if (result.success) {
            successCount++
            lastMessage = result.message || ''
        }
    }

    if (successCount > 0) {
        refreshTable()
        toast.add({
            type: 'success',
            title: 'Bulk Delete',
            message: lastMessage || `Successfully deleted ${successCount} accounts.`
        })
    } else {
        toast.add({
            type: 'warning',
            title: 'Bulk Delete',
            message: 'No accounts were deleted.'
        })
    }
}

const onBulkActivate = async (activate: boolean) => {
    let successCount = 0
    let lastMessage = ''
    for (const id of selectedIds.value) {
        const row = controller.accounts.value.find(a => a.id === id)
        if (row && row.isActive !== activate) {
             const result = await controller.toggleActivation(Number(id), row.isActive)
             if (result.success) {
                 successCount++
                 lastMessage = result.message || ''
             }
        }
    }

    if (successCount > 0) {
        refreshTable()
        toast.add({
            type: 'success',
            title: activate ? 'Bulk Activate' : 'Bulk Deactivate',
            message: lastMessage || `Successfully ${activate ? 'activated' : 'deactivated'} ${successCount} accounts.`
        })
    }
}

const triggerDelete = (row: Record<string, unknown>) => {
    confirmConfig.value = {
        title: 'Delete Account',
        message: `Are you sure you want to delete ${row.surname} ${row.otherNames}? This action cannot be undone.`,
        action: async () => {
             const result = await controller.deleteAccount(row.id as number)
             if (result.success) {
                 refreshTable()
                 toast.add({
                     type: 'success',
                     title: 'Deleted',
                     message: result.message || 'Account deleted successfully.'
                 })
             } else {
                 toast.add({
                     type: 'error',
                     title: 'Error',
                     message: result.message || 'Failed to delete account.'
                 })
             }
        }
    }
    showConfirmDialog.value = true
}

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

const handleActivation = (id: number, currentStatus: boolean) => {
    confirmConfig.value = {
        title: currentStatus ? 'Deactivate Account' : 'Activate Account',
        message: `Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this account?`,
        action: async () => {
             const result = await controller.toggleActivation(id, currentStatus)
            if (result.success) {
                refreshTable()
                toast.add({
                    type: 'success',
                    title: currentStatus ? 'Deactivated' : 'Activated',
                    message: result.message || `Account successfully ${currentStatus ? 'deactivated' : 'activated'}.`
                })
            } else {
                toast.add({
                    type: 'error',
                    title: 'Error',
                    message: result.message || `Failed to ${currentStatus ? 'deactivate' : 'activate'} account.`
                })
            }
        }
    }
    showConfirmDialog.value = true
}

onMounted(() => {
    controller.fetchRoles()
    controller.fetchCountries()
})

const refreshTable = () => {
    tableRef.value?.refresh()
}

const onCreateSubmit = async () => {
    const result = await controller.createAccount()
    if (result.success) {
        refreshTable()
        toast.add({
            type: 'success',
            title: 'Created',
            message: result.message || 'New account created successfully.'
        })
    } else {
        toast.add({
            type: 'error',
            title: 'Error',
            message: result.message || 'Failed to create account.'
        })
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Management Accounts</h1>
        <button @click="controller.showCreateDialog.value = true" class="create-btn">Create New User</button>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/management-accounts"
      :columns="columns"
      :filters="filters"
      selectable
      @update:selection="onSelectionChange"
      searchable
      title="Admin Users"
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
                    <div class="separator"></div>
                    <button @click="triggerBulkDelete" class="bulk-menu-item text-danger">
                        <Trash2 :size="16" /> Delete Selected
                    </button>
                </div>
            </BaseDropdown>
        </template>
        <template #cell-surname="{ row }">
            {{ row.surname }} {{ row.otherNames }}
        </template>

        <template #cell-verificationStatus="{ row }">
             <span class="status-badge" :class="(row.verificationStatus as string)?.toLowerCase() || 'pending'">
                {{ row.verificationStatus || 'Pending' }}
            </span>
        </template>

        <template #cell-isActive="{ row }">
            <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
                {{ row.isActive ? 'Active' : 'Inactive' }}
            </span>
        </template>

        <template #actions="{ row }">
            <div class="actions-flex">
                <button
                    class="icon-action"
                    :title="row.isActive ? 'Deactivate' : 'Activate'"
                    @click="handleActivation(row.id as number, row.isActive as boolean)"
                >
                    <Unlock v-if="!row.isActive" :size="16" />
                    <Lock v-else :size="16" />
                </button>
                <button class="icon-action danger" title="Delete" @click="triggerDelete(row)">
                    <Trash2 :size="16" />
                </button>
            </div>
        </template>
    </DataTable>

    <!-- Create Dialog -->
    <BaseDialog
        :show="controller.showCreateDialog.value"
        title="Create Management Account"
        @close="controller.showCreateDialog.value = false"
    >
        <form @submit.prevent="onCreateSubmit" id="createForm">
             <div class="form-grid">
                <div class="form-group">
                    <label>Email *</label>
                    <input v-model="controller.createForm.value.email" type="email" required class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Role *</label>
                     <select v-model="controller.createForm.value.role" required class="premium-input">
                        <option value="" disabled>Select Role</option>
                        <option v-for="r in controller.roles.value" :key="r" :value="r">
                            {{ r }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Surname</label>
                    <input v-model="controller.createForm.value.surname" type="text" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Other Names</label>
                    <input v-model="controller.createForm.value.otherNames" type="text" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Phone Number</label>
                    <input v-model="controller.createForm.value.phoneNumber" type="tel" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Country *</label>
                     <select v-model="controller.createForm.value.countryId" required class="premium-input">
                        <option value="" disabled>Select Country</option>
                        <option v-for="c in controller.countries.value" :key="c.id" :value="c.id">
                            {{ c.name }}
                        </option>
                    </select>
                </div>
            </div>
        </form>
        <template #footer>
            <button class="cancel-btn" @click="controller.showCreateDialog.value = false">Cancel</button>
            <button type="submit" form="createForm" class="submit-btn" :disabled="controller.createLoading.value">
                {{ controller.createLoading.value ? 'Creating...' : 'Create' }}
            </button>
        </template>
    </BaseDialog>

    <ConfirmDialog
        v-model:show="showConfirmDialog"
        :title="confirmConfig.title"
        :message="confirmConfig.message"
        type="danger"
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

.bulk-trigger-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-primary); /* Or a nice neutral if you prefer */
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

.separator {
    height: 1px;
    background: var(--color-border);
    margin: 0.5rem 0;
}

/* Status colors helpers */
.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }

.text-danger:hover {
    background: #fef2f2;
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
}

.create-btn:hover {
    background: var(--color-primary-hover);
}

.actions-flex {
    display: flex;
    gap: 0.5rem;
}

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

.icon-action:hover {
    background: var(--color-bg-secondary);
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.icon-action.danger:hover {
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-badge.active, .status-badge.verified {
    background: #dcfce7;
    color: #166534;
}

.status-badge.inactive, .status-badge.pending {
    background: #fee2e2;
    color: #991b1b;
}

/* Form Styles used in Dialog */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 600;
}

.premium-input {
    padding: 0.6rem;
    border: 1px solid var(--color-border-input);
    border-radius: 6px;
    background: var(--color-bg-input);
    color: var(--color-text-primary);
}

.submit-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: none;
}

.submit-btn {
    background: var(--color-primary);
    color: white;
}

.cancel-btn {
    background: transparent;
    color: var(--color-text-secondary);
}
</style>
