"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BasicInfoSection,
  MediaSection,
  ReviewSection,
} from "./productFormContent";
import { PricingLocationSection } from "./productFormContent/PricingLocationSection";
import { DetailsSection } from "./productFormContent/detailsSection/DetailsSection";
import { stepVariants } from "./constants/annimation";
import { ProductFormStepsProps } from "./productFormProps.types";

export function ProductFormSteps(props: ProductFormStepsProps) {
  const className = "space-y-6 sm:space-y-8";

  const renderStep = () => {
    switch (props.currentStep) {
      case 0:
        return (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <BasicInfoSection
              categories={props.categories}
              isEdit={false}
              registerStepValidity={props.registerStepValidity}
              className={className}
              stepIndex={0}
            />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
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
              registerStepValidity={props.registerStepValidity}
              className={className}
              stepIndex={1}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DetailsSection
              selectedCategory={props.selectedCategory}
              className={className}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <PricingLocationSection
              registerStepValidity={props.registerStepValidity}
              className={className}
              stepIndex={2}
              selectedCategory={props.selectedCategory}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ReviewSection
              categories={props.categories}
              className={className}
              commissionModel={props.commissionModel}
              commissionRate={props.feeConfig.rate}
              sellerEarns={props.sellerEarns}
              listingFee={props.listingFee}
              images={props.imageData}
            />
          </motion.div>
        );

      default:
        return <p className="text-sm text-gray-500">Étape invalide.</p>;
    }
  };

  return <>{renderStep()}</>;
}
