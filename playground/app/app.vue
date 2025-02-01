<script setup lang="ts">
import { useCounterStore } from "./stores/counter";

const counterStore = useCounterStore();

counterStore.increment();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>