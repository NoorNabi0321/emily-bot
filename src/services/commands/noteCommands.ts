import { boltedIron }
from "../../clients/boltedIronClient";

export async function createProjectNote(
  projectName: string,
  noteContent: string
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

  await boltedIron.createNote(
    project.id,
    noteContent
  );

  return `
📝 NOTE ADDED

Project:
${project.name}

Note:
${noteContent}
`;

}