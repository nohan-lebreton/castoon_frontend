<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useOrientation } from '../../stores/useOrientation'
import { storeToRefs } from 'pinia'

const router = useRouter()
const orientationStore = useOrientation()
const { isPortrait, landscapeWarningDismissed } = storeToRefs(orientationStore)

// État du clavier PIN
const showPinPad = ref(false)
const pinCode = ref('')
const pinError = ref(false)
const pinLength = 4
const pinLoading = ref(false)

// Vérifier si la route actuelle est une route enfant
const isChildRoute = computed(() => {
  const currentRoute = router.currentRoute.value
  return currentRoute.path.includes('/child')
})

// Déterminer si l'avertissement doit être affiché
const showWarning = computed(() => {
  return isPortrait.value && isChildRoute.value && !landscapeWarningDismissed.value
})

// Afficher le clavier PIN pour accès parental
const showParentAccess = () => {
  showPinPad.value = true
}

// Ajouter un chiffre au code PIN
const addDigit = (digit) => {
  // Réinitialiser l'état d'erreur dès qu'on commence à entrer un nouveau code
  if (pinError.value) {
    pinError.value = false
  }

  if (pinCode.value.length < pinLength) {
    pinCode.value += digit

    // Vérifier automatiquement le code une fois qu'il a la bonne longueur
    if (pinCode.value.length === pinLength) {
      verifyPinCode()
    }
  }
}

// Supprimer le dernier chiffre du code PIN
const removeDigit = () => {
  if (pinCode.value.length > 0) {
    pinCode.value = pinCode.value.slice(0, -1)
    pinError.value = false
  }
}

// Vérifier le code PIN
const verifyPinCode = async () => {
  pinLoading.value = true

  try {
    // Simulation d'une vérification de PIN - à remplacer par une vraie vérification
    // Ici on compare avec le code 1234 pour la démonstration
    // Dans une version réelle, on utiliserait une vérification via API ou le store useAuth

    setTimeout(() => {
      if (pinCode.value === '1234') {
        // Rediriger vers l'espace parent
        router.push('/parents/home')
      } else {
        // Afficher une erreur
        pinError.value = true
        pinCode.value = '' // Réinitialiser le code pour permettre une nouvelle saisie
      }
      pinLoading.value = false
    }, 500)
  } catch (error) {
    console.error('Erreur lors de la vérification du PIN:', error)
    pinError.value = true
    pinLoading.value = false
    pinCode.value = '' // Réinitialiser le code en cas d'erreur
  }
}

// Animation de remplissage du PIN
const getPinFillClass = (index) => {
  const isFilled = pinCode.value.length > index
  return {
    'pin-digit-filled': isFilled && !pinError.value,
    'pin-digit-error': isFilled && pinError.value,
  }
}

onMounted(() => {
  // Vérifier l'orientation initiale
  orientationStore.checkOrientation()

  // Ajouter un écouteur pour les changements d'orientation
  window.addEventListener('resize', orientationStore.checkOrientation)
})

onUnmounted(() => {
  // Supprimer l'écouteur lors du démontage du composant
  window.removeEventListener('resize', orientationStore.checkOrientation)
})
</script>

<template>
  <div class="landscape-warning" v-if="showWarning">
    <transition name="fade">
      <!-- Avertissement d'orientation standard -->
      <div class="warning-content" v-if="!showPinPad">
        <i class="pi pi-mobile warning-icon rotate-animation" style="transform: rotate(90deg)"></i>
        <h2>Mode paysage recommandé</h2>
        <p>
          Pour l'espace enfant, veuillez tourner votre appareil en mode paysage pour une meilleure
          expérience.
        </p>
        <div class="little-castoon-side">
          <img src="/LITTLE_CASTOON_SIDE.svg" alt="Little Castoon Side" />
        </div>
        <div class="button-container">
          <Button
            label="Accès parent"
            class="action-button"
            severity="primary"
            @click="showParentAccess"
          />
        </div>
      </div>

      <!-- Clavier PIN pour accès parental -->
      <div class="pin-content" v-else>
        <i class="pi pi-lock warning-icon"></i>
        <h2>Accès parent</h2>
        <p>Entrez votre code PIN à 4 chiffres pour accéder à l'espace parent</p>

        <!-- Affichage des digits du PIN -->
        <div class="pin-display">
          <div
            v-for="index in pinLength"
            :key="index"
            class="pin-digit"
            :class="getPinFillClass(index - 1)"
          ></div>
        </div>

        <!-- Message d'erreur -->
        <p class="error-message" v-if="pinError">Code PIN incorrect. Veuillez réessayer.</p>

        <!-- Clavier numérique -->
        <div class="pin-keypad" :class="{ disabled: pinLoading }">
          <div class="keypad-row">
            <button class="keypad-button" @click="addDigit('1')">1</button>
            <button class="keypad-button" @click="addDigit('2')">2</button>
            <button class="keypad-button" @click="addDigit('3')">3</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button" @click="addDigit('4')">4</button>
            <button class="keypad-button" @click="addDigit('5')">5</button>
            <button class="keypad-button" @click="addDigit('6')">6</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button" @click="addDigit('7')">7</button>
            <button class="keypad-button" @click="addDigit('8')">8</button>
            <button class="keypad-button" @click="addDigit('9')">9</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-button function-button" @click="showPinPad = false">
              <i class="pi pi-arrow-left"></i>
            </button>
            <button class="keypad-button" @click="addDigit('0')">0</button>
            <button class="keypad-button function-button" @click="removeDigit()">
              <i class="pi pi-delete-left"></i>
            </button>
          </div>
        </div>

        <!-- Loader pendant la vérification -->
        <div class="loader-container" v-if="pinLoading">
          <i class="pi pi-spin pi-spinner"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.little-castoon-side img {
  width: 200px;
}
.landscape-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.warning-content,
.pin-content {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
}

.pin-content {
  position: relative;
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  margin-bottom: 2rem;
  line-height: 1.5;
}

.rotate-animation {
  animation: rotate 2s infinite;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.action-button {
  width: 100%;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Styles pour le clavier PIN */
.pin-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.pin-digit {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #2e89e5;
  position: relative;
  transition: all 0.3s ease;
  background-color: transparent;
}

.pin-digit-filled {
  background-color: #2e89e5;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.pin-digit-error {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  animation: shake 0.5s;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.pin-keypad {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.keypad-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.keypad-button {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #2e89e5;
  border: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.keypad-button:hover {
  background-color: #1a7ad9;
}

.keypad-button:active {
  transform: scale(0.95);
  background-color: #1560ae;
}

.function-button {
  font-size: 1.2rem;
  background-color: #f79c07;
}

.function-button:hover {
  background-color: #e08c06;
}

.function-button:active {
  background-color: #c67c05;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-weight: bold;
}

.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
}

.loader-container i {
  font-size: 3rem;
  color: white;
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
</style>
