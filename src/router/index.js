import { createRouter, createWebHistory } from 'vue-router'

// Splash Screen
import SplashScreen from '../views/SplashScreen.vue'

// Auth views
import TheAuthLayout from '../views/auth/TheAuthLayout.vue'
import TheLogin from '../views/auth/TheLogin.vue'

// Parents views
import TheParentLayout from '../views/Parents/TheParentsLayout.vue'
import TheParentHome from '../views/Parents/TheParentHome.vue'
import TheParentChild from '../views/Parents/TheParentChild.vue'
import TheParentAccount from '../views/Parents/TheParentAccount.vue'
import TheParentSubscription from '../views/Parents/TheParentSubscription.vue'
import TheParentPin from '../views/Parents/TheParentPin.vue'
import TheParentAddChild from '../views/Parents/TheParentAddChild.vue'
import TheParentEditChild from '../views/Parents/TheParentEditChild.vue'

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
        {
          path: 'add-child',
          name: 'addChild',
          component: TheParentAddChild,
        },
        {
          path: 'edit-child/:documentId',
          name: 'EditChild',
          component: TheParentEditChild,
          props: true,
        },
        {
          path: 'account',
          name: 'parentAccount',
          component: TheParentAccount,
        },
        {
          path: 'subscription',
          name: 'parentSubscription',
          component: TheParentSubscription,
        },
        {
          path: 'pin',
          name: 'parentPin',
          component: TheParentPin,
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
