import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/utils/axios'

interface User {
  id: number
  email: string
  role?: string
  accountType?: 'management' | 'business' | 'personal'
}

interface LoginInput {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const setToken = (newToken: string, newRefreshToken?: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    
    if (newRefreshToken) {
         refreshToken.value = newRefreshToken
         localStorage.setItem('refreshToken', newRefreshToken)
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const setUser = (newUser: User) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    token.value = null
    user.value = null
    refreshToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
  }

  const login = async (credentials: LoginInput) => {
    // Strictly management login
    const endpoint = '/management-accounts/login';

    const response = await axios.post(endpoint, credentials)
    const responseData = response.data
    // Structure: { isSuccess: true, data: { token: '...', refreshToken: '...', user: {} } }
    
    const authToken = responseData.data?.token || responseData.token
    const newRefreshToken = responseData.data?.refreshToken
    const userData = responseData.data?.user || responseData.user

    if (authToken) {
        setToken(authToken, newRefreshToken)
    }
    if (userData) {
        userData.accountType = 'management'
        setUser(userData)
    }
    return response
  }
  
  const refreshAccessToken = async () => {
      if (!refreshToken.value || !user.value?.id) throw new Error('No refresh token or user ID')
      try {
          // Endpoint: /api/v1/management-accounts/refresh-token
          // Based on user request, payload requires refreshToken and userId
           const response = await axios.post('/management-accounts/refresh-token', {
              refreshToken: refreshToken.value,
              userId: user.value.id
          })
          const responseData = response.data
          
          if (responseData.isSuccess && responseData.data) {
              const { token: newToken, refreshToken: newRefToken, user: updatedUser } = responseData.data
              
              if (newToken) {
                  setToken(newToken, newRefToken)
                  
                  // Update user if returned (API sample showed user object in data)
                  if (updatedUser) {
                      updatedUser.accountType = user.value.accountType || 'management' // Preserve type
                      setUser(updatedUser)
                  }
                  
                  return newToken
              }
          }
          
          throw new Error('Refresh failed or no token returned')
      } catch (error) {
          logout()
          throw error
      }
  }

  // Initialize axios header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    refreshToken,
    setToken,
    setUser,
    logout,
    login,
    refreshAccessToken
  }
})
