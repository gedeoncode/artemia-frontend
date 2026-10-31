import { UIProduct } from "@/types/product";
export type ActionHandler = (helpers: ActionHelpers) => Promise<void> | void;
export interface Action {
  id: string;
  label: string;
  primary?: boolean;
  handler: ActionHandler;
}
export type ActionHelpers = {
  addToCart: (product: UIProduct) => Promise<void> | void;
  buyNow: (product: UIProduct) => Promise<void> | void;

  scheduleViewing: (product: UIProduct) => void;
  contactAgent: (product: UIProduct) => void;

  applyRental?: (product: UIProduct) => void;

  bookService: (product: UIProduct) => void;
  requestQuote: (product: UIProduct) => void;

  bookSpace: (product: UIProduct) => void;
  checkAvailability: (product: UIProduct) => void;

  scheduleTestDrive: (product: UIProduct) => void;
  contactSeller: (product: UIProduct) => void;

  downloadDemo?: (product: UIProduct) => void;
  default?: (product: UIProduct) => void;
};
