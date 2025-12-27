import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const DEFAULT_BIBLE_KEY = "ESV";

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
      select: {
        lastOpenedBible: true,
        lastOpenedBook: true,
        lastOpenedChapter: true,
      },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      lastOpenedBible: user.lastOpenedBible,
      lastOpenedBook: user.lastOpenedBook,
      lastOpenedChapter: user.lastOpenedChapter,
    };
  }),
  setLastOpened: protectedProcedure
    .input(
      z.object({
        newBibleKey: z.string().default(DEFAULT_BIBLE_KEY),
        newBookSlug: z.string(),
        newChapterSlug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const bible = await ctx.prisma.bible.findUnique({
        where: { key: input.newBibleKey ?? DEFAULT_BIBLE_KEY },
        select: { id: true, key: true, name: true },
      });
      if (!bible)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bible not found",
        });

      const book = await ctx.prisma.book.findUnique({
        where: { bibleId_slug: { bibleId: bible.id, slug: input.newBookSlug } },
        select: { id: true, slug: true, name: true },
      });
      if (!book)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });

      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          bookId_slug: { bookId: book.id, slug: input.newChapterSlug },
        },
        select: { id: true, slug: true, number: true },
      });
      if (!chapter)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          lastOpenedBibleId: bible.id,
          lastOpenedBookId: book.id,
          lastOpenedChapterId: chapter.id,
        },
      });

      return { success: true };
    }),
});
