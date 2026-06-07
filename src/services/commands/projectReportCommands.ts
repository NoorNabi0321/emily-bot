import { boltedIron }
from "../../clients/boltedIronClient";

export async function getProjectReport(
  reportType: string
): Promise<string> {

  let projects: any[] = [];

  switch (reportType) {

    case "archived":

      projects =
        await boltedIron.listProjects({
          isArchived: true
        });

      break;

    case "unassigned":

      projects =
        await boltedIron.listProjects({
          isUnassigned: true
        });

      break;

    case "fabrication":

      projects =
        await boltedIron.listProjects({
          status: "Fabrication"
        });

      break;

    case "onsite":

      projects =
        await boltedIron.listProjects({
          status: "On-Site"
        });

      break;

    case "installed":

      projects =
        await boltedIron.listProjects({
          status: "Installed"
        });

      break;

    case "urgent":

      const allProjects =
        await boltedIron.listProjects({});

      projects =
        allProjects.filter(
          (p:any) => p.isUrgent
        );

      break;

    default:

      return `
❌ Unknown report type

${reportType}
`;

  }

  if (!projects.length) {

    return `
📋 REPORT

No projects found.
`;

  }

  const projectList =
    projects
      .slice(0, 25)
      .map(
        (p:any) =>
          `• ${p.name}`
      )
      .join("\n");

  return `
📋 PROJECT REPORT

Type:
${reportType}

Count:
${projects.length}

Projects:

${projectList}
`;

}