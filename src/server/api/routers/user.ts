import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { name: null, email: null, image: null }, // TODO: add deletedAt on users, accounts, sessions, etc.
      });
      return { success: true };
    }),
});
