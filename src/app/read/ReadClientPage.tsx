"use client";

import { useCallback, useEffect, useState } from "react";
import { BookSelect } from "~/app/_components/TextSelectors/BookSelect";
import { ChapterSelect } from "~/app/_components/TextSelectors/ChapterSelect";
import { MarkdownViewer } from "~/app/_components/MarkdownViewer";
import { api } from "~/trpc/react";

export default function ReadClientPage() {
  const [book, setBook] = useState("01_Genesis");
  const [chapter, setChapter] = useState("Chapter_01");
  const [hasInitializedFromUser, setHasInitializedFromUser] = useState(false);
  const [selection, setSelection] = useState<{
    book: string;
    chapter: string;
    verses: string[];
  }>({
    book,
    chapter,
    verses: [],
  });

  const { data: lastOpened, isLoading: lastOpenedIsLoading } =
    api.user.getLastOpened.useQuery();
  const setLastOpened = api.user.setLastOpened.useMutation();

  const handleBookChange = useCallback(
    (newBook: string) => {
      const resetChapter = "Chapter_01";
      setBook(newBook);
      setChapter("Chapter_01");
      setSelection({ book: newBook, chapter: resetChapter, verses: [] });
      setLastOpened.mutate({ newBook, newChapter: resetChapter });
    },
    [setLastOpened],
  );

  const handleChapterChange = useCallback(
    (newChapter: string) => {
      setChapter(newChapter);
      setSelection({ book, chapter: newChapter, verses: [] });
      setLastOpened.mutate({ newBook: book, newChapter });
    },
    [book, setLastOpened],
  );

  const handleVersesChange = useCallback(
    (verses: string[]) => setSelection({ book, chapter, verses }),
    [book, chapter],
  );

  useEffect(() => {
    if (hasInitializedFromUser) return;
    if (lastOpenedIsLoading) return;

    setHasInitializedFromUser(true);

    const initialBook = lastOpened?.lastOpenedBook ?? "01_Genesis";
    const initialChapter = lastOpened?.lastOpenedChapter ?? "Chapter_01";

    setBook(initialBook);
    setChapter(initialChapter);
    setSelection({
      book: initialBook,
      chapter: initialChapter,
      verses: [],
    });
  }, [hasInitializedFromUser, lastOpened, lastOpenedIsLoading]);

  const {
    data: textData,
    isLoading: textIsLoading,
    error: textError,
  } = api.bible.getChapter.useQuery(
    { book, chapter },
    { enabled: hasInitializedFromUser },
  );

  if (!hasInitializedFromUser && lastOpenedIsLoading) {
    return <div>Loading last opened location...</div>;
  }

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

      {textIsLoading && <div>Loading...</div>}

      {textError && <div>{textError.message}</div>}

      {textData?.success && textData.content && (
        <MarkdownViewer
          content={textData.content}
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
