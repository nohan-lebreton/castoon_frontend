<script setup>
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useAuth } from '@/stores/useAuth.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useTransition } from '@/stores/useTransition'
import PortraitWarning from '@/components/orientation/PortraitWarning.vue'

const transitionStore = useTransition()
const auth = useAuth()
const router = useRouter()
const menu = ref()

const toggle = (event) => {
  menu.value.toggle(event)
}

const items = ref([
  {
    label: 'Profil Parent',
    items: [
      {
        label: 'Mon compte',
        icon: 'pi pi-user',
        command: () => {
          transitionStore.setTransition('fade')
          router.push({ name: 'parentAccount' })
        },
      },
      {
        label: 'Abonnement',
        icon: 'pi pi-credit-card',
        command: () => {
          transitionStore.setTransition('fade')
          router.push({ name: 'parentSubscription' })
        },
      },
      {
        label: 'logout',
        icon: 'pi pi-sign-out',
        command: async () => {
          // D'abord, changer la transition
          transitionStore.setTransition('fade')

          // Ensuite, rediriger vers la page d'authentification
          await router.push({ name: 'AuthLogin' })

          // Puis, seulement après la redirection, effectuer le logout
          setTimeout(() => {
            auth.logout()
          }, 100)
        },
      },
    ],
  },
  {
    label: 'Sécurité',
    items: [
      {
        label: 'Code pin',
        icon: 'pi pi-lock',
        command: () => {
          transitionStore.setTransition('fade')
          router.push({ name: 'parentPin' })
        },
      },
    ],
  },
])
</script>

<template>
  <div class="parent-layout">
    <PortraitWarning />
    <div class="home__header">
      <img
        src="/LITTLE_CASTOON_LOGO_MONOGRAMME_QUADRI.svg"
        alt="Logo Little Castoon"
        class="home__logo"
        @click="() => router.push({ name: 'ParentHome' })"
      />
      <h1 class="font-grenadine-medium">{{ auth.user?.username || 'Utilisateur' }}</h1>
      <Button
        type="button"
        icon="pi pi pi-bars"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        raised
        size="large"
        severity="primary"
      />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" severity="danger" />
    </div>
    <router-view v-slot="{ Component }">
      <transition :name="transitionStore.name" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.parent-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.home__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
  color: #2e89e5;
}
.home__logo {
  border-radius: 10%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
