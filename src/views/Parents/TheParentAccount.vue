<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { useAuth } from '@/stores/useAuth.js'
import { ref, onMounted } from 'vue'

const auth = useAuth()

const formData = ref({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  if (auth.user) {
    formData.value.username = auth.user.username || ''
    formData.value.email = auth.user.email || ''
  }
})

const updateProfile = async () => {
  // Ici, vous pouvez implémenter la logique pour mettre à jour le profil
  console.log('Mise à jour du profil', formData.value)
  // auth.updateProfile(formData.value)
}
</script>

<template>
  <div class="account-container">
    <div class="account-header">
      <h2 class="account-title">Mon Compte</h2>
    </div>

    <Card>
      <template #title>
        <div class="card-title">Informations personnelles</div>
      </template>
      <template #content>
        <div class="p-fluid">
          <div class="field">
            <label for="username">Nom d'utilisateur</label>
            <InputText id="username" v-model="formData.username" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="formData.email" type="email" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="mt-4">
      <template #title>
        <div class="card-title">Changer de mot de passe</div>
      </template>
      <template #content>
        <div class="p-fluid">
          <div class="field">
            <label for="currentPassword">Mot de passe actuel</label>
            <InputText id="currentPassword" v-model="formData.currentPassword" type="password" />
          </div>
          <div class="field">
            <label for="newPassword">Nouveau mot de passe</label>
            <InputText id="newPassword" v-model="formData.newPassword" type="password" />
          </div>
          <div class="field">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <InputText id="confirmPassword" v-model="formData.confirmPassword" type="password" />
          </div>
          <Button label="Mettre à jour" severity="success" @click="updateProfile" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.account-container {
  padding: 20px;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.account-title {
  font-size: 1.5rem;
  color: #f79c07;
}

.card-title {
  font-size: 1.2rem;
  color: #2e89e5;
}

.field {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
