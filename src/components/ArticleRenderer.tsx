"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArticleFloatingSection from "./ArticleFloatingSection";

const PLACEHOLDER_REGEX = /\[\[IMAGE_(\d+)\]\]/g;

type ArticleRendererProps = {
  content: string;
  imageUrls: string[];
  className?: string;
  stacked?: boolean;
};

function renderPart(
  part: { type: "markdown"; text: string } | { type: "image"; index: number },
  imageUrls: string[],
  usedIndices: Set<number>,
  key: number
) {
  if (part.type === "markdown") {
    if (!part.text.trim()) return null;
    return (
      <ReactMarkdown key={key} remarkPlugins={[remarkGfm]}>
        {part.text}
      </ReactMarkdown>
    );
  }
  const imgIndex = part.index - 1;
  const url = imageUrls[imgIndex];
  if (!url) return null;
  usedIndices.add(imgIndex);
  return (
    <figure key={key} className="my-8">
      <img
        src={url}
        alt=""
        className="w-full max-w-2xl mx-auto rounded-xl shadow-lg object-cover"
      />
    </figure>
  );
}

type Part = { type: "markdown"; text: string } | { type: "image"; index: number };

function parseParts(content: string): Part[] {
  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  PLACEHOLDER_REGEX.lastIndex = 0;
  while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "markdown", text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "image", index: parseInt(match[1], 10) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "markdown", text: content.slice(lastIndex) });
  }
  return parts;
}

function splitIntoSections(content: string): string[] {
  const byH2 = content.split(/(?=^##\s+)/m).filter((s) => s.trim());
  if (byH2.length > 1) return byH2;
  const byH3 = content.split(/(?=^###\s+)/m).filter((s) => s.trim());
  if (byH3.length > 1) return byH3;
  return [content];
}

export default function ArticleRenderer({
  content,
  imageUrls,
  className = "",
  stacked = true,
}: ArticleRendererProps) {
  const proseClasses =
    "prose prose-lg max-w-none article-content prose-headings:text-[#e8f0f8] prose-headings:font-serif prose-p:text-[#c8d6e3] prose-li:text-[#c8d6e3] prose-strong:text-[#e8f0f8] prose-a:text-[#7BC043] prose-a:no-underline hover:prose-a:text-[#8fd453] prose-img:rounded-xl prose-img:shadow-xl prose-blockquote:border-l-[#7BC043] prose-blockquote:bg-[#7BC043]/15 prose-blockquote:py-4 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-[#b8d4e8]";

  const usedIndices = new Set<number>();

  if (!stacked) {
    const parts = parseParts(content);
    return (
      <div className={`${proseClasses} ${className}`}>
        {parts.map((part, i) => renderPart(part, imageUrls, usedIndices, i))}
        {imageUrls.filter((_, i) => !usedIndices.has(i)).length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {imageUrls
              .filter((_, i) => !usedIndices.has(i))
              .map((url, i) => (
                <figure key={`extra-${i}`} className="overflow-hidden rounded-xl shadow-lg">
                  <img src={url} alt="" className="w-full h-48 object-cover" />
                </figure>
              ))}
          </div>
        )}
      </div>
    );
  }

  const sections = splitIntoSections(content);
  const sharedUsedIndices = new Set<number>();

  return (
    <div className={`space-y-0 ${className}`}>
      {sections.map((sectionContent, sectionIndex) => {
        const sectionParts = parseParts(sectionContent);
        return (
          <ArticleFloatingSection
            key={sectionIndex}
            index={sectionIndex}
            totalSections={sections.length}
          >
            <div
              className={proseClasses}
              style={{ marginBottom: sectionIndex < sections.length - 1 ? 0 : undefined }}
            >
              {sectionParts.map((part, i) => renderPart(part, imageUrls, sharedUsedIndices, sectionIndex * 1000 + i))}
            </div>
          </ArticleFloatingSection>
        );
      })}
      {(() => {
        const allUsed = new Set<number>();
        sections.forEach((s) => {
          parseParts(s).forEach((p) => {
            if (p.type === "image") allUsed.add(p.index - 1);
          });
        });
        const extra = imageUrls.filter((_, i) => !allUsed.has(i));
        if (extra.length === 0) return null;
        return (
          <ArticleFloatingSection index={sections.length} totalSections={sections.length + 1}>
            <div className={proseClasses}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {extra.map((url, i) => (
                  <figure key={i} className="overflow-hidden rounded-xl shadow-lg">
                    <img src={url} alt="" className="w-full h-48 object-cover" />
                  </figure>
                ))}
              </div>
            </div>
          </ArticleFloatingSection>
        );
      })()}
    </div>
  );
}
