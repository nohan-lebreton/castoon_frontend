import { defineStore } from 'pinia'
import api from './api'

export const usePodcastNodes = defineStore('podcastNodes', {
  state: () => {
    return {
      collection: [],
      currentNode: null,
      api,
    }
  },

  persist: {
    key: 'podcast-nodes-store',
    storage: localStorage,
    paths: ['currentNode'],
  },

  actions: {
    async fetchPodcastNodeByNumero(numero) {
      try {
        const response = await this.api.get(`/api/audio-nodes/${numero}?populate=*`)
        this.currentNode = response.data.data
        return this.currentNode
      } catch (error) {
        console.error(`Error fetching audio node with numero ${numero}:`, error)
        throw error
      }
    },
    async fetchPodcastNodesByPodcastId(podcastId) {
      try {
        const response = await this.api.get(
          `/api/audio-nodes?filters[podcast][documentId][$eq]=${podcastId}&populate=*`,
        )
        this.collection = response.data.data
        return this.collection
      } catch (error) {
        console.error(`Error fetching audio nodes for podcast ID ${podcastId}:`, error)
        throw error
      }
    },
  },
})
