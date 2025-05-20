import { ZodError } from "zod";

export function format_zod_error(
  error: ZodError,
): { field: string; message: string }[] {
  const issues = [];

  for (const issue of error.issues) {
    issues.push(issue);
  }

  return issues.map((issue) => ({
    field: issue.path.join(".") || "unknown",
    message: issue.message,
  }));
}
