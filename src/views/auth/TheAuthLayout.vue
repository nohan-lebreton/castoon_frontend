<script setup>
import { useTransition } from '@/stores/useTransition'

const transitionStore = useTransition()
</script>

<template>
  <div class="auth-layout">
    <header class="auth-header">
      <img src="/LITTLE_CASTOON_LOGO_QUADRI.svg" alt="Logo" class="logo" />
    </header>

    <main class="auth-main">
      <router-view v-slot="{ Component }">
        <transition :name="transitionStore.name" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="auth-footer">
      <p>&copy; {{ new Date().getFullYear() }} LittleCastoon. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}

.auth-header {
  padding: 1rem;
  color: white;
  text-align: center;
}

.auth-title {
  margin: 0;
  font-size: 1.8rem;
}

.auth-main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.85rem;
  color: #888;
  margin-top: auto;
}
</style>
