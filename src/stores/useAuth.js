import { defineStore } from 'pinia'
import api from './api'

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      user: null,
      token: null,
    }
  },

  actions: {
    async login(identifier, password) {
      console.log('Logging in with:', identifier, password)
      const response = await api.post(`/api/auth/local`, {
        identifier,
        password,
      })
      this.user = response.data.user
      this.token = response.data.jwt
      return response.data
    },
  },
})
