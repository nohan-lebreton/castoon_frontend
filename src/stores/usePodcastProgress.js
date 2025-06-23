import { defineStore } from 'pinia'
import api from './api'

export const usePodcastProgress = defineStore('podcastProgress', {
  state: () => {
    return {
      collection: [],
      api,
    }
  },

  actions: {
    async fetchPodcastProgressByChild(documentId) {
      try {
        const response = await this.api.get(
          `/api/podcast-progresses?filters[child][documentId][$eq]=${documentId}&populate[podcast][populate][topic]=true`,
        )
        this.collection = response.data.data
        return this.collection
      } catch (error) {
        console.error('Error fetching podcast progress:', error)
        throw error
      }
    },

    getTopicStats() {
      // Créer un objet pour stocker les statistiques par topic
      const topicStats = {}

      this.collection.forEach((progress) => {
        const topic = progress.podcast?.topic
        if (topic) {
          const topicId = topic.id
          const topicTitle = topic.title || 'Sans titre'

          if (!topicStats[topicId]) {
            topicStats[topicId] = {
              id: topicId,
              title: topicTitle,
              count: 0,
              completedCount: 0,
              totalScore: 0,
            }
          }

          topicStats[topicId].count++

          if (progress.isFinished) {
            topicStats[topicId].completedCount++
          }

          if (progress.scoring !== null && progress.scoring !== undefined) {
            topicStats[topicId].totalScore += progress.scoring
          }
        }
      })

      // Calculer le total des podcasts catégorisés
      const totalCategorizedPodcasts = Object.values(topicStats).reduce(
        (sum, stat) => sum + stat.count,
        0,
      )

      // Convertir en tableau et calculer les pourcentages
      return Object.values(topicStats).map((stat) => ({
        ...stat,
        completionPercentage:
          stat.count > 0 ? Math.round((stat.completedCount / stat.count) * 100) : 0,
        averageScore:
          stat.completedCount > 0 ? Math.round(stat.totalScore / stat.completedCount) : 0,
        // Calculer le pourcentage de représentation de chaque topic sur le total
        distributionPercentage:
          totalCategorizedPodcasts > 0
            ? Math.round((stat.count / totalCategorizedPodcasts) * 100)
            : 0,
      }))
    },

    getCompletedPodcastsCount() {
      return this.collection.filter((progress) => progress.isFinished).length
    },

    getTotalPodcastsCount() {
      return this.collection.length
    },

    getCompletionPercentage() {
      const completed = this.getCompletedPodcastsCount()
      const total = this.getTotalPodcastsCount()
      return total > 0 ? Math.round((completed / total) * 100) : 0
    },

    getTotalScore() {
      return this.collection.reduce((total, progress) => {
        return total + (progress.scoring || 0)
      }, 0)
    },
  },
})
