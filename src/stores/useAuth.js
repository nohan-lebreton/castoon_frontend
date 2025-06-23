import { defineStore } from 'pinia'
import api from './api'

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    userProfile: (state) => state.user,
  },

  actions: {
    async login(identifier, password) {
      try {
        const response = await api.post(`/api/auth/local`, {
          identifier,
          password,
        })
        // Mettre à jour l'état du store
        this.user = response.data.user
        this.token = response.data.jwt

        // Store auth data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.jwt)

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`

        return response.data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async logout() {
      // Remove authorization header before clearing state
      delete api.defaults.headers.common['Authorization']

      // Clear state
      this.user = null
      this.token = null

      // Remove from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    // Initialize auth state from localStorage and set auth header
    initAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },
  },
})
