import { useCallback } from "react";

export function useProductMetadata() {
  const updateMetadata = useCallback((metadata: any) => {
    // Update document title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Update meta tags
    const metaTags = {
      description: metadata.description,
      keywords: metadata.keywords,
      "og:title": metadata.title,
      "og:description": metadata.description,
      "og:image": metadata.imageUrl,
      "og:url": metadata.canonicalUrl,
      "twitter:card": "summary_large_image",
      "twitter:title": metadata.title,
      "twitter:description": metadata.description,
      "twitter:image": metadata.imageUrl
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      if (content) {
        const selector = `meta[name="${name}"], meta[property="${name}"]`;
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement("meta");
          if (name.startsWith("og:")) {
            meta.setAttribute("property", name);
          } else {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", String(content));
      }
    });

    // Update canonical URL
    if (metadata.canonicalUrl) {
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", metadata.canonicalUrl);
    }
  }, []);

  return { updateMetadata };
}
