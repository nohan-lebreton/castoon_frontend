<script setup>
import { useAuth } from '@/stores/useAuth.js'

const auth = useAuth()
</script>
<template>
  <img src="/public/LITTLE_CASTOON_LOGO_QUADRI.svg" alt="Logo" class="logo" />
  <form @submit.prevent="auth.login(username, password)">
    <h1>Connexion</h1>
    <div>
      <input type="text" id="username" v-model="username" required />
    </div>
    <div>
      <input type="password" id="password" v-model="password" required />
    </div>
    <button type="submit">Se connecter</button>
  </form>
</template>

<style scoped></style>
