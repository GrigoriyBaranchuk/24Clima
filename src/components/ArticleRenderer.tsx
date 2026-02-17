"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PLACEHOLDER_REGEX = /\[\[IMAGE_(\d+)\]\]/g;

type ArticleRendererProps = {
  content: string;
  imageUrls: string[];
  className?: string;
};

export default function ArticleRenderer({
  content,
  imageUrls,
  className = "",
}: ArticleRendererProps) {
  type Part = { type: "markdown"; text: string } | { type: "image"; index: number };
  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  PLACEHOLDER_REGEX.lastIndex = 0;
  while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "markdown", text: content.slice(lastIndex, match.index) });
    }
    const num = parseInt(match[1], 10);
    parts.push({ type: "image", index: num });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "markdown", text: content.slice(lastIndex) });
  }

  const usedIndices = new Set<number>();

  return (
    <div className={`prose prose-lg prose-slate max-w-none article-content prose-headings:text-[#1e3a5f] prose-a:text-[#0F9D58] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg ${className}`}>
      {parts.map((part, i) => {
        if (part.type === "markdown") {
          if (!part.text.trim()) return null;
          return (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
              {part.text}
            </ReactMarkdown>
          );
        }
        const imgIndex = part.index - 1;
        const url = imageUrls[imgIndex];
        if (!url) return null;
        usedIndices.add(imgIndex);
        return (
          <figure key={i} className="my-8">
            <img
              src={url}
              alt=""
              className="w-full rounded-lg shadow-lg object-cover max-w-2xl mx-auto"
            />
          </figure>
        );
      })}
      {(() => {
        const extra = imageUrls.filter((_, i) => !usedIndices.has(i));
        if (extra.length === 0) return null;
        return (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extra.map((url, i) => (
            <figure key={`extra-${i}`} className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={url}
                alt=""
                className="w-full h-48 object-cover"
              />
            </figure>
          ))}
        </div>
        );
      })()}
    </div>
  );
}
