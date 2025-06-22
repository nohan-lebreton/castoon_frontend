<script setup>
import TopicCard from '@/components/children/TopicCard.vue'
import { useChildren } from '@/stores/useChildren'
import { onMounted } from 'vue'
import { useTopics } from '@/stores/useTopics'

const childrenStore = useChildren()
const topicsStore = useTopics()

onMounted(() => {
  const currentChild = childrenStore.currentChild
  topicsStore.fetchTopicsByChildId(currentChild.documentId)
})
</script>

<template>
  <div>
    <div v-if="topicsStore.collection && topicsStore.collection.length" class="topics-list">
      <div v-for="topic in topicsStore.collection" :key="topic.id" class="topic-card">
        <TopicCard :topic="topic" />
      </div>
    </div>
    <div v-else>
      <p>Aucun topic disponible pour le moment.</p>
    </div>
  </div>
</template>

<style scoped>
.topics-list {
  display: flex;
}
</style>
