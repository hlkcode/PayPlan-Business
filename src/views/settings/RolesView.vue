<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/core/DataTable.vue'
import { managementService } from '@/services/management/ManagementAccountService'

const tableRef = ref()
const loading = ref(false)
const roles = ref<{id: number, name: string, roleClaims: string[]}[]>([])

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'roleClaims', label: 'Claims', sortable: false },
]

const fetchData = async () => {
    loading.value = true
    try {
        const response = await managementService.getRoles()
        if (response.isSuccess) {
            roles.value = response.data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<template>
  <div>
    <div class="page-header">
        <h1>Roles</h1>
    </div>

    <div class="table-container">
        <DataTable
            ref="tableRef"
            :api-url="''"
            :columns="columns"
            :items="roles"
            :loading="loading"
            title="System Roles"
            :searchable="false"
        >
             <template #cell-roleClaims="{ row }">
                <td>
                    {{ row.roleClaims && Array.isArray(row.roleClaims) && row.roleClaims.length ? row.roleClaims.join(', ') : 'None' }}
                </td>
             </template>
        </DataTable>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); }
</style>
