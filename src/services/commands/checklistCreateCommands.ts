import { boltedIron }
from "../../clients/boltedIronClient";

export async function createChecklistItem(
  projectName: string,
  title: string
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

  const result =
    await boltedIron
      .createChecklistItem(
        project.id,
        title
      );

  return `
✅ CHECKLIST ITEM CREATED

Project:
${project.name}

Item:
${title}

Checklist ID:
${result?.id || "Created"}
`;

}