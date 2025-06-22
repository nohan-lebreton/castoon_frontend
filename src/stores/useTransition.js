// stores/useTransition.ts
import { defineStore } from 'pinia'

export const useTransition = defineStore('transition', {
  state: () => ({
    name: 'fade',
  }),
  actions: {
    setTransition(name) {
      this.name = name
    },
  },
})
