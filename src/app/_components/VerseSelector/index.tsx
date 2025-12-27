import { useEffect, useState } from "react";

export type VerseData = { number: number; text: string };

interface VerseSelectorProps {
  verses: VerseData[];
  onSelectionChange: (verses: number[]) => void;
}

export function VerseSelector({
  verses,
  onSelectionChange,
}: VerseSelectorProps) {
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);

  useEffect(() => {
    onSelectionChange(selectedVerses);
  }, [onSelectionChange, selectedVerses]);

  const toggleVerse = (verseNumber: number) => {
    setSelectedVerses((prev) => {
      if (prev.includes(verseNumber)) {
        return prev.filter((v) => v !== verseNumber);
      }
      return [...prev, verseNumber].sort((a, b) => a - b);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="leading-relaxed">
        {verses.map((verse) => {
          const isSelected = selectedVerses.includes(verse.number);
          return (
            <span
              key={verse.number}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => toggleVerse(verse.number)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleVerse(verse.number);
                }
              }}
              className={`rounded transition-colors ${
                isSelected
                  ? "border border-blue-400 bg-blue-50"
                  : "border border-transparent hover:bg-gray-100"
              }`}
            >
              <strong className="shrink-0">{verse.number}</strong>
              <span className="ml-1">{verse.text} </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
