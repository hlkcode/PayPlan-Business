import { ref } from 'vue'
import { managementService } from '@/services/management/ManagementAccountService'
import type { ManagementAccount, CreateManagementAccountInput } from '@/models/account'
import type { PaginationDto } from '@/models/common'

import { commonService } from '@/services/CommonService'
import type { Country } from '@/models/common'

export function useManagementController() {
  const loading = ref(false)
  const accounts = ref<ManagementAccount[]>([])
  const totalRecords = ref(0)
  const roles = ref<string[]>([])
  const countries = ref<Country[]>([])

  // Reset Password State
  const showResetDialog = ref(false)
  const resetLoading = ref(false)

  // Dialog State
  const showCreateDialog = ref(false)
  const createLoading = ref(false)
  const createForm = ref<CreateManagementAccountInput>({
    email: '',
    role: '',
    surname: '',
    otherNames: '',
    phoneNumber: '',
    countryId: 80, // Default Ghana
  })

  const fetchAccounts = async (params: PaginationDto) => {
    loading.value = true
    try {
      const response = await managementService.getAll(params)
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

  const fetchRoles = async () => {
    try {
      roles.value = ['MANAGER', 'USER']
    } catch (error) {
      console.error('Failed to fetch roles', error)
    }
  }

  const fetchCountries = async () => {
    try {
      console.log('Controller: fetching countries...')
      const response = await commonService.getCountries()
      console.log('Controller: countries response', response)
      if (response.isSuccess) {
        countries.value = response.data
        console.log('Controller: set countries', countries.value)
      } else {
        console.warn('Controller: fetch countries failed or success=false', response)
      }
    } catch (error) {
      console.error('Failed to fetch countries', error)
    }
  }

  const createAccount = async () => {
    createLoading.value = true
    try {
      const response = await managementService.create(createForm.value)
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
      const response = await managementService.deleteAccount(id)
      return { success: response.isSuccess, message: response.message }
    } catch (error) {
      const err = error as Error
      console.error('Delete failed', err)
      return { success: false, message: err.message || 'Failed to delete account' }
    }
  }

  const toggleActivation = async (id: number, currentStatus: boolean) => {
    try {
      const response = await managementService.activate(id, !currentStatus)
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
      const response = await managementService.resetPassword(userId)
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
      role: '',
      surname: '',
      otherNames: '',
      phoneNumber: '',
      countryId: 80,
    }
  }

  return {
    // State
    loading,
    accounts,
    totalRecords,
    roles,
    countries,

    // Dialog
    showCreateDialog,
    createLoading,
    createForm,

    // Actions
    fetchAccounts,
    fetchRoles,
    fetchCountries,
    createAccount,
    deleteAccount,
    toggleActivation,
    resetPassword,
    showResetDialog,
    resetLoading,
  }
}
