"use client"
import { useRouter } from 'next/navigation';
import { BannerData } from '../types';

export const useBannerRedirect = () => {
  const router = useRouter();

  const handleRedirect = (banner: BannerData) => {
    const action = banner.action;

    if (!action) return;

    switch (action.type) {
      case 'internal':
        if (action.url) {
          router.push(action.url);
        }
        break;

      case 'category':
        if (action.slug) {
          router.push(`/category/${action.slug}`);
        }
        break;

      case 'product':
        if (action.id) {
          router.push(`/product/${action.id}`);
        }
        break;

      case 'external':
        if (action.url) {
          window.open(
            action.url,
            action.openInNewTab ? '_blank' : '_self',
            'noopener,noreferrer'
          );
        }
        break;

      case 'custom':
        console.warn('Custom action not implemented', action);
        break;

      default:
        console.warn('Unknown banner action type:', action);
    }
  };

  return { handleRedirect };
};