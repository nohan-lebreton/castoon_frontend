<script setup>
import Card from 'primevue/card'
import { usePodcasts } from '@/stores/usePodcasts'
import { useTransition } from '@/stores/useTransition'
import { useTopics } from '@/stores/useTopics'

const podcastsStore = usePodcasts()
const transitionStore = useTransition()
const topicsStore = useTopics()

const props = defineProps({
  podcast: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="podcast-card">
    <Card>
      <template #header>
        <img
          v-if="props.podcast.image?.url"
          :src="props.podcast.image.url"
          alt="Podcast Image"
          class="podcast-image"
          @click="
            () => {
              podcastsStore.currentPodcast = props.podcast
              transitionStore.setTransition('zoom-out')
              $router.push({
                name: 'ChildPodcastNode',
                params: {
                  topicTitle: topicsStore.currentTopic.title,
                  podcastTitle: props.podcast.title,
                  node: 1,
                },
              })
            }
          "
        />
        <h3 class="podcast-title">
          <p class="font-grenadine-medium">{{ props.podcast.title }}</p>
        </h3>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.podcast-card {
  width: 200px;
  height: 200px;
  margin: 10px;
  border-radius: 8px;
  border: 5px solid #31af97;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.1);
}
.podcast-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.podcast-title {
  font-size: 1.2em;
  margin: auto;
  text-align: center;
}
</style>
