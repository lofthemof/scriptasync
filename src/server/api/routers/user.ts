import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        name: null,
        email: null,
        image: null,
        deleted: true,
        deletedAt: new Date(),
      },
    });

    await ctx.prisma.account.deleteMany({
      where: { userId: userId },
    });

    await ctx.prisma.session.deleteMany({
      where: { userId: userId },
    });
    return { success: true };
  }),
  getLastOpened: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { lastOpenedBook: true, lastOpenedChapter: true },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      lastOpenedBook: user.lastOpenedBook,
      lastOpenedChapter: user.lastOpenedChapter,
    };
  }),
  setLastOpened: protectedProcedure
    .input(z.object({ newBook: z.string(), newChapter: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          lastOpenedBook: input.newBook,
          lastOpenedChapter: input.newChapter,
        },
        select: {
          lastOpenedBook: true,
          lastOpenedChapter: true,
        },
      });

      return {
        lastOpenedBook: updatedUser.lastOpenedBook,
        lastOpenedChapter: updatedUser.lastOpenedChapter,
      };
    }),
});
