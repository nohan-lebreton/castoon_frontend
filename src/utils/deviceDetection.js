/**
 * Utilitaire pour détecter le type d'appareil (mobile ou desktop) et le système d'exploitation
 */

/**
 * Détermine si l'utilisateur navigue sur un appareil mobile
 * @returns {boolean} true si l'utilisateur est sur mobile, false sinon
 */
export function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Détection basée sur userAgent pour les appareils mobiles
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  // Détection supplémentaire basée sur la largeur d'écran (généralement < 768px pour mobile)
  const isMobileWidth = window.innerWidth < 768

  return mobileRegex.test(userAgent) || isMobileWidth
}

/**
 * Détermine le système d'exploitation de l'appareil
 * @returns {string} 'ios', 'android' ou 'desktop'
 */
export function getDeviceOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios'
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android'
  }

  // Considéré comme desktop si non mobile
  return 'desktop'
}
