import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
  /**
   * Controls overall size of the logo
   */
  size?: "sm" | "md" | "lg";

  /**
   * Hide or show the text "Artemia"
   */
  withText?: boolean;

  /**
   * Disable link wrapping (useful in footers or static contexts)
   */
  asLink?: boolean;

  className?: string;
};

const sizeConfig = {
  sm: {
    image: 35,
    text: "text-sm",
    margin: "-ml-1.5"
  },
  md: {
    image: 50,
    text: "text-base",
    margin: "-ml-0.5"
},
lg: {
    image: 65,
    text: "text-lg",
    gap: "gap-3",
    margin: "-ml-3.5"
  },
};

export function Logo({
  size = "md",
  withText = true,
  asLink = true,
  className,
}: LogoProps) {
  const { image, text, margin } = sizeConfig[size];

  const content = (
    <div
      className={clsx(
        "flex items-center font-semibold tracking-tight text-gray-900 dark:text-white",
        className
      )}
    >
      <Image
        src="/logo-artemia.png"
        alt="Artemia"
        width={image}
        height={image}
        priority
        className="transition-transform duration-200 ease-out group-hover:scale-105"
      />

      {withText && (
        <span
          className={clsx(
            text,
            margin,
            "transition-colors duration-200 group-hover:text-blue-600"
          )}
        >
          Artemia
        </span>
      )}
    </div>
  );

  if (!asLink) {
    return content;
  }

  return (
    <Link
      href="/"
      aria-label="Go to Artemia homepage"
      className="inline-flex rounded-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
{}