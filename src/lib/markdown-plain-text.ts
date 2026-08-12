/**
 * Plain-text version of catalog markdown/HTML content for machine-readable
 * surfaces (Product/FAQPage JSON-LD, Google Merchant feed): strips HTML tags,
 * markdown link syntax, emphasis markers (**bold**, *italic*, `code`) and
 * leading # heading markers, then collapses whitespace. Google rejects markup
 * noise in structured data and g:description.
 */
export function markdownToPlainText(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
