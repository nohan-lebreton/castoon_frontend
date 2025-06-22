/**
 * Script utilitaire pour générer les images d'instructions iOS
 * Utilisé temporairement pour créer les images d'instructions
 * Ce fichier n'est pas importé dans le code de production
 */

// Fonction utilitaire pour générer une image SVG et la convertir en PNG
// Note: Ces fonctions seraient utilisées dans un environnement Node.js avec Canvas
// ou dans un script à part pour générer les images

/**
 * Génère une image SVG pour le bouton de partage iOS
 * @returns {string} Contenu SVG
 */
function generateShareIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="10" fill="#f2f2f2"/>
    <path d="M50,30 L30,50 L45,50 L45,70 L55,70 L55,50 L70,50 Z" fill="#007AFF"/>
    <text x="50" y="90" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">Partager</text>
  </svg>`
}

/**
 * Génère une image SVG pour le bouton d'ajout à l'écran d'accueil iOS
 * @returns {string} Contenu SVG
 */
function generateAddToHomeScreenSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="10" fill="#f2f2f2"/>
    <rect x="25" y="30" width="50" height="10" rx="5" fill="#007AFF"/>
    <rect x="25" y="45" width="50" height="10" rx="5" fill="#007AFF"/>
    <rect x="25" y="60" width="50" height="10" rx="5" fill="#007AFF"/>
    <text x="50" y="90" font-family="Arial" font-size="10" text-anchor="middle" fill="#333">Ajouter à l'écran d'accueil</text>
  </svg>`
}

/**
 * Génère une image SVG pour le bouton de confirmation iOS
 * @returns {string} Contenu SVG
 */
function generateConfirmButtonSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="10" fill="#f2f2f2"/>
    <rect x="20" y="40" width="60" height="20" rx="5" fill="#007AFF"/>
    <text x="50" y="55" font-family="Arial" font-size="12" text-anchor="middle" fill="white" font-weight="bold">Ajouter</text>
    <text x="50" y="90" font-family="Arial" font-size="10" text-anchor="middle" fill="#333">Confirmer</text>
  </svg>`
}

// Ces fonctions peuvent être utilisées pour générer les images SVG qui sont ensuite converties en PNG
// et placées dans le répertoire public/ pour être utilisées par l'application
