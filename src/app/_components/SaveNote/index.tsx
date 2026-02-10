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
          className="border-border bg-foreground text-background hover:bg-foreground/90 cursor-pointer rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Note
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save a Note</DialogTitle>
            <DialogDescription>
              Add a note for{" "}
              {formatPassageReference(bookSlug, chapterSlug, verses)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <textarea
              id="note"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note..."
              className="border-border min-h-[120px] w-full rounded-md border p-2"
              required
            />
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
              type="submit"
              disabled={saveNote.isPending}
              className="border-border bg-foreground text-background hover:bg-foreground/90 rounded-md border px-4 py-2 disabled:opacity-50"
            >
              {saveNote.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
