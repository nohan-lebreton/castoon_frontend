import { defineStore } from 'pinia'
import api from './api'

export const useTopic = defineStore('topic', {
  state: () => {
    return {
      collection: [],
      api,
      // Map pour stocker les couleurs générées dynamiquement
      generatedColors: {},
    }
  },

  actions: {
    async fetchTopics() {
      try {
        const response = await this.api.get('/api/topics')
        this.collection = response.data.data
        return this.collection
      } catch (error) {
        console.error('Error fetching topics:', error)
        throw error
      }
    },

    getTopicColor(topicName) {
      // Si on a déjà généré une couleur pour ce topic, on la renvoie
      if (this.generatedColors[topicName]) {
        return this.generatedColors[topicName]
      }

      // Sinon, on génère une nouvelle couleur avec un bon contraste
      const newColor = this.generateContrastingColor()
      this.generatedColors[topicName] = newColor
      return newColor
    },

    // Génère une couleur aléatoire avec un bon contraste
    generateContrastingColor() {
      const existingColors = Object.values(this.generatedColors)

      // On génère jusqu'à 50 couleurs et on prend celle qui a la distance moyenne maximale
      let bestColor = null
      let maxAvgDistance = 0

      for (let i = 0; i < 50; i++) {
        // Générer une couleur vive (en évitant les couleurs trop claires ou trop foncées)
        const h = Math.floor(Math.random() * 360) // Teinte aléatoire
        const s = Math.floor(Math.random() * 40 + 60) // Saturation entre 60% et 100%
        const l = Math.floor(Math.random() * 30 + 35) // Luminosité entre 35% et 65%

        const hexColor = this.hslToHex(h, s, l)

        // Calculer la distance moyenne avec les couleurs existantes
        const avgDistance = this.calculateAverageColorDistance(hexColor, existingColors)

        if (avgDistance > maxAvgDistance) {
          maxAvgDistance = avgDistance
          bestColor = hexColor
        }
      }

      return bestColor || '#607D8B' // Couleur par défaut si échec
    },

    // Convertit une couleur HSL en hexadécimal
    hslToHex(h, s, l) {
      l /= 100
      const a = (s * Math.min(l, 1 - l)) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    },

    // Calcule la distance moyenne entre une couleur et une liste de couleurs
    calculateAverageColorDistance(color, colorList) {
      if (colorList.length === 0) return 1000 // Distance maximale si pas de couleurs

      let totalDistance = 0

      for (const existingColor of colorList) {
        totalDistance += this.getColorDistance(color, existingColor)
      }

      return totalDistance / colorList.length
    },

    // Calcule la distance entre deux couleurs hexadécimales
    getColorDistance(hex1, hex2) {
      // Convertir les couleurs hex en RGB
      const rgb1 = this.hexToRgb(hex1)
      const rgb2 = this.hexToRgb(hex2)

      // Calcul de la distance euclidienne dans l'espace RGB
      return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2),
      )
    },

    // Convertit une couleur hexadécimale en RGB
    hexToRgb(hex) {
      hex = hex.replace(/^#/, '')

      // Gérer les deux formats (3 et 6 caractères)
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((c) => c + c)
          .join('')
      }

      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      }
    },

    getTopicById(id) {
      return this.collection.find((topic) => topic.id === id)
    },

    getTopicByTitle(title) {
      return this.collection.find((topic) => topic.title === title)
    },
  },
})
