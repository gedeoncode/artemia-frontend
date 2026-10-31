'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useImageLoaded } from '@/hooks';

interface ProgressiveImageProps extends ImageProps {
  imageClassName?: string;
}

export function ProgressiveImage({
  imageClassName,
  ...props
}: ProgressiveImageProps) {
  const { isLoaded, handleLoad } = useImageLoaded();

  return (
    <Image
      {...props}
      alt={props.alt}
      className={cn(
        'object-cover transition-all duration-700 ease-out',
        isLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm',
        imageClassName,
        props.className
      )}
      onLoad={handleLoad}
    />
  );
}