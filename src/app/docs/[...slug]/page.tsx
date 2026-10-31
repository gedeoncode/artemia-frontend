import fs from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/docs/mdx-components";
import { reportError } from "@/lib/logger";


interface PageProps {
  params: { slug: string[] };
}

export default async function DocsPage({ params }: PageProps) {
  // Construct path to MDX file
  const slugPath = params.slug.join("/");
  const filePath = path.join(process.cwd(), "src/content/docs", `${slugPath}.mdx`);

  let source = "";
  try {
    source = await fs.readFile(filePath, "utf-8");
  } catch (err) {
    reportError("Docs:FilePath", err);
    return <div>there's no docs for this page</div>;
  }

  return <MDXRemote source={source} components={mdxComponents} />;
}
