"use client";

import { useCallback, useState } from "react";
import { BookSelect } from "~/app/_components/TextSelectors/BookSelect";
import { ChapterSelect } from "~/app/_components/TextSelectors/ChapterSelect";
import { MarkdownViewer } from "~/app/_components/MarkdownViewer";
import { api } from "~/trpc/react";

interface UserClientPageProps {
  sessionId: string;
}

export default function ReadClientPage({ sessionId }: UserClientPageProps) {
  const [book, setBook] = useState("01_Genesis");
  const [chapter, setChapter] = useState("Chapter_01");
  const [selection, setSelection] = useState<{
    book: string;
    chapter: string;
    verses: string[];
  }>({
    book,
    chapter,
    verses: [],
  });

  const { data, isLoading, error } = api.bible.getChapter.useQuery({
    book,
    chapter,
  });

  const handleBookChange = useCallback(
    (newBook: string) => {
      setBook(newBook);
      setChapter("Chapter_01");
      setSelection({ book: newBook, chapter, verses: [] });
    },
    [chapter],
  );

  const handleChapterChange = useCallback(
    (newChapter: string) => {
      setChapter(newChapter);
      setSelection({ book, chapter: newChapter, verses: [] });
    },
    [book],
  );

  const handleVersesChange = useCallback(
    (verses: string[]) => setSelection({ book, chapter, verses }),
    [book, chapter],
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <div>Book</div>
        <BookSelect value={book} onChange={handleBookChange} />
      </div>
      <div className="flex items-center gap-2">
        <div>Chapter</div>
        <ChapterSelect
          book={book}
          value={chapter}
          onChange={handleChapterChange}
        />
      </div>

      {isLoading && <div>Loading...</div>}

      {error && <div>{error.message}</div>}

      {data?.success && data.content && (
        <MarkdownViewer
          content={data.content}
          onSelectionChange={handleVersesChange}
        />
      )}
      <div>
        <div>Selected verses</div>
        <pre>{JSON.stringify(selection, null, 2)}</pre>
      </div>
    </div>
  );
}
