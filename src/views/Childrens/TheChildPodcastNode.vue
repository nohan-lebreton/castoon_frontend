<script setup>
import { usePodcasts } from '@/stores/usePodcasts'
import { usePodcastNodes } from '@/stores/usePodcastNodes'
import { useTopics } from '@/stores/useTopics'
import { computed, onMounted } from 'vue'
import ChoiceButton from '@/components/children/ChoiceButton.vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { ref, watch } from 'vue'
import { onUnmounted } from 'vue'
import Tag from 'primevue/tag'
import { useTransition } from '@/stores/useTransition'

const audioPlayer = ref(null)
const isPlaying = ref(false)
const transcriptionContainer = ref(null)
const autoScrollActive = ref(true)
const scrollInterval = ref(null)
const scrollSpeed = ref(40) // pixels par seconde pour le défilement

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.src = ''
    audioPlayer.value = null
    isPlaying.value = false
    audioEnded.value = false
  }

  // Nettoyer l'intervalle de défilement
  stopAutoScroll()
})

// Fonction pour démarrer le défilement automatique
const startAutoScroll = () => {
  if (!autoScrollActive.value || !transcriptionContainer.value) return

  // Arrêter tout intervalle existant
  stopAutoScroll()

  // Calculer la durée totale de défilement basée sur la durée de l'audio
  const totalScrollHeight =
    transcriptionContainer.value.scrollHeight - transcriptionContainer.value.clientHeight
  const scrollStep = scrollSpeed.value / 10 // Ajuster selon la vitesse souhaitée

  // Créer un nouvel intervalle pour le défilement progressif
  scrollInterval.value = setInterval(() => {
    if (transcriptionContainer.value.scrollTop < totalScrollHeight) {
      transcriptionContainer.value.scrollTop += scrollStep
    } else {
      stopAutoScroll()
    }
  }, 100)
}

// Fonction pour arrêter le défilement automatique
const stopAutoScroll = () => {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value)
    scrollInterval.value = null
  }
}

// Fonction pour basculer le défilement automatique
const toggleAutoScroll = () => {
  autoScrollActive.value = !autoScrollActive.value
  if (autoScrollActive.value && isPlaying.value) {
    startAutoScroll()
  } else {
    stopAutoScroll()
  }
}

const toggleAudio = () => {
  if (!audioPlayer.value) return

  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
    // Arrêter le défilement automatique quand on met en pause
    stopAutoScroll()
  } else {
    audioPlayer.value.play()
    isPlaying.value = true
    // Démarrer le défilement automatique quand on démarre l'audio
    startAutoScroll()
  }
}

const podcastsStore = usePodcasts()
const podcastNodesStore = usePodcastNodes()
const router = useRouter()
const topicsStore = useTopics()
const transitionStore = useTransition()

const audioEnded = ref(false)

const currentTopic = computed(() => topicsStore.currentTopic || {})
const currentNodeNumero = computed(() => router.currentRoute.value.params.node)
const currentNode = computed(() =>
  podcastNodesStore.collection.find(
    (node) => String(node.numero) === String(currentNodeNumero.value),
  ),
)
const currentPodcast = computed(() => podcastsStore.currentPodcast || {})

watch(currentNode, (newNode) => {
  audioEnded.value = false
  if (newNode?.audio?.url) {
    // Nettoie l'ancien audio si nécessaire
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value.src = ''
      audioPlayer.value = null
    }

    audioPlayer.value = new Audio(newNode.audio.url)
    isPlaying.value = false
    audioEnded.value = false

    audioPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false
      audioEnded.value = true
      stopAutoScroll()
    })

    audioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true
        startAutoScroll()
      })
      .catch((err) => {
        console.warn('Autoplay refusé par le navigateur :', err)
      })
  }
})

onMounted(() => {
  const podcastId = podcastsStore.currentPodcast.documentId
  if (podcastId) {
    podcastNodesStore.fetchPodcastNodesByPodcastId(podcastId)
    console.log('Nodes:', podcastNodesStore.collection)
  }
  isPlaying.value = true
  console.log('Current Podcast:', currentPodcast.value)
  console.log('Current Node:', currentNode.value)
})
</script>

<template>
  <div class="podcast-node__container">
    <div ref="transcriptionContainer" class="transcription-container">
      <div v-if="currentNode && currentNode.transcription">
        <div
          v-for="(paragraph, index) in currentNode.transcription"
          :key="index"
          class="podcast-node__transcription"
        >
          <p v-for="(child, cIndex) in paragraph.children" :key="cIndex">
            {{ child.text }}
          </p>
        </div>
        <br />
        <p v-if="currentNode.text_choice_1">
          <Tag severity="warn" value="1."></Tag>{{ ' ' + currentNode.text_choice_1 }}
        </p>
        <p v-if="currentNode.text_choice_2">
          <Tag severity="success" value="2."></Tag>{{ ' ' + currentNode.text_choice_2 }}
        </p>
        <p v-if="currentNode.text_choice_3">
          <Tag severity="secondary" value="3."></Tag>{{ ' ' + currentNode.text_choice_3 }}
        </p>
        <p v-if="currentNode.text_choice_4">
          <Tag severity="secondary" value="4."></Tag>{{ ' ' + currentNode.text_choice_4 }}
        </p>
      </div>
      <div v-else>
        <p>Aucune transcription disponible pour ce nœud.</p>
      </div>
    </div>

    <div class="podcast-node__footer">
      <div class="podcast-node__tools">
        <Button
          severity="secondary"
          icon="pi pi-arrow-left"
          class="podcast-node__tools__button"
          @click="
            () => {
              transitionStore.setTransition('zoom')
              $router.push({
                name: 'ChildPodcasts',
                params: { topicTitle: currentTopic.title, podcastTitle: currentPodcast.title },
              })
            }
          "
        />
        <Button
          severity="secondary"
          :icon="isPlaying ? 'pi pi-pause' : 'pi pi-play'"
          class="podcast-node__tools__button"
          @click="toggleAudio"
        />
        <Button
          severity="secondary"
          :icon="autoScrollActive ? 'pi pi-lock' : 'pi pi-lock-open'"
          class="podcast-node__tools__button auto-scroll-button"
          @click="toggleAutoScroll"
          :class="{ active: autoScrollActive }"
          tooltip="Défilement automatique"
          tooltipOptions="bottom"
        />
      </div>
      <!-- show les boutons sur l'audio est finit-->
      <ChoiceButton :key="currentNode.numero" :show="audioEnded" :node="currentNode" />
    </div>
  </div>
</template>

<style scoped>
.podcast-node__tools__button {
  font-size: 2rem; /* taille du texte */
  width: 80px;
  height: 80px;
  border-radius: 12px; /* optionnel, pour des coins plus arrondis */
}

.auto-scroll-button.active {
  background-color: #4caf50;
  color: white;
}

.podcast-node__footer {
  display: flex;
  justify-content: space-between;
}
.podcast-node__tools {
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 1rem;
}
.transcription-container {
  max-height: 150px; /* ou ce que tu veux */
  background-color: black;
  color: white;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  scroll-behavior: smooth;
}

.podcast-node__transcription {
  margin-bottom: 1rem;
}
</style>
