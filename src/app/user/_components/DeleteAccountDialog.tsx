"use client";

import { useState } from "react";
import { formatPassageReference } from "~/app/_components/TextSelectors/bookData";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface DeleteAccountDialogProps {
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteAccountDialog({
  isPending,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [typedVerse, setTypedVerse] = useState("");

  const randomVerseQuery = api.bible.getRandomVerse.useQuery(
    { bibleKey: "ESV" },
    { enabled: false },
  );

  const verse = randomVerseQuery.data?.verse;
  const verseText = verse?.text ?? "";
  const verseReference = verse
    ? formatPassageReference(verse.bookSlug, verse.chapterSlug, [verse.number])
    : null;
  const isTypedMatch = verseText.length > 0 && typedVerse === verseText;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setTypedVerse("");
      void randomVerseQuery.refetch();
    }
  };

  const handleDelete = () => {
    if (!isTypedMatch) return;
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          disabled={isPending}
          className="cursor-pointer rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete account
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
          <DialogDescription>
            To confirm deletion, type the verse exactly as shown. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          {randomVerseQuery.isFetching && (
            <div className="text-muted-foreground text-sm">
              Loading a verse...
            </div>
          )}
          {!randomVerseQuery.isFetching && randomVerseQuery.data?.error && (
            <div className="text-sm text-red-600">
              {randomVerseQuery.data.error}
            </div>
          )}
          {!randomVerseQuery.isFetching && verse && (
            <div className="border-border bg-muted/40 rounded-md border p-3">
              <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                {verseReference}
              </div>
              <p className="mt-2 text-sm leading-relaxed">{verse.text}</p>
            </div>
          )}
          <textarea
            value={typedVerse}
            onChange={(event) => setTypedVerse(event.target.value)}
            placeholder="Type the verse text exactly..."
            className="border-border min-h-[120px] w-full rounded-md border p-2"
            disabled={randomVerseQuery.isFetching || !verse}
            required
          />
          {typedVerse.length > 0 && !isTypedMatch && (
            <div className="text-muted-foreground text-xs">
              The text must match character for character.
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="border-border hover:bg-muted rounded-md border px-4 py-2"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isTypedMatch || isPending}
            className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Confirm delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
