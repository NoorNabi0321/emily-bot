import { ParsedIntent } from "../types/intent";
import { PROJECT_STATUSES } from "../types/statuses";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateIntent(
  intent: ParsedIntent
): ValidationResult {
  if (!intent.intent) {
    return {
      valid: false,
      error: "Missing intent"
    };
  }

  if (
    intent.status &&
    !PROJECT_STATUSES.includes(intent.status)
  ) {
    return {
      valid: false,
      error: `Invalid status: ${intent.status}`
    };
  }

  if (
    intent.projectId &&
    intent.projectId <= 0
  ) {
    return {
      valid: false,
      error: "Invalid project ID"
    };
  }

  if (
    intent.subcontractorId &&
    intent.subcontractorId <= 0
  ) {
    return {
      valid: false,
      error: "Invalid subcontractor ID"
    };
  }

  return {
    valid: true
  };
}