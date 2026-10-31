// /errors/types.ts

export interface ErrorPresentation {
  title: string;
  description: string;
  actionLabel?: string;
  canRetry: boolean;
}