"use client";

import { useState } from "react";
import { MarkdownViewer } from "~/app/_components/MarkdownViewer";
// import { api } from "~/trpc/react";

interface UserClientPageProps {
  sessionId: string;
}

export default function ReadClientPage({ sessionId }: UserClientPageProps) {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");

  return (
    <div>
      <div className="flex">
        <div>Set Book</div>
        <input type="text"></input>
      </div>
      <div className="flex">
        <div>Set Chapter</div>
        <input type="text"></input>
      </div>
      <MarkdownViewer slug="01_Genesis/Chapter_01" />
    </div>
  );
}
