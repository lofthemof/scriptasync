"use client";

import { useEffect, useState, type ReactElement } from "react";
import { getBibleMarkdown } from "../_utils/getBibleMarkdown";

export function MarkdownViewer({ slug }: { slug: string }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const md = await getBibleMarkdown(slug);
      setContent(md);
      setLoading(false);
    };
    void loadContent();
  }, [slug]);

  if (loading) return <div>Loading...</div>;

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
            <strong>{verseNum}</strong> {verseText}{" "}
          </span>,
        );
      }
    }
  }

  return <div>{elements}</div>;
}
