<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import { useCompanyController } from '@/controllers/useCompanyController'
import { Pencil, Lock, Unlock, FileText } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const controller = useCompanyController()
const tableRef = ref()
const toast = useToastStore()

const columns = [
  { key: 'name', label: 'Company Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phoneNumber', label: 'Phone', sortable: false },
  { key: 'tin', label: 'TIN', sortable: false },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'isActive', label: 'Status', sortable: false },
]

onMounted(() => {
    controller.fetchCountries()
})

const refreshTable = () => {
    tableRef.value?.refresh()
}

const onEditSubmit = async () => {
    const result = await controller.updateCompany()
    if (result.success) {
        refreshTable()
        toast.add({
            type: 'success',
            title: 'Updated',
            message: result.message || 'Company details updated successfully.'
        })
    } else {
        toast.add({
            type: 'error',
            title: 'Error',
            message: result.message || 'Failed to update company.'
        })
    }
}

const handleActivation = async (id: number, currentStatus: boolean) => {
    const result = await controller.toggleActivation(id, currentStatus)
    if (result.success) {
        refreshTable()
        toast.add({
            type: 'success',
            title: currentStatus ? 'Deactivated' : 'Activated',
            message: result.message || `Company successfully ${currentStatus ? 'deactivated' : 'activated'}.`
        })
    } else {
        toast.add({
            type: 'error',
            title: 'Error',
            message: result.message || `Failed to ${currentStatus ? 'deactivate' : 'activate'} company.`
        })
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Companies</h1>
        <!-- No Create Company -->
    </div>

    <DataTable
      ref="tableRef"
      api-url="/Companies"
      :columns="columns"
      searchable
      title="Companies"
    >
        <template #cell-country="{ row }">
            {{ row.country }}
        </template>

        <template #cell-isActive="{ row }">
            <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
                {{ row.isActive ? 'Active' : 'Inactive' }}
            </span>
        </template>

        <template #actions="{ row }">
            <div class="actions-flex">
                <button class="icon-action" title="Documents" @click="controller.fetchCompanyDocuments(row.id as number)">
                    <FileText :size="16" />
                </button>
                <button class="icon-action" title="Edit" @click="controller.openEdit(row as any)">
                    <Pencil :size="16" />
                </button>
                <button
                    class="icon-action"
                    :title="row.isActive ? 'Deactivate' : 'Activate'"
                    @click="handleActivation(row.id as number, row.isActive as boolean)"
                >
                    <Unlock v-if="!row.isActive" :size="16" />
                    <Lock v-else :size="16" />
                </button>
            </div>
        </template>
    </DataTable>

    <!-- Edit Dialog -->
    <BaseDialog
        :show="controller.showEditDialog.value"
        title="Edit Company"
        @close="controller.showEditDialog.value = false"
    >
        <form @submit.prevent="onEditSubmit" id="editForm">
             <div class="form-grid">
                <div class="form-group">
                    <label>Company Name</label>
                    <input v-model="controller.editForm.value.name" type="text" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="controller.editForm.value.email" type="email" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input v-model="controller.editForm.value.phoneNumber" type="tel" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>TIN</label>
                    <input v-model="controller.editForm.value.tin" type="text" class="premium-input" />
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <input v-model="controller.editForm.value.address" type="text" class="premium-input" />
                </div>

                 <div class="form-group">
                    <label>Country</label>
                     <select v-model="controller.editForm.value.countryId" class="premium-input">
                        <option value="" disabled>Select Country</option>
                        <option v-for="c in controller.countries.value" :key="c.id" :value="c.id">
                            {{ c.name }}
                        </option>
                    </select>
                </div>
            </div>
        </form>
        <template #footer>
            <button class="cancel-btn" @click="controller.showEditDialog.value = false">Cancel</button>
            <button type="submit" form="editForm" class="submit-btn" :disabled="controller.editLoading.value">
                {{ controller.editLoading.value ? 'Saving...' : 'Save' }}
            </button>
        </template>
    </BaseDialog>

    <!-- Documents Dialog (Read Only List) -->
    <BaseDialog
        :show="controller.showDocsDialog.value"
        title="Company Documents"
        @close="controller.showDocsDialog.value = false"
    >
        <div v-if="controller.docsLoading.value">Loading...</div>
        <div v-else>
            <ul v-if="controller.companyDocuments.value.length">
                <li v-for="doc in controller.companyDocuments.value" :key="doc.id">
                   <a :href="doc.documentUrl" target="_blank">Document #{{ doc.id }} ({{ doc.status }})</a>
                </li>
            </ul>
             <p v-else>No documents found.</p>
        </div>
        <template #footer>
            <button class="cancel-btn" @click="controller.showDocsDialog.value = false">Close</button>
        </template>
    </BaseDialog>
  </div>
</template>

<style scoped>
/* Reusing styles from ManagementAccounts.vue pattern */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.actions-flex { display: flex; gap: 0.5rem; }

.icon-action {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 6px;
    cursor: pointer;
    color: var(--color-text-secondary);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.inactive { background: #fee2e2; color: #991b1b; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.premium-input { padding: 0.6rem; border: 1px solid var(--color-border-input); border-radius: 6px; background: var(--color-bg-input); color: var(--color-text-primary); }

.submit-btn { background: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); padding: 0.5rem 1rem; border: none; cursor: pointer; }
</style>
