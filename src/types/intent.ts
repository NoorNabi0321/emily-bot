import { ProjectStatus } from "./statuses";

export enum IntentType {
  PROJECT_LIST_ALL = "project_list_all",

  PROJECT_WEEKLY_SCHEDULE = "project_weekly_schedule",

  PROJECT_LIST_BY_STATUS = "project_list_by_status",

  PROJECT_LIST_BY_DATE = "project_list_by_date",

  PROJECT_DETAIL = "project_detail",

  SUBCONTRACTOR_DETAIL = "subcontractor_detail",

  PROJECT_LIST_UNASSIGNED = "project_list_unassigned",

  PROJECT_LIST_ARCHIVED = "project_list_archived",

  PROJECT_CREATE = "project_create",

  SUBCONTRACTOR_CREATE = "subcontractor_create",

  CHECKLIST_CREATE = "checklist_create",

  CHECKLIST_LIST = "checklist_list",

  PROJECT_UPDATE_STATUS = "project_update_status",

  PROJECT_UPDATE_DATE = "project_update_date",

  PROJECT_UPDATE_DETAILS = "project_update_details",

  ASSIGNMENT_UPDATE = "assignment_update",

  CHECKLIST_COMPLETE = "checklist_complete",

  PROJECT_SUMMARY = "project_summary",

  NOTE_CREATE = "note_create",

  PROJECT_DELETE = "project_delete",

  ASSIGNMENT_DELETE = "assignment_delete",

  CHECKLIST_DELETE = "checklist_delete",

  PROJECT_SEARCH = "project_search",

  PROJECT_LIST_BY_SUBCONTRACTOR =
    "project_list_by_subcontractor",

  PROJECT_LIST_ADVANCED =
    "project_list_advanced",
  
    GREETING = "greeting",

    NOTE_LIST = "note_list",

  PROJECT_ARCHIVE = "project_archive",

  PROJECT_UNARCHIVE = "project_unarchive", 

  PROJECT_REPORT = "project_report",

  SUBCONTRACTOR_SUMMARY = "subcontractor_summary",

  DASHBOARD = "dashboard",

}

export interface ParsedIntent {
  intent: IntentType;

  projectId?: number;
  projectName?: string;

  subcontractorId?: number;
  subcontractorName?: string;

  status?: ProjectStatus;

  searchTerm?: string;

  date?: string;

  itemTitle?: string;

  noteContent?: string;

  role?: string;

  updates?: Record<string, unknown>;

  filters?: Record<string, unknown>;

  confirmDelete?: boolean;

  reportType?: string;

  rawMessage: string;

  isUrgent?: boolean;

  isArchived?: boolean;

  isUnassigned?: boolean;
}