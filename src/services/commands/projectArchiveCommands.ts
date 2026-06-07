import { boltedIron }
from "../../clients/boltedIronClient";

export async function archiveProject(
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

  await boltedIron.updateProject(
    project.id,
    {
      isArchived: true
    }
  );

  return `
📦 PROJECT ARCHIVED

Project:
${project.name}
`;

}

export async function unarchiveProject(
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

  await boltedIron.updateProject(
    project.id,
    {
      isArchived: false
    }
  );

  return `
📂 PROJECT RESTORED

Project:
${project.name}
`;

}