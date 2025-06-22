<script setup>
import { useAuth } from '@/stores/useAuth.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Importez le router
import { useTransition } from '@/stores/useTransition'
import Button from 'primevue/button'

const transitionStore = useTransition()
const router = useRouter() // Utilisez le router
const auth = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')
const isPwa = ref(false)
const isIOS = ref(false)
const isAndroid = ref(false)

// Détection du mode PWA et de la plateforme
onMounted(() => {
  // Vérification si l'application est en mode standalone (PWA installée)
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  ) {
    isPwa.value = true
  }

  // Détection de la plateforme
  const userAgent = window.navigator.userAgent.toLowerCase()
  isIOS.value = /iphone|ipad|ipod/.test(userAgent)
  isAndroid.value = /android/.test(userAgent)
})

// Fonction de connexion qui gère la redirection
async function handleLogin() {
  try {
    error.value = ''
    await auth.login(username.value, password.value)
    // Redirection manuelle après connexion réussie
    transitionStore.setTransition('zoom')
    router.push({ name: 'ParentHome' })
  } catch (err) {
    error.value = 'Identifiants incorrects. Veuillez réessayer.'
    console.error('Erreur de connexion:', err)
  }
}
</script>
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <h1 class="auth-title">Connexion</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="input-group">
        <input
          class="input-group__input"
          type="text"
          id="username"
          v-model="username"
          required
          autocomplete="username"
          inputmode="text"
          placeholder="Nom d'utilisateur"
          enterkeyhint="next"
          autofocus
        />
      </div>
      <div>
        <input
          class="input-group__input"
          type="password"
          id="password"
          v-model="password"
          required
          autocomplete="current-password"
          inputmode="text"
          placeholder="Mot de passe"
          enterkeyhint="go"
        />
      </div>
      <div class="button-group">
        <Button severity="success" size="small" type="submit" label="Connexion" />
        <Button
          severity="warn"
          size="small"
          label="Inscription"
          @click="() => router.push({ name: 'AuthRegister' })"
          variant="text"
        />
      </div>
    </form>

    <!-- Guide d'installation PWA affiché uniquement si on n'est pas déjà en mode PWA -->
    <div v-if="!isPwa" class="pwa-install-guide">
      <h3 class="guide-title">Installer l'application Castoon</h3>
      <div class="guide-description">
        Profitez d'une meilleure expérience en installant Castoon sur votre appareil
      </div>

      <!-- Instructions pour iOS -->
      <div v-if="isIOS" class="device-guide">
        <h3>Sur votre iPhone/iPad</h3>
        <ol>
          <li>Ouvrez cette page dans <strong>Safari</strong></li>
          <li>Appuyez sur l'icône <strong>Partager</strong> <span class="icon">⎋</span></li>
          <li>Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong></li>
          <li>Appuyez sur <strong>"Ajouter"</strong></li>
        </ol>
      </div>

      <!-- Instructions pour Android -->
      <div v-if="isAndroid" class="device-guide">
        <h3>Sur votre appareil Android</h3>
        <ol>
          <li>Ouvrez cette page dans <strong>Chrome</strong></li>
          <li>Appuyez sur les trois points <strong>⋮</strong> en haut à droite</li>
          <li>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong></li>
          <li>Appuyez sur <strong>"Installer"</strong></li>
        </ol>
      </div>

      <!-- Instructions générales si la plateforme n'est pas détectée -->
      <div v-if="!isIOS && !isAndroid" class="device-guide">
        <h3>Sur iPhone/iPad (iOS)</h3>
        <ol>
          <li>Ouvrez cette page dans <strong>Safari</strong></li>
          <li>Appuyez sur l'icône <strong>Partager</strong> <span class="icon">⎋</span></li>
          <li>Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong></li>
          <li>Appuyez sur <strong>"Ajouter"</strong></li>
        </ol>

        <h3>Sur Android</h3>
        <ol>
          <li>Ouvrez cette page dans <strong>Chrome</strong></li>
          <li>Appuyez sur les trois points <strong>⋮</strong> en haut à droite</li>
          <li>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong></li>
          <li>Appuyez sur <strong>"Installer"</strong></li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
.error {
  color: red;
  margin-bottom: 15px;
}
.input-group {
  margin-bottom: 15px;
}
.input-group__input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.input-group__input:focus {
  border-color: #31af97;
  outline: none;
}
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pwa-install-guide {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.guide-title {
  font-size: 18px;
  color: #2e89e5;
  text-align: center;
  margin-bottom: 10px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.guide-description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.device-guide {
  margin-bottom: 20px;
}

.device-guide h3 {
  font-size: 16px;
  color: #f79c07;
  margin-bottom: 10px;
}

.device-guide ol {
  padding-left: 25px;
}

.device-guide li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.icon {
  display: inline-block;
  font-size: 16px;
}

/* Animation pour l'apparition du guide PWA */
.pwa-install-guide {
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
