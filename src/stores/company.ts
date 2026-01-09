import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company } from '@/models/admin'

export const useCompanyStore = defineStore('company', () => {
  const currentCompany = ref<Company | null>(null)

  // Initialize from local storage if available
  const saved = localStorage.getItem('current_company')
  if (saved) {
    try {
      currentCompany.value = JSON.parse(saved)
    } catch (e) {
      localStorage.removeItem('current_company')
    }
  }

  const setCompany = (company: Company) => {
    currentCompany.value = company
    localStorage.setItem('current_company', JSON.stringify(company))
  }

  const clearCompany = () => {
    currentCompany.value = null
    localStorage.removeItem('current_company')
  }

  const hasCompany = computed(() => !!currentCompany.value)

  return {
    currentCompany,
    setCompany,
    clearCompany,
    hasCompany,
  }
})
