<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrientation } from '../../stores/useOrientation'
import { storeToRefs } from 'pinia'

const router = useRouter()
const orientationStore = useOrientation()
const { isPortrait, portraitWarningDismissed } = storeToRefs(orientationStore)

// Vérifier si la route actuelle est une route parent
const isParentRoute = computed(() => {
  const currentRoute = router.currentRoute.value
  return currentRoute.path.includes('/parents')
})

// Déterminer si l'avertissement doit être affiché (en mode paysage pour les routes parent)
const showWarning = computed(() => {
  return !isPortrait.value && isParentRoute.value && !portraitWarningDismissed.value
})

onMounted(() => {
  // Vérifier l'orientation initiale
  orientationStore.checkOrientation()
  // Ajouter un écouteur pour les changements d'orientation
  window.addEventListener('resize', orientationStore.checkOrientation)
})

onUnmounted(() => {
  // Supprimer l'écouteur lors du démontage du composant
  window.removeEventListener('resize', orientationStore.checkOrientation)
})
</script>

<template>
  <div class="portrait-warning" v-if="showWarning">
    <div class="warning-content">
      <i class="pi pi-mobile warning-icon"></i>
      <h2>Mode portrait recommandé</h2>
      <p>Pour l'espace parental, veuillez tourner votre appareil en mode portrait.</p>
    </div>
  </div>
</template>

<style scoped>
.portrait-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e3562b;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  backdrop-filter: blur(5px);
}

.warning-content {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  margin-bottom: 2rem;
  line-height: 1.5;
}

.rotate-animation {
  animation: rotate 2s infinite ease-in-out;
  font-size: 2rem;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  75% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
