"use client";

import { useCallback, useEffect, useState } from "react";
import { SaveNoteDialog } from "~/app/_components/SaveNote";
import { BookSelect } from "~/app/_components/TextSelectors/BookSelect";
import { formatPassageReference } from "~/app/_components/TextSelectors/bookData";
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
    <div className="-mt-7 flex flex-col gap-4">
      <div className="border-border bg-background/90 sticky top-0 z-10 -mx-6 border-b px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Book
            </span>
            <BookSelect value={bookSlug} onChange={handleBookChange} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Chapter
            </span>
            <ChapterSelect
              book={bookSlug}
              value={chapterSlug}
              onChange={handleChapterChange}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SaveNoteDialog
              bookSlug={selection.bookSlug}
              chapterSlug={selection.chapterSlug}
              verses={selection.verses}
            />
            <span className="text-muted-foreground text-sm">
              {selection.verses.length > 0
                ? formatPassageReference(
                    selection.bookSlug,
                    selection.chapterSlug,
                    selection.verses,
                  )
                : "Select verses to save a note"}
            </span>
          </div>
        </div>
      </div>

      {chapterIsLoading && (
        <div className="text-muted-foreground text-sm">Loading...</div>
      )}

      {chapterError && (
        <div className="text-muted-foreground text-sm">
          {chapterError.message}
        </div>
      )}

      {chapterData?.verses && (
        <VerseSelector
          verses={chapterData.verses}
          onSelectionChange={handleVersesChange}
        />
      )}
    </div>
  );
}
