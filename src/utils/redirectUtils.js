/* Utilitaire pour rediriger automatiquement vers la bonne page selon le type d'appareil */
import { isMobileDevice } from './deviceDetection'

/**
 * Redirige vers la page appropriée en fonction du type d'appareil
 * @param {object} router - Instance du routeur Vue
 */
export function redirectBasedOnDevice(router) {
  const isMobile = isMobileDevice()

  if (isMobile) {
    // Sur mobile, rediriger vers les instructions d'installation
    if (router.currentRoute.value.name !== 'InstallInstructions') {
      router.push({ name: 'InstallInstructions' })
    }
  } else {
    // Sur desktop, rediriger vers la landing page avec QR code
    if (router.currentRoute.value.name !== 'LandingPage') {
      router.push({ name: 'LandingPage' })
    }
  }
}

/**
 * Vérifie si l'application est installée comme PWA
 * @returns {boolean} true si l'application est en mode standalone (installée), false sinon
 */
export function isPWAInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
}
