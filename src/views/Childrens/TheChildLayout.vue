<script setup>
import { useChildren } from '@/stores/useChildren'
import Button from 'primevue/button'
import { useTransition } from '@/stores/useTransition'
import ParentPinDialog from '@/components/children/ParentPinDialog.vue'
import LandscapeWarning from '@/components/orientation/LandscapeWarning.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transitionStore = useTransition()

const childrenStore = useChildren()
const currentChild = computed(() => childrenStore.currentChild)

const showPinCodeDialog = ref(false)

const home = computed(() => {
  return router.currentRoute.value.name === 'ChildTopics'
})
// regarder si la route contine topicTitle
const currentTopic = computed(() => {
  return router.currentRoute.value.params.topicTitle
    ? router.currentRoute.value.params.topicTitle
    : null
})

const currentPodcast = computed(() => {
  return router.currentRoute.value.params.podcastTitle
    ? router.currentRoute.value.params.podcastTitle
    : null
})
</script>
<template>
  <div>
    <LandscapeWarning />
    <div class="child-header">
      <!-- Colonne gauche : Bonjour -->
      <div v-if="home" class="child-left">
        <h1 class="child-home-title">
          Bonjour <span class="child-name">{{ currentChild.name }}</span> !
        </h1>
      </div>

      <!--- Topic title -->
      <div v-if="currentTopic && !currentPodcast" class="child-callback">
        <Button
          severity="secondary"
          raised
          class="child-back-button"
          icon="pi pi-arrow-left"
          @click="$router.push({ name: 'ChildTopics' })"
        />
        <h1 class="child-topic-title">
          Les podcasts :
          <span class="font-grenadine-medium text-custom-success">{{ currentTopic }}</span>
        </h1>
      </div>

      <div v-if="currentTopic && currentPodcast">
        <h1 class="child-topic-title">
          <span class="font-grenadine-medium text-custom-white">{{ currentPodcast }}</span>
        </h1>
      </div>
    </div>

    <router-view v-slot="{ Component }">
      <transition :name="transitionStore.name" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Dialog -->
    <ParentPinDialog
      :visible="showPinCodeDialog"
      @close="showPinCodeDialog = false"
      @validated="handlePinValidated"
    />
  </div>
</template>

<style scoped>
.child-home {
  display: flex;
  justify-content: space-between;
}
.child-toolbar {
  display: flex;
  gap: 1rem;
}
.text-custom-success {
  color: #31af97; /* exemple de couleur personnalisée */
}
.text-custom-white {
  color: #ffffff; /* exemple de couleur blanche */
}
.child-callback {
  display: flex;
  gap: 1rem;
}
.child-home-title {
  font-size: 2rem;
}

.child-name {
  color: #f79c07; /* exemple de couleur orange */
  font-weight: bold;
}

.child-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
