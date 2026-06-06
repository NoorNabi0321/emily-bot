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

    const checklist =
  await boltedIron.getChecklist(
    project.id
  );

const items =
  checklist?.json ||
  checklist ||
  [];

const maxOrder =
  items.length
    ? Math.max(
        ...items.map(
          (x:any)=>
            Number(
              x.order || 0
            )
        )
      )
    : 0;

console.log(
  "[CHECKLIST CREATE]",
  {
    projectId: project.id,
    itemCount: items.length,
    nextOrder: maxOrder + 1
  }
);

const result =
  await boltedIron
    .createChecklistItem(
      project.id,
      title,
      maxOrder + 1
    );

console.log(
  "[CHECKLIST CREATE RESULT]",
  result
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