import { defineStore } from 'pinia'
import api from './api'

export const useChildren = defineStore('children', {
  state: () => {
    return {
      collection: [],
      currentChild: null,
      showPinCodeDialog: false,
      api,
    }
  },

  persist: {
    key: 'children-store',
    storage: localStorage,
    paths: ['currentChild'],
  },

  actions: {
    async fetchChildren() {
      try {
        const response = await this.api.get('/api/children?populate[avatar][populate]=image')
        this.collection = response.data.data
      } catch (error) {
        console.error('Error fetching children:', error)
      }
    },

    async fetchChildById(documentId) {
      try {
        const response = await this.api.get(
          `/api/children/${documentId}?populate[avatar][populate]=image&populate[topics][populate]=image`,
        )
        this.currentChild = response.data.data
        return response.data.data
      } catch (error) {
        console.error(`Error fetching child with ID ${documentId}:`, error)
        throw error
      }
    },

    getImageUrl(path) {
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      return `${this.api.defaults.baseURL}${path}`
    },

    calculateAge(birthdate) {
      const today = new Date()
      const birthDate = new Date(birthdate)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    },
  },
})
