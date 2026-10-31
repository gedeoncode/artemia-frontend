import * as React from "react";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio expressed as a number (e.g. 16/9 -> 16/9) or a string like "16/9" */
  ratio?: number | string;
  /** If true, the child will be positioned absolutely to fill the ratio box. Default true. */
  fillChild?: boolean;
}

/**
 * AspectRatio
 * A small, accessible aspect-ratio container similar to the one used in shadcn/ui.
 * Usage:
 *  <AspectRatio ratio="16/9">...content...</AspectRatio>
 *  <AspectRatio ratio={4/3}>...content...</AspectRatio>
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    {
      ratio = "1/1",
      className = "",
      children,
      fillChild = true,
      style,
      ...rest
    },
    ref
  ) => {
    // Accept either a number (e.g. 16/9) or string (e.g. "16/9" or "1/1")
    let numericRatio: number;

    if (typeof ratio === "number") {
      numericRatio = ratio;
    } else if (typeof ratio === "string") {
      const parts = ratio.split("/").map((p) => Number(p.trim()));
      if (
        parts.length === 2 &&
        !Number.isNaN(parts[0]) &&
        !Number.isNaN(parts[1]) &&
        parts[1] !== 0
      ) {
        numericRatio = parts[0] / parts[1];
      } else {
        // fallback for strings like "16:9" or plain number string
        const asNumber = Number(ratio);
        numericRatio = !Number.isNaN(asNumber) && asNumber > 0 ? asNumber : 1;
      }
    } else {
      numericRatio = 1;
    }

    // padding-top percent = (height / width) * 100 = (1 / ratio) * 100
    const paddingTop =
      numericRatio > 0 ? `${(1 / numericRatio) * 100}%` : "100%";

    return (
      <div
        ref={ref}
        className={`relative w-full ${className}`}
        style={{ ...style }}
        {...rest}
      >
        <div aria-hidden="true" style={{ width: "100%", paddingTop }} />
        <div
          className={`absolute inset-0 ${fillChild ? "flex" : ""}`}
          // allow children to expand and be positioned inside the ratio box
        >
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export default AspectRatio;
