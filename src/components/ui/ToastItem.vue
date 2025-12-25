<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next';
import type { Toast } from '@/stores/toast';

const props = defineProps<{
  toast: Toast;
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const isVisible = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true;
  });
});

const removeToast = () => {
  isVisible.value = false;
  // Wait for animation to finish before emitting remove
  setTimeout(() => {
    emit('remove', props.toast.id);
  }, 300);
};

const iconComponent = computed(() => {
  switch (props.toast.type) {
    case 'success': return CheckCircle;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'info': return Info;
    default: return Info;
  }
});

const toastClasses = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return 'toast-success';
    case 'error':
      return 'toast-error';
    case 'warning':
      return 'toast-warning';
    case 'info':
      return 'toast-info';
    default:
      return 'toast-info';
  }
});
</script>

<template>
  <div
    class="toast-item"
    :class="[toastClasses, { 'is-visible': isVisible }]"
    role="alert"
  >
    <div class="toast-icon-wrapper">
      <component :is="iconComponent" class="toast-icon" />
    </div>

    <div class="toast-content">
      <h3 v-if="toast.title" class="toast-title">{{ toast.title }}</h3>
      <p class="toast-message">{{ toast.message }}</p>
    </div>

    <button @click="removeToast" class="toast-close" aria-label="Close">
      <X class="w-4 h-4" />
    </button>

    <!-- Progress bar for auto-dismiss -->
    <div
      v-if="toast.duration !== 0"
      class="toast-progress"
      :style="{ animationDuration: `${toast.duration}ms` }"
    ></div>
  </div>
</template>

<style scoped>
.toast-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 400px;
  background: var(--color-background, #ffffff);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 12px;
  overflow: hidden;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto;
  border: 1px solid rgba(0,0,0,0.05);
}

/* Dark mode fallback if variables not present, but trying to use variables */
@media (prefers-color-scheme: dark) {
  .toast-item {
    background: #1e1e1e;
    border-color: rgba(255,255,255,0.1);
    color: #fff;
  }
}

.toast-item.is-visible {
  transform: translateX(0);
  opacity: 1;
}

.toast-icon-wrapper {
  flex-shrink: 0;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.toast-icon {
  width: 20px;
  height: 20px;
}

.toast-content {
  flex: 1;
  margin-right: 12px;
}

.toast-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
  color: #111827; /* Gray 900 */
}

.toast-message {
  font-size: 0.875rem;
  color: #374151; /* Gray 700 */
  opacity: 0.9;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 4px;
  border-radius: 4px;
  color: inherit;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0,0,0,0.05);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  width: 100%;
  transform-origin: left;
  animation: progress linear forwards;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Type variations */
.toast-success {
  border-left: 4px solid #10b981;
}
.toast-success .toast-icon { color: #10b981; }

.toast-error {
  border-left: 4px solid #ef4444;
}
.toast-error .toast-icon { color: #ef4444; }

.toast-warning {
  border-left: 4px solid #f59e0b;
}
.toast-warning .toast-icon { color: #f59e0b; }

.toast-info {
  border-left: 4px solid #3b82f6;
}
.toast-info .toast-icon { color: #3b82f6; }
</style>
