import { ref, onMounted, computed } from 'vue'
import { companyService } from '@/services/CompanyService'
import { useCompanyStore } from '@/stores/company'
import { useToastStore } from '@/stores/toast'
import type { CompanyDocument, DocumentType } from '@/models/admin'

export const useDocumentsController = () => {
  const companyStore = useCompanyStore()
  const toast = useToastStore()

  const documents = ref<CompanyDocument[]>([])
  const loading = ref(false)
  const isUploading = ref(false)

  const neededDocuments = ref<DocumentType[]>([])

  const currentCompany = computed(() => companyStore.currentCompany)

  const fetchDocuments = async () => {
    if (!companyStore.currentCompany?.companyId) return

    loading.value = true
    try {
      const response = await companyService.getDocuments(companyStore.currentCompany.companyId, {
        pageNumber: 1,
        pageSize: 100,
      })

      if (response.isSuccess && response.data) {
        documents.value = response.data.items || []
      }
    } catch (error) {
      console.error(error)
      toast.add({ type: 'error', title: 'Error', message: 'Failed to load documents' })
    } finally {
      loading.value = false
    }
  }

  const fetchNeededDocumentTypes = async () => {
    if (!companyStore.currentCompany?.companyId) return
    try {
      const response = await companyService.getNeededDocumentTypes(
        companyStore.currentCompany.companyId,
      )
      if (response.isSuccess && response.data) {
        neededDocuments.value = response.data.items || []
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Multi-upload state
  interface UploadItem {
    id: string
    documentTypeId: number | null
    file: File | null
    expiryDate: string
  }

  const uploadItems = ref<UploadItem[]>([
    { id: crypto.randomUUID(), documentTypeId: null, file: null, expiryDate: '' },
  ])
  const showUploadModal = ref(false)

  const addUploadItem = () => {
    uploadItems.value.push({
      id: crypto.randomUUID(),
      documentTypeId: null,
      file: null,
      expiryDate: '',
    })
  }

  const removeUploadItem = (index: number) => {
    if (uploadItems.value.length > 1) {
      uploadItems.value.splice(index, 1)
    }
  }

  const resetUploadForm = () => {
    uploadItems.value = [
      { id: crypto.randomUUID(), documentTypeId: null, file: null, expiryDate: '' },
    ]
    showUploadModal.value = false
  }

  const handleFileUpload = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      if (file && uploadItems.value[index]) {
        uploadItems.value[index].file = file
      }
    }
  }

  const submitUpload = async () => {
    if (!companyStore.currentCompany?.companyId) return

    // Validate that at least one item has a file and type
    const validItems = uploadItems.value.filter((item) => item.file && item.documentTypeId)
    if (validItems.length === 0) {
      toast.add({
        type: 'warning',
        title: 'Validation',
        message: 'Please select a file and document type.',
      })
      return
    }

    loading.value = true
    const formData = new FormData()
    formData.append('companyId', companyStore.currentCompany.companyId.toString())

    validItems.forEach((item, index) => {
      formData.append(`files[${index}].documentTypeId`, item.documentTypeId!.toString())
      formData.append(`files[${index}].file`, item.file!)
      // if (item.expiryDate) {
      formData.append(`files[${index}].expiryDate`, item.expiryDate)
      // }
    })

    try {
      console.log('FormData Entries:', Array.from(formData.entries()))

      const response = await companyService.submitKyc(formData)
      if (response.isSuccess) {
        toast.add({ type: 'success', title: 'Success', message: 'Documents uploaded successfully' })
        resetUploadForm()
        fetchDocuments()
        fetchNeededDocumentTypes()
      } else {
        toast.add({ type: 'error', title: 'Error', message: 'Failed to upload documents' })
      }
    } catch (error) {
      console.error(error)
      toast.add({ type: 'error', title: 'Error', message: 'Failed to upload documents' })
    } finally {
      loading.value = false
    }
  }

  // Placeholder for upload logic if needed, or delete
  const deleteDocument = async (id: number) => {
    // Confirm dialog logic usually in view
    try {
      const response = await companyService.deleteDocument(id)
      if (response.isSuccess) {
        toast.add({ type: 'success', title: 'Deleted', message: 'Document removed' })
        fetchDocuments()
        fetchNeededDocumentTypes()
      } else {
        toast.add({ type: 'error', title: 'Error', message: 'Failed to delete document' })
      }
    } catch {
      toast.add({ type: 'error', title: 'Error', message: 'Failed to delete document' })
    }
  }

  onMounted(() => {
    if (companyStore.currentCompany) {
      fetchDocuments()
      fetchNeededDocumentTypes()
    }
  })

  return {
    documents,
    neededDocuments,
    uploadItems,
    addUploadItem,
    removeUploadItem,
    resetUploadForm,
    showUploadModal,
    handleFileUpload,
    submitUpload,
    loading,
    isUploading,
    currentCompany,
    fetchDocuments,
    fetchNeededDocumentTypes,
    deleteDocument,
  }
}
