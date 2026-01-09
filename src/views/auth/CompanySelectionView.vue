<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'
import { companyService } from '@/services/CompanyService'
import type { Company } from '@/models/admin'
import { Building2, ArrowRight, Wallet, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const companyStore = useCompanyStore()

const loading = ref(true)
const companies = ref<Company[]>([])

onMounted(async () => {
  if (!authStore.user?.id) {
    router.push('/login')
    return
  }

  try {
    const response = await companyService.getUserCompanies(authStore.user.id, {
        pageNumber: 1,
        pageSize: 100
    })

    if (response.isSuccess && response.data) {
        companies.value = response.data.items || []

        // If user has only one company, maybe auto-select?
        // For now, let's keep it explicit for "Business Owner" feel.
    }
  } catch (error) {
    console.error('Failed to load companies', error)
  } finally {
    loading.value = false
  }
})

const selectCompany = (company: Company) => {
    companyStore.setCompany(company)
    router.push('/dashboard')
}

const logout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<template>
  <div class="selection-container">
    <div class="selection-content">
        <div class="header">
            <div class="logo-area">
                <Wallet class="logo-icon" :size="32" />
                <span class="brand-name">PayPlan</span>
            </div>
            <button @click="logout" class="logout-btn">
                <LogOut :size="18" />
                Sign Out
            </button>
        </div>

        <div class="main-area">
            <h1>Select Business Account</h1>
            <p class="subtitle">Choose the company you want to manage today.</p>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <span>Loading your businesses...</span>
            </div>

            <div v-else-if="companies.length === 0" class="empty-state">
                <Building2 :size="48" />
                <h3>No Companies Found</h3>
                <p>You don't have any business accounts associated with your profile.</p>
                <div class="empty-actions">
                     <button @click="logout" class="secondary-btn">Back to Login</button>
                     <!-- Maybe link to create company if allowed? -->
                </div>
            </div>

            <div v-else class="company-grid">
                <div
                    v-for="company in companies"
                    :key="company.id"
                    class="company-card"
                    @click="selectCompany(company)"
                >
                    <div class="card-icon">
                        <Building2 :size="24" />
                    </div>
                    <div class="card-info">
                        <h3>{{ company.name }}</h3>
                        <span class="role-badge">{{ company.userRoleInCompany || 'Owner' }}</span>
                    </div>
                    <div class="arrow-icon">
                        <ArrowRight :size="20" />
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ new Date().getFullYear() }} PayPlan Business. All rights reserved.</p>
        </div>
    </div>
  </div>
</template>

<style scoped>
.selection-container {
    min-height: 100vh;
    background: var(--color-bg-main); /* Uses theme variable */
    display: flex;
    justify-content: center;
    padding: 2rem;
}

.selection-content {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4rem;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-primary);
}

.brand-name {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: var(--color-text-primary);
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--color-border);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all 0.2s;
}

.logout-btn:hover {
    border-color: var(--color-text-primary);
    color: var(--color-text-primary);
}

.main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
    letter-spacing: -0.03em;
}

.subtitle {
    color: var(--color-text-secondary);
    font-size: 1.125rem;
    margin-bottom: 3rem;
}

.company-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

.company-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.company-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
}

.card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
}

.card-info {
    flex: 1;
    text-align: left;
}

.card-info h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
}

.role-badge {
    font-size: 0.75rem;
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    padding: 0.125rem 0.5rem;
    border-radius: 99px;
    font-weight: 600;
    text-transform: uppercase;
}

.arrow-icon {
    color: var(--color-border); /* Muted initially */
    transition: transform 0.2s, color 0.2s;
}

.company-card:hover .arrow-icon {
    color: var(--color-primary);
    transform: translateX(4px);
}

.loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--color-text-secondary);
    padding: 4rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.footer {
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    padding-top: 4rem;
}
</style>
