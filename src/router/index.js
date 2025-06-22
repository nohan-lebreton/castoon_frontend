import { createRouter, createWebHistory } from 'vue-router'
import { isMobileDevice } from '../utils/deviceDetection'
import { isPWAInstalled } from '../utils/redirectUtils'

// Splash Screen & Landing Pages
import SplashScreen from '../views/SplashScreen.vue'
import LandingPage from '../views/LandingPage.vue'
import InstallInstructions from '../views/InstallInstructions.vue'

// Auth views
import TheAuthLayout from '../views/auth/TheAuthLayout.vue'
import TheLogin from '../views/auth/TheLogin.vue'

// Parents views
import TheParentLayout from '../views/Parents/TheParentsLayout.vue'
import TheParentHome from '../views/Parents/TheParentHome.vue'
import TheParentChild from '../views/Parents/TheParentChild.vue'

// Children views
import TheChildLayout from '../views/Childrens/TheChildLayout.vue'
import TheChildTopics from '../views/Childrens/TheChildTopics.vue'
import TheChildPodcasts from '../views/Childrens/TheChildPodcasts.vue'
import TheChildPodcastNode from '../views/Childrens/TheChildPodcastNode.vue'

import { useAuth } from '../stores/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Splash Screen route (racine de l'application)
    {
      path: '/',
      name: 'SplashScreen',
      component: SplashScreen,
    },

    // Landing et installation pour PWA
    {
      path: '/landing',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/install',
      name: 'InstallInstructions',
      component: InstallInstructions,
    },

    // Auth routes
    {
      path: '/auth',
      component: TheAuthLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'AuthLogin',
          component: TheLogin,
        },
      ],
    },

    // Parents routes
    {
      path: '/parents',
      component: TheParentLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'ParentHome',
          component: TheParentHome,
        },
        {
          path: 'child/:documentId',
          name: 'ParentChild',
          component: TheParentChild,
          props: true,
        },
      ],
    },

    // Children routes
    {
      path: '/child',
      component: TheChildLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'ChildTopics',
          component: TheChildTopics,
        },
        {
          path: ':topicTitle?',
          name: 'ChildPodcasts',
          component: TheChildPodcasts,
          props: true,
        },
        {
          path: ':topicTitle?/:podcastTitle?/:node?',
          name: 'ChildPodcastNode',
          component: TheChildPodcastNode,
          meta: { darkBackground: true },
        },
      ],
    },

    // Redirect root to auth login
    /* La redirection vers /auth est maintenant gérée par le SplashScreen */
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuth()
  const isAuthenticated = authStore.isAuthenticated

  // Cas spécial pour la déconnexion - permettre d'accéder à AuthLogin même si encore authentifié
  // mais en route vers la déconnexion
  if (to.name === 'AuthLogin' && from.path.includes('/parents') && isAuthenticated) {
    next()
    return
  }

  // Splash screen est toujours accessible
  if (to.name === 'SplashScreen') {
    next()
    return
  }

  // Pages d'accueil spéciales - toujours accessibles
  if (to.name === 'LandingPage' || to.name === 'InstallInstructions') {
    // Vérifier si on est sur la bonne page selon le device
    const isMobile = isMobileDevice()
    const isPWA = isPWAInstalled()

    // Si on est sur PWA installée, on peut accéder à l'application
    if (isPWA && to.name === 'InstallInstructions') {
      next()
      return
    }

    // Si on est sur mobile mais pas sur la page d'installation
    if (isMobile && !isPWA && to.name !== 'InstallInstructions') {
      next({ name: 'InstallInstructions' })
      return
    }

    // Si on est sur desktop mais pas sur la landing page
    if (!isMobile && to.name !== 'LandingPage') {
      next({ name: 'LandingPage' })
      return
    }

    next()
    return
  }

  // Pour les routes protégées qui nécessitent un appareil mobile ou une PWA
  const isMobile = isMobileDevice()
  const isPWA = isPWAInstalled()

  // Bloquer l'accès direct à l'application sur desktop
  if (!isMobile && !to.path.includes('/landing') && to.name !== 'LandingPage') {
    next({ name: 'LandingPage' })
    return
  }

  // Sur mobile, si l'app n'est pas installée et qu'on tente d'accéder à une route protégée
  if (isMobile && !isPWA && !to.path.includes('/install') && to.name !== 'InstallInstructions') {
    next({ name: 'InstallInstructions' })
    return
  }

  // Vérifications normales d'authentification
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'AuthLogin' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'ParentHome' })
  } else {
    next()
  }
})

export default router
