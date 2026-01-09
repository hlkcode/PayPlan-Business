import { ref, computed } from 'vue'
import { companyService } from '@/services/CompanyService'
import type { InviteUsersToCompanyInput } from '@/models/admin'
import { useToastStore } from '@/stores/toast'
import { useCompanyStore } from '@/stores/company'

export const useInviteController = () => {
  const companyStore = useCompanyStore()
  const inviteLoading = ref(false)
  const showInviteDialog = ref(false)
  const toast = useToastStore()

  // Form
  const inviteForm = ref<InviteUsersToCompanyInput>({
    email: '',
    role: 'Employee', // Default
    companyId: 0,
  })

  // Computed for template compatibility (optional, or update template)
  const currentCompany = computed(() => companyStore.currentCompany)

  const sendInvite = async () => {
    if (!companyStore.currentCompany?.companyId) return

    inviteLoading.value = true
    inviteForm.value.companyId = companyStore.currentCompany.companyId

    try {
      const response = await companyService.inviteUsers(inviteForm.value)
      if (response.isSuccess) {
        toast.add({ type: 'success', title: 'Sent', message: 'Invitation sent successfully' })
        showInviteDialog.value = false
        inviteForm.value.email = '' // Reset
      } else {
        toast.add({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to send invite',
        })
      }
    } catch {
      toast.add({ type: 'error', title: 'Error', message: 'Failed to send invite' })
    } finally {
      inviteLoading.value = false
    }
  }

  const openInviteDialog = () => {
    if (!companyStore.currentCompany) {
      toast.add({
        type: 'warning',
        title: 'No Company',
        message: 'You need a company to invite users.',
      })
      return
    }
    showInviteDialog.value = true
  }

  return {
    currentCompany,
    inviteLoading,
    showInviteDialog,
    inviteForm,
    sendInvite,
    openInviteDialog,
  }
}
