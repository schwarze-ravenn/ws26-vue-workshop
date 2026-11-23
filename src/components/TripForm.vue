<script setup lang="ts">
import { type Trip } from '@/App.vue'
import { useWeatherService } from '@/service/useWeatherService'
import { useTripsStore } from '@/state/useTripsStore'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const formModel: Ref<Omit<Trip, 'id'>> = ref({
  name: '',
  description: '',
  date: '',
  length: 1,
})
const errors = ref<Partial<Record<keyof Trip, string>>>({})
const tripsStore = useTripsStore()
const router = useRouter()
const tripLengthString = computed((): '-' | 'short' | 'medium' | 'long' => {
  if (!formModel.value?.length) return '-'
  const len = formModel.value.length
  if (len < 3) return 'short'
  if (len < 14) return 'medium'
  return 'long'
})

const validateForm = (): boolean => {
  errors.value = {}
  if (!formModel.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  if (!formModel.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  if (!formModel.value.date) {
    errors.value.date = 'Start date is required'
  }
  if (!Number.isInteger(formModel.value.length) || formModel.value.length < 1) {
    errors.value.length = 'Length must be at least one day'
  }
  return Object.keys(errors.value).length === 0
}
const submitHandler = async () => {
  if (!validateForm()) {
    return
  }

  tripsStore.addTrip({
    ...formModel.value,
    name: formModel.value.name.trim(),
    description: formModel.value.description.trim(),
  })
  await router.push({ name: 'home' })
}

const weatherService = useWeatherService();
const enabled = computed(() => !!formModel.value.name);
const { isFetching, data: geolocationInfo } = useQuery({
  queryKey: ['geolocation', formModel.value.name],
  queryFn: () => weatherService.getGeoLocationFromName(formModel.value.name ?? ''),
  enabled,
  staleTime: 2 * 60 * 1000,
});
</script>

<template>
  <form @submit.prevent="submitHandler">
    <div>
      <label for="tripName">Trip Name</label>
      <input @input="validateForm" id="tripName" type="text" v-model="formModel.name" required />
      <p v-show="errors.name" class="error">{{ errors.name }}</p>
    </div>
    <div>
      <label for="tripDescription">Description</label>
      <textarea @input="validateForm" id="tripDescription" v-model="formModel.description" required />
      <p v-show="errors.description" class="error">{{ errors.description }}</p>
    </div>
    <div>
      <label for="tripDate">Start Date</label>
      <input @input="validateForm" id="tripDate" type="date" v-model="formModel.date" required />
      <p v-show="errors.date" class="error">{{ errors.date }}</p>
    </div>
    <div>
      <label for="tripLength">Length (in days)</label>
      <input @input="validateForm" id="tripLength" type="number" min="1" step="1" v-model.number="formModel.length" required />
      <p v-show="errors.length" class="error">{{ errors.length }}</p>
    </div>
    <button type="submit">Submit</button>
  </form>

  <p>Trip "{{ formModel.name }}" will be created.</p>
  <p>Trip is {{ tripLengthString }}</p>
  <p>Geocoordinates <span v-if="isFetching">Loading...</span><span v-else>{{ geolocationInfo }}</span></p>
</template>

<style scoped></style>
