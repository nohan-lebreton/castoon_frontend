<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildren } from '@/stores/useChildren'
import { useAvatar } from '@/stores/useAvatar'
import { useTopic } from '@/stores/useTopic'
import { useTransition } from '@/stores/useTransition'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const childrenStore = useChildren()
const avatarStore = useAvatar()
const topicStore = useTopic()
const transitionStore = useTransition()

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// État du formulaire
const child = reactive({
  name: '',
  birthday: null,
  avatarId: null,
  topics: [],
})

// Référence pour l'avatar sélectionné
const selectedAvatarId = ref(null)
// Array to hold all available topics
const availableTopics = ref([])
// By default all topics are selected
const selectedTopics = ref([])

onMounted(async () => {
  try {
    // Fetch avatars and topics in parallel
    await Promise.all([avatarStore.fetchAvatars(), topicStore.fetchTopics()])

    // Store topics and select all by default
    availableTopics.value = topicStore.collection
    console.log('Available topics:', availableTopics.value)

    // Pré-sélectionner tous les topics
    selectedTopics.value = availableTopics.value.map((topic) => topic.id)
    child.topics = selectedTopics.value
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    errorMessage.value = 'Impossible de charger les données nécessaires.'
  }
})

// Fonction pour sélectionner un avatar
const selectAvatar = (avatarId) => {
  selectedAvatarId.value = avatarId
  child.avatarId = avatarId
}

// Fonction pour valider le formulaire
const validateForm = () => {
  if (!child.name.trim()) {
    errorMessage.value = "Le nom de l'enfant est requis"
    return false
  }

  if (!child.birthday) {
    errorMessage.value = 'La date de naissance est requise'
    return false
  }

  // Vérifier que l'enfant a entre 3 et 12 ans
  const age = childrenStore.calculateAge(child.birthday)
  if (age < 3 || age > 12) {
    errorMessage.value = "L'enfant doit avoir entre 3 et 12 ans"
    return false
  } // Vérifier qu'un avatar a été sélectionné
  if (!child.avatarId) {
    errorMessage.value = "Veuillez sélectionner un avatar pour l'enfant"
    return false
  }

  // Vérifier qu'au moins un thème est sélectionné
  if (selectedTopics.value.length === 0) {
    errorMessage.value = "Veuillez sélectionner au moins un thème d'intérêt"
    return false
  }

  return true
}

// Fonction pour créer un enfant
const createChild = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }
  isLoading.value = true

  try {
    // Préparer les données de l'enfant
    const childData = {
      name: child.name,
      birthday: child.birthday,
      topics: {
        connect: selectedTopics.value,
      },
    }

    // Appeler la méthode du store pour créer l'enfant
    await childrenStore.createChild(childData, null, child.avatarId)

    // Afficher un message de succès
    successMessage.value = 'Enfant ajouté avec succès!'

    // Réinitialiser le formulaire
    child.name = ''
    child.birthday = null
    child.avatarId = null
    selectedAvatarId.value = null
    // Réinitialiser les topics à tous sélectionnés
    selectedTopics.value = topicStore.collection.map((topic) => topic.id)

    // Rediriger vers la page d'accueil après 2 secondes
    setTimeout(() => {
      transitionStore.setTransition('slide-right')
      router.push({ name: 'ParentHome' })
    }, 2000)
  } catch (error) {
    console.error("Erreur lors de la création de l'enfant:", error)
    errorMessage.value = "Erreur lors de la création de l'enfant. Veuillez réessayer."
  } finally {
    isLoading.value = false
  }
}

// Fonction pour annuler et retourner à la page d'accueil
const cancel = () => {
  transitionStore.setTransition('slide-right')
  router.push({ name: 'ParentHome' })
}
</script>

<template>
  <div class="add-child-container">
    <div class="add-child-header">
      <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-text" @click="cancel" />
      <h1 class="add-child-title">Ajouter un enfant</h1>
    </div>

    <div class="add-child-form">
      <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
      <Message v-if="successMessage" severity="success" :closable="false">{{
        successMessage
      }}</Message>

      <div class="form-group">
        <label for="name">Nom de l'enfant*</label>
        <InputText
          id="name"
          v-model="child.name"
          class="w-full"
          placeholder="Prénom de l'enfant"
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="birthday">Date de naissance*</label>
        <!--
          Note: The Calendar component is deprecated.
          Consider replacing with DatePicker in future updates.
        -->
        <Calendar
          id="birthday"
          v-model="child.birthday"
          class="w-full"
          dateFormat="dd/mm/yy"
          :showIcon="true"
          :disabled="isLoading"
          :maxDate="new Date()"
          placeholder="JJ/MM/AAAA"
        />
        <small class="helper-text">L'enfant doit avoir entre 3 et 12 ans</small>
      </div>
      <div class="form-group">
        <label>Avatar*</label>
        <div v-if="avatarStore.isLoading" class="avatar-loading">
          <ProgressSpinner />
          <span>Chargement des avatars...</span>
        </div>
        <div v-else class="avatar-grid">
          <div
            v-for="avatar in avatarStore.collection"
            :key="avatar.id"
            class="avatar-item"
            :class="{ selected: selectedAvatarId === avatar.id }"
            @click="selectAvatar(avatar.id)"
          >
            <img
              v-if="avatar.image?.url"
              :src="avatarStore.getImageUrl(avatar.image.url)"
              :alt="avatar.name || 'Avatar ' + avatar.id"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              <i class="pi pi-user"></i>
            </div>
            <div class="avatar-name">{{ avatar.name }}</div>
          </div>
        </div>
        <small class="helper-text">Choisissez un avatar pour votre enfant</small>
      </div>

      <div class="form-group">
        <label>Thèmes d'intérêt</label>
        <div v-if="topicStore.collection.length === 0" class="topics-loading">
          <ProgressSpinner />
          <span>Chargement des thèmes...</span>
        </div>
        <div v-else class="topics-container">
          <div v-for="topic in availableTopics" :key="topic.id" class="topic-item">
            <Checkbox :inputId="'topic-' + topic.id" :value="topic.id" v-model="selectedTopics" />
            <label :for="'topic-' + topic.id" class="topic-label">
              <span class="topic-name">{{ topic.title || 'Sans nom' }}</span>
            </label>
          </div>
          <small class="helper-text"
            >Tous les thèmes sont sélectionnés par défaut. Vous pouvez décocher ceux qui
            n'intéressent pas votre enfant.</small
          >
        </div>
      </div>

      <div class="form-actions">
        <Button label="Annuler" class="p-button-outlined" @click="cancel" :disabled="isLoading" />
        <Button
          label="Ajouter"
          severity="success"
          @click="createChild"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-child-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-child-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.add-child-title {
  font-size: 1.8rem;
  color: #f79c07;
  margin-left: 15px;
}

.add-child-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.helper-text {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

:deep(.p-fileupload-buttonbar) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-fileupload-content) {
  background: transparent;
  border: none;
  padding: 8px 0;
}

:deep(.p-button.p-component.p-fileupload-choose) {
  width: 100%;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-checkbox) {
  margin-right: 0;
}

:deep(.p-checkbox-box.p-highlight) {
  border-color: #f79c07;
  background: #f79c07;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
  border-color: #e08c06;
  background: #e08c06;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.avatar-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.avatar-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-item.selected {
  border-color: #f79c07;
  box-shadow: 0 0 0 4px rgba(247, 156, 7, 0.3);
}

.avatar-image {
  width: 100%;
  height: calc(100% - 24px);
  object-fit: cover;
}

.avatar-name {
  font-size: 0.8rem;
  text-align: center;
  padding: 4px 0;
  background-color: #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 24px;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 24px);
  background-color: #f0f0f0;
  color: #666;
  font-size: 2rem;
}

.avatar-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;
}

.topics-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.topics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.topic-label {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  cursor: pointer;
  max-width: 100%;
  color: #333;
  font-weight: 500;
}

.topic-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
