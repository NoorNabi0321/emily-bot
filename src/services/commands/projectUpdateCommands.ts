import { boltedIron }
from "../../clients/boltedIronClient";

export async function updateProjectDetails(
  projectName: string,
  updates: any
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
    updates
  );

  const fields =
    Object.keys(
      updates
    ).join(", ");

  return `
✅ PROJECT UPDATED

Project:
${project.name}

Updated:
${fields}
`;

}