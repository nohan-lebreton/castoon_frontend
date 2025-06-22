/**
 * Ce fichier contient une fonction qui désactive le mode sombre
 * pour PrimeVue et l'application globalement.
 */

export function disableDarkMode() {
  // Supprimer la classe 'dark' du document si elle existe
  document.documentElement.classList.remove('dark')

  // Ajouter la classe 'light' au document si elle n'existe pas déjà
  if (!document.documentElement.classList.contains('light')) {
    document.documentElement.classList.add('light')
  }

  // Désactiver les préférences système pour le mode sombre
  document.documentElement.style.colorScheme = 'light'

  // Forcer le mode clair pour les attributs de données PrimeVue
  document.documentElement.setAttribute('data-theme-mode', 'light')

  // Supprimer tout écouteur qui pourrait changer le thème
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {})

  return true
}
