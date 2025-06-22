import { defineStore } from 'pinia'
import api from './api'

export const useTopics = defineStore('topics', {
  state: () => {
    return {
      collection: [],
      currentTopic: null,
      api,
    }
  },

  persist: {
    key: 'topics-store',
    storage: localStorage,
    paths: ['currentTopic'],
  },

  actions: {
    async fetchTopicsByChildId(documentId) {
      try {
        const response = await this.api.get(
          `/api/topics?filters[children][documentId][$eq]=${documentId}&populate=image`,
        )
        this.collection = response.data.data
        return this.collection
      } catch (error) {
        console.error(`Error fetching topics for child with ID ${documentId}:`, error)
        throw error
      }
    },
    async fetchTopicById(documentId) {
      try {
        const response = await this.api.get(`/api/topics/${documentId}?populate=*`)
        this.currentTopic = response.data.data
        return response.data.data
      } catch (error) {
        console.error(`Error fetching topic with ID ${documentId}:`, error)
        throw error
      }
    },
  },
})
