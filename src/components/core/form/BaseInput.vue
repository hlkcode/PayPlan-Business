<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text' // text, password, email, number
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  icon: {
    type: Object, // Component
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)
const isFocused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
    showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="base-input-group" :class="{ 'has-error': !!error, 'is-disabled': disabled, 'is-focused': isFocused }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <div class="input-wrapper">
      <!-- Leading Icon Slot or Prop -->
      <div v-if="$slots.icon || icon" class="leading-icon">
         <slot name="icon">
             <component :is="icon" v-if="icon" :size="20" />
         </slot>
      </div>

      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="base-input"
        :class="{ 'with-leading-icon': $slots.icon || icon, 'with-trailing-icon': type === 'password' }"
        @input="handleInput"
        @focus="isFocused = true; emit('focus', $event)"
        @blur="isFocused = false; emit('blur', $event)"
      />

      <!-- Password Toggle -->
      <button 
        v-if="type === 'password'" 
        type="button" 
        class="password-toggle" 
        @click="togglePassword"
        tabindex="-1"
      >
        <Eye v-if="!showPassword" :size="20" />
        <EyeOff v-else :size="20" />
      </button>
    </div>

    <div v-if="error" class="error-message">
       <AlertCircle :size="14" />
       <span>{{ error }}</span>
    </div>
  </div>
</template>

<style scoped>
.base-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary, #1e293b);
}

.required-indicator {
  color: var(--color-danger, #ef4444);
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: var(--color-text-primary, #1e293b);
  background: var(--color-bg-input, #ffffff);
  border: 1px solid var(--color-border-input, #e2e8f0);
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
}

.base-input::placeholder {
  color: var(--color-text-secondary, #94a3b8);
}

/* States */
.base-input:focus {
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 0 3px var(--color-primary-light, rgba(99, 102, 241, 0.1));
}

.base-input:disabled {
  background-color: var(--color-bg-secondary, #f1f5f9);
  cursor: not-allowed;
  opacity: 0.7;
}

.has-error .base-input {
  border-color: var(--color-danger, #ef4444);
}

.has-error .base-input:focus {
  box-shadow: 0 0 0 3px var(--color-danger-light, rgba(239, 68, 68, 0.1));
}

/* Icons */
.leading-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-secondary, #94a3b8);
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 10;
}

.base-input.with-leading-icon {
  padding-left: 2.75rem; 
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary, #94a3b8);
  padding: 4px;
  display: flex;
  transition: color 0.1s;
}

.password-toggle:hover {
  color: var(--color-text-primary, #1e293b);
}

.base-input.with-trailing-icon {
  padding-right: 2.75rem;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-danger, #ef4444);
  margin-top: 0.1rem;
}
</style>
