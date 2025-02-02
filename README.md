# Single Pinia

[![version](https://img.shields.io/npm/v/single-pinia?label=npm)](https://www.npmjs.com/package/single-pinia)
[![downloads](https://img.shields.io/npm/dm/single-pinia?label=downloads)](https://www.npmjs.com/package/single-pinia)
[![license](https://img.shields.io/npm/l/single-pinia?label=license)](/LICENSE)

Write pinia at top level with export syntax. Powered by [TS Macro] and [Unplugin].

## Install

```shell
pnpm i -D single-pinia
```

## Usage

1. TS Macro:

   ```ts
   // tsm.config.ts
   import singlePinia from "single-pinia/ts-macro";

   export default {
    plugins: [
      singlePinia()
    ]
   };
   ```

2. Unplugin, like Vite:

   ```ts
   // vite.config.ts
   import singlePinia from "single-pinia/vite";
   import { defineOptions } from "vite";

   export default defineOptions({
    plugins: [
      singlePinia()
    ]
   });
   ```

Then you can using the following syntax in the file that matches the `stores/.*?\.(j|t)sx?` pattern by default:

```ts
defineStore("counter");

export const count = ref(0);

export function increment() {
  count.value++;
}

export function decrement() {
  count.value--;
}
```

It will be transformed into:

```ts
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement
  };
});
```

This plugin mainly performs the following transformations:

- Infers the name of the return value from file name.

- Uses the variables or functions exported under the `defineStore` statement as the setup return values for this store.

[TS Macro]: https://github.com/ts-macro/ts-macro

[Unplugin]: https://github.com/unjs/unplugin