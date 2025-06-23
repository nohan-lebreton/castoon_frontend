import { defineStore } from 'pinia'
import api from './api'

export const useAvatar = defineStore('avatar', {
  state: () => {
    return {
      collection: [],
      api,
      isLoading: false,
    }
  },

  actions: {
    async fetchAvatars() {
      try {
        this.isLoading = true
        const response = await this.api.get('/api/avatars?populate=*')

        this.collection = response.data.data

        console.log('Processed avatars:', this.collection)
        return this.collection
      } catch (error) {
        console.error('Error fetching avatars:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    getImageUrl(path) {
      if (!path) return null
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      return `${this.api.defaults.baseURL}${path}`
    },
  },
})
