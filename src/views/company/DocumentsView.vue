<script setup lang="ts">
import { computed } from 'vue'
import { useDocumentsController } from '@/controllers/useDocumentsController'
import DataTable from '@/components/core/DataTable.vue'
import { Download, Trash2, Upload, FileText, UploadCloud } from 'lucide-vue-next'

const controller = useDocumentsController()

const columns = [
  { key: 'name', label: 'Document Name', sortable: true },
  { key: 'expiryDate', label: 'Expiry Date', sortable: true },
  { key: 'createdAt', label: 'Date Added', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const filters: any[] = [
  {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' }
      ]
  },
  {
      key: 'createdAt',
      label: 'Date Added',
      type: 'date'
  }
]

const documentsEndpoint = computed(() => {
    return controller.currentCompany.value?.companyId
        ? `/companies/${controller.currentCompany.value.companyId}/documents`
        : ''
})
</script>

<template>
  <div>
    <div class="page-header mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Manage legal and business documents for {{ controller.currentCompany.value?.name }}</p>
        </div>
    </div>

    <!-- Needed Documents Warning -->
    <div v-if="controller.neededDocuments.value.length > 0" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 class="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Required Documents</h3>
        <ul class="space-y-1">
            <li v-for="doc in controller.neededDocuments.value" :key="doc.documentTypeId || doc.id" class="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                {{ doc.title || doc.name }}
            </li>
        </ul>
    </div>

    <DataTable
      :api-url="documentsEndpoint"
      :columns="columns"
      :filters="filters"
      searchable
      title="Documents"
    >
        <template #header-actions>
            <button
                @click="controller.showUploadModal.value = true"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
                <Upload class="w-4 h-4 mr-2" />
                Upload Document
            </button>
        </template>

        <template #cell-expiryDate="{ row }">
            {{ new Date((row as any).expiryDate).toLocaleDateString() }}
        </template>

        <template #cell-createdAt="{ row }">
            {{ new Date((row as any).createdAt).toLocaleDateString() }}
        </template>

        <template #cell-status="{ row }">
            <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="(row as any).status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'"
            >
                {{ (row as any).status || 'Pending' }}
            </span>
        </template>

        <template #actions="{ row }">
             <div class="flex items-center gap-2">
                <a
                    :href="(row as any).url"
                    target="_blank"
                    class="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="View"
                >
                    <Download class="w-4 h-4" />
                </a>
                <button
                    @click="controller.deleteDocument((row as any).id)"
                    class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 class="w-4 h-4" />
                </button>
            </div>
        </template>
    </DataTable>
  </div>

  <!-- Upload Modal -->
  <div v-if="controller.showUploadModal.value" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-700">
        <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Upload Document</h3>
            <button @click="controller.resetUploadForm" class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <form @submit.prevent="controller.submitUpload">
            <div class="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
                <div v-for="(item, index) in controller.uploadItems.value" :key="item.id" class="relative p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div class="absolute -top-3 -right-3" v-if="controller.uploadItems.value.length > 1">
                        <button type="button" @click="controller.removeUploadItem(index)" class="p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="space-y-5">
                        <div class="space-y-2">
                             <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Document Type</label>
                             <div class="relative">
                                <select
                                    v-model="item.documentTypeId"
                                    required
                                    class="w-full px-4 py-3.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                >
                                    <option :value="null" disabled>Select type...</option>
                                    <option
                                        v-for="type in controller.neededDocuments.value"
                                        :key="type.documentTypeId"
                                        :value="type.documentTypeId"
                                    >
                                        {{ type.title }} (Required)
                                    </option>
                                </select>
                             </div>
                        </div>

                        <div class="space-y-2">
                             <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Expiry Date</label>
                             <input
                                type="date"
                                v-model="item.expiryDate"
                                class="w-full px-4 py-3.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                             />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Document File</label>
                            <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative group">
                                <input
                                    type="file"
                                    @change="(e) => controller.handleFileUpload(e, index)"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                    accept=".pdf,image/*"
                                    required
                                />
                                <div v-if="item.file" class="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                    <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                                        <FileText class="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{{ item.file.name }}</span>
                                    <span class="text-xs text-slate-500 mt-1">Click to change</span>
                                </div>
                                <div v-else class="group-hover:scale-105 transition-transform duration-200">
                                    <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                                        <UploadCloud class="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p class="text-sm font-medium text-slate-600 dark:text-slate-300">Click or drag file here</p>
                                    <p class="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" @click="controller.addUploadItem" class="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 font-medium">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Another Document
                </button>
            </div>

            <div class="p-6 pt-2">
                <button
                    type="submit"
                    :disabled="controller.loading.value"
                    class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                >
                    <span v-if="!controller.loading.value">Upload Document(s)</span>
                    <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                </button>
                <div class="mt-4 text-center">
                    <button type="button" @click="controller.resetUploadForm" class="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </div>
  </div>
</template>
