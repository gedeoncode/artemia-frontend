"use client";

import  {CarouselSection}  from "./CarousselSection";
import { ProductCard, ProductRow } from "../productCard";
import { ProductSection, Sections,  } from "@/domain/home/types";
import { EmptyState } from "./EmptyState";
type Props = {
  sections:ProductSection[]
}
export function ProductCarousselContainer({sections}: Props) {


  if (!sections || sections.length === 0) {
    return <EmptyState message="No product sections available" />;
  }

  return (
    <div className="layout-container">
      {sections.map((section: ProductSection) => (
        <CarouselSection
          key={section.title}
          title={section.title}
          link={section.link}
          items={section.products}
          renderItem={(product) => (
            <ProductCard key={product.id} product={product} />
          )}
          renderMobileItem={(product) => (
            <ProductRow key={product.id} product={product} />
          )}
        />
      ))}
    </div>
  );
}
