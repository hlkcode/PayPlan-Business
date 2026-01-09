import { computed } from 'vue'
import { useCompanyStore } from '@/stores/company'

export const useCompanyUsersController = () => {
  const companyStore = useCompanyStore()

  const currentCompany = computed(() => companyStore.currentCompany)

  return {
    currentCompany,
  }
}
