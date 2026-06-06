import { boltedIron }
from "../../clients/boltedIronClient";

export async function createChecklistItem(
  projectName: string,
  title: string
): Promise<string> {

  console.log(
    "[CHECKLIST CREATE] START",
    {
      projectName,
      title
    }
  );

  const project =
    await boltedIron.searchProject(
      projectName
    );

  console.log(
    "[CHECKLIST CREATE] PROJECT FOUND:",
    project
  );

  if (!project) {

    return `
❌ PROJECT NOT FOUND

Search:
${projectName}
`;

  }

  try {

    console.log(
      "[CHECKLIST CREATE] CALLING API",
      {
        projectId: project.id,
        title
      }
    );

    const result =
      await boltedIron.createChecklistItem(
        project.id,
        title
      );

    console.log(
      "[CHECKLIST CREATE] API RESULT:",
      JSON.stringify(
        result,
        null,
        2
      )
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

  } catch (error) {

    console.error(
      "[CHECKLIST CREATE] ERROR:",
      error
    );

    return `
❌ CHECKLIST CREATION FAILED

Project:
${project.name}

Item:
${title}
`;

  }

}