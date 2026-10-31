// shared/errors/get-error-display.ts

export function getErrorDisplay(error: {
  status?: number;
}) {
  switch (error.status) {
    case 401:
      return {
        title: "Authentication Required",
        description:
          "Please sign in and try again.",
      };

    case 403:
      return {
        title: "Access Denied",
        description:
          "You don't have permission to access this resource.",
      };

    case 404:
      return {
        title: "Not Found",
        description:
          "The requested resource could not be found.",
      };

    default:
      return {
        title: "Something Went Wrong",
        description:
          "An unexpected error occurred.",
      };
  }
}