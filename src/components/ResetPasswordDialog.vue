<script setup lang="ts">
import { useBusinessController } from '@/controllers/business/useBusinessController'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'

const props = defineProps<{
    show: boolean
    userId: number
}>()

const emit = defineEmits(['close', 'success'])

const controller = useBusinessController()

const onConfirm = async () => {
    const result = await controller.resetPassword(props.userId)
    if (result.success) {
        emit('success')
        emit('close')
        // Toast is handled in controller/view usually, but controller returns result message.
        // View likely handles toast, or we can add toast here if we imported store.
        // Controller `resetPassword` already deals with loading state, but we might need to show loading here.
        // `controller.resetLoading` is available.
    } else {
        alert('Failed: ' + result.message)
    }
}
</script>

<template>
    <BaseDialog :show="show" title="Reset Password" @close="$emit('close')">
        <div class="confirmation-content">
            <p>Are you sure you want to reset the password for this user?</p>
            <p class="sub-text">This action will trigger a password reset for the account. The user may receive an email with instructions.</p>
        </div>
        <template #footer>
            <button class="cancel-btn" @click="$emit('close')">Cancel</button>
            <button class="submit-btn" @click="onConfirm" :disabled="controller.resetLoading.value">
                {{ controller.resetLoading.value ? 'Resetting...' : 'Confirm Reset' }}
            </button>
        </template>
    </BaseDialog>
</template>

<style scoped>
.confirmation-content {
    padding: 1rem 0;
    color: var(--color-text-primary);
}
.sub-text {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-top: 0.5rem;
}
.submit-btn { background: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); padding: 0.5rem 1rem; border: none; cursor: pointer; }
</style>
