import { boltedIron }
from "../../clients/boltedIronClient";

export async function getAdvancedReport(
  intent:any
): Promise<string> {

  let projects =
    await boltedIron.listProjects({});

  projects =
    projects?.json ||
    projects ||
    [];

  if (intent.status) {

    projects =
      projects.filter(
        (p:any) =>
          p.status ===
          intent.status
      );

  }

  if (intent.isUrgent) {

    projects =
      projects.filter(
        (p:any) =>
          p.isUrgent
      );

  }

  if (intent.isArchived) {

    projects =
      projects.filter(
        (p:any) =>
          p.isArchived
      );

  }

  if (intent.subcontractorName) {

    const subcontractor =
      await boltedIron
        .searchSubcontractor(
          intent.subcontractorName
        );

    if (subcontractor) {

      const subProjects =
        await boltedIron
          .getProjectsForSubcontractor(
            subcontractor.id
          );

      const allowedIds =
        (
          subProjects?.json ||
          subProjects ||
          []
        ).map(
          (p:any) => p.id
        );

      projects =
        projects.filter(
          (p:any) =>
            allowedIds.includes(
              p.id
            )
        );

    }

  }

  if (!projects.length) {

    return `
📋 REPORT

No matching projects found.
`;

  }

  const projectList =
    projects
      .slice(0,20)
      .map(
        (p:any) =>
          `• ${p.name}
${p.status}
${p.isUrgent ? "⚡" : ""}`
      )
      .join("\n\n");

  return `
📋 ADVANCED REPORT

Results:
${projects.length}

${projectList}
`;

}