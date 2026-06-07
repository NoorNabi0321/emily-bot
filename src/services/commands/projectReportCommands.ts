import { boltedIron }
from "../../clients/boltedIronClient";

export async function getProjectReport(
  reportType: string
): Promise<string> {

  let projects: any[] = [];

  async function normalize(
    promise:any
    ) {

    const result =
        await promise;

    console.log(
        "REPORT NORMALIZE RAW:",
        JSON.stringify(
        result,
        null,
        2
        )
    );

    if (Array.isArray(result)) {
        return result;
    }

    if (
        result &&
        Array.isArray(result.json)
    ) {
        return result.json;
    }

    return [];

    }

  switch (reportType) {

    case "archived":

      projects =
        await normalize(
            boltedIron.listProjects({
            status: "Fabrication"
            })
        );

      break;

    case "unassigned":

      projects =
        await normalize(
            boltedIron.listProjects({
            status: "Fabrication"
            })
        );

      break;

    case "fabrication":

      projects =
        await normalize(
            boltedIron.listProjects({
            status: "Fabrication"
            })
        );

      break;

    case "onsite":

      projects =
        await normalize(
            boltedIron.listProjects({
            status: "Fabrication"
            })
        );

      break;

    case "installed":

      projects =
        await normalize(
            boltedIron.listProjects({
            status: "Fabrication"
            })
        );

      break;

    case "urgent":

      const allProjects =
        await normalize(
            boltedIron.listProjects({})
        );

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