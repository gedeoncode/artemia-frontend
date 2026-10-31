"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStepperContext } from "@/domain/seller/products/add/context";
import { FormStepper } from "../FormStepper";
import { FormActions } from "../FormActions";
import { ErrorAlert } from "@/components/error/ErrorAlert";
import { SUCCESS_DISPLAY_DURATION, usePublish } from "../../hooks/usePublish";
import { steps } from "../../constants/steps";
import { PageSection } from "@/components/PageSection";
import { ConfettiEffect } from "@/components/ui/ConfettiEffect";
import { ProductFormSteps } from "./ProductFormSteps";
import { useStepValidation } from "./hooks/useStepValidation";
import { useAttributeCleanup } from "./hooks/useAttributeCleanup";
import { ProductFormProps } from "./productFormProps.types";

export function ProductForm(props: ProductFormProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    currentStep,
    next,
    prev,
    jumpTo,
    isLast,
    isFirst,
    stepValidity,
    registerStepValidity,
  } = useStepperContext();

  const { publishedSuccess, redirecting, publish } = usePublish({
    handleProductSubmit: props.handleProductSubmit,
    methods: props.methods,
    router,
    cleanupAll: props.cleanupAll,
  });

  // Cleanup hidden attributes
  useAttributeCleanup({
    selectedCategory: props.selectedCategory,
    methods: props.methods,
  });

  // Validation logic
  const { validateStep } = useStepValidation({
    currentStep,
    methods: props.methods,
    selectedCategory: props.selectedCategory,
    registerStepValidity,
  });

  useEffect(() => {
    if (publishedSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, SUCCESS_DISPLAY_DURATION);

      return () => clearTimeout(timer);
    }
  }, [publishedSuccess, router]);

  const handleStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    if (submitter?.dataset?.ignoreSubmit === "true") return;

    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    if (!isLast) {
      registerStepValidity(currentStep, true);
      next();
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const allStepsValid = await Promise.all([
        validateStep(0),
        validateStep(1),
        validateStep(2),
        validateStep(3),
      ]);

      if (allStepsValid.every(Boolean)) {
        await publish();
      } else {
        const firstInvalidStep = allStepsValid.findIndex((valid) => !valid);
        if (firstInvalidStep !== -1) {
          jumpTo(firstInvalidStep);
          registerStepValidity(firstInvalidStep, false);
        }
      }
    }
  };

  const handleStepClick = useCallback(
    (step: number) => {
      if (step < currentStep || stepValidity[step]) {
        jumpTo(step);
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [currentStep, stepValidity, jumpTo],
  );

  return (
    <>
      {showConfetti && <ConfettiEffect duration={3000} />}

      <PageSection className="relative">
        <header
          
          className="mb-8 text-center sm:text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                id="add-product-form"
                className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
              >
                Ajouter un nouveau produit
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Remplissez les étapes ci-dessous pour créer votre annonce. Les
                champs obligatoires sont marqués d'un{" "}
                <span className="text-red-600 font-semibold">*</span>.
              </p>
            </div>
          </div>
        </header>

        <div className="">
          <FormStepper
            currentStep={currentStep}
            steps={steps}
            onStepClick={handleStepClick}
          />
        </div>

        <AnimatePresence>
          {props.error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ErrorAlert title="Erreur" message={props.error} />
            </motion.div>
          )}
        </AnimatePresence>

        <form
          ref={formRef}
          onSubmit={handleStepSubmit}
          noValidate
          className="bg-white shadow-lg rounded-sm ring-1 ring-slate-200 overflow-hidden"
        >
          <div className="sm:p-8">
         
            
              <ProductFormSteps
                currentStep={currentStep}
                categories={props.categories}
                imageData={props.imageData}
                handleImagesUpload={props.handleImagesUpload}
                removeImage={props.removeImage}
                handleSetPrimaryImage={props.handleSetPrimaryImage}
                uploadError={props.uploadError}
                loading={props.loading}
                maxImages={props.maxImages}
                maxFileSize={props.maxFileSize}
                acceptedFormats={props.acceptedFormats}
                registerStepValidity={registerStepValidity}
                selectedCategory={props.selectedCategory}
                commissionModel={props.commissionModel}
                feeConfig={props.feeConfig}
                sellerEarns={props.sellerEarns}
                listingFee={props.listingFee}
              />
          </div>

          <div className="border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <FormActions
              isFirst={isFirst}
              isLast={isLast}
              next={next}
              prev={prev}
              loading={props.loading}
              canProceed={!!stepValidity[currentStep] || currentStep === 4}
            />
          </div>
        </form>
      </PageSection>
    </>
  );
}
