<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import { ref } from 'vue'

// Données fictives d'abonnement à remplacer par les vraies données
const subscription = ref({
  plan: 'Premium',
  status: 'Actif',
  nextBillingDate: '22/07/2025',
  price: '9.99€/mois',
})

const plans = ref([
  {
    name: 'Basic',
    price: '4.99€/mois',
    features: ['Accès à 10 histoires par mois', '1 profil enfant', 'Téléchargement limité'],
  },
  {
    name: 'Premium',
    price: '9.99€/mois',
    features: [
      'Accès illimité à toutes les histoires',
      "Jusqu'à 3 profils enfants",
      'Téléchargements illimités',
      'Pas de publicités',
    ],
  },
  {
    name: 'Famille',
    price: '14.99€/mois',
    features: [
      'Accès illimité à toutes les histoires',
      "Jusqu'à 5 profils enfants",
      'Téléchargements illimités',
      'Pas de publicités',
      'Contrôle parental avancé',
    ],
  },
])

const changePlan = (plan) => {
  console.log('Changement de plan vers', plan.name)
  // Logique pour changer d'abonnement
}

const cancelSubscription = () => {
  console.log("Annulation de l'abonnement")
  // Logique pour annuler l'abonnement
}
</script>

<template>
  <div class="subscription-container">
    <div class="subscription-header">
      <h2 class="subscription-title">Mon Abonnement</h2>
    </div>

    <Card>
      <template #title>
        <div class="card-title">Statut de l'abonnement</div>
      </template>
      <template #content>
        <div class="subscription-info">
          <div class="info-row">
            <span class="info-label">Plan actuel:</span>
            <span class="info-value">{{ subscription.plan }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Statut:</span>
            <span class="info-value">{{ subscription.status }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Prochaine facturation:</span>
            <span class="info-value">{{ subscription.nextBillingDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Prix:</span>
            <span class="info-value">{{ subscription.price }}</span>
          </div>
        </div>
        <Button
          label="Annuler l'abonnement"
          severity="danger"
          class="p-button-outlined mt-3"
          @click="cancelSubscription"
        />
      </template>
    </Card>

    <h3 class="plans-title mt-4">Changer de plan</h3>

    <div class="plans-grid">
      <Card v-for="(plan, index) in plans" :key="index" class="plan-card">
        <template #title>
          <div class="plan-title">{{ plan.name }}</div>
        </template>
        <template #subtitle>
          <div class="plan-price">{{ plan.price }}</div>
        </template>
        <template #content>
          <ul class="plan-features">
            <li v-for="(feature, i) in plan.features" :key="i">{{ feature }}</li>
          </ul>
          <Button
            :label="plan.name === subscription.plan ? 'Plan actuel' : 'Choisir ce plan'"
            :disabled="plan.name === subscription.plan"
            :severity="plan.name === subscription.plan ? 'info' : 'success'"
            class="w-full"
            @click="changePlan(plan)"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.subscription-container {
  padding: 20px;
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subscription-title {
  font-size: 1.5rem;
  color: #f79c07;
}

.card-title {
  font-size: 1.2rem;
  color: #2e89e5;
}

.subscription-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-label {
  font-weight: bold;
  width: 40%;
}

.info-value {
  width: 60%;
}

.plans-title {
  font-size: 1.3rem;
  color: #2e89e5;
  margin-bottom: 1rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.plan-card {
  height: 100%;
}

.plan-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e89e5;
}

.plan-price {
  font-size: 1rem;
  color: #f79c07;
}

.plan-features {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.plan-features li {
  margin-bottom: 0.5rem;
}

.w-full {
  width: 100%;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
