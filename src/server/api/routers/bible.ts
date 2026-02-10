import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

const DEFAULT_BIBLE_KEY = "ESV";

export const bibleRouter = createTRPCRouter({
  getRandomVerse: publicProcedure
    .input(
      z.object({
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
          return { verse: null, error: "Bible not found" };
        }

        const versesCount = await prisma.verse.count({
          where: { book: { bibleId: bible.id } },
        });

        if (versesCount === 0) {
          return { verse: null, error: "No verses found" };
        }

        const skip = Math.floor(Math.random() * versesCount);

        const verse = await prisma.verse.findFirst({
          where: { book: { bibleId: bible.id } },
          orderBy: { id: "asc" },
          skip,
          select: {
            number: true,
            text: true,
            book: { select: { slug: true } },
            chapter: { select: { slug: true } },
          },
        });

        if (!verse) {
          return { verse: null, error: "Verse not found" };
        }

        return {
          verse: {
            number: verse.number,
            text: verse.text,
            bookSlug: verse.book.slug,
            chapterSlug: verse.chapter.slug,
          },
          error: null,
        };
      } catch (error) {
        console.error("Failed to fetch random verse", error);
        return {
          verse: null,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error while fetching random verse",
        };
      }
    }),
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
