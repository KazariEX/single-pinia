import { testFixtures } from "@sxzz/test-utils";
import { describe } from "vitest";
import { transformSetupPinia } from "../src/unplugin/core";

describe("transform", async () => {
    await testFixtures(
        import.meta.glob<string>("./fixtures/*.ts", {
            eager: true,
            query: "?raw",
            import: "default"
        }),
        (_, id, code) => transformSetupPinia(code, id)?.code
    );
});