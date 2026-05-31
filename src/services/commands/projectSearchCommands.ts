import { boltedIron } from "../../clients/boltedIronClient";
import { formatProjectList } from "../../formatters/projectFormatter";

export async function listProjectsBySubcontractor(
  subcontractorName: string
): Promise<string> {

  const projects =
    await boltedIron.getProjects({
      subcontractor: subcontractorName
    });

  if (!projects.length) {
    return `
❌ NO PROJECTS FOUND

Subcontractor:
${subcontractorName}
`;
  }

  return formatProjectList(projects);
}

export async function searchProjects(
  searchTerm: string
): Promise<string> {

  const projects =
    await boltedIron.getProjects({
      projectName: searchTerm
    });

  if (!projects.length) {
    return `
❌ PROJECT NOT FOUND

Search:
${searchTerm}
`;
  }

  return formatProjectList(projects);
}

export async function advancedProjectSearch(
  filters: any
): Promise<string> {

  const projects =
    await boltedIron.getProjects({
      status: filters?.status,
      subcontractor:
        filters?.subcontractorName,
      date: filters?.date,
      projectName:
        filters?.projectName
    });

  if (!projects.length) {
    return `
❌ NO PROJECTS FOUND

Filters Applied:
${JSON.stringify(filters, null, 2)}
`;
  }

  return formatProjectList(projects);
}