<script setup lang="ts">
import { ref } from 'vue'
import BaseDialog from '@/components/core/dialog/BaseDialog.vue'
import type { Request } from '@/models/admin'

const { request } = defineProps<{
    show: boolean
    request: Request | null
    loading: boolean
}>()

const emit = defineEmits(['close', 'approve', 'reject'])

const note = ref('')

// Reset note when dialog opens
const onShow = () => {
    note.value = ''
}

const handleApprove = () => {
    emit('approve', note.value)
}

const handleReject = () => {
    emit('reject', note.value)
}
</script>

<template>
    <BaseDialog
        :show="show"
        :title="request ? `Request Details` : 'Request Details'"
        @close="$emit('close')"
        @show="onShow"
    >
        <div v-if="request" class="request-details">
            <div class="detail-row">
                <span class="label">Platform:</span>
                <span class="value">{{ request.platform }}</span>
            </div>
             <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ request.description }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Created By:</span>
                <span class="value">{{ request.createdBy }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ new Date(request.createdAt).toLocaleString() }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Status:</span>
                <span class="status-badge" :class="request.status?.toLowerCase()">{{ request.status }}</span>
            </div>

            <div class="form-group">
                <label>Note (Optional)</label>
                <textarea
                    v-model="note"
                    class="premium-input"
                    rows="3"
                    placeholder="Add a note for approval or rejection..."
                ></textarea>
            </div>
        </div>

        <template #footer>
            <div class="dialog-actions">
                <button
                    class="btn-reject"
                    :disabled="loading"
                    @click="handleReject"
                >
                    Reject
                </button>
                <button
                    class="btn-approve"
                    :disabled="loading"
                    @click="handleApprove"
                >
                    {{ loading ? 'Processing...' : 'Approve' }}
                </button>
            </div>
        </template>
    </BaseDialog>
</template>

<style scoped>
.request-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
}

.label {
    font-weight: 600;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.value {
    color: var(--color-text-primary);
    font-weight: 500;
}

.form-group {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 600;
}

.premium-input {
    padding: 0.75rem;
    border: 1px solid var(--color-border-input);
    border-radius: 8px;
    background: var(--color-bg-input);
    color: var(--color-text-primary);
    font-family: inherit;
    resize: vertical;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    width: 100%;
}

.btn-approve, .btn-reject {
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-approve {
    background: var(--color-primary);
    color: white;
}

.btn-approve:hover {
    filter: brightness(1.1);
}

.btn-reject {
    background: #fee2e2;
    color: #991b1b;
}

.btn-reject:hover {
    background: #fecaca;
}

.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    background: #e2e8f0;
}
.status-badge.pending { background: #fef9c3; color: #854d0e; }
.status-badge.approved { background: #dcfce7; color: #166534; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }
</style>
