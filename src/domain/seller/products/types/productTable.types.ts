// types.ts
import type { Product } from './product.types';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ProductTableProps {
  products: Product[];
  selectedProductIds: string[];
  sortConfig: SortConfig;
  onSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onEdit: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<boolean>;
  onSort: (field: string) => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
  error?: Error | null;
}