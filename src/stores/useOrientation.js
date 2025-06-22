// useOrientation.js - Store pour gérer les préférences d'orientation
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrientation = defineStore(
  'orientation',
  () => {
    // État
    const isPortrait = ref(true)
    const landscapeWarningDismissed = ref(false)
    const portraitWarningDismissed = ref(false)

    // Getters
    const orientation = computed(() => (isPortrait.value ? 'portrait' : 'landscape'))

    // Actions
    function checkOrientation() {
      isPortrait.value = window.innerHeight > window.innerWidth

      // Réinitialiser les avertissements si l'orientation est correcte
      // Parents en mode portrait, enfants en mode paysage
      if (isPortrait.value) {
        portraitWarningDismissed.value = false // Espace parent ok en portrait
      } else {
        landscapeWarningDismissed.value = false // Espace enfant ok en paysage
      }
    }

    function dismissLandscapeWarning() {
      landscapeWarningDismissed.value = true
    }

    function dismissPortraitWarning() {
      portraitWarningDismissed.value = true
    }

    function resetWarnings() {
      landscapeWarningDismissed.value = false
      portraitWarningDismissed.value = false
    }

    return {
      isPortrait,
      landscapeWarningDismissed,
      portraitWarningDismissed,
      orientation,
      checkOrientation,
      dismissLandscapeWarning,
      dismissPortraitWarning,
      resetWarnings,
    }
  },
  {
    // Ne pas persister l'état dans le localStorage
    persist: false,
  },
)
