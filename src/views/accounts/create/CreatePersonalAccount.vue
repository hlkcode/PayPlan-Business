<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)

const form = ref({
    phoneNumber: '',
    pin: '', // Required length 5
    email: '',
    surname: '',
    otherNames: '',
    country: 'Ghana' // Default string per schema
})

const submit = async () => {
    isLoading.value = true
    try {
        await axios.post('/personal-accounts', form.value)
        router.push('/admin/accounts/personal')
    } catch (error: unknown) {
        console.error('Failed to create account', error)
         let msg = 'Failed to create account'
        if (error && typeof error === 'object' && 'response' in error) {
             const axiosError = error as { response: { data: { message: string } } }
             if (axiosError.response?.data?.message) {
                 msg = axiosError.response.data.message
             }
        }
        alert(msg)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div class="create-page">
    <div class="page-header">
        <button @click="router.back()" class="back-btn">
            <ArrowLeft :size="20" /> Back
        </button>
        <h1>Create Personal Account</h1>
    </div>

    <div class="form-card">
        <form @submit.prevent="submit">
            <div class="form-grid">
                <div class="form-group">
                    <label>Phone Number *</label>
                    <input v-model="form.phoneNumber" type="tel" required class="premium-input" placeholder="233..." />
                </div>

                <div class="form-group">
                    <label>PIN (5 Digits) *</label>
                    <input v-model="form.pin" type="password" maxlength="5" minlength="5" required class="premium-input" placeholder="*****" />
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" class="premium-input" placeholder="user@example.com" />
                </div>

                <div class="form-group">
                    <label>Surname</label>
                    <input v-model="form.surname" type="text" class="premium-input" placeholder="Doe" />
                </div>

                <div class="form-group">
                    <label>Other Names</label>
                    <input v-model="form.otherNames" type="text" class="premium-input" placeholder="John" />
                </div>

                 <div class="form-group">
                    <label>Country</label>
                     <input v-model="form.country" type="text" class="premium-input" placeholder="Ghana" />
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Creating...' : 'Create Account' }}
                </button>
            </div>
        </form>
    </div>
  </div>
</template>

<style scoped>
.create-page {
    max-width: 800px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.page-header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-text-primary);
    font-weight: 700;
}

.back-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    padding: 0;
}

.back-btn:hover {
    color: var(--color-primary);
}

.form-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: var(--shadow-card);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

@media (max-width: 640px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
}

.premium-input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border-input);
    border-radius: 8px;
    background: var(--color-bg-input);
    color: var(--color-text-primary);
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
}

.premium-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.submit-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background: var(--color-primary-hover);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>
