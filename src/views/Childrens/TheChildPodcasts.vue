<script setup>
import { onMounted, computed } from 'vue'
import { useTopics } from '@/stores/useTopics'
import { usePodcasts } from '@/stores/usePodcasts'
import PodcastCard from '@/components/children/PodcastCard.vue'

const topicsStore = useTopics()
const podcastsStore = usePodcasts()

// Make currentTopic available to the template
const currentTopic = computed(() => topicsStore.currentTopic || {})

onMounted(() => {
  if (currentTopic.value && currentTopic.value.documentId) {
    podcastsStore.fetchPodcastsByTopics(currentTopic.value.documentId)
  }
})
</script>

<template>
  <div class="child-podcasts">
    <div
      v-if="podcastsStore.collection && podcastsStore.collection.length"
      class="podcasts-container"
    >
      <div v-for="podcast in podcastsStore.collection" :key="podcast.id">
        <PodcastCard :podcast="podcast" />
      </div>
    </div>
    <div v-else class="no-podcasts">Aucun podcast disponible pour ce sujet.</div>
  </div>
</template>

<style scoped>
.child-podcasts {
  display: flex;
}
.child-callback {
  padding: 1rem;
  margin-bottom: 1rem;
}
.child-back-button {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.podcasts-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
}

.podcast-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.podcast-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.no-podcasts {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
</style>
