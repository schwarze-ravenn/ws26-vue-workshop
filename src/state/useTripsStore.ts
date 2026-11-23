import { defineStore } from "pinia";
import type { Trip } from "@/App.vue";
import { computed, ref } from "vue";

function isTrip(value: unknown): value is Trip {
    if (typeof value !== "object" || value === null) return false;

    const trip = value as Record<string, unknown>;
    return typeof trip.id === "number"
        && typeof trip.name === "string"
        && typeof trip.description === "string"
        && typeof trip.date === "string"
        && typeof trip.length === "number";
}

function loadTrips(): Trip[] {
    if (typeof window === "undefined") return [];

    const storedTrips = window.localStorage.getItem("trips");
    if (storedTrips === null) {
        window.localStorage.setItem("trips", "[]");
        return [];
    }

    const parsedTrips: unknown = JSON.parse(storedTrips);
    if (!Array.isArray(parsedTrips) || !parsedTrips.every(isTrip)) {
        throw new Error("Stored trips data is invalid.");
    }

    return parsedTrips;
}

export const useTripsStore = defineStore('trips', () => {
    const trips = ref<Trip[]>(loadTrips());

    const tripsInFuture = computed(() => {
        const futureTrips = trips.value.filter(({ date }) => date > '2026-11-23');
        return futureTrips;
    });

    function saveTrips(): void {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("trips", JSON.stringify(trips.value));
        }
    }

    function getTripById(id: number): Trip | undefined {
        return trips.value.find((trip) => trip.id === id);
    }

    function addTrip(trip: Omit<Trip, "id">): Trip {
        const id = Math.max(0, ...trips.value.map(({ id }) => id)) + 1;
        const newTrip = { ...trip, id };
        trips.value.push(newTrip);
        saveTrips();
        return newTrip;
    }

    function removeTrip(id: number): void {
        trips.value = trips.value.filter((trip) => trip.id !== id);
        saveTrips();
    }

    return { trips, getTripById, tripsInFuture, addTrip, removeTrip };
})