import { defineStore } from 'pinia'

export const useLastRoute = defineStore('lastRoute', {
  state: () => ({
    lastRouteName: null,
    lastRouteParams: null,
    lastRouteQuery: null,
    hasVisitedBefore: false,
  }),

  actions: {
    saveRoute(route) {
      // Ne pas enregistrer la route du splash screen
      if (route.name === 'SplashScreen') return

      this.lastRouteName = route.name
      this.lastRouteParams = route.params
      this.lastRouteQuery = route.query
      this.hasVisitedBefore = true
    },
  },

  persist: true, // Assure que les données sont persistées entre les sessions
})
