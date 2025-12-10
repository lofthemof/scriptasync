"use client";

import { MarkdownViewer } from "~/app/_components/MarkdownViewer";
// import { api } from "~/trpc/react";

interface UserClientPageProps {
  sessionId: string;
}

export default function ReadClientPage({ sessionId }: UserClientPageProps) {
  return <MarkdownViewer slug="01_Genesis/Chapter_01" />;
}
