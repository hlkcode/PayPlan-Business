<script setup lang="ts">
import { useToastStore } from '@/stores/toast';
import ToastItem from './ToastItem.vue';
import { storeToRefs } from 'pinia';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
</script>

<template>
  <div class="toast-container">
    <ToastItem
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @remove="toastStore.remove"
    />
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* Let clicks pass through container area */
  width: auto;
  min-width: 320px;
}
</style>
