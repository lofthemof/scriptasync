"use client";

import { formatPassageReference } from "~/app/_components/TextSelectors/bookData";

interface NoteVerse {
  verse: {
    number: number;
    text: string;
    chapter: { slug: string };
    book: { slug: string };
  };
}

interface NoteBoxProps {
  content: string | null;
  verses: NoteVerse[];
  createdAt: Date;
}

export function NoteBox({ content, verses, createdAt }: NoteBoxProps) {
  if (verses.length === 0) return null;

  const firstVerse = verses[0]!.verse;
  const bookSlug = firstVerse.book.slug;
  const chapterSlug = firstVerse.chapter.slug;
  const verseNumbers = verses.map((v) => v.verse.number);

  const passageRef = formatPassageReference(
    bookSlug,
    chapterSlug,
    verseNumbers,
  );

  return (
    <div className="rounded border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{passageRef}</h3>
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3 text-sm text-gray-700">
        {verses.map((v) => (
          <span key={v.verse.number}>
            <sup className="mr-1 font-bold">{v.verse.number}</sup>
            <span className="mr-1">{v.verse.text}</span>
          </span>
        ))}
      </div>

      {content && (
        <div className="border-t border-gray-100 pt-2 text-sm">{content}</div>
      )}
    </div>
  );
}
