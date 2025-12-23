<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import { useRequestController } from '@/controllers/useRequestController'
import RequestApprovalDialog from '@/components/requests/RequestApprovalDialog.vue'
import { useToastStore } from '@/stores/toast'
import { Eye } from 'lucide-vue-next'

const controller = useRequestController()
const toast = useToastStore()
const tableRef = ref()

const columns = [
  { key: 'description', label: 'Description', sortable: true },
  { key: 'platform', label: 'Platform', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true },
]

const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'all', label: 'All Requests' }
]

// Refresh table when tab changes
watch(controller.activeTab, () => {
    tableRef.value?.refresh()
})

const onApproveReject = async (approve: boolean, note: string) => {
    const result = await controller.processApproval(approve, note)
    if (result.success) {
        toast.add({
            type: 'success',
            title: approve ? 'Approved' : 'Rejected',
            message: result.message || `Request ${approve ? 'approved' : 'rejected'} successfully.`
        })
        tableRef.value?.refresh()
    } else {
        toast.add({
            type: 'error',
            title: 'Error',
            message: result.message || 'Action failed.'
        })
    }
}
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Requests</h1>
    </div>

    <div class="tabs-container">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: controller.activeTab.value === tab.id }"
            @click="controller.activeTab.value = tab.id as any"
        >
            {{ tab.label }}
        </button>
    </div>

    <DataTable
      ref="tableRef"
      api-url="/Requests/all"
      :columns="columns"
      searchable
      :title="controller.activeTab.value === 'pending' ? 'Pending Requests' : 'All Requests'"
      :custom-fetch="controller.fetchRequests"
    >
        <template #cell-createdAt="{ row }">
            {{ new Date((row as any).createdAt).toLocaleDateString() }}
        </template>

        <template #cell-status="{ row }">
             <span :class="['status-badge', ((row as any).status || '').toLowerCase()]">
                {{ (row as any).status }}
            </span>
        </template>

        <template #actions="{ row }">
            <button class="icon-action" title="View Details" @click="controller.openApprovalDialog(row as any)">
                <Eye :size="16" />
            </button>
        </template>
    </DataTable>

    <RequestApprovalDialog
        :show="controller.showApprovalDialog.value"
        :request="controller.selectedRequest.value"
        :loading="controller.approvalLoading.value"
        @close="controller.showApprovalDialog.value = false"
        @approve="(note: string) => onApproveReject(true, note)"
        @reject="(note: string) => onApproveReject(false, note)"
    />
  </div>
</template>

<style scoped>
.page-header {
    margin-bottom: 2rem;
}

.page-header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-text-primary);
    font-weight: 700;
}

.tabs-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

.tab-btn {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: all 0.2s;
    font-size: 0.95rem;
}

.tab-btn:hover {
    color: var(--color-primary);
}

.tab-btn.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
    font-weight: 600;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #e2e8f0;
    color: #475569;
}

.status-badge.accepted, .status-badge.approved {
    background: #dcfce7;
    color: #166534;
}

.status-badge.pending {
    background: #fef9c3;
    color: #854d0e;
}

.status-badge.rejected {
    background: #fee2e2;
    color: #991b1b;
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
</style>
