import { defineStore } from 'pinia'
import api from './api'

export const usePodcasts = defineStore('podcasts', {
  state: () => {
    return {
      collection: [],
      currentPodcast: null,
      api,
    }
  },

  persist: {
    key: 'podcasts-store',
    storage: localStorage,
    paths: ['currentPodcast'],
  },

  actions: {
    async fetchPodcastsByTopics(documentId) {
      try {
        const response = await this.api.get(
          `/api/podcasts?filters[topic][documentId][$eq]=${documentId}&populate=image`,
        )
        this.collection = response.data.data
        return this.collection
      } catch (error) {
        console.error('Error fetching podcasts:', error)
        throw error
      }
    },
    async fetchPodcastById(documentId) {
      try {
        const response = await this.api.get(`/api/podcasts/${documentId}?populate=*`)
        return response.data.data
      } catch (error) {
        console.error(`Error fetching podcast with ID ${documentId}:`, error)
        throw error
      }
    },
  },
})
