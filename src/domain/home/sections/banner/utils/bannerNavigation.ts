// bannerNavigation.ts

import { BannerData } from "@/domain/home/types/banner.types";

export const getBannerHref = (banner: BannerData): string | null => {
  const action = banner.cta;
  if (!action) return null;

  switch (action.type) {
    case 'internal':
      return action.url ?? null;

    case 'category':
      return action.slug ? `/listing/category/${action.slug}` : null;

    case 'product':
      return action._id ? `/product/${action._id}` : null;

    case 'external':
      return action.url ?? null;

    default:
      return null;
  }
};