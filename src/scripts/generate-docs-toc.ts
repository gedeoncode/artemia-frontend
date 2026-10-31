import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getHeadings } from "../lib/docs/get-headings";

const DOCS_DIR = path.join(process.cwd(), "src/content/docs");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "src/lib/docs/generated-headings.ts"
);
const HASH_FILE = path.join(process.cwd(), ".toc-hash");

// Check for --force flag
const force = process.argv.includes("--force");

// Walk through all MDX files recursively
function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith(".mdx")) {
      results.push(filePath);
    }
  });
  return results;
}

// Compute SHA-256 hash of all file contents
function getFilesHash(files: string[]): string {
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(fs.readFileSync(file, "utf-8"));
  }
  return hash.digest("hex");
}

// Read previous hash
const previousHash = fs.existsSync(HASH_FILE)
  ? fs.readFileSync(HASH_FILE, "utf-8")
  : "";

// Get all MDX files
const mdxFiles = walk(DOCS_DIR);
const currentHash = getFilesHash(mdxFiles);

// Determine if generation is needed
const shouldGenerate =
  force || !fs.existsSync(OUTPUT_FILE) || currentHash !== previousHash;

if (!shouldGenerate) {
  console.log("No changes in docs. Skipping TOC generation.");
  process.exit(0);
}

// Generate headings for each MDX file
const data: Record<string, ReturnType<typeof getHeadings>> = {};
mdxFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");

  const relativePath = path
    .relative(DOCS_DIR, file)
    .replace(/\\/g, "/")
    .replace(".mdx", "");

  const route = "/" + relativePath;
  data[route] = getHeadings(content);
});

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

// Write generated headings
const output = `// This file is generated automatically. Do not edit manually.
export const generatedHeadings = ${JSON.stringify(data, null, 2)} as const;
`;

fs.writeFileSync(OUTPUT_FILE, output);

// Update hash
fs.writeFileSync(HASH_FILE, currentHash);

console.log("✅ Generated headings for docs:", Object.keys(data));
if (force) console.log("⚡ Forced regeneration applied.");
