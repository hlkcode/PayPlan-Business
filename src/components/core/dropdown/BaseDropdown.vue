<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
    align?: 'left' | 'right'
}>(), {
    align: 'left'
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const positionStyles = ref<Record<string, string | number>>({})

const updatePosition = () => {
    if (dropdownRef.value) {
        const rect = dropdownRef.value.getBoundingClientRect()
        const styles: Record<string, string | number> = {
            position: 'fixed',
            top: `${rect.bottom + 8}px`,
            minWidth: '200px',
            zIndex: 99999
        }

        if (props.align === 'right') {
            styles.right = `${window.innerWidth - rect.right}px`
            styles.left = 'auto'
        } else {
            styles.left = `${rect.left}px`
            styles.right = 'auto'
        }
        
        positionStyles.value = styles
    }
}

const toggle = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
       updatePosition()
    }
}

const close = () => {
    isOpen.value = false
}

// Close if clicked outside
const onClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        close()
    }
}

const onScroll = () => {
    if (isOpen.value) updatePosition()
}

onMounted(() => {
    document.addEventListener('click', onClickOutside)
    window.addEventListener('resize', onScroll)
    window.addEventListener('scroll', onScroll, true)
})

onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
    window.removeEventListener('resize', onScroll)
    window.removeEventListener('scroll', onScroll, true)
})
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <div class="dropdown-trigger" @click.stop="toggle">
        <slot name="trigger"></slot>
    </div>
    
    <Teleport to="body">
        <Transition name="slide-fade">
            <div v-if="isOpen" class="dropdown-menu" :style="positionStyles" @click.stop>
                <slot></slot>
            </div>
        </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dropdown {
    display: inline-block;
}

.dropdown-trigger {
    cursor: pointer;
}

.dropdown-menu {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    padding: 0.5rem;
    overflow: hidden;
    /* Position is handled inline via style binding */
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
