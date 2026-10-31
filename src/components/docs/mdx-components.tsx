import {
  Callout,
  Steps,
  Step,
  Card,
  Grid,
  Badge,
  Tabs,
  TabsContent,
  StarRating,
  Accordion,
  AccordionItem
} from "../ui";
import { Blockquote } from "../ui/blockquote";

// components/docs/mdx-components.tsx
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const mdxComponents = {
  h1: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h1 id={id}>{children}</h1>;
  },
  h2: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h2 id={id}>{children}</h2>;
  },
  h3: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h3 id={id}>{children}</h3>;
  },
  h4: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h4 id={id}>{children}</h4>;
  },
  h5: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h5 id={id}>{children}</h5>;
  },
  h6: ({ children }: { children: string }) => {
    const id = slugify(children);
    return <h6 id={id}>{children}</h6>;
  },
  blockquote: Blockquote,
  Callout,
  Steps,
  Step,
  Card,
  Grid,
  Badge,
  Tabs,
  TabsContent,
  StarRating,
  Accordion,
  AccordionItem
};
