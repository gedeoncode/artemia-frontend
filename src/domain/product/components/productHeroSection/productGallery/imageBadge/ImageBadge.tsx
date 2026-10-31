// components/ImageBadges/ImageBadges.tsx

'use client';

import { memo, useMemo } from 'react';
import { Tag, Star, Clock, Zap } from 'lucide-react';
import type { ImageBadge } from '../../types/gallery.types';
import styles from './ImageBadges.module.css';

interface ImageBadgesProps {
  badges: ImageBadge[];
  className?: string;
  maxDisplay?: number;
}

const BadgeIcon = memo(({ type }: { type: ImageBadge['type'] }) => {
  switch (type) {
    case 'sale':
      return <Tag size={14} aria-hidden="true" />;
    case 'bestseller':
      return <Star size={14} aria-hidden="true" />;
    case 'new':
      return <Clock size={14} aria-hidden="true" />;
    default:
      return <Zap size={14} aria-hidden="true" />;
  }
});

BadgeIcon.displayName = 'BadgeIcon';

export const ImageBadges = memo<ImageBadgesProps>(function ImageBadges({
  badges,
  className,
  maxDisplay = 3,
}: ImageBadgesProps) {
  // Sort and filter badges by priority
  const sortedBadges = useMemo(() => {
    const priorityOrder = ['sale', 'bestseller', 'new', 'custom'];
    return [...badges]
      .sort((a, b) => {
        const priorityA = priorityOrder.indexOf(a.type);
        const priorityB = priorityOrder.indexOf(b.type);
        return priorityA - priorityB;
      })
      .slice(0, maxDisplay);
  }, [badges, maxDisplay]);

  if (sortedBadges.length === 0) {
    return null;
  }

  return (
    <div 
      className={styles.badgesContainer}
      role="complementary"
      aria-label="Image badges"
    >
      {sortedBadges.map((badge) => (
        <div
          key={badge.id}
          className={styles.badge}
          style={{
            backgroundColor: badge.color || getBadgeColor(badge.type),
          }}
          data-type={badge.type}
        >
          <BadgeIcon type={badge.type} />
          <span className={styles.badgeLabel}>{badge.label}</span>
        </div>
      ))}
    </div>
  );
});

// Helper function for badge colors
function getBadgeColor(type: ImageBadge['type']): string {
  switch (type) {
    case 'sale':
      return '#dc2626'; // Red
    case 'bestseller':
      return '#f59e0b'; // Amber
    case 'new':
      return '#3b82f6'; // Blue
    case 'custom':
      return '#8b5cf6'; // Purple
    default:
      return '#6b7280'; // Gray
  }
}

ImageBadges.displayName = 'ImageBadges';