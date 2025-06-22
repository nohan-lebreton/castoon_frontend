<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { isMobileDevice } from '@/utils/deviceDetection'

const router = useRouter()
const qrCodeUrl = ref('')
const isLoading = ref(true)
const currentUrl = ref('')

// Générer le QR code pointant vers l'URL actuelle
onMounted(async () => {
  try {
    // Si l'utilisateur est sur mobile, rediriger directement vers la page d'installation
    if (isMobileDevice()) {
      router.push({ name: 'InstallInstructions' })
      return
    }

    // Obtenir l'URL actuelle pour le QR code
    currentUrl.value = window.location.origin

    // Générer le QR code
    qrCodeUrl.value = await QRCode.toDataURL(currentUrl.value, {
      width: 300,
      margin: 1,
      color: {
        dark: '#48A85B', // Couleur principale Castoon (vert)
        light: '#ffffff', // Fond blanc
      },
    })

    isLoading.value = false
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="landing-container">
    <div class="landing-content">
      <!-- Logo Castoon -->
      <div class="logo-container">
        <img src="/LITTLE_CASTOON_LOGO_QUADRI.svg" alt="Logo Castoon" class="logo" />
      </div>

      <!-- Titre et message -->
      <div class="message-container">
        <h1>Bienvenue sur Castoon</h1>
        <p class="description">
          Pour profiter pleinement de l'expérience Castoon, scannez le QR code ci-dessous avec votre
          appareil mobile.
        </p>
      </div>

      <!-- QR Code -->
      <div class="qrcode-container">
        <div v-if="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Génération du QR code...</p>
        </div>
        <div v-else class="qrcode-content">
          <img :src="qrCodeUrl" alt="QR Code Castoon" class="qrcode" />
          <p class="qrcode-instructions">
            Scannez ce code avec l'appareil photo de votre téléphone pour installer Castoon
          </p>
        </div>
      </div>

      <!-- Instructions supplémentaires -->
      <div class="instructions">
        <p>
          Castoon est optimisé pour les appareils mobiles. Installez-le comme une application sur
          votre téléphone pour la meilleure expérience d'écoute pour vos enfants.
        </p>
      </div>

      <!-- Footer -->
      <div class="landing-footer">
        <p>&copy; {{ new Date().getFullYear() }} LittleCastoon. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-image: url('../assets/LITTLE_CASTOON_BG.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.landing-content {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo-container {
  width: 100%;
  max-width: 250px;
  margin-bottom: 1rem;
}

.logo {
  width: 100%;
  height: auto;
}

.message-container {
  margin-bottom: 2rem;
}

h1 {
  color: #48a85b; /* Vert Castoon */
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.description {
  font-size: 1.2rem;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
}

.qrcode-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qrcode {
  width: 250px;
  height: 250px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-instructions {
  font-size: 1rem;
  color: #666;
  max-width: 300px;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(72, 168, 91, 0.3);
  border-radius: 50%;
  border-top: 4px solid #48a85b;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.instructions {
  max-width: 600px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.landing-footer {
  margin-top: auto;
  color: #777;
  font-size: 0.9rem;
}

/* Responsive design pour les grands écrans */
@media (min-width: 1200px) {
  .landing-content {
    max-width: 1000px;
  }
}
</style>
