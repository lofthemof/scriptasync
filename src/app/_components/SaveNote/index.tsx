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

export function SaveNoteDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button>Save</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save this Passage</DialogTitle>
            <DialogDescription>Save this passage for later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <input id="note" name="note" placeholder="Add a note (optional)" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button>Cancel</button>
            </DialogClose>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
