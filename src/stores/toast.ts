import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  const add = (payload: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    const toast: Toast = {
      id,
      duration: 3000, // Default duration
      ...payload,
    };
    toasts.value.push(toast);

    if (toast.duration !== 0) {
      setTimeout(() => {
        remove(id);
      }, toast.duration);
    }
  };

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    toasts,
    add,
    remove,
  };
});
