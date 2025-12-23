<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type CSSProperties } from 'vue'
import { ChevronDown, Check, Search } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as () => any[],
    required: true
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<CSSProperties>({ top: '0px', left: '0px', width: '0px', bottom: 'auto', position: 'fixed' as const })
let rafId: number | null = null

// Computed
const selectedOption = computed(() => {
  return props.options.find(opt => {
    const val = props.valueKey ? opt[props.valueKey] : opt
    return val === props.modelValue
  })
})

const displayValue = computed(() => {
  if (selectedOption.value) {
    return props.labelKey ? selectedOption.value[props.labelKey] : selectedOption.value
  }
  return props.placeholder
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => {
    const label = props.labelKey ? opt[props.labelKey] : opt
    return String(label).toLowerCase().includes(query)
  })
})

const updatePosition = () => {
    if (!triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()

    // Check space below
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = 300 // Max height defined in CSS
    const flip = spaceBelow < dropdownHeight && rect.top > dropdownHeight

    if (flip) {
         dropdownStyle.value = {
            top: 'auto',
            bottom: `${window.innerHeight - rect.top + 4}px`, // distance from bottom of viewport
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            position: 'fixed' as const
        }
    } else {
        dropdownStyle.value = {
            top: `${rect.bottom + 4}px`,
            bottom: 'auto',
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            position: 'fixed' as const
        }
    }
}

const startUpdateLoop = () => {
    updatePosition()
    rafId = requestAnimationFrame(startUpdateLoop)
}

const stopUpdateLoop = () => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
}

// Methods
const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value

  if (isOpen.value) {
      startUpdateLoop()
      if (props.searchable) {
         // Focus logic handled by autofocus or manual ref
      }
      // No need for explicit scroll listeners in loop mode, but resizing can trigger layout changes reflow
      window.addEventListener('resize', updatePosition)
  } else {
      searchQuery.value = ''
      stopUpdateLoop()
      window.removeEventListener('resize', updatePosition)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectOption = (option: any) => {
  const val = props.valueKey ? option[props.valueKey] : option
  emit('update:modelValue', val)
  isOpen.value = false
  searchQuery.value = ''
  stopUpdateLoop()
  window.removeEventListener('resize', updatePosition)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSelected = (option: any) => {
   const val = props.valueKey ? option[props.valueKey] : option
   return val === props.modelValue
}

// Click outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  // Check if click is inside trigger or dropdown
  const isTrigger = triggerRef.value && triggerRef.value.contains(target)
  const isDropdown = dropdownRef.value && dropdownRef.value.contains(target)

  if (!isTrigger && !isDropdown) {
    isOpen.value = false
    searchQuery.value = ''
    stopUpdateLoop()
    window.removeEventListener('resize', updatePosition)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('click', handleClickOutside)
  stopUpdateLoop()
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <div class="searchable-select">
    <!-- Trigger -->
    <div
        ref="triggerRef"
        class="select-trigger"
        :class="{ 'is-open': isOpen, 'is-disabled': disabled, 'has-value': !!modelValue }"
        @click="toggleDropdown"
    >
      <span class="selected-text">{{ displayValue }}</span>
      <ChevronDown class="chevron-icon" :size="16" />
    </div>

    <!-- Dropdown Portal -->
    <Teleport to="body">
        <div
            v-if="isOpen"
            ref="dropdownRef"
            class="select-dropdown-portal"
            :style="dropdownStyle"
        >
          <!-- Search -->
          <div v-if="searchable" class="search-container">
            <Search class="search-icon" :size="14" />
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search..."
                class="search-input"
                autofocus
            />
          </div>

          <!-- Options -->
          <div class="options-list">
            <div
                v-for="(option, index) in filteredOptions"
                :key="index"
                class="option-item"
                :class="{ 'is-selected': isSelected(option) }"
                @click="selectOption(option)"
            >
                <span>{{ labelKey ? option[labelKey] : option }}</span>
                <Check v-if="isSelected(option)" :size="14" class="check-icon" />
            </div>
            <div v-if="filteredOptions.length === 0" class="no-results">
                No results found
            </div>
          </div>
        </div>
    </Teleport>
  </div>
</template>

<style scoped>
.searchable-select {
  position: relative;
  width: 100%;
  font-family: inherit;
}

.select-trigger {
  width: 100%;
  padding: 0.6rem 1rem;
  background: var(--color-bg-input, #fff);
  border: 1px solid var(--color-border-input, #e2e8f0);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  color: var(--color-text-secondary, #64748b);
  font-size: 0.95rem;
}

.select-trigger.has-value {
    color: var(--color-text-primary, #1e293b);
}

.select-trigger:hover:not(.is-disabled) {
  border-color: var(--color-primary, #6366f1);
}

.select-trigger.is-open {
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 0 2px var(--color-primary-light, rgba(99, 102, 241, 0.1));
}

.select-trigger.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f1f5f9;
}

.chevron-icon {
  color: var(--color-text-secondary);
  transition: transform 0.2s;
}

.select-trigger.is-open .chevron-icon {
  transform: rotate(180deg);
}

/* Dropdown Portal Styled Globally or Scoped with deep if using standard portal,
   but scoped styles won't apply to body-appended elements easily unless we use :deep or global styles.
   However, Vue's Teleport keeps component context, so scoped styles *might* apply if implemented correctly in some build tools,
   but safe bet is to use simple class names and styling.
   Actually, scoped styles DO work with Teleport in Vue 3 (SFC).
*/
.select-dropdown-portal {
  /* Position set inline */
  background: var(--color-bg-card, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 9999; /* High z-index to sit on top of modals */
  overflow: hidden;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

/* Search */
.search-container {
  padding: 8px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
    color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.875rem;
  background: transparent;
  color: var(--color-text-primary);
}

/* Options */
.options-list {
  overflow-y: auto;
  flex: 1;
}

.option-item {
  padding: 0.6rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  transition: background 0.1s;
}

.option-item:hover {
  background: var(--color-bg-secondary, #f8fafc);
}

.option-item.is-selected {
  background: var(--color-primary-light, #e0e7ff);
  color: var(--color-primary);
  font-weight: 500;
}

.check-icon {
    color: var(--color-primary);
}

.no-results {
    padding: 1rem;
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
}
</style>
