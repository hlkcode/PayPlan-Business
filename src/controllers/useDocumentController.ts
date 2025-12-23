import { ref } from 'vue'
import { documentService } from '@/services/DocumentService'
import type {
  DocumentType,
  CreateDocumentTypeInput,
  CountryDocument,
  CreateCountryDocumentInput,
} from '@/models/admin'
import type { PaginationDto, Country } from '@/models/common'
import { commonService } from '@/services/CommonService'

export function useDocumentController() {
  // --- Document Types ---
  const typesLoading = ref(false)
  const docTypes = ref<DocumentType[]>([])
  const typesTotal = ref(0)

  const showTypeDialog = ref(false)
  const typeFormLoading = ref(false)
  const typeForm = ref<CreateDocumentTypeInput>({ name: '' })
  const editingTypeId = ref<number | null>(null)

  const fetchTypes = async (params: PaginationDto) => {
    typesLoading.value = true
    try {
      const response = await documentService.getTypes(params)
      if (response.isSuccess) {
        docTypes.value = response.data.items
        typesTotal.value = response.data.totalCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      typesLoading.value = false
    }
  }

  const openCreateType = () => {
    editingTypeId.value = null
    typeForm.value = { name: '' }
    showTypeDialog.value = true
  }

  const openEditType = (type: DocumentType) => {
    editingTypeId.value = type.id
    typeForm.value = { name: type.name }
    showTypeDialog.value = true
  }

  const saveType = async () => {
    typeFormLoading.value = true
    try {
      if (editingTypeId.value) {
        await documentService.updateType(editingTypeId.value, typeForm.value)
      } else {
        await documentService.createType(typeForm.value)
      }
      showTypeDialog.value = false
      return true
    } catch (e) {
      console.error(e)
      return false
    } finally {
      typeFormLoading.value = false
    }
  }

  const deleteType = async (id: number) => {
    try {
      await documentService.deleteType(id)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  // --- Country Documents ---
  const cdLoading = ref(false)
  const countryDocs = ref<CountryDocument[]>([])
  const cdTotal = ref(0) // Pagination for this list

  const showCdDialog = ref(false)
  const cdFormLoading = ref(false)
  const cdForm = ref<CreateCountryDocumentInput>({ countryId: 0, documentTypeId: 0 })
  const editingCdId = ref<number | null>(null)

  const countries = ref<Country[]>([])

  // Helper to fetch all deps
  const fetchDependencies = async () => {
    try {
      const cRes = await commonService.getAllCountries()
      if (cRes.isSuccess) countries.value = cRes.data

      // Should also ensure types are loaded for dropdown
      if (docTypes.value.length === 0) {
        // Fetch all/some types
        fetchTypes({ pageNumber: 1, pageSize: 100 })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchCountryDocuments = async (params: PaginationDto) => {
    cdLoading.value = true
    try {
      const response = await documentService.getCountryDocuments(params)
      if (response.isSuccess) {
        countryDocs.value = response.data.items
        cdTotal.value = response.data.totalCount
      }
    } catch (e) {
      console.error(e)
    } finally {
      cdLoading.value = false
    }
  }

  const openCreateCd = () => {
    try {
      console.log('openCreateCd called')
      editingCdId.value = null

      // Safely assign defaults with strict checks
      const hasCountries = countries.value && countries.value.length > 0
      const defaultCountryId = hasCountries ? countries.value[0]?.id : 0

      const hasDocTypes = docTypes.value && docTypes.value.length > 0
      const defaultDocTypeId = hasDocTypes ? docTypes.value[0]?.id : 0
      cdForm.value = { countryId: defaultCountryId || 0, documentTypeId: defaultDocTypeId || 0 }

      console.log('Setting showCdDialog to true')
      showCdDialog.value = true
    } catch (error) {
      console.error('Error in openCreateCd:', error)
      // Even if setup fails, try to open dialog so user sees something (empty form)
      showCdDialog.value = true
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditCd = (item: any) => {
    editingCdId.value = item.id
    cdForm.value = { countryId: item.countryId, documentTypeId: item.documentTypeId }
    showCdDialog.value = true
  }

  const saveCd = async () => {
    cdFormLoading.value = true
    try {
      let response
      if (editingCdId.value) {
        response = await documentService.updateCountryDocument(editingCdId.value, cdForm.value)
      } else {
        response = await documentService.createCountryDocument(cdForm.value)
      }
      if (response.isSuccess) {
        showCdDialog.value = false
      }
      return { success: response.isSuccess, message: response.message }
    } catch (e) {
      const err = e as Error
      console.error(err)
      return { success: false, message: err.message || 'Action failed' }
    } finally {
      cdFormLoading.value = false
    }
  }

  const deleteCd = async (id: number) => {
    try {
      const response = await documentService.deleteCountryDocument(id)
      return { success: response.isSuccess, message: response.message }
    } catch (e) {
      const err = e as Error
      console.error(err)
      return { success: false, message: err.message || 'Delete failed' }
    }
  }

  return {
    // Types
    typesLoading,
    docTypes,
    typesTotal,
    showTypeDialog,
    typeFormLoading,
    typeForm,
    editingTypeId, // Added
    fetchTypes,
    openCreateType,
    openEditType,
    saveType,
    deleteType,

    // CountryDocs
    cdLoading,
    countryDocs,
    cdTotal,
    showCdDialog,
    cdFormLoading,
    cdForm,
    editingCdId, // Added
    fetchCountryDocuments,
    openCreateCd,
    openEditCd,
    saveCd,
    deleteCd,

    // Deps
    countries,
    fetchDependencies,
  }
}
