import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { jobRouter } from "./routers/job";
import { companyRouter } from "./routers/company";
import { categoryRouter } from "./routers/category";
import { subCategoryRouter } from "./routers/subCategory";
import { jobApplicationsRouter } from "./routers/jobApplications";
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
  jobApplications: jobApplicationsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
