"use server";

import fs from "fs";
import path from "path";

export async function getBibleMarkdown(slug: string) {
  const baseDir = path.join(process.cwd(), "src/content/esv_bible");
  const fullPath = path.join(baseDir, `${slug}.md`);
  const md = fs.readFileSync(fullPath, "utf8");
  return md;
}
