"use client";

import { useCallback, useEffect, useState } from "react";
import { BookSelect } from "~/app/_components/TextSelectors/BookSelect";
import { ChapterSelect } from "~/app/_components/TextSelectors/ChapterSelect";
import { VerseSelector } from "~/app/_components/VerseSelector";
import { api } from "~/trpc/react";

const CHAP_ONE_SLUG = "Chapter_01";
const GENESIS_SLUG = "01_Genesis";

export default function ReadClientPage() {
  const [bookSlug, setBookSlug] = useState(GENESIS_SLUG);
  const [chapterSlug, setChapterSlug] = useState(CHAP_ONE_SLUG);
  const [hasInitializedFromUser, setHasInitializedFromUser] = useState(false);
  const [selection, setSelection] = useState<{
    bookSlug: string;
    chapterSlug: string;
    verses: number[];
  }>({
    bookSlug,
    chapterSlug,
    verses: [],
  });

  const { data: lastOpened, isLoading: lastOpenedIsLoading } =
    api.user.getLastOpened.useQuery();
  const setLastOpened = api.user.setLastOpened.useMutation();

  const handleBookChange = useCallback(
    (newBookSlug: string) => {
      const resetChapter = CHAP_ONE_SLUG;
      setBookSlug(newBookSlug);
      setChapterSlug(CHAP_ONE_SLUG);
      setSelection({
        bookSlug: newBookSlug,
        chapterSlug: resetChapter,
        verses: [],
      });
      setLastOpened.mutate({ newBookSlug, newChapterSlug: resetChapter });
    },
    [setLastOpened],
  );

  const handleChapterChange = useCallback(
    (newChapterSlug: string) => {
      setChapterSlug(newChapterSlug);
      setSelection({
        bookSlug: bookSlug,
        chapterSlug: newChapterSlug,
        verses: [],
      });
      setLastOpened.mutate({ newBookSlug: bookSlug, newChapterSlug });
    },
    [bookSlug, setLastOpened],
  );

  const handleVersesChange = useCallback(
    (verses: number[]) =>
      setSelection({ bookSlug: bookSlug, chapterSlug: chapterSlug, verses }),
    [bookSlug, chapterSlug],
  );

  useEffect(() => {
    if (hasInitializedFromUser) return;
    if (lastOpenedIsLoading) return;

    setHasInitializedFromUser(true);

    const initialBook = lastOpened?.lastOpenedBook?.slug ?? GENESIS_SLUG;
    const initialChapter = lastOpened?.lastOpenedChapter?.slug ?? CHAP_ONE_SLUG;

    setBookSlug(initialBook);
    setChapterSlug(initialChapter);
    setSelection({
      bookSlug: initialBook,
      chapterSlug: initialChapter,
      verses: [],
    });
  }, [hasInitializedFromUser, lastOpened, lastOpenedIsLoading]);

  const {
    data: chapterData,
    isLoading: chapterIsLoading,
    error: chapterError,
  } = api.bible.getChapter.useQuery(
    { bookSlug, chapterSlug },
    { enabled: hasInitializedFromUser },
  );

  if (!hasInitializedFromUser && lastOpenedIsLoading) {
    return <div>Loading last opened location...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div>Book</div>
        <BookSelect value={bookSlug} onChange={handleBookChange} />
      </div>
      <div className="flex items-center gap-2">
        <div>Chapter</div>
        <ChapterSelect
          book={bookSlug}
          value={chapterSlug}
          onChange={handleChapterChange}
        />
      </div>

      {chapterIsLoading && <div>Loading...</div>}

      {chapterError && <div>{chapterError.message}</div>}

      {chapterData?.verses && (
        <VerseSelector
          verses={chapterData.verses}
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
