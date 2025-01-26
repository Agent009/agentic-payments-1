import { toast } from "sonner";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error: unknown): void {
  if (error instanceof AppError) {
    if (error.isOperational) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("Non-operational error:", error);
    }
  } else {
    toast.error("An unexpected error occurred. Please try again later.");
    console.error("Unexpected error:", error);
  }
}
