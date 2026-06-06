import {
  ParsedIntent,
  IntentType
} from "../types/intent";

import {
  listAllProjects,
  listProjectsByStatus,
  getProjectDetail
} from "./commands/projectReadCommands";

import {
  getSubcontractorDetail
}
from "./commands/subcontractorReadCommands";

import {
  listProjectsBySubcontractor,
  searchProjects,
  advancedProjectSearch
} from "./commands/projectSearchCommands";

import {
  getProjectChecklist
} from "./commands/checklistReadCommands";

import {
  getProjectNotes
} from "./commands/noteReadCommands";

import {
  completeChecklistItem
} from "./commands/checklistCommands";

import {
  createProjectNote
}
from "./commands/noteCommands";

import {
  updateProjectStatus
} from "./commands/projectStatusCommands";

import {
  updateProjectDate
} from "./commands/projectDateCommands";

import {
  assignSubcontractorToProject,
  removeSubcontractorAssignment
}
from "./commands/assignmentCommands";

import {
  createChecklistItem
}
from "./commands/checklistCreateCommands";

import {
  deleteChecklistItem
}
from "./commands/checklistDeleteCommands";

import {
  createProject
}
from "./commands/projectCreateCommands";

import {
  updateProjectDetails
}
from "./commands/projectUpdateCommands";

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

    case IntentType.GREETING:
      return "Hello 👋 Emily Bot online.";

    case IntentType.SUBCONTRACTOR_DETAIL:
        return getSubcontractorDetail(
            intent.subcontractorName || ""
        );
    
    case IntentType.PROJECT_LIST_BY_SUBCONTRACTOR:

        return listProjectsBySubcontractor(
            intent.subcontractorName || ""
        );

    case IntentType.PROJECT_SEARCH:

        return searchProjects(
            intent.searchTerm || ""
        );

    case IntentType.PROJECT_LIST_ADVANCED:

        return advancedProjectSearch(
            intent.filters || {}
        );

    case IntentType.CHECKLIST_CREATE:

      return createChecklistItem(
        intent.projectName || "",
        intent.itemTitle || ""
      );

    case IntentType.CHECKLIST_COMPLETE:

        return completeChecklistItem(
            intent.projectName || "",
            intent.itemTitle || ""
        );

    case IntentType.NOTE_CREATE:

      return createProjectNote(
        intent.projectName || "",
        intent.noteContent || ""
      );

    case IntentType.NOTE_LIST:

      return getProjectNotes(
        intent.projectName || ""
      );

    case IntentType.PROJECT_UPDATE_STATUS:

      return updateProjectStatus(
        intent.projectName || "",
        intent.status || ""
      );

    case IntentType.PROJECT_UPDATE_DATE:

      return updateProjectDate(
        intent.projectName || "",
        intent.updates || {}
      );

      case IntentType.ASSIGNMENT_UPDATE:

        return assignSubcontractorToProject(
          intent.projectName || "",
          intent.subcontractorName || ""
        );

      case IntentType.ASSIGNMENT_DELETE:

        return removeSubcontractorAssignment(
          intent.projectName || "",
          intent.subcontractorName || ""
        );

      case IntentType.CHECKLIST_CREATE:

        return createChecklistItem(
          intent.projectName || "",
          intent.itemTitle || ""
        );

      case IntentType.CHECKLIST_LIST:

        return getProjectChecklist(
          intent.projectName || ""
        );
      
      case IntentType.CHECKLIST_DELETE:

        return deleteChecklistItem(
          intent.projectName || "",
          intent.itemTitle || ""
        );

      case IntentType.PROJECT_CREATE:

        return createProject(
          intent.projectName || ""
        );

      case IntentType.PROJECT_UPDATE_DETAILS:

        return updateProjectDetails(
          intent.projectName || "",
          intent.updates || {}
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