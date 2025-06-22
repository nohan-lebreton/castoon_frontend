<template>
  <div class="splash-screen">
    <video
      ref="videoRef"
      src="/LITTLE_CASTOON_LOGO.mp4"
      class="logo-video"
      autoplay
      muted
      playsinline
    ></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/useAuth'
import { useLastRoute } from '../stores/useLastRoute'
import { isMobileDevice } from '../utils/deviceDetection'

const router = useRouter()
const authStore = useAuth()
const lastRouteStore = useLastRoute()
const videoRef = ref(null)

onMounted(() => {
  // Attendre que la vidéo soit chargée
  if (videoRef.value) {
    videoRef.value.onloadedmetadata = () => {
      // Calculer la durée de redirection basée sur la durée de la vidéo
      // mais au minimum 2 secondes
      const videoDuration = videoRef.value.duration * 1000 // Conversion en millisecondes
      const redirectTime = Math.max(2000, videoDuration)

      // Attendre la durée appropriée avant de rediriger
      setTimeout(() => {
        // Si l'utilisateur a déjà visité le site et a une dernière route enregistrée
        if (lastRouteStore.hasVisitedBefore && lastRouteStore.lastRouteName) {
          router.push({
            name: lastRouteStore.lastRouteName,
            params: lastRouteStore.lastRouteParams || {},
            query: lastRouteStore.lastRouteQuery || {},
          })
        } else {
          // Première visite ou pas de route enregistrée
          if (authStore.isAuthenticated) {
            router.push({ name: 'ParentHome' })
          } else {
            // Pour les nouveaux utilisateurs, vérifier si mobile ou desktop
            const isMobile = isMobileDevice()
            if (isMobile) {
              // Sur mobile, rediriger vers les instructions d'installation
              router.push({ name: 'InstallInstructions' })
            } else {
              // Sur desktop, rediriger vers la landing page avec QR code
              router.push({ name: 'LandingPage' })
            }
          }
        }
      }, redirectTime)
    }
  }
})
</script>

<style scoped>
.splash-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  width: 100%;
  overflow: hidden;
}

.logo-video {
  width: 100%;
  max-width: 400px;
  border: none;
  outline: none;
  box-shadow: none;
  margin-bottom: 30px;
  display: block;
}
</style>
