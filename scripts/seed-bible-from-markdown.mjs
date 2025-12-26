import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Testament } from "../generated/prisma/index.js";

const baseDir = path.join(process.cwd(), "src/content/esv_bible");
const bookDataPath = path.join(
  process.cwd(),
  "src/app/_components/TextSelectors/bookData.ts",
);
const BIBLE = {
  key: "ESV",
  name: "English Standard Version",
  language: "en",
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required to seed bible data.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ["error", "warn"],
});

const parseBooks = async () => {
  const raw = await fs.readFile(bookDataPath, "utf8");
  const matches = raw.matchAll(
    /\{\s*file:\s*"([^"]+)",\s*name:\s*"([^"]+)"\s*\}/g,
  );

  return Array.from(matches).map(([, slug, name], idx) => ({
    slug,
    name,
    order: idx + 1,
    testament: idx + 1 <= 39 ? Testament.OLD : Testament.NEW,
  }));
};

const parseVerses = (content) => {
  const verseRegex = /^(\d+)\.\s*(.+)$/;
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const match = verseRegex.exec(line);
      if (!match) return null;
      return {
        number: Number.parseInt(match[1] ?? "0", 10),
        text: (match[2] ?? "").trim(),
      };
    })
    .filter(Boolean);
};

const upsertChapterWithVerses = async (book, chapterNumber, content) => {
  const verses = parseVerses(content);

  const chapter = await prisma.chapter.upsert({
    where: {
      bookId_number: {
        bookId: book.id,
        number: chapterNumber,
      },
    },
    update: { number: chapterNumber, bookId: book.id },
    create: { number: chapterNumber, bookId: book.id },
  });

  await prisma.verse.deleteMany({ where: { chapterId: chapter.id } });

  if (verses.length === 0) return;

  await prisma.verse.createMany({
    data: verses.map((verse) => ({
      bookId: book.id,
      chapterId: chapter.id,
      number: verse.number,
      text: verse.text,
    })),
  });
};

const seedBible = async () => {
  const books = await parseBooks();
  const bible = await prisma.bible.upsert({
    where: { key: BIBLE.key },
    update: { name: BIBLE.name, language: BIBLE.language },
    create: { key: BIBLE.key, name: BIBLE.name, language: BIBLE.language },
  });

  for (const bookMeta of books) {
    const bookDir = path.join(baseDir, bookMeta.slug);
    const bookRecord = await prisma.book.upsert({
      where: {
        bibleId_slug: {
          bibleId: bible.id,
          slug: bookMeta.slug,
        },
      },
      update: {
        name: bookMeta.name,
        order: bookMeta.order,
        testament: bookMeta.testament,
        bibleId: bible.id,
      },
      create: {
        slug: bookMeta.slug,
        name: bookMeta.name,
        order: bookMeta.order,
        testament: bookMeta.testament,
        bibleId: bible.id,
      },
    });

    const files = await fs.readdir(bookDir);
    const chapterFiles = files
      .filter((file) => file.toLowerCase().startsWith("chapter_"))
      .sort();

    for (const file of chapterFiles) {
      const match = /Chapter_(\d+)/.exec(file);
      if (!match) continue;

      const chapterNumber = Number.parseInt(match[1] ?? "0", 10);
      const fullPath = path.join(bookDir, file);
      const content = await fs.readFile(fullPath, "utf8");

      await upsertChapterWithVerses(bookRecord, chapterNumber, content);
      console.log(`Saved ${bookMeta.slug} chapter ${chapterNumber}`);
    }
  }
};

seedBible()
  .catch((err) => {
    console.error("Failed to seed bible data", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
