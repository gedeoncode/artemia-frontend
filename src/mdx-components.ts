import { mdxComponents } from "@/components/docs/mdx-components";
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  ...mdxComponents,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
