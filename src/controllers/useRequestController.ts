import { ref } from 'vue'
import { requestService } from '@/services/RequestService'
import type { Request } from '@/models/admin'
import type { PaginationDto } from '@/models/common'

export function useRequestController() {
  const loading = ref(false)
  const requests = ref<Request[]>([])
  const totalRecords = ref(0)
  const activeTab = ref<'pending' | 'all'>('pending')

  // Dialog State
  const showApprovalDialog = ref(false)
  const selectedRequest = ref<Request | null>(null)
  const approvalLoading = ref(false)

  const fetchRequests = async (params: PaginationDto) => {
    loading.value = true
    try {
      // Choose endpoint based on active tab
      const apiCall =
        activeTab.value === 'pending'
          ? requestService.getPending(params)
          : requestService.getAll(params)

      const response = await apiCall
      if (response.isSuccess) {
        requests.value = response.data.items
        totalRecords.value = response.data.totalCount
      }
    } catch (error) {
      console.error('Failed to fetch requests', error)
    } finally {
      loading.value = false
    }
  }

  const openApprovalDialog = (request: Request) => {
    selectedRequest.value = request
    showApprovalDialog.value = true
  }

  const processApproval = async (approve: boolean, note?: string) => {
    if (!selectedRequest.value) return { success: false }

    approvalLoading.value = true
    try {
      const payload = {
        id: selectedRequest.value.id,
        approve,
        note,
        accpetedDocs: [], // Todo: Wire up document selection if UI supports it
      }
      const response = await requestService.approve(payload)
      if (response.isSuccess) {
        showApprovalDialog.value = false
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Action failed' }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    } finally {
      approvalLoading.value = false
    }
  }

  return {
    loading,
    requests,
    totalRecords,
    activeTab,
    showApprovalDialog,
    selectedRequest,
    approvalLoading,
    fetchRequests,
    openApprovalDialog,
    processApproval,
  }
}
