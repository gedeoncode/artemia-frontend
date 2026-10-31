export const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    (error as any).response !== null &&
    "data" in (error as any).response &&
    typeof (error as any).response.data === "object" &&
    (error as any).response.data !== null &&
    "message" in (error as any).response.data
  ) {
    return (error as any).response.data?.userMessage ?? (error as any).response.data?.message ;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return (error as any).message;
  }
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};
