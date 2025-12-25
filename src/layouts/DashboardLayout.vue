<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import AvatarMenu from '@/components/core/dropdown/AvatarMenu.vue'
import {
    Sun,
    Moon,
    LayoutDashboard,
    User,
    Briefcase,
    ShieldCheck,
    PanelLeftClose,
    PanelLeftOpen,
    Users,
    Globe,
    FileText,
    Files,
    Building,
    Inbox
} from 'lucide-vue-next'

const { isDark, toggleTheme } = useTheme()
const isCollapsed = ref(false)

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
          <div class="logo">
              <span v-if="!isCollapsed">PayPlan</span>
              <span v-else>P</span>
          </div>
          <button @click="toggleSidebar" class="collapse-btn">
              <PanelLeftClose v-if="!isCollapsed" :size="20" />
              <PanelLeftOpen v-else :size="20" />
          </button>
      </div>

      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item" active-class="active" :title="isCollapsed ? 'Dashboard' : ''">
            <LayoutDashboard :size="20" />
            <span v-if="!isCollapsed">Dashboard</span>
        </router-link>

        <router-link to="/companies" class="nav-item" active-class="active" :title="isCollapsed ? 'Companies' : ''">
             <Building :size="20" />
            <span v-if="!isCollapsed">Companies</span>
        </router-link>

         <router-link to="/requests" class="nav-item" active-class="active" :title="isCollapsed ? 'Requests' : ''">
            <Inbox :size="20" />
            <span v-if="!isCollapsed">Requests</span>
        </router-link>

        <div class="nav-section-label" v-if="!isCollapsed">ACCOUNTS</div>
        <div class="nav-separator" v-else></div>

        <router-link to="/accounts/personal" class="nav-item" active-class="active" :title="isCollapsed ? 'Personal Accounts' : ''">
            <User :size="20" />
            <span v-if="!isCollapsed">Personal</span>
        </router-link>

        <router-link to="/accounts/business" class="nav-item" active-class="active" :title="isCollapsed ? 'Business Accounts' : ''">
            <Briefcase :size="20" />
            <span v-if="!isCollapsed">Business</span>
        </router-link>

        <router-link to="/accounts/management" class="nav-item" active-class="active" :title="isCollapsed ? 'Management Accounts' : ''">
            <ShieldCheck :size="20" />
            <span v-if="!isCollapsed">Management</span>
        </router-link>



        <div class="nav-section-label" v-if="!isCollapsed">SETTINGS</div>
        <div class="nav-separator" v-else></div>



        <router-link to="/settings/roles" class="nav-item" active-class="active" :title="isCollapsed ? 'Roles' : ''">
             <Users :size="20" />
            <span v-if="!isCollapsed">Roles</span>
        </router-link>

        <router-link to="/countries" class="nav-item" active-class="active" :title="isCollapsed ? 'Countries' : ''">
            <Globe :size="20" />
            <span v-if="!isCollapsed">Countries</span>
        </router-link>

         <router-link to="/settings/document-types" class="nav-item" active-class="active" :title="isCollapsed ? 'Document Types' : ''">
            <FileText :size="20" />
            <span v-if="!isCollapsed">Doc Types</span>
        </router-link>

        <router-link to="/settings/country-documents" class="nav-item" active-class="active" :title="isCollapsed ? 'Country Documents' : ''">
            <Files :size="20" />
            <span v-if="!isCollapsed">Country Docs</span>
        </router-link>
      </nav>
    </aside>

    <main class="content">
      <header class="top-bar">
        <h2>Portal</h2>
        <div class="header-actions">
           <div class="action-items">
               <button @click="toggleTheme" class="icon-btn theme-toggle">
                  <Sun v-if="!isDark" :size="20" />
                  <Moon v-else :size="20" />
               </button>
               <AvatarMenu />
           </div>
        </div>
      </header>
      <div class="page-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
  font-family: var(--font-family-base);
  transition: background-color 0.3s;
}

.sidebar {
  width: 260px;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 50;
}

.sidebar.collapsed {
    width: 80px;
}

.sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

.sidebar.collapsed .sidebar-header {
    justify-content: center;
    padding: 0;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
}

.collapse-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
}

.sidebar.collapsed .collapse-btn {
    display: none; /* Hide internal toggle if strictly icon-only mode desired, or keep it */
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
}

/* Alternative: Keep toggle available even when collapsed, maybe in different spot or ensure header handles it */
.sidebar.collapsed .sidebar-header {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0;
    height: auto;
}
.sidebar.collapsed .collapse-btn {
    display: flex;
    position: static;
    transform: none;
}

.nav-menu {
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 0.75rem;
}

.nav-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.nav-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-section-label {
    padding: 1.5rem 1rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
}

.nav-separator {
    height: 1px;
    background: var(--color-border);
    margin: 1rem 0.5rem;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  /* transition: margin-left 0.3s; */
}

.top-bar {
  height: 64px;
  background: var(--color-bg-card);
  padding: 0 2rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text-primary);
    font-weight: 700;
}

.header-actions {
    display: flex;
    align-items: center;
}

.action-items {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition: color 0.2s, background-color 0.2s;
}

.theme-toggle:hover {
    color: var(--color-primary);
    background-color: var(--color-bg-secondary);
}

.page-content {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}
</style>
