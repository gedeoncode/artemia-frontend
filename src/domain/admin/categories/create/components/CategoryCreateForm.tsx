// app/(dashboard)/categories/create/CategoryCreateForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { ProgressNavigator } from "./sidebar/ProgressNavigator";
import { LivePreviewPanel } from "./sidebar/LivePreviewPanel";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { CommerceSettingsSection } from "./sections/CommerceSettingsSection";
import { SEOSection } from "./sections/SEOSection";
import { RulesAndAutomationSection } from "./sections/RulesAndAutomationSection";
import { MediaSection } from "./sections/MediaSection";
import { AdvancedSection } from "./sections/AdvancedSection/AdvancedSection";
import { StickyFooter } from "./components/StickyFooter";
import { StickyHeader } from "./components/StickyHeader";
import { useCreateCategoryMutation } from "../hooks/useCreateCategories";

export function CategoryCreateForm() {
  const router = useRouter();
  const { form, isValid } = useCategoryForm();
  const createCategoryMutation = useCreateCategoryMutation();

  const handleSubmit = form.handleSubmit(async (data) => {
    await createCategoryMutation.mutateAsync(data);
    router.push("/admin/categories");
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FormProvider {...form}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50">
          <StickyHeader title="Create New Category" />

          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Left Navigation */}
              <ProgressNavigator onNavigate={scrollToSection} />

              {/* Main Form */}
              <div className="flex-1 max-w-3xl space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <section id="section-basic" className="scroll-mt-20">
                    <BasicInfoSection />
                  </section>

                  <section id="section-commerce" className="scroll-mt-20">
                    <CommerceSettingsSection />
                  </section>

                  <section id="section-seo" className="scroll-mt-20">
                    <SEOSection />
                  </section>

                  <section id="section-rules" className="scroll-mt-20">
                    <RulesAndAutomationSection />
                  </section>

                  <section id="section-media" className="scroll-mt-20">
                    <MediaSection />
                  </section>

                  <section id="section-advanced" className="scroll-mt-20">
                    <AdvancedSection
                      control={form.control}
                      errors={form.formState.errors}
                    />
                  </section>
                </form>
              </div>

              {/* Right Preview */}
              <LivePreviewPanel />
            </div>
          </div>

          <StickyFooter
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            isSubmitting={createCategoryMutation.isPending}
            isValid={isValid}
          />
        </div>
      </DndProvider>
    </FormProvider>
  );
}
