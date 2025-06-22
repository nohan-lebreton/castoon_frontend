<script setup>
import { useTransition } from '@/stores/useTransition'
import { useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'

const transitionStore = useTransition()
const route = useRoute()

// Fonction pour mettre à jour la couleur de fond en fonction de la route
const updateBackgroundColor = () => {
  const appEl = document.getElementById('app')
  if (appEl) {
    if (route.meta.darkBackground) {
      appEl.style.backgroundColor = '#383838'
    } else {
      appEl.style.backgroundColor = '' // Revenir à la couleur par défaut
    }
  }
}

// Mettre à jour la couleur de fond à chaque changement de route
watch(
  () => route.name,
  () => {
    updateBackgroundColor()
  },
  { immediate: true },
)

// S'assurer que la couleur est correcte au chargement initial
onMounted(() => {
  updateBackgroundColor()
})
</script>

<template>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <!-- Viewport contrôlé -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
    />
    <!-- Désactiver le mode de mise à l'échelle sur iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <!-- Bloquer le double-tap pour zoomer -->
    <meta name="format-detection" content="telephone=no" />

    <meta name="description" content="Votre application Castoon" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="apple-touch-icon" href="/ios/180.png" />
    <title>Castoon App</title>
  </head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <router-view v-slot="{ Component }">
    <transition :name="transitionStore.name" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
/* Styles globaux pour empêcher le redimensionnement */
html,
body {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  touch-action: none; /* Désactive tous les gestes tactiles */
}
/* Assure que le contenu remplit tout l'écran */
#app {
  width: 100%;
  height: 100%;
  overflow: auto; /* Permet le défilement à l'intérieur de l'app */
  -webkit-overflow-scrolling: touch; /* Défilement fluide sur iOS */
  z-index: 1; /* S'assurer que le contenu est au-dessus du fond */
  transition: background-color 0.3s ease; /* Transition fluide pour le changement de couleur */
}
/* Empêche la sélection de texte qui peut interférer avec l'expérience */
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard */
}
/* Autoriser la sélection de texte dans les zones de saisie */
input,
textarea {
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
</style>
