"use client";

import SuccessDesktop from "./SuccessDesktop";
import SuccessMobile from "./SuccessMobile";
import SuccessShimmer from "./SuccessShimmer";
import { useBreakpoints } from "@/hooks";

export default function SuccessWrapper() {
  const {isMobile} = useBreakpoints()

  if (isMobile === null || isMobile === undefined) {
    return <SuccessShimmer />;
  }
  return isMobile ? <SuccessMobile /> : <SuccessDesktop />;
}