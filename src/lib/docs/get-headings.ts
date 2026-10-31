export type Heading = {
  id: string;
  title: string;
  level: number;
};

/**
 * Extract headings from Markdown/MDX content.
 * - Handles H1 (#), H2 (##), H3 (###), H4 (####)
 * - Ensures unique IDs for duplicate titles
 * - Always places H1 at the beginning of the returned array
 * - Ignores frontmatter lines (`---`)
 * - Allows optional leading spaces
 */
export function getHeadings(content: string): Heading[] {
  const seen = new Set<string>();
  const headings: Heading[] = [];
  let h1Heading: Heading | null = null;

  content.split("\n").forEach((line) => {
    line = line.trim();
    if (!line || line === "---") return; // skip empty lines and frontmatter

    const match = line.match(/^\s*(#{1,4})\s+(.*)$/); // H1-H4, optional spaces
    if (!match) return;

    const [, hashes, rawTitle] = match;
    const level = hashes.length; // 1 = H1, 2 = H2, 3 = H3, 4 = H4
    const title = rawTitle.trim();

    // generate slug/id
    let id = title
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // ensure unique
    let uniqueId = id;
    let i = 1;
    while (seen.has(uniqueId)) {
      uniqueId = `${id}-${i++}`;
    }
    seen.add(uniqueId);

    const heading: Heading = { id: uniqueId, title, level };

    if (level === 1) {
      h1Heading = heading; // H1 stored separately
    } else {
      headings.push(heading);
    }
  });

  // H1 always first
  return h1Heading ? [h1Heading, ...headings] : headings;
}
