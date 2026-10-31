// File: components/ProductFormContent.tsx
import React, { Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { useStepperContext } from "@/domain/seller/products/add/context";
import { FormStepper } from "./FormStepper";
import { FormActions } from "./FormActions";
import { ErrorAlert } from "@/components/error/ErrorAlert";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { usePublish } from "../hooks/usePublish";
import type { ProductFormData } from "../../types";

import {
  BasicInfoSection,
  MediaSection,
  PricingInventorySection,
  // ShippingSection,
  ReviewSection,
} from "./productForm/productFormContent";
import { steps } from "../constants/steps";
import { ProductCategory } from "../../types/product.types";
import { FeeConfig } from "../hooks/useListingFee";
import { PageSection } from "@/components/PageSection";
import { CommissionModel } from "@/types/seller";
import { UseFormReturn } from "react-hook-form";

interface Props {
  categories: ProductCategory[];
  imageData: ImageData[];
  handleImagesUpload: (files: File[]) => Promise<void>;
  removeImage: (publicId: string) => void;
  handleSetPrimaryImage: (publicId: string) => void;
  uploadError?: string | null;
  loading?: boolean;
  maxImages: number;
  maxFileSize: number;
  acceptedFormats?: string[];
  handleProductSubmit: (data: ProductFormData) => Promise<ProductFormData>;
  methods: UseFormReturn<ProductFormData>;
  error?: string | null;
  price?: number;
  listingFee: number;
  sellerEarns: number;
  commissionModel: CommissionModel;
  feeConfig: FeeConfig;
  cleanupAll: () => void;
}

export function ProductForm(props: Props) {
  const router = useRouter();
  const {
    currentStep,
    next,
    prev,
    jumpTo,
    isLast,
    isFirst,
    isStepValid,
    stepValidity,
    registerStepValidity,
  } = useStepperContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    publishing,
    publishedSuccess,
    redirecting,
    publish,
    submitError,
    // setSubmitError,
  } = usePublish({
    handleProductSubmit: props.handleProductSubmit,
    methods: props.methods,
    router,
    cleanupAll: props.cleanupAll,
  });

  const className = "space-y-4 sm:space-y-6";

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoSection
            categories={props.categories}
            isEdit={false}
            registerStepValidity={registerStepValidity}
            className={className}
            stepIndex={0}
          />
        );

      case 1:
        return (
          <MediaSection
            images={props.imageData}
            onImagesUpload={props.handleImagesUpload}
            onImageRemove={props.removeImage}
            onSetPrimaryImage={props.handleSetPrimaryImage}
            uploadError={props.uploadError}
            loading={props.loading}
            maxImages={props.maxImages}
            maxFileSize={props.maxFileSize}
            acceptedFormats={props.acceptedFormats}
            registerStepValidity={registerStepValidity}
            className={className}
            stepIndex={1}
          />
        );

      case 2:
        return (
          <PricingInventorySection
            price={props.price}
            listingFee={props.listingFee}
            sellerEarns={props.sellerEarns}
            commissionModel={props.commissionModel}
            feeConfig={props.feeConfig}
            minPrice={props.feeConfig.min}
            maxPrice={props.feeConfig.max}
            commissionRate={props.feeConfig.rate}
            registerStepValidity={registerStepValidity}
            className={className}
            stepIndex={2}
          />
        );

      // case 3:
      //   return (
      //     <ShippingSection
      //       registerStepValidity={registerStepValidity}
      //       stepIndex={3}
      //       className={className}
      //     />
      //   );

      case 3:
        return (
          <ReviewSection
            categories={props.categories}
            registerStepValidity={registerStepValidity}
            className={className}
            stepIndex={3}
            commissionModel={props.commissionModel}
            commissionRate={props.feeConfig.rate}
            sellerEarns={props.sellerEarns}
            listingFee={props.listingFee}
            images={props.imageData}
          />
        );

      default:
        return <p className="text-sm text-gray-500">Étape invalide.</p>;
    }
  }, [currentStep, props, registerStepValidity]);

  const handleStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    if (submitter?.dataset?.ignoreSubmit === "true") return;

    const stepFieldsMap: Record<number, string[]> = {
      0: ["title", "category", "description"],
      1: [],
      2: ["price", "quantity"],
      3: [],
    };

    const fieldsToValidate = stepFieldsMap[currentStep] ?? [];
    if (fieldsToValidate.length > 0) {
      const valid = await props.methods.trigger(fieldsToValidate);
      registerStepValidity(currentStep, !!valid);
      if (!valid) return;
    }

    if (!isLast) {
      if (isStepValid(currentStep) || fieldsToValidate.length > 0) next();
      else next();
    } else {
      setShowConfirmModal(true);
    }
  };

  if (redirecting) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[300px] px-4 py-8 text-gray-600 sm:px-6 sm:py-12 sm:min-h-[400px]"
        role="status"
        aria-live="polite"
      >
        {publishedSuccess ? (
          <>
            <FiCheckCircle
              className="w-12 h-12 mb-3 text-green-500 sm:w-14 sm:h-14"
              aria-hidden
            />
            <p className="mb-1 text-base font-semibold text-center sm:text-lg">
              « {publishedSuccess.title} » a été publié avec succès
            </p>
            <p className="text-xs text-center text-gray-500 sm:text-sm">
              {props.commissionModel === "PAP"
                ? "Redirection vers le paiement…"
                : "Finalisation de votre annonce…"}
            </p>
          </>
        ) : (
          <>
            <FiLoader
              className="w-8 h-8 mb-2 animate-spin sm:w-10 sm:h-10"
              aria-hidden
            />
            <p className="mb-2 text-base font-medium text-center sm:text-lg">
              Redirection en cours…
            </p>
            <p className="text-xs text-center text-gray-500 sm:text-sm">
              Finalisation de la mise en ligne…
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <PageSection>
      <header className="mb-6 text-center sm:text-left">
        <h1
          id="add-product-form"
          className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
        >
          Ajouter un nouveau produit
        </h1>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          Remplissez les étapes ci-dessous pour créer votre annonce. Les champs
          obligatoires sont marqués d’un <span className="text-red-600">*</span>
          .
        </p>
      </header>

      <div className="sticky z-10 top-0 sm:top-4 bg-white/0 -mx-4 px-4 sm:mx-0 sm:px-0">
        <FormStepper
          currentStep={currentStep}
          steps={steps}
          onStepClick={(step: number) => {
            if (step < currentStep || isStepValid(step)) jumpTo(step);
          }}
        />
      </div>

      {(props.error || submitError) && (
        <ErrorAlert title="Erreur" message={props.error ?? submitError ?? ""} />
      )}

      <form
        onSubmit={handleStepSubmit}
        noValidate
        className="p-4 bg-white shadow-sm rounded-xl ring-1 ring-gray-100 sm:p-6"
      >
        <Suspense
          fallback={
            <p className="text-sm text-gray-500 sm:text-base">
              Chargement de la section…
            </p>
          }
        >
          {renderStep}
        </Suspense>

        <FormActions
          isFirst={isFirst}
          isLast={isLast}
          next={next}
          prev={prev}
          loading={props.loading || publishing}
          canProceed={!!stepValidity[currentStep]}
        />
      </form>

      <ConfirmationDialog
        isOpen={showConfirmModal}
        title="Confirmer la publication"
        message={
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Vous êtes sur le point de publier ce produit. Vérifiez les frais
              et les détails avant de confirmer.
            </p>

            {props.commissionModel === "PAP" ? (
              <div className="p-3 border-l-4 border-blue-300 rounded bg-blue-50">
                <div className="text-sm font-medium text-blue-800">
                  Paiement à la publication
                </div>
                <div className="text-xs text-blue-700">
                  Vous serez redirigé vers la page de paiement pour régler les
                  frais de mise en ligne.
                </div>
              </div>
            ) : (
              <div className="p-3 border-l-4 border-green-300 rounded bg-green-50">
                <div className="text-sm font-medium text-green-800">
                  Publication immédiate
                </div>
                <div className="text-xs text-green-700">
                  Le produit sera publié immédiatement après confirmation.
                </div>
              </div>
            )}

            <div className="p-3 mt-2 bg-white border rounded">
              <div className="flex flex-col gap-2 sm:gap-1">
                <div className="flex justify-between text-sm">
                  <span>Frais de mise en ligne</span>
                  <span className="font-medium">
                    {props.listingFee
                      ? `Ksh ${props.listingFee.toFixed(2)}`
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Gain estimé du vendeur</span>
                  <span className="font-medium">
                    {props.sellerEarns
                      ? `Ksh ${props.sellerEarns.toFixed(2)}`
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Taux de commission</span>
                  <span>{props.feeConfig?.rate ?? "-"}%</span>
                </div>
              </div>
            </div>
          </div>
        }
        confirmLabel={
          props.commissionModel === "PAP"
            ? "Procéder au paiement"
            : "Publier maintenant"
        }
        cancelLabel="Annuler"
        onConfirm={async () => {
          setShowConfirmModal(false);
          const ok = await publish();
          if (!ok) setShowConfirmModal(true);
        }}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={publishing}
        disableConfirm={publishing}
        variant="primary"
      />
    </PageSection>
  );
}
