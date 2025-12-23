import { ref } from 'vue'
import { countryService } from '@/services/CountryService'
import type { Country, PaginationDto } from '@/models/common'

export function useCountryController() {
  const loading = ref(false)
  const countries = ref<Country[]>([])
  const totalRecords = ref(0)

  // Documents for a country
  const docsLoading = ref(false)
  const showDocsDialog = ref(false)

  const fetchCountries = async (params: PaginationDto) => {
    loading.value = true
    try {
      const response = await countryService.getAll(params)
      if (response.isSuccess) {
        countries.value = response.data.items
        totalRecords.value = response.data.totalCount
      }
    } catch (error) {
      console.error('Failed to fetch countries', error)
    } finally {
      loading.value = false
    }
  }

  const toggleActivation = async (id: number, currentStatus: boolean) => {
    try {
      const response = await countryService.activate(id, !currentStatus)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any
      console.error('Activation failed', err)
      if (err.response && err.response.status === 400) {
        return { success: false, message: err.response.data.message }
      } else {
        return { success: false, message: err.message || 'Activation failed' }
      }
    }
  }

  // Document Types View
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const documentTypesView = ref<any[]>([])
  // Reuse existing docsLoading and showDocsDialog

  // ... (fetchCountries, toggleActivation stay same)

  const fetchDocumentTypes = async (countryId: number) => {
    docsLoading.value = true
    try {
      const response = await countryService.getDocumentTypes(countryId)
      if (response.isSuccess) {
        documentTypesView.value = response.data.items
        showDocsDialog.value = true
      }
    } catch (error) {
      console.error('Failed to fetch doc types', error)
    } finally {
      docsLoading.value = false
    }
  }

  return {
    loading,
    countries,
    totalRecords,

    documentTypesView,
    docsLoading,
    showDocsDialog,

    fetchCountries,
    toggleActivation,
    fetchDocumentTypes,
  }
}
