import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";

export const bibleRouter = createTRPCRouter({
  getChapter: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      try {
        const baseDir = path.join(process.cwd(), "src/content/esv_bible");
        const fullPath = path.join(baseDir, `${input.slug}.md`);
        const md = fs.readFileSync(fullPath, "utf8");
        return { success: true, content: md };
      } catch (error) {
        return { success: false, error: error };
      }
    }),
});
