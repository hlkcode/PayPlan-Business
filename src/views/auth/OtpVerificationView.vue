<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { businessService } from '@/services/business/BusinessAccountService'
import { useToastStore } from '@/stores/toast'
import { ShieldCheck } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const phoneNumber = ref('')
const code = ref('')
const loading = ref(false)
const resendLoading = ref(false)

onMounted(() => {
    if (route.query.phone) {
        phoneNumber.value = route.query.phone as string
    }
})

const handleVerify = async () => {
    if (!phoneNumber.value || !code.value) {
        toast.add({
            type: 'error',
            title: 'Error',
            message: 'Please enter phone number and code'
        })
        return
    }

    loading.value = true
    try {
        const response = await businessService.verifyCode({
            phoneNumber: phoneNumber.value,
            code: code.value
        })

        if (response.isSuccess) {
            toast.add({
                type: 'success',
                title: 'Verified',
                message: 'Account verified successfully. Please login.'
            })
            router.push('/login')
        } else {
            throw new Error(response.message || 'Verification failed')
        }
    } catch (e: unknown) {
        const err = e as { message: string }
         toast.add({
            type: 'error',
            title: 'Verification Failed',
            message: err.message || 'Invalid code'
        })
    } finally {
        loading.value = false
    }
}

const resendCode = async () => {
    if (!phoneNumber.value) {
         toast.add({ type: 'error', title: 'Error', message: 'Phone number is missing '})
         return
    }

    resendLoading.value = true
    try {
        const response = await businessService.sendCode({ phoneNumber: phoneNumber.value })
        if (response.isSuccess) {
             toast.add({ type: 'success', title: 'Code Sent', message: 'Verification code sent to your phone' })
        } else {
             throw new Error(response.message || 'Failed to send code')
        }
    } catch (e: unknown) {
        const err = e as { message: string }
         toast.add({
            type: 'error',
            title: 'Error',
            message: err.message || 'Failed to send code'
        })
    } finally {
        resendLoading.value = false
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative bg-slate-50 overflow-hidden font-sans">
    <div class="absolute inset-0 z-0 h-full w-full">
        <div class="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[80px] opacity-40 top-1/2 left-1/4 animate-pulse"></div>
        <div class="absolute w-80 h-80 bg-purple-500 rounded-full blur-[80px] opacity-40 bottom-1/4 right-1/4 animate-pulse delay-700"></div>
    </div>

    <div class="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center">
        <div class="mb-8 flex flex-col items-center">
            <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
                <ShieldCheck :size="32" />
            </div>
            <h1 class="text-3xl font-bold text-slate-800 mb-2">Verification</h1>
            <p class="text-slate-500">Enter the code sent to <span class="font-medium text-slate-700">{{ phoneNumber }}</span></p>
        </div>

        <form @submit.prevent="handleVerify" class="flex flex-col gap-6">
            <div class="space-y-2 text-left">
                <label for="code" class="block text-sm font-semibold text-slate-700 ml-1">Verification Code</label>
                <input
                    id="code"
                    v-model="code"
                    placeholder="Enter 6-digit code"
                    required
                    class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-center text-lg tracking-widest font-mono transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
                />
            </div>

            <button type="submit" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center" :disabled="loading">
                <span v-if="!loading">Verify Account</span>
                <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>

            <button type="button" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" @click="resendCode" :disabled="resendLoading">
                {{ resendLoading ? 'Sending...' : 'Resend Code' }}
            </button>
        </form>
    </div>
  </div>
</template>
