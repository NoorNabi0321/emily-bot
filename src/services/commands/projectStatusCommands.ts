import { boltedIron }
from "../../clients/boltedIronClient";

export async function updateProjectStatus(
  projectName: string,
  status: string
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

  await boltedIron.updateProjectStatus(
    project.id,
    status
  );

  return `
✅ PROJECT STATUS UPDATED

Project:
${project.name}

New Status:
${status}
`;

}