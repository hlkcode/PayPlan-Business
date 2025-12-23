<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import SearchableSelect from '@/components/core/form/SearchableSelect.vue'
import { useDocumentController } from '@/controllers/useDocumentController'
import { Trash2, Pencil } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const {
    fetchDependencies,
    openCreateCd,
    openEditCd,
    saveCd,
    deleteCd,
    showCdDialog,
    cdForm,
    cdFormLoading,
    editingCdId,
    countries,
    docTypes
} = useDocumentController()
const tableRef = ref()
const toast = useToastStore()

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'documentTypeName', label: 'Type', sortable: true },
  { key: 'countryName', label: 'Country', sortable: true },
]

onMounted(() => {
    fetchDependencies()
})

const refreshTable = () => {
    tableRef.value?.refresh()
}

const onSave = async () => {
    try {
        const result = await saveCd()
        if (result.success) {
            refreshTable()
            toast.add({
                type: 'success',
                title: 'Success',
                message: result.message || 'Document link saved successfully.'
            })
        } else {
             toast.add({
                type: 'error',
                title: 'Error',
                message: result.message || 'Failed to save document link.'
            })
        }
    } catch { // Removed unused 'e'
        toast.add({
            type: 'error',
            title: 'Error',
            message: 'An unexpected error occurred.'
        })
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDelete = async (row: any) => {
    if (confirm('Are you sure?')) {
        try {
            const result = await deleteCd(Number(row.id))
            if (result.success) {
                refreshTable()
                toast.add({
                    type: 'success',
                    title: 'Deleted',
                    message: result.message || 'Document link removed successfully.'
                })
            } else {
                 toast.add({
                    type: 'error',
                    title: 'Error',
                    message: result.message || 'Failed to delete document link.'
                })
            }
        } catch {
             toast.add({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete document link.'
            })
        }
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Country Documents</h1>
        <button @click="openCreateCd()" class="create-btn">Link Document</button>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/CountryDocumentTypes"
      :columns="columns"
      searchable
      title="Country Documents"
    >

        <template #actions="{ row }">
            <div class="actions-flex">
                <button class="icon-action" title="Edit" @click="openEditCd(row as any)">
                    <Pencil :size="16" />
                </button>
                <button class="icon-action danger" title="Delete" @click="onDelete(row)">
                    <Trash2 :size="16" />
                </button>
            </div>
        </template>
    </DataTable>

    <BaseDialog
        :show="showCdDialog"
        :title="editingCdId ? 'Edit Link' : 'Link Document'"
        @close="showCdDialog = false"
    >
        <form @submit.prevent="onSave" id="cdForm">
            <div class="form-group">
                <label>Country</label>
                <SearchableSelect
                    v-model="cdForm.countryId"
                    :options="countries"
                    label-key="name"
                    value-key="id"
                    placeholder="Select Country"
                    searchable
                />
            </div>
            <div class="form-group">
                <label>Document Type</label>
                <SearchableSelect
                    v-model="cdForm.documentTypeId"
                    :options="docTypes"
                    label-key="name"
                    value-key="id"
                    placeholder="Select Document Type"
                    searchable
                />
            </div>
        </form>
        <template #footer>
            <button class="cancel-btn" @click="showCdDialog = false">Cancel</button>
            <button type="submit" form="cdForm" class="submit-btn" :disabled="cdFormLoading">
                {{ cdFormLoading ? 'Saving...' : 'Save' }}
            </button>
        </template>
    </BaseDialog>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; }
.create-btn { background: var(--color-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
.actions-flex { display: flex; gap: 0.5rem; }
.icon-action { background: none; border: 1px solid var(--color-border); border-radius: 6px; padding: 6px; cursor: pointer; color: var(--color-text-secondary); }
.icon-action.danger:hover { color: var(--color-danger); border-color: var(--color-danger); }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.premium-input { padding: 0.6rem; border: 1px solid var(--color-border-input); border-radius: 6px; background: var(--color-bg-input); color: var(--color-text-primary); }

.submit-btn { background: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); padding: 0.5rem 1rem; border: none; cursor: pointer; }
</style>
