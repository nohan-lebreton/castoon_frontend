<script setup>
import Button from 'primevue/button'
import ChildrenList from '@/components/parents/ChildrenList.vue'
import { useTransition } from '@/stores/useTransition'

const transitionStore = useTransition()
</script>
<template>
  <div>
    <div class="home__children">
      <div class="home__children__header">
        <h2 class="home__children__title">Mes enfants</h2>
        <Button
          severity="success"
          size="small"
          raised
          icon="pi pi-user-edit"
          @click="
            () => {
              transitionStore.setTransition('slide-left')
              $router.push({ name: 'addChild' })
            }
          "
        />
      </div>
      <div class="home__children__list">
        <ChildrenList />
      </div>

      <!-- liste des enfants -->
    </div>
  </div>
</template>

<style scoped>
.home__children {
  padding: 20px;
  border-radius: 8px;
}
.home__children__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.home__children__title {
  font-size: 1.5rem;
  color: #f79c07;
}
</style>
