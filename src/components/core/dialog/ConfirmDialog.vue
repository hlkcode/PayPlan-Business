<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import { AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger',
  loading: false
})

const onConfirm = () => {
    emit('confirm')
}

const onCancel = () => {
    emit('cancel')
    emit('update:show', false)
}
</script>

<template>
  <BaseDialog
    :show="show"
    :title="title"
    width="450px"
    @close="onCancel"
  >
    <div class="confirm-content">
        <div class="icon-wrapper" :class="type">
            <AlertCircle v-if="type === 'danger'" :size="32" />
            <AlertTriangle v-else-if="type === 'warning'" :size="32" />
            <Info v-else :size="32" />
        </div>
        <div class="message-wrapper">
             <p class="message-text">{{ message }}</p>
             <slot></slot>
        </div>
    </div>

    <template #footer>
        <button class="cancel-btn" @click="onCancel" :disabled="loading">
            {{ cancelText }}
        </button>
        <button
            class="confirm-btn"
            :class="type"
            @click="onConfirm"
            :disabled="loading"
        >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Processing...' : confirmText }}
        </button>
    </template>
  </BaseDialog>
</template>

<style scoped>
.confirm-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    padding: 1rem 0;
}

.icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-wrapper.danger {
    background: #fee2e2;
    color: #ef4444;
}

.icon-wrapper.warning {
    background: #fef3c7;
    color: #f59e0b;
}

.icon-wrapper.info {
    background: #e0f2fe;
    color: #0ea5e9;
}

.message-text {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0;
}

.cancel-btn {
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
    background: var(--color-bg-secondary);
}

.confirm-btn {
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.confirm-btn.danger {
    background: #ef4444;
}
.confirm-btn.danger:hover:not(:disabled) {
    background: #dc2626;
}

.confirm-btn.warning {
    background: #f59e0b;
}
.confirm-btn.warning:hover:not(:disabled) {
    background: #d97706;
}

.confirm-btn.info {
    background: #0ea5e9;
}
.confirm-btn.info:hover:not(:disabled) {
    background: #0284c7;
}

.confirm-btn:disabled, .cancel-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
