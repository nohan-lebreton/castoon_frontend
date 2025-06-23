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

    async deleteChild(documentId) {
      try {
        await this.api.delete(`/api/children/${documentId}`)
        // Retirer l'enfant de la collection
        this.collection = this.collection.filter(
          (child) => child.id !== documentId && child.attributes?.documentId !== documentId,
        )
        return true
      } catch (error) {
        console.error(`Error deleting child with ID ${documentId}:`, error)
        throw error
      }
    },

    async createChild(childData, avatarFile, avatarId) {
      try {
        let response

        // If avatarId is provided, we're using an existing avatar
        if (avatarId) {
          // Add the avatar relation to the childData
          childData.avatar = {
            connect: [avatarId],
          }

          // Use regular JSON request
          response = await this.api.post('/api/children', {
            data: childData,
          })
        } else {
          // Using uploaded file or no avatar
          const formData = new FormData()
          formData.append('data', JSON.stringify(childData))

          if (avatarFile) {
            formData.append('files.avatar', avatarFile)
          }

          response = await this.api.post('/api/children', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }

        // Ajouter l'enfant à la collection
        this.collection.push(response.data.data)
        return response.data.data
      } catch (error) {
        console.error('Error creating child:', error)
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

    async updateChild(documentId, childData, avatarFile, avatarId) {
      try {
        let response

        // If avatarId is provided, we're using an existing avatar
        if (avatarId) {
          // Add the avatar relation to the childData
          childData.avatar = {
            connect: [avatarId],
          }

          // Use regular JSON request
          response = await this.api.put(`/api/children/${documentId}`, {
            data: childData,
          })
        } else {
          // Using uploaded file or no avatar
          const formData = new FormData()
          formData.append('data', JSON.stringify(childData))

          if (avatarFile) {
            formData.append('files.avatar', avatarFile)
          }

          response = await this.api.put(`/api/children/${documentId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }

        // Mettre à jour l'enfant dans la collection
        const index = this.collection.findIndex(
          (child) => child.id === documentId || child.attributes?.documentId === documentId,
        )
        if (index !== -1) {
          this.collection[index] = response.data.data
        }

        return response.data.data
      } catch (error) {
        console.error(`Error updating child with ID ${documentId}:`, error)
        throw error
      }
    },
  },
})
