interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}
export function FilterSection({
  title,
  description,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`space-y-4 pb-6 border-b border-slate-200 last:border-b-0 last:pb-0 ${className}`}
    >
      <h2 className="text-base font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      { description &&
      <p className="text-sm text-gray-700"> {description}</p>
      }
      <div className="space-y-3">{children}</div>
    </section>
  );
}
