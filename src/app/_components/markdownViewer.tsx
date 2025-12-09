import fs from "fs";
import path from "path";
import { type ReactElement } from "react";

export function MarkdownViewer({ slug }: { slug: string }) {
  const baseDir = path.join(process.cwd(), "src/content/esv_bible");
  const fullPath = path.join(baseDir, `${slug}.md`);
  const md = fs.readFileSync(fullPath, "utf8");

  const lines = md.split("\n");
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
