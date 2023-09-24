import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { jobRouter } from "./routers/job";
import { companyRouter } from "./routers/company";
import { categoryRouter } from "./routers/category";
import { subCategoryRouter } from "./routers/subCategory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  job: jobRouter,
  company: companyRouter,
  category: categoryRouter,
  subCategory: subCategoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
