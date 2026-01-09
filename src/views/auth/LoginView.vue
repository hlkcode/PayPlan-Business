<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

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

    router.push('/dashboard')

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
  <div class="min-h-screen flex items-center justify-center relative bg-slate-50 overflow-hidden font-sans">
    <div class="absolute inset-0 z-0">
        <div class="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[80px] opacity-50 -top-10 -left-10 animate-pulse"></div>
        <div class="absolute w-72 h-72 bg-pink-500 rounded-full blur-[80px] opacity-50 -bottom-5 -right-5 animate-pulse delay-700"></div>
    </div>

    <div class="relative z-10 w-full max-w-md p-12 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-500 mb-2 tracking-tight">
            PayPlan Business
        </h1>
        <p class="text-slate-500 text-sm">Welcome back! Please login to your business account.</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
          <div class="relative flex items-center">
             <Mail class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="20" />
             <input
                id="email"
                v-model="email"
                placeholder="name@company.com"
                type="email"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
             />
          </div>
        </div>

        <div class="space-y-2">
           <label for="password" class="block text-sm font-semibold text-slate-700 ml-1">Password</label>
           <div class="relative flex items-center">
             <Lock class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="20" />
             <input
                id="password"
                v-model="password"
                placeholder="••••••••"
                type="password"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
              />
           </div>
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-100 rounded-lg text-red-500 text-sm text-center">
          {{ errorMsg }}
        </div>

        <button type="submit" class="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </button>
      </form>

      <div class="mt-8 text-center space-y-4">
        <a href="#" class="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors">Forgot Password?</a>
        <div class="text-sm text-slate-400">
            Don't have an account? <router-link to="/signup" class="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">Sign Up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
