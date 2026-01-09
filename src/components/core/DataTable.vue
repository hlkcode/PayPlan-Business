<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import axios from '@/utils/axios'
import BaseDropdown from '@/components/core/dropdown/BaseDropdown.vue'
import BaseCheckbox from '@/components/core/form/BaseCheckbox.vue'
import { Columns, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-vue-next'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  formatter?: (val: unknown) => string
}

export interface FilterDef {
    key: string
    label: string
    type: 'text' | 'select' | 'date'
    options?: { value: string | number | boolean, label: string }[]
    placeholder?: string
}

const props = withDefaults(defineProps<{
  columns: Column[]
  apiUrl: string
  title?: string
  searchable?: boolean
  filters?: FilterDef[]
  selectable?: boolean
  items?: Record<string, unknown>[]
  loading?: boolean
}>(), {
  loading: undefined
})

const data = ref<Record<string, unknown>[]>([])
const selectedRows = ref<Set<string | number>>(new Set())
const isAllSelected = computed(() => {
    return data.value.length > 0 && data.value.every(row => selectedRows.value.has(row.id as string | number))
})

const emit = defineEmits(['update:selection'])

const toggleSelection = (id: string | number) => {
    if (selectedRows.value.has(id)) {
        selectedRows.value.delete(id)
    } else {
        selectedRows.value.add(id)
    }
    emit('update:selection', Array.from(selectedRows.value))
}

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedRows.value.clear()
    } else {
        data.value.forEach(row => selectedRows.value.add(row.id as string | number))
    }
    emit('update:selection', Array.from(selectedRows.value))
}

const totalRecords = ref(0)
const internalLoading = ref(false)
const isLoading = computed(() => props.loading !== undefined ? props.loading : internalLoading.value)

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortOrder = ref('')
const sortBy = ref('')

const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value) || 1)
const pageSizeOptions = [10, 20, 50, 100]

// Feature: Column Visibility
const hiddenColumns = ref<Set<string>>(new Set())
const toggleColumn = (key: string) => {
    if (hiddenColumns.value.has(key)) {
        hiddenColumns.value.delete(key)
    } else {
        hiddenColumns.value.add(key)
    }
}
const visibleColumns = computed(() => props.columns.filter(c => !hiddenColumns.value.has(c.key)))

// Feature: Filters
const filterValues = ref<Record<string, string | number | boolean>>({})
const appliedFiltersCount = computed(() => {
    return Object.values(filterValues.value).filter(v => v !== '' && v !== null && v !== undefined).length
})

const clearFilters = () => {
    filterValues.value = {}
    fetchData()
}

const getCellValue = (row: Record<string, unknown>, column: Column) => {
  const value = row[column.key]
  if (column.formatter) {
    return column.formatter(value)
  }
  // Handle nested properties (e.g. country.name) if key is 'country.name'
  if (column.key.includes('.')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return column.key.split('.').reduce((acc: Record<string, any>, part) => acc && acc[part], row)
  }
  return value
}

const fetchData = async () => {
  if (props.items) {
      data.value = props.items
      totalRecords.value = props.items.length
      return
  }

  internalLoading.value = true
  try {
    // Standardized Params for .NET API
    const params: Record<string, string | number | boolean> = {
      PageNumber: currentPage.value,
      PageSize: pageSize.value,
      Query: searchQuery.value,
      ...filterValues.value // Spread generic filters
    }

    // Add sorting only if active
    if (sortBy.value) {
        params.OrderBy = sortBy.value
        params.SortOrder = sortOrder.value || 'asc'
    }

    const response = await axios.get(props.apiUrl, { params })

    const responseData = response.data

    if (responseData.isSuccess && responseData.data) {
        data.value = responseData.data.items || []
        totalRecords.value = responseData.data.totalCount || 0
    } else if (Array.isArray(responseData)) {
         // Fallback for endpoints returning direct array
        data.value = responseData
        totalRecords.value = responseData.length
    } else {
        data.value = []
        totalRecords.value = 0
    }

  } catch (error) {
    console.error('Failed to fetch data', error)
    data.value = []
    totalRecords.value = 0
  } finally {
    internalLoading.value = false
  }
}

// Debounce search
let timeout: ReturnType<typeof setTimeout> | undefined
const onSearch = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 500)
}

const onSort = (key: string) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
  fetchData()
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchData()
}

watch([pageSize, () => props.apiUrl], () => {
  currentPage.value = 1
  fetchData()
})

watch(() => props.items, (newItems) => {
      if (newItems) {
          data.value = newItems
          totalRecords.value = newItems.length
      }
}, { immediate: true })

onMounted(() => {
  fetchData()
})

defineExpose({ refresh: fetchData })
</script>

<template>
  <div class="data-table-container">
    <div class="table-header">
      <div class="header-left">
          <div class="header-controls">
               <!-- Search -->
              <div v-if="searchable" class="search-box">
                <Search :size="16" class="search-icon" />
                <input
                  v-model="searchQuery"
                  @input="onSearch"
                  placeholder="Search..."
                  class="control-input"
                />
              </div>

              <!-- Filters -->
              <BaseDropdown v-if="filters && filters.length > 0" align="left">
                  <template #trigger>
                       <button class="control-btn" :class="{ 'active': appliedFiltersCount > 0 }">
                            <Filter :size="16" />
                            <span>Filter</span>
                            <span v-if="appliedFiltersCount > 0" class="badge">{{ appliedFiltersCount }}</span>
                       </button>
                  </template>
                  <div class="dropdown-panel">
                      <div class="panel-header">
                          <span>Filter Options</span>
                          <button v-if="appliedFiltersCount > 0" @click="clearFilters" class="clear-btn">Clear</button>
                      </div>
                      <div class="filters-grid">
                          <div v-for="filter in filters" :key="filter.key" class="filter-item">
                              <label>{{ filter.label }}</label>

                              <select v-if="filter.type === 'select'" v-model="filterValues[filter.key]" class="filter-input" @change="fetchData">
                                    <option value="">All</option>
                                    <option v-for="opt in filter.options" :key="String(opt.value)" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                              </select>

                              <input
                                v-else-if="filter.type === 'date'"
                                type="date"
                                v-model="filterValues[filter.key]"
                                class="filter-input"
                                @change="fetchData"
                             />

                              <input
                                 v-else
                                 type="text"
                                 v-model="filterValues[filter.key]"
                                 class="filter-input"
                                 :placeholder="filter.placeholder"
                                 @change="fetchData"
                               />
                          </div>
                      </div>
                  </div>
              </BaseDropdown>

               <!-- Columns -->
               <BaseDropdown align="left">
                    <template #trigger>
                        <button class="control-btn">
                            <Columns :size="16" />
                            <span>View</span>
                        </button>
                    </template>
                    <div class="dropdown-list">
                        <div class="list-header">Toggle Columns</div>
                        <label v-for="col in columns" :key="col.key" class="column-toggle">
                            <BaseCheckbox
                                :modelValue="!hiddenColumns.has(col.key)"
                                @update:modelValue="toggleColumn(col.key)"
                                :label="col.label"
                            />
                        </label>
                    </div>
               </BaseDropdown>
          </div>

          <div v-if="selectable && selectedRows.size > 0" class="bulk-actions-slot">
               <slot name="bulk-actions" :selected="Array.from(selectedRows)"></slot>
          </div>
      </div>

      <div class="header-right">
           <slot name="header-actions"></slot>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="premium-table">
        <thead>
          <tr>
            <th v-if="selectable" class="checkbox-col">
                <BaseCheckbox
                    :modelValue="isAllSelected"
                    :indeterminate="data.length > 0 && selectedRows.size > 0 && !isAllSelected"
                    @update:modelValue="toggleSelectAll"
                />
            </th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              @click="col.sortable ? onSort(col.key) : null"
              :class="{ 'clickable': col.sortable }"
            >
              <div class="th-content">
                  {{ col.label }}
                  <span v-if="col.sortable && sortBy === col.key" class="sort-icon">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
              </div>
            </th>
            <th v-if="$slots.actions">Actions</th>
          </tr>
        </thead>
        <tbody>
            <template v-if="isLoading">
                <tr v-for="i in Math.min(pageSize, 5)" :key="`skeleton-${i}`" class="skeleton-row">
                    <td v-if="selectable" class="checkbox-col">
                        <div class="skeleton-box checkbox-skeleton"></div>
                    </td>
                    <td v-for="col in visibleColumns" :key="col.key">
                        <div class="skeleton-box text-skeleton" :style="{ width: Math.random() * 40 + 40 + '%' }"></div>
                    </td>
                    <td v-if="$slots.actions">
                         <div class="skeleton-box action-skeleton"></div>
                    </td>
                </tr>
            </template>
            <tr v-else-if="data.length === 0">
                 <td :colspan="visibleColumns.length + ($slots.actions ? 1 : 0) + (selectable ? 1 : 0)" class="empty-cell">
                    <div class="empty-state">
                        <div class="empty-icon">No Records</div>
                        <p>No records found</p>
                    </div>
                </td>
            </tr>
            <tr v-else v-for="(row, index) in data" :key="index" :class="{'selected-row': selectedRows.has(row.id as number)}">
                <td v-if="selectable" class="checkbox-col">
                     <BaseCheckbox
                        :modelValue="selectedRows.has(row.id as number)"
                        @update:modelValue="toggleSelection(row.id as number)"
                    />
                </td>
                <td v-for="col in visibleColumns" :key="col.key">
                    <slot :name="`cell-${col.key}`" :row="row">
                        {{ getCellValue(row, col) }}
                    </slot>
                </td>
                <td v-if="$slots.actions">
                    <slot name="actions" :row="row"></slot>
                </td>
            </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-footer">
        <div class="footer-left">
            <div class="rows-per-page">
                <span>Rows per page:</span>
                <select v-model="pageSize" class="page-size-select">
                    <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>
            <div class="page-info">
                {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalRecords) }} of {{ totalRecords }}
            </div>
        </div>

        <div class="pagination-controls">
            <button
                :disabled="currentPage === 1"
                @click="changePage(1)"
                class="page-icon-btn"
                title="First Page"
            >
                <ChevronsLeft :size="16" />
            </button>
            <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="page-icon-btn"
                title="Previous"
            >
                <ChevronLeft :size="16" />
            </button>

            <div class="page-numbers">
                <button
                    v-for="p in totalPages"
                    :key="p"
                    :class="['page-num-btn', { active: p === currentPage }]"
                    @click="changePage(p)"
                    v-show="Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages"
                >
                    <span v-if="Math.abs(p - currentPage) === 2 && p !== 1 && p !== totalPages">...</span>
                    <span v-else>{{ p }}</span>
                </button>
            </div>

             <button
                :disabled="currentPage >= totalPages"
                @click="changePage(currentPage + 1)"
                class="page-icon-btn"
                title="Next"
            >
                <ChevronRight :size="16" />
            </button>
            <button
                :disabled="currentPage >= totalPages"
                @click="changePage(totalPages)"
                class="page-icon-btn"
                title="Last Page"
            >
                <ChevronsRight :size="16" />
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  background: var(--color-bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.data-table-container:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.table-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
  gap: 1rem;
  flex-wrap: wrap;
}

.table-title {
  margin: 0;
  font-size: 1.125rem;
  color: var(--color-text-primary);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--color-text-secondary);
    pointer-events: none;
}

.control-input {
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid var(--color-border-input);
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  border-radius: 8px;
  width: 240px;
  outline: none;
  font-family: inherit;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.control-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light-opacity);
    width: 280px;
}

.control-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-card); /* Keep consistent */
    color: var(--color-text-primary);
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:hover {
    background: var(--color-bg-secondary);
    border-color: var(--color-text-secondary);
}

.control-btn.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

/* Badge */
.badge {
    background: white;
    color: var(--color-primary);
    font-size: 0.7rem;
    padding: 1px 5px;
    border-radius: 99px;
    font-weight: 700;
}

.control-btn.active .badge {
    background: rgba(255,255,255,0.2);
    color: white;
}

/* Dropdown styling */
.dropdown-panel { padding: 1rem; width: 300px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary); }
.clear-btn { font-size: 0.75rem; color: var(--color-primary); background: none; border: none; cursor: pointer; }
.filters-grid { display: flex; flex-direction: column; gap: 1rem; }
.filter-item { display: flex; flex-direction: column; gap: 0.25rem; }
.filter-item label { font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;}
.filter-input { padding: 0.5rem; border: 1px solid var(--color-border-input); border-radius: 6px; font-size: 0.875rem; background: var(--color-bg-input); color: var(--color-text-primary); }

.dropdown-list { padding: 0.5rem; min-width: 180px; }
.list-header { padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; }
.column-toggle { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; user-select: none; font-size: 0.9rem; color: var(--color-text-primary); }
.column-toggle:hover { background: var(--color-bg-secondary); }

/* Table */
.table-wrapper { overflow-x: auto; }
.premium-table { width: 100%; border-collapse: collapse; text-align: left; }
.premium-table th { padding: 0.875rem 1.5rem; background: var(--color-bg-secondary); font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); white-space: nowrap; user-select: none; }
.th-content { display: flex; align-items: center; gap: 0.5rem; }
.premium-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); font-size: 0.9rem; transition: background 0.1s; }
.premium-table tr:last-child td { border-bottom: none; }
.premium-table tr:hover td { background: var(--color-bg-secondary); }
.clickable { cursor: pointer; }
.clickable:hover .th-content { color: var(--color-primary); }

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--color-text-muted);
}
.empty-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Pagination Footer */
.pagination-footer {
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-card);
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.rows-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
}

.page-size-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-input);
    color: var(--color-text-primary);
    font-size: 0.875rem;
    cursor: pointer;
}

.page-info {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.page-icon-btn:hover:not(:disabled) {
    background: var(--color-bg-secondary);
    color: var(--color-primary);
}

.page-icon-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    align-items: center;
}

.page-num-btn {
    min-width: 32px;
    height: 32px;
    padding: 0 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    font-weight: 500;
}

.page-num-btn:hover {
    background: var(--color-bg-secondary);
}

.page-num-btn.active {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

/* Skeleton Loader */
.skeleton-row td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

.skeleton-box {
    background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-input) 50%, var(--color-bg-secondary) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    height: 20px;
}

.text-skeleton {
    height: 16px;
}

.checkbox-skeleton {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

.action-skeleton {
    width: 80px;
    height: 28px;
    margin: 0 auto;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
