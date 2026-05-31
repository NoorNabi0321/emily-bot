import { boltedIron } from "../../clients/boltedIronClient";

import {
  formatProjectList,
  formatProjectDetail
} from "../../formatters/projectFormatter";

export async function listAllProjects(): Promise<string> {
  const projects = await boltedIron.getProjects();

  return formatProjectList(projects);
}

export async function listProjectsByStatus(
  status: string
): Promise<string> {
  const projects =
    await boltedIron.getProjectsByStatus(status);

  return formatProjectList(projects);
}

export async function getProjectDetail(
  projectName: string
): Promise<string> {
  const project =
    await boltedIron.searchProject(projectName);

  if (!project) {
    return `❌ PROJECT NOT FOUND

Search: "${projectName}"`;
  }

  const assignments =
    await boltedIron.getAssignments(project.id);

  return formatProjectDetail(
    project,
    assignments?.json ||
      assignments ||
      []
  );
}