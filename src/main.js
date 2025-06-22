import './assets/main.css'
import './assets/fonts.css'

import { createApp } from 'vue'

import './theme/castoon-theme.js'
import PrimeVue from 'primevue/config'
import MyPreset from './theme/castoon-theme.js'
import { disableDarkMode } from './theme/disableDarkMode.js'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useAuth } from './stores/useAuth'

import './assets/transitions.css'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: false,
    },
    dark: false, // Désactiver explicitement le mode sombre
    mode: 'light', // Forcer le mode clair
  },
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Initialize auth state before mounting the app
const authStore = useAuth(pinia)
authStore.initAuth()

// Désactiver le mode sombre
disableDarkMode()

app.mount('#app')
