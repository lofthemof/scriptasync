import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS } from "../bookData";

interface BookSelectProps {
  value: string;
  onChange: (bookFile: string) => void;
}

export function BookSelect({ value, onChange }: BookSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a book" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Old Testament</SelectLabel>
          {OLD_TESTAMENT_BOOKS.map((book) => (
            <SelectItem key={book.file} value={book.file}>
              {book.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>New Testament</SelectLabel>
          {NEW_TESTAMENT_BOOKS.map((book) => (
            <SelectItem key={book.file} value={book.file}>
              {book.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
