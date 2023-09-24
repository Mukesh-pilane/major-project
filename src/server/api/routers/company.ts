import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

import { prisma } from "~/server/db";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.company.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  infiniteCompanies: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const limit = 8;
      const companies = await prisma.company.findMany({
        skip: input.skip,
        take: limit + 1,
      });
      const hasMore = companies?.length > limit;
      if (hasMore) {
        companies.pop();
      }
      return {
        companies,
        hasMore,
      };
    }),
  //Single company
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.company.findUnique({
        where: {
          id: input.id,
        },
        include: {
          jobs: {
            where: {
              approved: {
                equals: true,
              },
            },
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      });
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string(),
        website: z.string(),
        linkedin: z.string(),
        logo: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (
        !input.name ||
        !input.desc ||
        !input.website ||
        !input.linkedin ||
        !input.logo
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return ctx.prisma.company.create({
        data: {
          name: input.name,
          desc: input.desc,
          website: input.website,
          linkedin: input.linkedin,
          logo: input.logo,
        },
      });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.company.delete({
        where: {
          id: input.id,
        },
      });
    }),
  updateAdminCompany: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        desc: z.string(),
        website: z.string(),
        linkedin: z.string(),
        logo: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.company.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          desc: input.desc,
          website: input.website,
          linkedin: input.linkedin,
          logo: input.logo,
        },
      });
    }),
});
