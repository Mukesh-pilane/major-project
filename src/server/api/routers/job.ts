import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
export const jobRouter = createTRPCRouter({
  adminGetAllJobs: publicProcedure.query(() => {
    return prisma.job.findMany({
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  adminGetApprovedJobs: adminProcedure.query(() => {
    return prisma.job.findMany({
      where: {
        approved: {
          equals: true,
        },
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }),
  adminGetUnApprovedJobs: adminProcedure.query(() => {
    return prisma.job.findMany({
      where: {
        approved: {
          equals: false,
        },
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }),

  //Get single Jobs listing
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.job.findUnique({
        where: {
          id: input.id,
        },
        include: {
          company: true,
          category: true,
          subCategory: true,
        },
      });
    }),

  getAllJobsShowMore: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const limit = 5;
      const jobs = await prisma.job.findMany({
        where: {
          approved: {
            equals: true,
          },
        },
        include: {
          company: true,
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit + 1, // fetch one more tweet than needed
        skip: input.skip || 0,
      });
      const hasMore = jobs?.length > limit;
      if (hasMore) {
        jobs.pop();
      }
      return {
        jobs,
        hasMore,
      };
    }),

  search: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        category: z.string().default(""),
        searchTerm: z.string().default(""),
        subCategory: z.string().default(""),
      })
    )
    .mutation(async ({ input }) => {
      const limit = 5;
      const jobs = await prisma.job.findMany({
        where: {
          approved: {
            equals: true,
          },
          category: {
            name: {
              contains: input?.category ? input.category : "",
            },
          },
          subCategory: {
            name: {
              contains: input?.subCategory ? input.subCategory : "",
            },
          },
          OR: [
            {
              title: {
                contains: input.searchTerm,
                mode: "insensitive",
              },
            },
            {
              company: {
                name: { contains: input.searchTerm, mode: "insensitive" },
              },
            },
          ],
        },
        include: {
          company: true,
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit + 1, // fetch one more tweet than needed
        skip: input.skip || 0,
      });
      const hasMore = jobs?.length > limit;
      if (hasMore) {
        jobs.pop();
      }
      return {
        jobs,
        hasMore,
      };
    }),

  //Job Search Quick Search (Home of the website)
  getSearch: publicProcedure
    .input(z.object({ searchTerm: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.searchTerm.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              company: {
                name: {
                  contains: input.searchTerm.toLowerCase(),
                  mode: "insensitive",
                },
              },
            },
          ],
        },

        take: 15,
        include: {
          company: true,
          category: true,
          subCategory: true,
        },
      });
    }),

  getUserJobs: protectedProcedure
    .input(z.object({ skip: z.number().default(0), userId: z.string() }))
    .mutation(async ({ input }) => {
      const limit = 5;
      const jobs = await prisma.job.findMany({
        where: {
          userId: input.userId,
        },

        include: {
          company: true,
          category: true,
          subCategory: true,
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit + 1, // fetch one more tweet than needed
        skip: input.skip || 0,
      });
      const hasMore = jobs?.length > limit;
      if (hasMore) {
        jobs.pop();
      }
      return {
        jobs,
        hasMore,
      };
    }),

  userJobDelete: protectedProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.job.deleteMany({
        where: {
          AND: [{ id: input.id, userId: input.userId }],
        },
      });
    }),

  //Admin Create
  create: adminProcedure
    .input(
      z.object({
        title: z.string(),
        desc: z.string(),
        type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY"]),
        education: z.string().default("Any Graduate"),
        role: z.string(),
        experienceMin: z.number().optional(),
        experienceMax: z.number().optional(),
        salary: z.number().optional(),
        workPlace: z.enum(["OFFICE", "REMOTE", "HYBRID"]),
        location: z.string().optional(),
        companyId: z.string(),
        categoryId: z.string(),
        subCategoryId: z.string(),
        applyUrl: z.string().optional(),
        applyInstruction: z.string().optional(),
        applyEmail: z.string().optional(),
        approved: z.boolean(),
        featured: z.boolean(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.create({
        data: {
          title: input.title,
          desc: input.desc,
          type: input.type,
          education: input.education,
          role: input.role,
          experienceMin: input.experienceMin,
          experienceMax: input.experienceMax,
          salary: input.salary,
          workPlace: input.workPlace,
          location: input.location,
          companyId: input.companyId,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          applyUrl: input.applyUrl,
          applyInstruction: input.applyInstruction,
          applyEmail: input.applyEmail,
          approved: input.approved,
          featured: input.featured,
          userId: input.userId,
        },
      });
    }),

  userCreate: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        desc: z.string(),
        type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY"]),
        education: z.string().default("Any Graduate"),
        role: z.string(),
        experienceMin: z.number().optional(),
        experienceMax: z.number().optional(),
        salary: z.number().optional(),
        workPlace: z.enum(["OFFICE", "REMOTE", "HYBRID"]).default("REMOTE"),
        location: z.string().optional(),
        companyId: z.string(),
        categoryId: z.string(),
        subCategoryId: z.string(),
        applyUrl: z.string().optional(),
        applyInstruction: z.string().optional(),
        applyEmail: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.create({
        data: {
          title: input.title,
          desc: input.desc,
          type: input.type,
          education: input.education,
          role: input.role,
          experienceMin: input.experienceMin,
          experienceMax: input.experienceMax,
          salary: input.salary,
          workPlace: input.workPlace,
          location: input.location,
          companyId: input.companyId,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          applyUrl: input.applyUrl,
          applyInstruction: input.applyInstruction,
          applyEmail: input.applyEmail,
          userId: input.userId,
        },
      });
    }),

  updateAdminJob: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        desc: z.string(),
        type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY"]),
        education: z.string(),
        role: z.string(),
        experienceMin: z.number(),
        experienceMax: z.number(),
        salary: z.number(),
        workPlace: z.enum(["OFFICE", "REMOTE", "HYBRID"]),
        location: z.string(),
        companyId: z.string(),
        categoryId: z.string(),
        subCategoryId: z.string(),
        approved: z.boolean(),
        featured: z.boolean(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          desc: input.desc,
          type: input.type,
          education: input.education,
          role: input.role,
          experienceMin: input.experienceMin,
          experienceMax: input.experienceMax,
          salary: input.salary,
          workPlace: input.workPlace,
          location: input.location,
          companyId: input.companyId,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          approved: input.approved,
          featured: input.featured,
          userId: input.userId,
        },
      });
    }),

  deleteJob: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.job.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
