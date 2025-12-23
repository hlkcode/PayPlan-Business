<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseDropdown from './BaseDropdown.vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'
import ConfirmDialog from '@/components/core/dialog/ConfirmDialog.vue'
import { LogOut, User, ChevronDown, Lock } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const showCpDialog = ref(false)
const showConfirmLogout = ref(false)

const triggerLogout = () => {
    showConfirmLogout.value = true
}

const onConfirmLogout = () => {
    authStore.logout()
    router.push('/admin/login')
    showConfirmLogout.value = false
}
</script>

<template>
  <BaseDropdown>
    <template #trigger>
        <div class="avatar-trigger">
            <div class="avatar">
                <User :size="20" />
            </div>
            <span class="user-name">Admin</span>
            <ChevronDown :size="16" class="chevron" />
        </div>
    </template>

    <div class="menu-items">
        <div class="menu-header">
            <p class="role">Administrator</p>
        </div>
        <button @click="showCpDialog = true" class="menu-item">
            <Lock :size="16" />
            Change Password
        </button>
        <button @click="triggerLogout" class="menu-item danger">
            <LogOut :size="16" />
            Logout
        </button>
    </div>
  </BaseDropdown>

  <ChangePasswordDialog
    :show="showCpDialog"
    @close="showCpDialog = false"
    @success="showCpDialog = false"
  />

  <ConfirmDialog
    v-model:show="showConfirmLogout"
    title="Logout"
    message="Are you sure you want to logout?"
    @confirm="onConfirmLogout"
  />
</template>

<style scoped>
.avatar-trigger {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s;
}

.avatar-trigger:hover {
    background: var(--color-bg-secondary);
}

.avatar {
    width: 36px;
    height: 36px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-name {
    font-weight: 500;
    color: var(--color-text-primary);
    font-size: 0.9rem;
}

.chevron {
    color: var(--color-text-secondary);
}

.menu-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
}

.role {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    font-weight: 600;
    text-transform: uppercase;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    color: var(--color-text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    font-family: inherit;
}

.menu-item:hover {
    background: var(--color-bg-secondary);
}

.menu-item.danger {
    color: var(--color-danger);
}

.menu-item.danger:hover {
    background: var(--color-danger-bg);
}
</style>
