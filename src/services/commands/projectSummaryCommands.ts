import { boltedIron }
from "../../clients/boltedIronClient";

export async function getProjectSummary(
  projectName: string
): Promise<string> {

  const project =
    await boltedIron.searchProject(
      projectName
    );

  if (!project) {

    return `
❌ PROJECT NOT FOUND

Search:
${projectName}
`;

  }

  const [
    projectInfo,
    assignments,
    checklist,
    notes
  ] = await Promise.all([

    boltedIron.getProject(
      project.id
    ),

    boltedIron.getAssignments(
      project.id
    ),

    boltedIron.getChecklist(
      project.id
    ),

    boltedIron.getProjectNotes(
      project.id
    )

  ]);

  console.log(
    "SUMMARY CHECKLIST RAW:",
    JSON.stringify(
        checklist,
        null,
        2
    )
    );

    console.log(
    "SUMMARY NOTES RAW:",
    JSON.stringify(
        notes,
        null,
        2
    )
    );

const checklistItems =
  checklist?.json || [];

const noteItems =
  notes?.json || [];

const totalItems =
  checklistItems.length;

const completedItems =
  checklistItems.filter(
    (item:any) =>
      item.isCompleted
  ).length;

const pendingItems =
    totalItems -
    completedItems;

const assignedSubs =
    assignments
        .map(
        (a: any) =>
            a.subcontractor
            ?.companyName
        )
        .filter(Boolean)
        .join("\n• ");

  const recentNotes =
  noteItems
    .slice(0, 3)
    .map(
      (n:any) =>
        `• ${n.content}`
    )
    .join("\n");

console.log(
  "SUMMARY ASSIGNMENTS RAW:",
  JSON.stringify(
    assignments,
    null,
    2
  )
);

console.log(
  "SUMMARY PROJECT RAW:",
  JSON.stringify(
    projectInfo,
    null,
    2
  )
);

  return `
📋 PROJECT SUMMARY

Project:
${projectInfo.name}

Status:
${projectInfo.status}

Urgent:
${projectInfo.isUrgent ? "Yes" : "No"}

GC:
${projectInfo.gcCompany || "N/A"}

GC Contact:
${projectInfo.gcContactName || "N/A"}

Assigned Team:
${assignedSubs || "None"}

Checklist:
${completedItems}/${totalItems} Completed
${pendingItems} Pending

Recent Notes:
${recentNotes || "None"}
`;

}