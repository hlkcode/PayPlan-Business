<script setup lang="ts">
import { ref } from 'vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import { businessService } from '@/services/business/BusinessAccountService'
import { useToastStore } from '@/stores/toast'

defineProps<{
    show: boolean
}>()

const emit = defineEmits(['close', 'success'])
const toast = useToastStore()

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const loading = ref(false)

const onSubmit = async () => {
    if (form.value.newPassword !== form.value.confirmPassword) {
        toast.add({
            type: 'error',
            title: 'Error',
            message: 'New passwords do not match'
        })
        return
    }

    loading.value = true
    try {
        const payload = {
            currentPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
            confirmNewPassword: form.value.confirmPassword
        }

        const response = await businessService.changePassword(payload)

        if (response.isSuccess) {
            toast.add({
                type: 'success',
                title: 'Success',
                message: 'Password changed successfully'
            })
            emit('success')
            emit('close')
            form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
        } else {
             toast.add({
                type: 'error',
                title: 'Error',
                message: response.message || 'Failed to change password'
            })
        }
    } catch (e) {
        const err = e as Error
        console.error(err)
        toast.add({
            type: 'error',
            title: 'Error',
            message: err.message || 'An error occurred'
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <BaseDialog :show="show" title="Change Password" @close="$emit('close')">
        <form @submit.prevent="onSubmit" id="cpForm">
            <div class="form-group">
                <label>Current Password</label>
                <input v-model="form.oldPassword" type="password" class="premium-input" required placeholder="Enter current password" />
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input v-model="form.newPassword" type="password" class="premium-input" required placeholder="Enter new password" />
            </div>
            <div class="form-group">
                <label>Confirm New Password</label>
                <input v-model="form.confirmPassword" type="password" class="premium-input" required placeholder="Confirm new password" />
            </div>
        </form>
        <template #footer>
            <button class="cancel-btn" @click="$emit('close')">Cancel</button>
            <button type="submit" form="cpForm" class="submit-btn" :disabled="loading">
                {{ loading ? 'Saving...' : 'Change Password' }}
            </button>
        </template>
    </BaseDialog>
</template>

<style scoped>
.form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); }
.premium-input { padding: 0.6rem; border: 1px solid var(--color-border-input); border-radius: 6px; background: var(--color-bg-input); color: var(--color-text-primary); }
.submit-btn { background: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); padding: 0.5rem 1rem; border: none; cursor: pointer; }
</style>
