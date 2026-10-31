import { UseFormReturn } from "react-hook-form";

import { Category, Images } from "@/types";

import { CommissionModel } from "@/types/seller";

import {
  CreateProductFormSchema,
  CreateProductResponseFormSchema,
} from "../../../schemas";

import { FeeConfig } from "../../hooks/useListingFee";
export interface ProductFormProps {
  categories: Category[];
  imageData: Images;
  handleImagesUpload: (files: File[]) => Promise<void>;
  removeImage: (publicId: string) => void;
  handleSetPrimaryImage: (publicId: string) => void;
  uploadError?: string | null;
  loading?: boolean;
  maxImages: number;
  maxFileSize: number;
  acceptedFormats: string[];
  handleProductSubmit: (
    data: CreateProductFormSchema,
  ) => Promise<CreateProductResponseFormSchema>;
  methods: UseFormReturn<CreateProductFormSchema>;
  error: Error | string | null;
  price?: number;
  listingFee: number;
  sellerEarns: number;
  commissionModel: CommissionModel;
  feeConfig: FeeConfig;
  cleanupAll: () => void;
  selectedCategory: Category;
}


export interface ProductFormStepsProps {
  currentStep: number;
  categories: Category[];
  imageData: Images;
  handleImagesUpload: (files: File[]) => Promise<void>;
  removeImage: (publicId: string) => void;
  handleSetPrimaryImage: (publicId: string) => void;
  uploadError?: string | null;
  loading?: boolean;
  maxImages: number;
  maxFileSize: number;
  acceptedFormats: string[];
  registerStepValidity: (step: number, isValid: boolean) => void;
  selectedCategory: Category;
  commissionModel: CommissionModel;
  feeConfig: FeeConfig;
  sellerEarns: number;
  listingFee: number;
}