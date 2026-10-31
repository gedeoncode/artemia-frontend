export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success"
  | "ghost"
  | "link"
  | "black"
  | "neutral"
  | "info"
  | "archive"
  | "destructive"
  | "warning";
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  size?: "sm" | "md" | "lg";

  isPending?: boolean;

  /** Custom loading spinner/icon */
  loadingIcon?: React.ReactNode;

  /** Loading text (defaults to no text, just spinner) */
  loadingText?: string;

  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;

  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;

  /** When true, only displays the icon (requires aria-label) */
  iconOnly?: boolean;

  children?: React.ReactNode;
}
