// /ui/actions/getActions.ts

import { createActions } from "./actionFactory";
import { Action } from "../types";
import { ProductNature } from "@/types/product";

export function getActions(
  nature: ProductNature | undefined,
  helpers: any,
): Action[] {
  const a = createActions(helpers);

  switch (nature) {
    case "physical":
      return [a.add_to_cart(), a.buy_now()];

    case "vehicle":
      return [a.schedule_test_drive(), a.contact_seller()];

    case "real-estate":
      return [a.schedule_viewing(), a.contact_agent()];

    case "service":
      return [a.book_service(), a.request_quote()];

    case "space":
      return [a.book_space(), a.check_availability()];

    case "digital":
      return [a.download_demo(), a.buy_now()];

    default:
      return [a.contact_seller()];
  }
}
