"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { formatPassageReference } from "~/app/_components/TextSelectors/bookData";
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
import { api } from "~/trpc/react";

interface SaveNoteDialogProps {
  bookSlug: string;
  chapterSlug: string;
  verses: number[];
}

export function SaveNoteDialog({
  bookSlug,
  chapterSlug,
  verses,
}: SaveNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const saveNote = api.user.saveNote.useMutation({
    onSuccess: () => {
      setContent("");
      setOpen(false);
      toast.success("Note saved successfully!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveNote.mutate({
      bookSlug,
      chapterSlug,
      verses,
      content,
    });
  };

  const isDisabled = verses.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={isDisabled}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Note
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save a Note</DialogTitle>
            <DialogDescription>
              Add a note for {formatPassageReference(bookSlug, chapterSlug, verses)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <textarea
              id="note"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note..."
              className="min-h-[100px] w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={saveNote.isPending}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saveNote.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
