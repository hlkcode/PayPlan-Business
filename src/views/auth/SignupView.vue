<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import { businessService } from '@/services/business/BusinessAccountService'
import { countryService } from '@/services/CountryService'

import { Mail, Phone, MapPin, Building, FileText, Lock } from 'lucide-vue-next'

const router = useRouter()
const toast = useToastStore()
const authStore = useAuthStore()

const email = ref('')
const companyName = ref('')
const tin = ref('')
const phoneNumber = ref('')
const address = ref('')
const password = ref('')
const selectedCountryId = ref<number | null>(null)

const countries = ref<{id: number, name: string}[]>([])
const isLoading = ref(false)
const isCountriesLoading = ref(false)
const errorMsg = ref('')

const fetchCountries = async () => {
    isCountriesLoading.value = true
    try {
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
        companyName: companyName.value,
        tin: tin.value,
        phoneNumber: phoneNumber.value,
        address: address.value,
        countryId: selectedCountryId.value,
        password: password.value
    }

    const response = await businessService.create(payload)

    if (response.isSuccess) {
        toast.add({
            type: 'success',
            title: 'Account Created',
            message: 'Account created. Please verify your phone number.',
        })
        router.push({ path: '/verify-otp', query: { phone: phoneNumber.value } })
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
  <div class="min-h-screen flex items-center justify-center relative bg-slate-50 overflow-hidden font-sans py-12 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 z-0 h-full w-full">
        <div class="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[80px] opacity-40 top-10 left-10 animate-pulse"></div>
        <div class="absolute w-80 h-80 bg-purple-500 rounded-full blur-[80px] opacity-40 bottom-10 right-10 animate-pulse delay-700"></div>
    </div>

    <div class="relative z-10 w-full max-w-xl p-8 sm:p-10 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 tracking-tight">
            PayPlan Business
        </h1>
        <p class="text-slate-500 text-sm sm:text-base">Create your business account to get started.</p>
      </div>

      <form @submit.prevent="handleSignup" class="flex flex-col gap-5">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div class="space-y-1.5">
                <label for="companyName" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Company Name</label>
                <div class="relative flex items-center">
                    <Building class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
                    <input
                        id="companyName"
                        v-model="companyName"
                        placeholder="Acme Corp"
                        required
                        class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
                    />
                </div>
            </div>

            <div class="space-y-1.5">
                 <label for="tin" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">TIN</label>
                 <div class="relative flex items-center">
                    <FileText class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
                    <input
                        id="tin"
                        v-model="tin"
                        placeholder="Tax ID Number"
                        class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
                    />
                </div>
            </div>
        </div>

        <div class="space-y-1.5">
          <label for="email" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Email Address</label>
          <div class="relative flex items-center">
             <Mail class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
             <input
                id="email"
                v-model="email"
                placeholder="name@company.com"
                type="email"
                required
                class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
             />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-1.5">
                <label for="phone" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Phone Number</label>
                <div class="relative flex items-center">
                    <Phone class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
                    <input
                        id="phone"
                        v-model="phoneNumber"
                        placeholder="+1234567890"
                        type="tel"
                        required
                        class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
                    />
                </div>
            </div>

            <div class="space-y-1.5">
                <label for="country" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Country</label>
                 <div class="relative flex items-center">
                    <MapPin class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
                    <select
                        id="country"
                        v-model="selectedCountryId"
                        required
                        :disabled="isCountriesLoading"
                        class="w-full pl-11 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none hover:border-indigo-300 disabled:bg-slate-50"
                    >
                        <option :value="null" disabled>Select Country</option>
                         <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                        </option>
                    </select>
                     <div class="absolute right-3 pointer-events-none text-slate-400">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-1.5">
           <label for="address" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Address</label>
           <div class="relative flex items-start">
                <MapPin class="absolute left-4 top-3.5 text-slate-400 pointer-events-none z-10" :size="18" />
                <textarea
                    id="address"
                    v-model="address"
                    rows="2"
                    placeholder="Headquarters Address"
                    class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300 resize-none"
                ></textarea>
           </div>
        </div>

        <div class="space-y-1.5">
           <label for="password" class="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wide">Password</label>
           <div class="relative flex items-center">
             <Lock class="absolute left-4 text-slate-400 pointer-events-none z-10" :size="18" />
             <input
                id="password"
                v-model="password"
                placeholder="••••••••"
                type="password"
                required
                class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 hover:border-indigo-300"
              />
           </div>
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-100 rounded-lg text-red-500 text-sm text-center">
          {{ errorMsg }}
        </div>

        <button type="submit" class="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <div class="text-sm text-slate-500">
            Already have an account? <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Sign In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
