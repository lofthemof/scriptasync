"use client";

import { useCallback, useState } from "react";
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

  const [bookInput, setBookInput] = useState(book);
  const [chapterInput, setChapterInput] = useState(chapter);

  const { data, isLoading, error } = api.bible.getChapter.useQuery({
    book,
    chapter,
  });

  const handleVersesChange = useCallback(
    (verses: string[]) => setSelection({ book, chapter, verses }),
    [book, chapter],
  );

  return (
    <div>
      <div className="flex">
        <div>Book</div>
        <input
          type="text"
          onChange={(e) => setBookInput(e.target.value)}
          value={bookInput}
        />
        <button
          onClick={() => {
            setBook(bookInput);
            setSelection({ book: bookInput, chapter, verses: [] });
          }}
        >
          Set
        </button>
      </div>
      <div className="flex">
        <div>Set Chapter</div>
        <input
          type="text"
          onChange={(e) => setChapterInput(e.target.value)}
          value={chapterInput}
        />
        <button
          onClick={() => {
            setChapter(chapterInput);
            setSelection({ book, chapter: chapterInput, verses: [] });
          }}
        >
          Set
        </button>
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
