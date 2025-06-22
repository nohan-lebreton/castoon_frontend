<script setup>
import { useChildren } from '@/stores/useChildren'
import { onMounted } from 'vue'
import { useTransition } from '@/stores/useTransition'

const transitionStore = useTransition()
const childrenStore = useChildren()

onMounted(async () => {
  await childrenStore.fetchChildren()
})
</script>

<template>
  <div>
    <div
      v-for="child in childrenStore.collection"
      :key="child.id"
      class="children-list_item"
      @click="
        () => {
          transitionStore.setTransition('slide-left')
          $router.push({ name: 'ParentChild', params: { documentId: child.documentId } })
        }
      "
    >
      <img
        v-if="child.avatar?.image?.url"
        :src="childrenStore.getImageUrl(child.avatar.image.url)"
        alt="Avatar"
        class="children-list_avatar"
      />
      <div class="children-list_info">
        <h2 class="font-grenadine-medium">{{ child.name }}</h2>
        <p class="font-grenadine">{{ childrenStore.calculateAge(child.birthday) }} ans</p>
      </div>
    </div>
  </div>
</template>

<style>
.children-list_avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.placeholder-avatar {
  background-color: #f79c07;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
}

.children-list_item {
  width: 100%;
  border: 1px solid #f79c07;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.children-list_item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.children-list_info {
  margin-left: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>
