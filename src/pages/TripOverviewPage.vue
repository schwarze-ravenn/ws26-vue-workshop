<script setup lang="ts">
import TripList from '@/components/TripList.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
    <h2>Trip Overview</h2>
    <RouterLink :to="{ name: 'form' }">Create a trip</RouterLink>
    <TripList />
</template>

<style scoped></style>