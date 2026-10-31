"use client";
import { ErrorView } from "@/components/error/ErrorView";

export function normalizeError(error: Error) {
  return {
    title: "Impossible de charger la page du panier.",
    description:
      error.message ||
      "Une erreur inattendue s'est produite lors du chargement de la page du panier.",
    canRetry: true,
  };
}
export default function ProductError({ error, reset }: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
    const normalize = normalizeError(error)
  return <ErrorView title={normalize.title} description={normalize.description} retry={reset} />;
}
