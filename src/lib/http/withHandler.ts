import { classify } from "@/errors";
import { NextRequest, NextResponse } from "next/server";

type HandlerContext<TParams = Record<string, string>> = {
  params: Promise<TParams>;
};
export function withHandler<TResponse, TParams = Record<string, string>>(
  handler: (
    req: NextRequest,
    context: HandlerContext<TParams>
  ) => Promise<TResponse>
) {
  return async (
    req: NextRequest,
    context: HandlerContext<TParams>
  ) => {
    try {
      const data = await handler(req, context);
      const status = (data as any)?.statusCode ?? 200;

      return NextResponse.json(data, { status });
    } catch (error) {
      const err = classify(error);

      return NextResponse.json(
        {
          code: err.code ?? "UNKNOWN_ERROR",
          message: err.message ?? "Internal server error",
        },
        { status: err.statusCode ?? 500 }
      );
    }
  };
}