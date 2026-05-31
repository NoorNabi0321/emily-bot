import {
  ParsedIntent,
  IntentType
} from "../types/intent";

import {
  listAllProjects,
  listProjectsByStatus,
  getProjectDetail
} from "./commands/projectReadCommands";

export async function executeIntent(
  intent: ParsedIntent,
  user?: any
): Promise<string> {
  switch (intent.intent) {
    case IntentType.PROJECT_LIST_ALL:
      return listAllProjects();

    case IntentType.PROJECT_LIST_BY_STATUS:
      return listProjectsByStatus(
        intent.status || ""
      );

    case IntentType.PROJECT_DETAIL:
      return getProjectDetail(
        intent.projectName || ""
      );

    default:
      return `
⚠️ Command recognized.

Handler not implemented yet.

Intent:
${intent.intent}
`;
  }
}