<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputOtp from 'primevue/inputotp'
import { useTransition } from '@/stores/useTransition'
import { useAuth } from '@/stores/useAuth.js'
import { ref, onMounted } from 'vue'

const transitionStore = useTransition()
const auth = useAuth()

const currentPin = ref('')
const newPin = ref('')
const confirmPin = ref('')
const pinLength = 4
const hasPinSet = ref(false) // À remplacer par la vérification réelle

// Simuler un PIN existant pour la démonstration
// À remplacer par la vérification réelle du PIN dans le store d'authentification
onMounted(() => {
  if (auth.user?.pin) {
    hasPinSet.value = true
  }
})

const updatePin = () => {
  // Vérification que les PINs correspondent
  if (newPin.value !== confirmPin.value) {
    // Afficher un message d'erreur
    alert('Les codes PIN ne correspondent pas')
    return
  }

  // Vérification que le PIN actuel est correct (si un PIN existe déjà)
  if (hasPinSet.value && currentPin.value !== auth.user?.pin) {
    // Afficher un message d'erreur
    alert('Le code PIN actuel est incorrect')
    return
  }

  console.log('Mise à jour du PIN', newPin.value)
  // Logique pour mettre à jour le PIN dans le store d'authentification
  // auth.updatePin(newPin.value)
}
</script>

<template>
  <div class="pin-container">
    <div class="pin-header">
      <h2 class="pin-title">Code PIN</h2>
      <Button
        icon="pi pi-arrow-left"
        class="p-button-rounded p-button-text"
        label="Retour"
        @click="
          () => {
            transitionStore.setTransition('slide-right')
            $router.push({ name: 'ParentHome' })
          }
        "
      />
    </div>

    <Card>
      <template #title>
        <div class="card-title">Configuration du code PIN</div>
      </template>
      <template #subtitle>
        <div class="card-subtitle">
          Le code PIN est utilisé pour sécuriser l'accès à l'application pour vos enfants
        </div>
      </template>
      <template #content>
        <div class="pin-content">
          <p class="pin-info">
            Le code PIN permet de protéger l'accès aux fonctionnalités parentales. Assurez-vous de
            choisir un code que vous pouvez facilement mémoriser mais difficile à deviner pour vos
            enfants.
          </p>

          <div v-if="hasPinSet" class="pin-form-section">
            <h3 class="section-title">Code PIN actuel</h3>
            <div class="pin-input-container">
              <InputOtp v-model="currentPin" :length="pinLength" />
            </div>
          </div>

          <div class="pin-form-section">
            <h3 class="section-title">Nouveau code PIN</h3>
            <div class="pin-input-container">
              <InputOtp v-model="newPin" :length="pinLength" />
            </div>
          </div>

          <div class="pin-form-section">
            <h3 class="section-title">Confirmer le code PIN</h3>
            <div class="pin-input-container">
              <InputOtp v-model="confirmPin" :length="pinLength" />
            </div>
          </div>

          <div class="pin-actions">
            <Button
              label="Enregistrer le code PIN"
              severity="success"
              icon="pi pi-check"
              @click="updatePin"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.pin-container {
  padding: 20px;
}

.pin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pin-title {
  font-size: 1.5rem;
  color: #f79c07;
}

.card-title {
  font-size: 1.2rem;
  color: #2e89e5;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.pin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pin-info {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.pin-form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  color: #2e89e5;
  margin-bottom: 0.75rem;
}

.pin-input-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.pin-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
