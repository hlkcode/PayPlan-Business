<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import { useDocumentController } from '@/controllers/useDocumentController'
import { Trash2, Pencil } from 'lucide-vue-next'

const controller = useDocumentController()
const tableRef = ref()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
]

const refreshTable = () => {
    tableRef.value?.refresh()
}

const onSave = async () => {
    const success = await controller.saveType()
    if (success) refreshTable()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDelete = async (row: any) => {
    if (confirm('Are you sure you want to delete this document type?')) {
        await controller.deleteType(row.id)
        refreshTable()
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Document Types</h1>
        <button @click="controller.openCreateType()" class="create-btn">Add Type</button>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/DocumentTypes"
      :columns="columns"
      searchable
      title="Document Types"
    >
        <template #actions="{ row }">
            <div class="actions-flex">
                <button class="icon-action" title="Edit" @click="controller.openEditType(row as any)">
                    <Pencil :size="16" />
                </button>
                <button class="icon-action danger" title="Delete" @click="onDelete(row)">
                    <Trash2 :size="16" />
                </button>
            </div>
        </template>
    </DataTable>

    <BaseDialog
        :show="controller.showTypeDialog.value"
        :title="controller.editingTypeId?.value ? 'Edit Type' : 'Create Type'"
        @close="controller.showTypeDialog.value = false"
    >
        <form @submit.prevent="onSave" id="typeForm">
            <div class="form-group">
                <label>Name</label>
                <input v-model="controller.typeForm.value.name" type="text" required class="premium-input" />
            </div>
        </form>
        <template #footer>
            <button class="cancel-btn" @click="controller.showTypeDialog.value = false">Cancel</button>
            <button type="submit" form="typeForm" class="submit-btn" :disabled="controller.typeFormLoading.value">
                {{ controller.typeFormLoading.value ? 'Saving...' : 'Save' }}
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
