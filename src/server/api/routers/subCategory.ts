import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subCategoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subcategory.findMany({
      include: {
        category: true,
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        categoryId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name || !input.categoryId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please provide all the necessary information",
        });
      }
      return ctx.prisma.subcategory.create({
        data: {
          name: input.name,
          categoryId: input.categoryId,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subcategory.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
        categoryId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subcategory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          categoryId: input.categoryId,
        },
      });
    }),
});
