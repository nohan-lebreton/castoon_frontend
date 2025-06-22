<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDeviceOS } from '@/utils/deviceDetection'
import { isPWAInstalled } from '@/utils/redirectUtils'

const deviceOS = ref('desktop')
const showInstallPopup = ref(false)
const router = useRouter()

// Déterminer le système d'exploitation de l'appareil au chargement
onMounted(() => {
  deviceOS.value = getDeviceOS()

  // Vérifier si l'application est déjà installée (en mode standalone)
  const isInStandaloneMode = isPWAInstalled()

  if (isInStandaloneMode) {
    // Si déjà installée en mode standalone, rediriger vers l'app
    showInstallPopup.value = false
    // Rediriger vers l'application principale si authentifié
    const authStore = JSON.parse(localStorage.getItem('auth') || '{"isAuthenticated": false}')
    if (authStore.isAuthenticated) {
      router.push({ name: 'ParentHome' })
    } else {
      router.push({ name: 'AuthLogin' })
    }
  } else {
    // Sinon, montrer les instructions d'installation
    showInstallPopup.value = true
  }
})
</script>

<template>
  <div class="install-container">
    <div class="install-content">
      <!-- Logo Castoon -->
      <div class="logo-container">
        <img src="/LITTLE_CASTOON_LOGO_QUADRI.svg" alt="Logo Castoon" class="logo" />
      </div>

      <!-- Titre et introduction -->
      <div class="message-container">
        <h1>Installer Castoon</h1>
        <p class="description">
          Pour profiter pleinement de Castoon et permettre à vos enfants d'écouter les podcasts même
          hors ligne, installez-le comme une application sur votre appareil.
        </p>
      </div>

      <!-- Instructions spécifiques iOS -->
      <div v-if="deviceOS === 'ios'" class="instructions">
        <h2>Instructions pour iOS</h2>
        <div class="instruction-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <p>Appuyez sur l'icône <strong>Partager</strong> en bas de votre navigateur Safari</p>
            <div class="step-image">
              <img src="/ios-share-icon.png" alt="Icône Partager iOS" class="ios-icon" />
            </div>
          </div>
        </div>
        <div class="instruction-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <p>Faites défiler et appuyez sur <strong>Ajouter à l'écran d'accueil</strong></p>
            <div class="step-image">
              <img src="/ios-add-icon.png" alt="Ajouter à l'écran d'accueil iOS" class="ios-icon" />
            </div>
          </div>
        </div>
        <div class="instruction-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <p>Appuyez sur <strong>Ajouter</strong> en haut à droite</p>
            <div class="step-image">
              <img src="/ios-confirm-icon.png" alt="Confirmer l'ajout iOS" class="ios-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions spécifiques Android -->
      <div v-else-if="deviceOS === 'android'" class="instructions">
        <h2>Instructions pour Android</h2>
        <div class="instruction-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <p>Appuyez sur les trois points <strong>⋮</strong> (menu) en haut à droite de Chrome</p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <p>
              Sélectionnez <strong>Installer l'application</strong> ou
              <strong>Ajouter à l'écran d'accueil</strong>
            </p>
          </div>
        </div>
        <div class="instruction-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <p>Appuyez sur <strong>Installer</strong> dans la boîte de dialogue qui apparaît</p>
          </div>
        </div>
      </div>

      <!-- Instructions génériques pour desktop -->
      <div v-else class="instructions">
        <h2>Instructions</h2>
        <p class="desktop-message">
          Castoon est optimisé pour les appareils mobiles. Veuillez scanner le QR code sur la page
          d'accueil avec votre téléphone pour installer l'application.
        </p>
        <button class="back-button" @click="$router.push('/')">Retour à l'accueil</button>
      </div>

      <!-- Message final -->
      <div class="final-message">
        <p>
          Une fois installée, l'application Castoon sera disponible directement depuis l'écran
          d'accueil de votre appareil.
        </p>
      </div>

      <!-- Footer -->
      <div class="install-footer">
        <p>&copy; {{ new Date().getFullYear() }} LittleCastoon. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-container {
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

.install-content {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.logo-container {
  width: 100%;
  max-width: 200px;
  margin-bottom: 1rem;
}

.logo {
  width: 100%;
  height: auto;
}

.message-container {
  margin-bottom: 1rem;
}

h1 {
  color: #48a85b; /* Vert Castoon */
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

h2 {
  color: #48a85b;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.description {
  font-size: 1.1rem;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
}

.instructions {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 12px;
}

.instruction-step {
  display: flex;
  align-items: flex-start;
  text-align: left;
  gap: 1rem;
}

.step-number {
  min-width: 40px;
  height: 40px;
  background-color: #48a85b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-content p {
  margin: 0;
  line-height: 1.4;
}

.step-image {
  margin-top: 0.5rem;
  text-align: center;
}

.ios-icon {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.desktop-message {
  text-align: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background-color: #48a85b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #3c8e4c;
}

.final-message {
  font-style: italic;
  color: #666;
  max-width: 600px;
  margin: 1rem 0;
}

.install-footer {
  margin-top: auto;
  color: #777;
  font-size: 0.9rem;
  padding-top: 1rem;
}

/* Responsive styles */
@media (max-width: 600px) {
  .install-content {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .description {
    font-size: 1rem;
  }

  .instructions {
    padding: 0.8rem;
  }
}
</style>
