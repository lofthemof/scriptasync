import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BOOK_CHAPTER_COUNTS } from "../bookData";

interface ChapterSelectProps {
  book: string;
  value: string;
  onChange: (chapter: string) => void;
}

const formatChapterValue = (chapterNumber: number) =>
  `Chapter_${String(chapterNumber).padStart(2, "0")}`;

export function ChapterSelect({ book, value, onChange }: ChapterSelectProps) {
  const chapterCount = BOOK_CHAPTER_COUNTS[book] ?? 0;
  const chapters = chapterCount
    ? Array.from({ length: chapterCount }, (_, idx) => idx + 1)
    : [];

  return (
    <Select value={value} onValueChange={onChange} disabled={!chapterCount}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a chapter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Chapters</SelectLabel>
          {chapters.map((chapterNumber) => {
            const chapterValue = formatChapterValue(chapterNumber);
            return (
              <SelectItem key={chapterValue} value={chapterValue}>
                {chapterNumber}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
