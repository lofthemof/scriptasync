import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

const DEFAULT_BIBLE_KEY = "ESV";

export const bibleRouter = createTRPCRouter({
  getChapter: publicProcedure
    .input(
      z.object({
        chapterSlug: z.string(),
        bookSlug: z.string(),
        bibleKey: z.string().default(DEFAULT_BIBLE_KEY),
      }),
    )
    .query(async ({ input }) => {
      try {
        const bible = await prisma.bible.findUnique({
          where: { key: input.bibleKey ?? DEFAULT_BIBLE_KEY },
          select: { id: true },
        });

        if (!bible) {
          return { success: false, error: "Bible not found" };
        }

        const book = await prisma.book.findUnique({
          where: { bibleId_slug: { bibleId: bible.id, slug: input.bookSlug } },
          select: { id: true },
        });

        if (!book) {
          return { success: false, error: "Book not found" };
        }

        const chapter = await prisma.chapter.findUnique({
          where: { bookId_slug: { bookId: book.id, slug: input.chapterSlug } },
          include: {
            book: true,
            verses: { orderBy: { number: "asc" } },
          },
        });

        if (!chapter) {
          return { success: false, error: "Chapter not found" };
        }

        const verses = chapter.verses.map((verse) => ({
          number: verse.number,
          text: verse.text,
        }));

        return { verses };
      } catch (error) {
        console.error("Failed to fetch chapter", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error while fetching chapter",
        };
      }
    }),
});
