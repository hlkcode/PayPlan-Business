<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue';
</script>

<template>
  <ToastContainer />
  <RouterView />
</template>

<style>
/* Global resets if not present elsewhere */
body {
  margin: 0;
  font-family: 'Inter', sans-serif; /* Assuming Inter is available or defaults */
  background-color: #f3f4f6;
}
</style>
