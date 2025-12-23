<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: boolean
  label?: string
  indeterminate?: boolean
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="custom-checkbox"
    :class="{ 'disabled': disabled }"
    @click="toggle"
  >
    <div
        class="checkbox-box"
        :class="{ 'checked': modelValue || indeterminate, 'indeterminate': indeterminate }"
    >
        <Minus v-if="indeterminate" :size="14" color="white" stroke-width="3" />
        <Check v-else-if="modelValue" :size="14" color="white" stroke-width="3" />
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.custom-checkbox.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-box {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 2px solid var(--color-border-input);
  background: var(--color-bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-box.checked,
.checkbox-box.indeterminate {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-label {
    font-size: 0.9rem;
    color: var(--color-text-primary);
}

/* Hover effects */
.custom-checkbox:hover:not(.disabled) .checkbox-box:not(.checked):not(.indeterminate) {
    border-color: var(--color-primary);
}
</style>
