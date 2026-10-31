"use client";

import { useState } from "react";
import {
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsAppIcon,
  EmailIcon,
  LinkIcon,
} from "../ui/SocialIcons";
import { UIProduct } from "../../types";
// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ShareButtonsProps {
  product: UIProduct;
}

export function ShareButtons({ product }: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product?.name} - ${product?.description?.substring(0, 100)}...`;
  const imageUrl = product.images[0];
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Je voulais partager ${product?.name} avec vous`)}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`,
  };
  const trackShareEvent = (platform: string) => {
    // Replace with your analytics implementation
    console.log(`Shared on ${platform}`, {
      productId: product._id,
      productName: product.name,
      url: currentUrl,
    });

    // Example with Google Analytics:
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "share", {
        method: platform,
        content_type: "product",
        item_id: product._id,
      });
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentUrl);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed"; // Prevent scroll to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Update ShareButtons component to include native sharing
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: shareText,
        url: currentUrl,
      });
    } catch (err) {
      console.log("Native sharing not supported or was cancelled", err);
    }
  };

  return (
    <div className="pt-6 mt-6 border-t border-gray-200 animate-fade-in">
      <h3 className="text-sm font-medium text-gray-900">Partager ce produit</h3>
      <div className="flex mt-4 space-x-4">
        <a
          href={shareLinks.facebook}
          onClick={() => trackShareEvent("facebook")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-blue-600"
          aria-label="Share on Facebook"
        >
          <FacebookIcon className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.twitter}
          onClick={() => trackShareEvent("facebook")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-blue-400"
          aria-label="Share on Twitter"
        >
          <TwitterIcon className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.pinterest}
          onClick={() => trackShareEvent("pinterest")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-red-600"
          aria-label="Share on Pinterest"
        >
          <PinterestIcon className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.whatsapp}
          onClick={() => trackShareEvent("whatsapp")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-green-500"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.email}
          onClick={() => trackShareEvent("email")}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Share via Email"
        >
          <EmailIcon className="w-5 h-5" />
        </a>
        <button
          onClick={copyToClipboard}
          className="relative text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Copy link"
        >
          <LinkIcon className="w-5 h-5" />
          {isCopied && (
            <span
              role="status"
              aria-live="polite"
              className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-800 rounded -top-8 left-1/2 whitespace-nowrap animate-pop-up"
            >
              Lien copié&nbsp;!
            </span>
          )}
        </button>

        {typeof navigator !== "undefined" &&
          typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Share using device dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          )}
      </div>
    </div>
  );
}
