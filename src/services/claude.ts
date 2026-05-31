import Anthropic from "@anthropic-ai/sdk";
import { ParsedIntent, IntentType } from "../types/intent";
import { PROJECT_STATUSES } from "../types/statuses";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export interface ClaudeIntentResponse {
  success: boolean;
  intent?: ParsedIntent;
  error?: string;
}

export async function parseIntent(
  message: string
): Promise<ClaudeIntentResponse> {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      temperature: 0,

      system: `
You are Emily Bot.

Your ONLY job is extracting structured intents.

IMPORTANT RULES:

- Return ONLY valid JSON.
- Never explain.
- Never add markdown.
- Never add code blocks.
- Never include text before or after the JSON.

SUPPORTED INTENTS:

project_list_all
project_weekly_schedule
project_list_by_status
project_list_by_date
project_detail

subcontractor_detail

project_list_unassigned
project_list_archived

project_create
subcontractor_create
checklist_create

project_update_status
project_update_date
project_update_details

assignment_update
assignment_delete

checklist_complete
checklist_delete

note_create

project_delete

project_search
project_list_by_subcontractor
project_list_advanced

VALID PROJECT STATUSES:

${PROJECT_STATUSES.join("\n")}

STATUS NORMALIZATION:

If user says:
- completed
- complete
- finished
- done

Use:
"Inspection Passed"

If user says:
- onsite
- on site

Use:
"On-Site"

If user says:
- fabrication

Use:
"Fabrication"

If user says:
- drawings
- shop drawings

Use:
"Shop Drawings"

OUTPUT SCHEMA:

{
  "intent": "",
  "projectId": null,
  "projectName": null,
  "subcontractorId": null,
  "subcontractorName": null,
  "status": null,
  "searchTerm": null,
  "date": null,
  "itemTitle": null,
  "noteContent": null,
  "role": null,
  "filters": null
}

EXAMPLES:

User:
Show all projects

Output:
{
  "intent": "project_list_all"
}

User:
Show fabrication projects

Output:
{
  "intent": "project_list_by_status",
  "status": "Fabrication"
}

User:
Tell me about Eastburn

Output:
{
  "intent": "project_detail",
  "projectName": "Eastburn"
}

User:
Show Carlos projects

Output:
{
  "intent": "project_list_by_subcontractor",
  "subcontractorName": "Carlos"
}

User:
Delete project 1680001

Output:
{
  "intent": "project_delete",
  "projectId": 1680001
}

User:
Show Mendy projects

Output:
{
  "intent":"project_list_by_subcontractor",
  "subcontractorName":"Mendy"
}

User:
Search Ross

Output:
{
  "intent":"project_search",
  "searchTerm":"Ross"
}

User:
Find Franklin projects

Output:
{
  "intent":"project_search",
  "searchTerm":"Franklin"
}

User:
Show fabrication projects assigned to Victor

Output:
{
  "intent":"project_list_advanced",
  "filters":{
    "status":"Fabrication",
    "subcontractorName":"Victor"
  }
}
`
,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const result = response.content[0];

    if (result.type !== "text") {
      return {
        success: false,
        error: "Claude returned non-text response"
      };
    }

    const text = result.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Claude Raw:", text);

    const parsed = JSON.parse(text);

    const intent: ParsedIntent = {
      intent: parsed.intent as IntentType,

      projectId: parsed.projectId ?? undefined,
      projectName: parsed.projectName ?? undefined,

      subcontractorId: parsed.subcontractorId ?? undefined,
      subcontractorName: parsed.subcontractorName ?? undefined,

      status: parsed.status ?? undefined,

      searchTerm: parsed.searchTerm ?? undefined,

      date: parsed.date ?? undefined,

      itemTitle: parsed.itemTitle ?? undefined,

      noteContent: parsed.noteContent ?? undefined,

      role: parsed.role ?? undefined,

      updates: parsed.updates ?? undefined,

      filters: parsed.filters ?? undefined,

      confirmDelete: parsed.confirmDelete ?? false,

      rawMessage: message
    };

    return {
      success: true,
      intent
    };
  } catch (error) {
    console.error("Claude Error:", error);

    return {
      success: false,
      error: "Failed to parse intent"
    };
  }
}