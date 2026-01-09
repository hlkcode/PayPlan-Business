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

const toastTypeClasses = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'border-l-4 border-green-500';
    case 'error':   return 'border-l-4 border-red-500';
    case 'warning': return 'border-l-4 border-amber-500';
    case 'info':    return 'border-l-4 border-blue-500';
    default:        return 'border-l-4 border-blue-500';
  }
});

const iconColorClass = computed(() => {
    switch (props.toast.type) {
    case 'success': return 'text-green-500 dark:text-green-400';
    case 'error':   return 'text-red-500 dark:text-red-400';
    case 'warning': return 'text-amber-500 dark:text-amber-400';
    case 'info':    return 'text-blue-500 dark:text-blue-400';
    default:        return 'text-blue-500 dark:text-blue-400';
  }
})

const progressBarColorClass = computed(() => {
    switch (props.toast.type) {
    case 'success': return 'bg-green-500';
    case 'error':   return 'bg-red-500';
    case 'warning': return 'bg-amber-500';
    case 'info':    return 'bg-blue-500';
    default:        return 'bg-blue-500';
  }
})
</script>

<template>
  <div
    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 dark:bg-slate-800 dark:ring-white/10 mb-3"
    :class="[
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        toastTypeClasses
    ]"
    role="alert"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <component :is="iconComponent" class="h-6 w-6" :class="iconColorClass" aria-hidden="true" />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-slate-900 dark:text-slate-100" v-if="toast.title">{{ toast.title }}</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ toast.message }}</p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button
            type="button"
            @click="removeToast"
            class="inline-flex rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-400"
          >
            <span class="sr-only">Close</span>
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="toast.duration !== 0" class="h-1 w-full bg-slate-100 dark:bg-slate-700">
        <div
            class="h-full origin-left animate-[progress_linear_forwards]"
            :class="progressBarColorClass"
            :style="{ animationDuration: `${toast.duration}ms` }"
        ></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>
