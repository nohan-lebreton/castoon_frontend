<script setup>
import { useAuth } from '@/stores/useAuth.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Importez le router
import { useTransition } from '@/stores/useTransition'
import Button from 'primevue/button'

const transitionStore = useTransition()
const router = useRouter() // Utilisez le router
const auth = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')

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
</style>
