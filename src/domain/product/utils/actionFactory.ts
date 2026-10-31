// /ui/actions/actionFactory.ts

import { Action } from "../types";

export function createActions(helpers: any) {
  return {
    add_to_cart: (): Action => ({
      id: "add_to_cart",
      label: "Add to Cart",
      handler: helpers.addToCart,
    }),

    buy_now: (): Action => ({
      id: "buy_now",
      label: "Buy Now",
      primary: true,
      handler: helpers.buyNow,
    }),

    contact_seller: (): Action => ({
      id: "contact_seller",
      label: "Contact Seller",
      handler: helpers.contactSeller,
    }),

    schedule_viewing: (): Action => ({
      id: "schedule_viewing",
      label: "Schedule Viewing",
      primary: true,
      handler: helpers.scheduleViewing,
    }),

    contact_agent: (): Action => ({
      id: "contact_agent",
      label: "Contact Agent",
      handler: helpers.contactAgent,
    }),

    schedule_test_drive: (): Action => ({
      id: "schedule_test_drive",
      label: "Schedule Test Drive",
      primary: true,
      handler: helpers.scheduleTestDrive,
    }),

    book_service: (): Action => ({
      id: "book_service",
      label: "Book Service",
      primary: true,
      handler: helpers.bookService,
    }),

    request_quote: (): Action => ({
      id: "request_quote",
      label: "Request Quote",
      handler: helpers.requestQuote,
    }),

    book_space: (): Action => ({
      id: "book_space",
      label: "Book Space",
      primary: true,
      handler: helpers.bookSpace,
    }),

    check_availability: (): Action => ({
      id: "check_availability",
      label: "Check Availability",
      handler: helpers.checkAvailability,
    }),

    download_demo: (): Action => ({
      id: "download_demo",
      label: "Download Demo",
      handler: helpers.downloadDemo,
    }),
  };
}