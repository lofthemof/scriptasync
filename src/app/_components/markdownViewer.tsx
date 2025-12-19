"use client";

import { useEffect, useMemo, useState } from "react";

interface MarkdownViewerProps {
  content: string;
  onSelectionChange: (verses: string[]) => void;
}

interface Verse {
  number: string;
  text: string;
  key: number;
}

export function MarkdownViewer({
  content,
  onSelectionChange,
}: MarkdownViewerProps) {
  const lines = useMemo(() => content.split("\n"), [content]);

  const verses = useMemo(() => {
    const verseRegex = /^(\d+)\.\s*(.*)/;
    return lines.reduce((acc, rawLine, index) => {
      const line = rawLine.trim();
      if (!line || line.startsWith("# ")) return acc;
      const match = verseRegex.exec(line);
      if (match) {
        acc.push({
          number: match[1] ?? "",
          text: match[2] ?? "",
          key: index,
        });
      }
      return acc;
    }, [] as Verse[]);
  }, [lines]);

  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);

  useEffect(() => {
    onSelectionChange(selectedVerses);
  }, [onSelectionChange, selectedVerses]);

  const toggleVerse = (verseNumber: string) => {
    setSelectedVerses((prev) => {
      if (prev.includes(verseNumber)) {
        return prev.filter((v) => v !== verseNumber);
      }
      return [...prev, verseNumber].sort((a, b) => Number(a) - Number(b));
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="leading-relaxed">
        {verses.map((verse) => {
          const isSelected = selectedVerses.includes(verse.number);
          return (
            <span
              key={verse.key}
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
