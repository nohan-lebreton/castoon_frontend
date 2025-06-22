<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['close', 'validated'])

const parentPin = ref('')

function appendPin(n) {
  if (parentPin.value.length < 4) {
    parentPin.value += n.toString()
  }
}

function removePin() {
  parentPin.value = parentPin.value.slice(0, -1)
}

function validateParentPin() {
  // Add your validation logic here
  emit('validated', parentPin.value)
  // Reset pin after validation
  parentPin.value = ''
}

function closeDialog() {
  parentPin.value = ''
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    header="Code Parental"
    :modal="true"
    :closable="true"
    :style="{ width: '400px' }"
    @update:visible="closeDialog"
  >
    <div class="p-fluid" style="text-align: center">
      <div class="pin-field">
        <input
          id="parentPin"
          type="password"
          v-model="parentPin"
          class="p-inputtext p-component"
          maxlength="4"
          readonly
        />
        <Button icon="pi pi-delete-left" @click="removePin" />
      </div>
      <div class="keypad">
        <Button severity="secondary" label="0" @click="appendPin(0)" />
        <Button
          severity="secondary"
          v-for="n in 9"
          :key="n"
          :label="n.toString()"
          @click="appendPin(n)"
        />
      </div>
    </div>
    <template #footer>
      <Button severity="success" label="Valider" icon="pi pi-check" @click="validateParentPin" />
    </template>
  </Dialog>
</template>

<style scoped>
.pin-field {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.pin-field input {
  width: 130px;
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  gap: 10px;
  justify-content: center;
}
</style>
