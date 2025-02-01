defineStore("counter");

export const count = ref(0);

export function increment() {
    count.value++;
}

export function decrement() {
    count.value--;
}