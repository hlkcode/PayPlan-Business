<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

import BaseInput from '@/components/core/form/BaseInput.vue'
import { Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })

    toast.add({
      type: 'success',
      title: 'Welcome Back!',
      message: 'You have successfully logged in.',
    })

    router.push('/admin/dashboard')

  } catch (err: unknown) {
    console.error('Login failed', err)
    let message = 'An unexpected error occurred during login.'

    if (err instanceof Error) {
      message = err.message || 'Login failed. Please check your credentials.'
    } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } }
        if (axiosError.response?.data?.message) {
            message = axiosError.response.data.message
        }
    }

    errorMsg.value = message
    toast.add({
      type: 'error',
      title: 'Login Failed',
      message
    })
  } finally {
    isLoading.value = false
  }
}
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
        <p class="brand-subtitle">Welcome back! Please login to your management account.</p>
      </div>

       <!-- Tabs removed as per requirement -->

      <form @submit.prevent="handleLogin" class="login-form">
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
            id="password"
            v-model="password"
            placeholder="••••••••"
            label="Password"
            type="password"
            required
            :icon="Lock"
          />
        </div>

        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="card-footer">
        <a href="#" class="forgot-link">Forgot Password?</a>
        <div class="signup-prompt">
            Don't have an account? <router-link to="/admin/signup">Sign Up</router-link>
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
  max-width: 480px;
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

/* Tabs */
.account-tabs {
    display: flex;
    background: var(--color-bg-secondary);
    padding: 4px;
    border-radius: 12px;
    margin-bottom: 2rem;
    gap: 4px;
}

.tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
}

.tab-btn:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
}

.tab-btn.active {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
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

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  z-index: 2;
}

.toggle-password:hover {
  color: var(--color-text-primary);
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
}

.premium-input.with-icon {
  padding-left: 3rem;
}

.premium-input.with-suffix {
  padding-right: 3rem;
}

.premium-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
  background: var(--color-bg-input);
}

.premium-input:focus + .input-icon {
    color: var(--color-primary);
}

.premium-input::placeholder {
  color: var(--color-text-muted);
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forgot-link {
  color: #94a3b8;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: white;
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
