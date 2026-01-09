import { ref, onMounted } from 'vue'
import { companyService } from '@/services/CompanyService'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'

export const useDashboardController = () => {
  const authStore = useAuthStore()
  const companyStore = useCompanyStore()
  const totalCompanies = ref(0)
  // ... refs
  const activeInvites = ref(0)
  const pendingInvites = ref(0)
  const loading = ref(true)

  const fetchStats = async () => {
    if (!authStore.user?.id) return
    loading.value = true
    try {
      // Fetch stats for current company
      if (companyStore.currentCompany?.id) {
        const inviteRes = await companyService.getInvites(companyStore.currentCompany.id)
        const invites = inviteRes.data?.items || []

        activeInvites.value = invites.filter((i) => i.status === 'Accepted').length
        pendingInvites.value = invites.filter((i) => i.status === 'Pending').length
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStats()
  })

  return {
    totalCompanies,
    activeInvites,
    pendingInvites,
    loading,
  }
}
