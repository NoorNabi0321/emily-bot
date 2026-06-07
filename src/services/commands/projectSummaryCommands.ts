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
    "SUMMARY PROJECT RAW:",
    JSON.stringify(
      projectInfo,
      null,
      2
    )
  );

  console.log(
    "SUMMARY ASSIGNMENTS RAW:",
    JSON.stringify(
      assignments,
      null,
      2
    )
  );

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

  const projectData =
    projectInfo?.json ||
    projectInfo ||
    {};

  const assignmentItems =
    assignments?.json ||
    assignments ||
    [];

  const checklistItems =
    checklist?.json ||
    checklist ||
    [];

  const noteItems =
    notes?.json ||
    notes ||
    [];

  const totalItems =
    checklistItems.length;

  const completedItems =
    checklistItems.filter(
      (item: any) =>
        item.isCompleted
    ).length;

  const pendingItems =
    totalItems -
    completedItems;

  const assignedSubs =
    assignmentItems
        .map(
        (a:any) =>
            `• ${a.subcontractor?.companyName}`
        )
        .filter(Boolean)
        .join("\n");

  const recentNotes =
    noteItems
      .slice(0, 3)
      .map(
        (n: any) =>
          `• ${n.content}`
      )
      .join("\n");

  return `
📋 PROJECT SUMMARY

Project:
${projectData.name || project.name}

Status:
${projectData.status || "N/A"}

Urgent:
${projectData.isUrgent ? "Yes" : "No"}

GC:
${projectData.gcCompany || "N/A"}

GC Contact:
${projectData.gcContactName || "N/A"}

GC Phone:
${projectData.gcContactPhone || "N/A"}

GC Email:
${projectData.gcContactEmail || "N/A"}

Assigned Team:
${assignedSubs || "None"}

Checklist:
${completedItems}/${totalItems} Completed
${pendingItems} Pending

Recent Notes:
${recentNotes || "None"}
`;

}