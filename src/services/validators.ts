import {
  ParsedIntent,
  IntentType
} from "../types/intent";

import {
  PROJECT_STATUSES
} from "../types/statuses";

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

  switch (intent.intent) {

    case IntentType.PROJECT_UPDATE_STATUS:

      if (!intent.projectName) {

        return {
          valid: false,
          error: "Project name required"
        };

      }

      if (!intent.status) {

        return {
          valid: false,
          error: "Status required"
        };

      }

      break;

    case IntentType.CHECKLIST_COMPLETE:

      if (!intent.projectName) {

        return {
          valid: false,
          error: "Project name required"
        };

      }

      if (!intent.itemTitle) {

        return {
          valid: false,
          error: "Checklist item required"
        };

      }

      break;

    case IntentType.NOTE_CREATE:

      if (!intent.projectName) {

        return {
          valid: false,
          error: "Project name required"
        };

      }

      if (!intent.noteContent) {

        return {
          valid: false,
          error: "Note content required"
        };

      }

      break;

  }

  return {
    valid: true
  };

}