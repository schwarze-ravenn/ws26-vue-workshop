<script setup lang="ts">
import { useTripsStore } from '@/state/useTripsStore.ts';
import TripListItem from './TripListItem.vue';
const tripsStore = useTripsStore();
const { tripsInFuture } = tripsStore;

const vHighlight = {
  mounted: (el: HTMLElement) => {
    el.classList.add('is-highlight')
  }
}

const onTripDeleted = (id: number) => {
    tripsStore.removeTrip(id);
}
</script>

<template>
  <h2 v-highlight>You have so many trips!</h2>
  <ul>
    <TripListItem v-for="trip in tripsInFuture" :key="trip.id" :trip="trip" @trip-deleted="onTripDeleted" />
  </ul>
</template>

<style scoped>
.is-highlight {
    color: yellow;
}
</style>
