import dynamic from "next/dynamic";
import { LoadingDots } from '@/components/ui/LoadingSpinner';
export * from "./CategorySpecificFieldsSection"
export const CategoryTreeModalSelect = dynamic(
  () =>
    import("./CategoryTreeSelect").then((mod) => mod.CategoryTreeModalSelect),
  { 
ssr: false, loading: () => <LoadingDots /> }
);

export * from "./CategoryTreeSelect"