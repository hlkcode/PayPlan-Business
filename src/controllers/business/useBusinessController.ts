import { ref } from 'vue'
import { businessService } from '@/services/business/BusinessAccountService'
import type { BusinessAccount, CreateBusinessAccountInput } from '@/models/account'
import type { PaginationDto } from '@/models/common'
import { commonService } from '@/services/CommonService'
import type { Country } from '@/models/common'

export function useBusinessController() {
  const loading = ref(false)
  const accounts = ref<BusinessAccount[]>([])
  const totalRecords = ref(0)
  const countries = ref<Country[]>([])

  // Dialog State
  const showCreateDialog = ref(false)
  const createLoading = ref(false)
  const resetLoading = ref(false)

  // Initialize with empty/default values
  const createForm = ref<CreateBusinessAccountInput>({
    email: '',
    password: '',
    companyName: '',
    tin: '',
    phoneNumber: '',
    address: '',
    countryId: 80, // Default Ghana
  })

  const fetchAccounts = async (params: PaginationDto) => {
    loading.value = true
    try {
      const response = await businessService.getAll(params)
      if (response.isSuccess) {
        accounts.value = response.data.items
        totalRecords.value = response.data.totalCount
      }
    } catch (error) {
      console.error('Failed to fetch accounts', error)
    } finally {
      loading.value = false
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await commonService.getCountries()
      if (response.isSuccess) {
        countries.value = response.data
      }
    } catch (error) {
      console.error('Failed to fetch countries', error)
    }
  }

  const createAccount = async () => {
    createLoading.value = true
    try {
      const response = await businessService.create(createForm.value)
      if (response.isSuccess) {
        showCreateDialog.value = false
        resetForm()
      }
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Failed to create account', err)
      return { success: false, message: err.message || 'Failed to create account' }
    } finally {
      createLoading.value = false
    }
  }

  const deleteAccount = async (id: number) => {
    try {
      const response = await businessService.deleteAccount(id)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Delete failed', err)
      return { success: false, message: err.message || 'Failed to delete account' }
    }
  }

  const toggleActivation = async (id: number, currentStatus: boolean) => {
    try {
      const response = await businessService.activate(id, !currentStatus)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Activation failed', err)
      return { success: false, message: err.message || 'Activation failed' }
    }
  }

  const resetPassword = async (userId: number) => {
    resetLoading.value = true
    try {
      const response = await businessService.resetPassword(userId)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Reset password failed', err)
      return { success: false, message: err.message || 'Reset failed' }
    } finally {
      resetLoading.value = false
    }
  }

  const resetForm = () => {
    createForm.value = {
      email: '',
      password: '',
      companyName: '',
      tin: '',
      phoneNumber: '',
      address: '',
      countryId: 80,
    }
  }

  return {
    // State
    loading,
    accounts,
    totalRecords,
    countries,

    // Dialog
    showCreateDialog,
    createLoading,
    createForm,

    // Actions
    fetchAccounts,
    fetchCountries,
    createAccount,
    deleteAccount,
    toggleActivation,
    resetPassword,
    resetLoading,
  }
}
