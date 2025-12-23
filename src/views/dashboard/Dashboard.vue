<script setup lang="ts">
// Dashboard logic can go here (charts, stats)
defineOptions({
  name: 'DashboardOverview'
})
</script>

<template>
  <div>
    <h1 class="page-title">Dashboard Overview</h1>
    <div class="stats-grid">
       <div class="stat-card">
         <h3>Total Users</h3>
         <p class="stat-value">1,234</p>
       </div>
       <div class="stat-card">
         <h3>Active Sessions</h3>
         <p class="stat-value">56</p>
       </div>
        <div class="stat-card">
         <h3>Revenue</h3>
         <p class="stat-value">¢12,345</p>
       </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: var(--color-text-primary);
    font-weight: 700;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background: var(--color-bg-card);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow-card);
    border: 1px solid var(--color-border);
    transition: background-color 0.3s, border-color 0.3s;
}

.stat-card h3 {
    margin-top: 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    text-transform: uppercase;
    font-weight: 600;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0;
}
</style>
