import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const DEFAULT_BIBLE_KEY = "ESV";

interface NoteVerseEntry {
  noteId: string;
  verseId: string;
  order: number;
}

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
        select: { id: true },
      });
      if (!bible)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bible not found",
        });

      const book = await ctx.prisma.book.findUnique({
        where: { bibleId_slug: { bibleId: bible.id, slug: input.newBookSlug } },
        select: { id: true },
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
        select: { id: true },
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
  saveNote: protectedProcedure
    .input(
      z.object({
        bibleKey: z.string().default(DEFAULT_BIBLE_KEY),
        bookSlug: z.string(),
        chapterSlug: z.string(),
        verses: z.array(z.number()),
        content: z.string(),
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
        where: { key: input.bibleKey ?? DEFAULT_BIBLE_KEY },
        select: { id: true },
      });
      if (!bible)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bible not found",
        });

      const book = await ctx.prisma.book.findUnique({
        where: { bibleId_slug: { bibleId: bible.id, slug: input.bookSlug } },
        select: { id: true },
      });
      if (!book)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });

      const chapter = await ctx.prisma.chapter.findUnique({
        where: {
          bookId_slug: { bookId: book.id, slug: input.chapterSlug },
        },
        select: { id: true },
      });
      if (!chapter)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });

      const note = await ctx.prisma.note.create({
        data: { userId: userId, content: input.content },
      });

      const verses = await ctx.prisma.verse.findMany({
        where: { chapterId: chapter.id, number: { in: input.verses } },
        select: { id: true, number: true },
      });

      const verseIdByNumber = new Map(
        verses.map((verse) => [verse.number, verse.id]),
      );

      const noteVerseDatas = input.verses.reduce<NoteVerseEntry[]>(
        (acc, verseNumber, index) => {
          const verseId = verseIdByNumber.get(verseNumber);
          if (!verseId) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Verse ${verseNumber} not found`,
            });
          }

          acc.push({ noteId: note.id, verseId, order: index + 1 });
          return acc;
        },
        [],
      );

      await ctx.prisma.noteVerse.createMany({ data: noteVerseDatas });

      return { success: true };
    }),
});
