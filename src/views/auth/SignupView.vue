<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import { managementService } from '@/services/management/ManagementAccountService'
import { countryService } from '@/services/CountryService'

import BaseInput from '@/components/core/form/BaseInput.vue'
import { Mail, User, Phone, MapPin } from 'lucide-vue-next'

const router = useRouter()
const toast = useToastStore()
const authStore = useAuthStore()

const email = ref('')
const surname = ref('')
const otherNames = ref('')
const phoneNumber = ref('')
const selectedCountryId = ref<number | null>(null)

const countries = ref<{id: number, name: string}[]>([])
const isLoading = ref(false)
const isCountriesLoading = ref(false)
const errorMsg = ref('')

// Hardcoded role as per requirement
const ROLE = 'MANAGER'

const fetchCountries = async () => {
    isCountriesLoading.value = true
    try {
        // Fetch all supported countries without pagination if possible, or large page size
        // Assuming getAll supports standard params, let's request a large page size to get all
        const response = await countryService.getAll({ pageNumber: 1, pageSize: 100 })
        if (response.isSuccess) {
            countries.value = response.data.items
        }
    } catch (e) {
        console.error('Failed to fetch countries', e)
    } finally {
        isCountriesLoading.value = false
    }
}

const handleSignup = async () => {
  if (!selectedCountryId.value) {
      errorMsg.value = 'Please select a country.'
      return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const payload = {
        email: email.value,
        surname: surname.value,
        otherNames: otherNames.value,
        phoneNumber: phoneNumber.value,
        countryId: selectedCountryId.value,
        role: ROLE
    }

    const response = await managementService.create(payload)

    if (response.isSuccess) {
        toast.add({
            type: 'success',
            title: 'Account Created',
            message: 'Your account has been created successfully. Please check your email for login details.',
        })
        router.push('/login')
    } else {
        throw new Error(response.message || 'Signup failed')
    }

  } catch (err: unknown) {
    console.error('Signup failed', err)
    let message = 'An unexpected error occurred during signup.'

    if (err instanceof Error) {
      message = err.message
    } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } }
        if (axiosError.response?.data?.message) {
            message = axiosError.response.data.message
        }
    }

    errorMsg.value = message
    toast.add({
      type: 'error',
      title: 'Signup Failed',
      message
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
    authStore.logout()
    fetchCountries()
})
</script>

<template>
  <div class="login-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-card glass">
      <div class="brand-header">
        <h1 class="brand-title">PayPlan</h1>
        <p class="brand-subtitle">Create your management account.</p>
      </div>

      <form @submit.prevent="handleSignup" class="login-form">
        <!-- Name Fields -->
        <div class="form-row">
            <div class="form-group half">
                <BaseInput
                    id="surname"
                    v-model="surname"
                    placeholder="Doe"
                    label="Surname"
                    required
                    :icon="User"
                />
            </div>
            <div class="form-group half">
                 <BaseInput
                    id="otherNames"
                    v-model="otherNames"
                    placeholder="John"
                    label="Other Names"
                    required
                    :icon="User"
                />
            </div>
        </div>

        <div class="form-group">
          <BaseInput
            id="email"
            v-model="email"
            placeholder="name@example.com"
            label="Email Address"
            type="email"
            required
            :icon="Mail"
          />
        </div>

        <div class="form-group">
            <BaseInput
                id="phone"
                v-model="phoneNumber"
                placeholder="+1234567890"
                label="Phone Number"
                type="tel"
                required
                :icon="Phone"
            />
        </div>

         <div class="form-group">
            <label for="country">Country</label>
            <div class="input-wrapper">
                 <div class="input-icon">
                    <MapPin :size="18" />
                </div>
                <select id="country" v-model="selectedCountryId" class="premium-input with-icon" required :disabled="isCountriesLoading">
                    <option :value="null" disabled>Select Country</option>
                    <option v-for="country in countries" :key="country.id" :value="country.id">
                        {{ country.name }}
                    </option>
                </select>
            </div>
         </div>

        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="card-footer">
        <div class="signup-prompt">
            Already have an account? <router-link to="/login">Sign In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container & Background */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--color-bg-primary);
  overflow: hidden;
  font-family: var(--font-family-base, 'Inter', sans-serif);
}

.background-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: float 10s infinite ease-in-out;
  opacity: 0.5;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary, #6366f1);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  bottom: -5%;
  right: -5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: #8b5cf6;
  top: 40%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

/* Glass Card */
.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 520px;
  padding: 3rem 2.5rem;
  background: var(--color-bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  color: var(--color-text-primary);
}

/* Typography */
.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8 0%, #c4b5fd 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -1px;
}

.brand-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

/* Form Styles */
.form-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.form-group.half {
    flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.premium-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border-input);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  appearance: none; /* for select */
}

.premium-input.with-icon {
  padding-left: 3rem;
}

.premium-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
  background: var(--color-bg-input);
}

/* Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: var(--color-primary, #6366f1);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* footer */
.card-footer {
  margin-top: 2rem;
  text-align: center;
}

.signup-prompt {
    color: #94a3b8;
    font-size: 0.9rem;
}

.signup-prompt a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 600;
}

.signup-prompt a:hover {
    text-decoration: underline;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  vertical-align: middle;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
