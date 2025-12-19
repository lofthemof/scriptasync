import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS } from "./bookData";

export function BookSelect() {
  return (
    <Select>
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
