"use client";

import { type ReactElement } from "react";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const lines = content.split("\n");
  const elements: ReactElement[] = [];
  const verseRegex = /^(\d+)\.\s*(.*)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();

    if (!line) continue;

    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={i} className="mb-4 text-2xl font-bold">
          {line.substring(2)}
        </h2>,
      );
    } else {
      const match = verseRegex.exec(line);
      if (match) {
        const verseNum = match[1];
        const verseText = match[2];
        elements.push(
          <span key={i}>
            <strong>{verseNum}</strong> {verseText + " "}
          </span>,
        );
      }
    }
  }

  return <div>{elements}</div>;
}
