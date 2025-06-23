<script setup>
import { onMounted, ref, computed } from 'vue'
import { useChildren } from '@/stores/useChildren'
import { usePodcastProgress } from '@/stores/usePodcastProgress'
import { useTopic } from '@/stores/useTopic'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { useTransition } from '@/stores/useTransition'
import router from '@/router'
import ProgressBar from 'primevue/progressbar'
import MeterGroup from 'primevue/metergroup'

const transitionStore = useTransition()
const route = useRoute()
const childrenStore = useChildren()
const podcastProgressStore = usePodcastProgress()
const topicStore = useTopic()

const child = ref(null)
const isLoading = ref(true)

defineProps({
  documentId: String,
})

onMounted(async () => {
  try {
    isLoading.value = true
    const childId = route.params.documentId
    child.value = await childrenStore.fetchChildById(childId)
    await podcastProgressStore.fetchPodcastProgressByChild(childId)
    await topicStore.fetchTopics() // Charger les topics
    console.log('Child data loaded:', child.value)
    console.log('Podcast progress data loaded:', podcastProgressStore.collection)
  } catch (error) {
    console.error('Error loading child data:', error)
  } finally {
    isLoading.value = false
  }
})

const completionPercentage = computed(() => {
  return podcastProgressStore.getCompletionPercentage()
})

const completedPodcasts = computed(() => {
  return podcastProgressStore.getCompletedPodcastsCount()
})

const totalScore = computed(() => {
  return podcastProgressStore.getTotalScore()
})

const totalPodcasts = computed(() => {
  return podcastProgressStore.getTotalPodcastsCount()
})

const topicStats = computed(() => {
  const stats = podcastProgressStore.getTopicStats()
  return stats.map((topic) => ({
    name: topic.title,
    value: topic.distributionPercentage, // Utiliser le pourcentage de distribution
    color: getColorForTopic(topic.title),
    completionPercentage: topic.completionPercentage,
    count: topic.count,
  }))
})

function getColorForTopic(topicName) {
  return topicStore.getTopicColor(topicName)
}

function playWithSelectedChild() {
  if (child.value) {
    //mettre l'enfant en storage pour l'utiliser dans le jeu
    childrenStore.currentChild = child.value
    transitionStore.setTransition('zoom-out')
    router.push({ name: 'ChildTopics' })
  }
}

function editChild() {
  if (child.value) {
    transitionStore.setTransition('slide-left')
    router.push({
      name: 'EditChild',
      params: { documentId: child.value.documentId },
    })
  }
}

function deleteChild() {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${child.value.name} ?`)) {
    // Appeler l'API pour supprimer l'enfant
    childrenStore
      .deleteChild(child.value.documentId)
      .then(() => {
        // Rediriger vers la page d'accueil
        transitionStore.setTransition('slide-right')
        router.push({ name: 'ParentHome' })
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'enfant:", error)
        alert("Une erreur est survenue lors de la suppression de l'enfant.")
      })
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
        <div class="child-actions">
          <Button
            :label="`${child.name}`"
            severity="success"
            icon="pi pi-play-circle"
            size="large"
            class="playButton"
            raised
            @click="playWithSelectedChild()"
          />
          <div class="action-buttons">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-outlined"
              aria-label="Modifier"
              title="Modifier le profil"
              @click="editChild()"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-outlined"
              aria-label="Supprimer"
              title="Supprimer le profil"
              @click="deleteChild()"
            />
          </div>
        </div>
      </div>
      <div class="child-progress">
        <h2 class="progress-title">Progression</h2>

        <div v-if="isLoading" class="loading-progress">
          Chargement des données de progression...
        </div>

        <div v-else-if="totalPodcasts === 0" class="no-progress">
          Aucun podcast écouté pour le moment.
        </div>

        <div v-else class="progress-stats">
          <div class="progress-card">
            <h3>Score total : {{ totalScore }}</h3>
          </div>
          <div class="progress-card">
            <h3>Taux de complétion</h3>
            <div class="progress-bar-container">
              <ProgressBar
                :value="completionPercentage"
                :pt="{ value: { class: 'progress-value' } }"
              />
              <span class="progress-text">{{ completionPercentage }}%</span>
            </div>
            <div class="progress-details">
              {{ completedPodcasts }} sur {{ totalPodcasts }} podcasts terminés
            </div>
          </div>
          <div class="progress-card">
            <h3>Répartition des thématiques écoutées</h3>
            <div v-if="topicStats.length === 0" class="no-topics">
              Aucune donnée de thématique disponible.
            </div>
            <div v-else class="topic-stats-container">
              <div class="topic-meter-container">
                <MeterGroup
                  :value="topicStats"
                  :min="0"
                  :max="100"
                  labelPosition="outside"
                  valuePosition="outside"
                  valueTemplate="{value}%"
                />
              </div>
              <div class="topic-legend">
                <p class="legend-title">Pourcentage des thématiques écoutées :</p>
                <ul class="legend-list">
                  <li v-for="topic in topicStats" :key="topic.name" class="legend-item">
                    <span class="color-indicator" :style="{ backgroundColor: topic.color }"></span>
                    <span class="topic-name"
                      >{{ topic.count ? topic.count + ' ' : '' }} {{ topic.name }}</span
                    >
                    <span class="topic-value">{{ topic.value }}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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

.child-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
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

.child-progress {
  padding: 20px;
  margin-top: 20px;
}

.progress-title {
  font-size: 1.8rem;
  color: #2e89e5;
  margin-bottom: 20px;
  text-align: center;
}

.loading-progress,
.no-progress {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.progress-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.progress-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.progress-card h3 {
  font-size: 1.3rem;
  color: #f79c07;
  margin-bottom: 15px;
  text-align: center;
}

.progress-bar-container {
  position: relative;
  margin-bottom: 10px;
}

.progress-value {
  height: 24px;
  font-size: 14px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.progress-details {
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.topic-meter-container {
  margin-top: 15px;
}

.topic-stats-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.topic-legend {
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

.legend-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #333;
}

.legend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.color-indicator {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 8px;
}

.topic-name {
  font-weight: 500;
  margin-right: 8px;
}

.topic-value {
  font-weight: bold;
  margin-right: 8px;
}

.topic-details {
  color: #666;
  font-size: 0.85rem;
}

.no-topics {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 10px;
}

.score-high {
  background-color: #4caf50;
}

.score-medium {
  background-color: #ff9800;
}

.score-low {
  background-color: #f44336;
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
