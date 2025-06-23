<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'
import Button from 'primevue/button'
import { useTopics } from '@/stores/useTopics'
import { useTransition } from '@/stores/useTransition'

const router = useRouter()
const topicsStore = useTopics()
const transitionStore = useTransition()

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  node: {
    type: Object,
    required: false,
  },
})
</script>

<template>
  <div class="choice-button__container">
    <div v-if="show && !node.isEnd" class="choice-button">
      {{ console.log('node choice', node) }}
      <!-- afficher le nombre de button -->
      <Button
        v-if="node.next_node_1"
        label="1"
        class="choice-button__btn"
        severity="warn"
        size="large"
        @click="
          () => {
            transitionStore.setTransition('fade')
            router.push({
              name: 'ChildPodcastNode',
              params: {
                topicTitle: topicsStore.currentTopic.title,
                podcastTitle: node.podcast.title,
                node: node.next_node_1.numero,
              },
            })
          }
        "
      />
      <Button
        v-if="node.next_node_2"
        label="2"
        size="large"
        class="choice-button__btn"
        severity="success"
        @click="
          () => {
            transitionStore.setTransition('fade')
            router.push({
              name: 'ChildPodcastNode',
              params: {
                topicTitle: topicsStore.currentTopic.title,
                podcastTitle: node.podcast.title,
                node: node.next_node_2.numero,
              },
            })
          }
        "
      />
      <Button
        v-if="node.next_node_3"
        label="3"
        size="large"
        class="choice-button__btn"
        severity="info"
        @click="
          () => {
            transitionStore.setTransition('fade')
            router.push({
              name: 'ChildPodcastNode',
              params: {
                topicTitle: topicsStore.currentTopic.title,
                podcastTitle: node.podcast.title,
                node: node.next_node_3.numero,
              },
            })
          }
        "
      />
      <Button
        v-if="node.next_node_4"
        label="4"
        size="large"
        class="choice-button__btn"
        severity="primary"
        @click="
          () => {
            transitionStore.setTransition('fade')
            router.push({
              name: 'ChildPodcastNode',
              params: {
                topicTitle: topicsStore.currentTopic.title,
                podcastTitle: node.podcast.title,
                node: node.next_node_4.numero,
              },
            })
          }
        "
      />
    </div>
    <div v-if="show && node.isEnd" class="choice-button">
      <Button
        label="Terminer !"
        class="choice-button__btn--end"
        severity="success"
        size="large"
        @click="
          () => {
            transitionStore.setTransition('zoom-out')
            router.push({
              name: 'ChildPodcasts',
              params: {
                topicTitle: topicsStore.currentTopic.title,
              },
            })
          }
        "
      />
    </div>
  </div>
</template>

<style scoped>
.choice-button__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.choice-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
}

.choice-button__btn {
  font-size: 2rem; /* taille du texte */
  width: 80px;
  height: 80px;
  border-radius: 12px; /* optionnel, pour des coins plus arrondis */
}

.choice-button__btn--end {
  font-size: 2rem; /* taille du texte */
  width: 300px;
  height: 80px;
  border-radius: 12px; /* optionnel, pour des coins plus arrondis */
}
</style>
