import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
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
});
