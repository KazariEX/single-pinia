<script lang="ts" setup>
    import { useCounterStore } from "./stores/counter";

    const counterStore = useCounterStore();
</script>

<template>
    <div flex="~ justify-center" m="t-8">
        <button
            w="12"
            @click="counterStore.decrement"
        >-1</button>
        <input
            text="center"
            v-model="counterStore.count"
        />
        <button
            w="12"
            @click="counterStore.increment"
        >+1</button>
    </div>
</template>