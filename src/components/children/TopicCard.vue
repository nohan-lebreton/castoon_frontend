<script setup>
import Card from 'primevue/card'
import { useTransition } from '@/stores/useTransition'
import { useTopics } from '@/stores/useTopics'

const transitionStore = useTransition()
const topicsStore = useTopics()

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="topic-card"
    @click="
      () => {
        topicsStore.currentTopic = props.topic
        transitionStore.setTransition('slide-left')
        $router.push({ name: 'ChildPodcasts', params: { topicTitle: props.topic.title } })
      }
    "
  >
    <Card>
      <template #header>
        <img
          v-if="props.topic.image?.url"
          :src="props.topic.image.url"
          alt="Topic Image"
          class="topic-image"
        />
        <h3 class="topic-title">
          <p class="font-grenadine-medium">{{ props.topic.title }}</p>
        </h3>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.topic-card {
  width: 200px;
  height: 200px;
  margin: 10px;
  border-radius: 8px;
  border: 5px solid #f79c07;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.1);
}
.topic-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.topic-title {
  font-size: 1.2em;
  margin: auto;
  text-align: center;
}
</style>
