import { ref } from 'vue'
import { companyService } from '@/services/CompanyService'
import type { Company, UpdateCompanyInput, CompanyDocument } from '@/models/admin'
import type { PaginationDto } from '@/models/common'
import { commonService } from '@/services/CommonService'
import type { Country } from '@/models/common'

import { useAuthStore } from '@/stores/auth'

export function useCompanyController() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const companies = ref<Company[]>([])
  const totalRecords = ref(0)
  // For editing
  const showEditDialog = ref(false)
  const editLoading = ref(false)
  const editForm = ref<UpdateCompanyInput>({})
  const currentCompanyId = ref<number | null>(null)

  // Documents
  const companyDocuments = ref<CompanyDocument[]>([])
  const docsLoading = ref(false)
  const showDocsDialog = ref(false)

  // Dependencies
  const countries = ref<Country[]>([])

  const fetchCompanies = async (params: PaginationDto) => {
    if (!authStore.user?.id) return
    loading.value = true
    try {
      const response = await companyService.getUserCompanies(authStore.user.id, params)
      if (response.isSuccess) {
        companies.value = response.data.items
        totalRecords.value = response.data.totalCount
      }
    } catch (error) {
      console.error('Failed to fetch companies', error)
    } finally {
      loading.value = false
    }
  }

  const openEdit = (company: Company) => {
    currentCompanyId.value = company.id
    editForm.value = {
      name: company.name,
      email: company.email,
      phoneNumber: company.phoneNumber,
      tin: company.tin,
      address: company.address,
      countryId: company.countryId,
    }
    showEditDialog.value = true
  }

  const updateCompany = async () => {
    if (!currentCompanyId.value) return { success: false, message: 'No company selected' }

    editLoading.value = true
    try {
      const response = await companyService.update(currentCompanyId.value, editForm.value)
      showEditDialog.value = false
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Update failed', err)
      return { success: false, message: err.message || 'Update failed' }
    } finally {
      editLoading.value = false
    }
  }

  const toggleActivation = async (id: number, currentStatus: boolean) => {
    try {
      const response = await companyService.activate(id, !currentStatus)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Activation failed', err)
      return { success: false, message: err.message || 'Activation failed' }
    }
  }

  const fetchCompanyDocuments = async (companyId: number) => {
    docsLoading.value = true
    try {
      const response = await companyService.getDocuments(companyId)
      if (response.isSuccess) {
        companyDocuments.value = response.data.items // Assuming PaginatedList
        showDocsDialog.value = true
      }
    } catch (error) {
      console.error('Failed to fetch docs', error)
    } finally {
      docsLoading.value = false
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await commonService.getCountries()
      if (response.isSuccess) {
        countries.value = response.data
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    loading,
    companies,
    totalRecords,

    showEditDialog,
    editLoading,
    editForm,
    openEdit,
    updateCompany,

    companyDocuments,
    docsLoading,
    showDocsDialog,
    fetchCompanyDocuments,

    toggleActivation,
    fetchCompanies,

    countries,
    fetchCountries,
  }
}
