<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  show: boolean
  title?: string
  width?: string
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="dialog-overlay" @click.self="emit('close')">
      <div class="dialog-content" :style="{ maxWidth: width || '500px' }">
        <header class="dialog-header">
           <h3 v-if="title">{{ title }}</h3>
           <slot name="header"></slot>
           <button @click="emit('close')" class="close-btn">
             <X :size="20" />
           </button>
        </header>
        
        <div class="dialog-body">
           <slot></slot>
        </div>
        
        <footer v-if="$slots.footer" class="dialog-footer">
            <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog-content {
  background: var(--color-bg-card);
  border-radius: 16px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: var(--color-bg-secondary);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
