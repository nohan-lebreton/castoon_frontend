<script setup>
import { onMounted, ref } from 'vue'
import { useChildren } from '@/stores/useChildren'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { useTransition } from '@/stores/useTransition'
import router from '@/router'
//import MeterGroup from 'primevue/metergroup'

const transitionStore = useTransition()
const route = useRoute()
const childrenStore = useChildren()

const child = ref(null)

defineProps({
  documentId: String,
})

onMounted(async () => {
  const childId = route.params.documentId
  child.value = await childrenStore.fetchChildById(childId)
})

function playWithSelectedChild() {
  if (child.value) {
    //mettre l'enfant en storage pour l'utiliser dans le jeu
    childrenStore.currentChild = child.value
    transitionStore.setTransition('zoom-out')
    router.push({ name: 'ChildTopics' })
  }
}
</script>

<template>
  <div>
    <div class="child-callback">
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
    <div v-if="child" class="child-profile">
      <div class="child-profile-header">
        <img
          v-if="child.avatar?.image?.url"
          :src="childrenStore.getImageUrl(child.avatar.image.url)"
          alt="Avatar"
          class="child-avatar"
        />
        <Button
          :label="`${child.name}`"
          severity="success"
          icon="pi pi-play-circle"
          size="large"
          class="playButton"
          raised
          @click="playWithSelectedChild()"
        />
      </div>
      <div class="child-progress">
        <h2>Progression</h2>
        <!-- Vous pouvez ajouter un composant MeterGroup ici si nécessaire -->
        <!-- <MeterGroup :value="child.progress" /> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.child-profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.child-avatar {
  justify-content: center;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
}
.playButton {
  margin-top: 20px;
  width: 150px;
  height: 50px;
  font-size: 1.2em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
