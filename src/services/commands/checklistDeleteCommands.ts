import { boltedIron }
from "../../clients/boltedIronClient";

export async function deleteChecklistItem(
  projectName: string,
  itemTitle: string
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

  const checklist =
    await boltedIron.getChecklist(
      project.id
    );

  const items =
    checklist?.json ||
    checklist ||
    [];

  const item =
    items.find(
      (x: any) =>
        (
          x.text ||
          x.title ||
          ""
        )
          .toLowerCase()
          .trim() ===
        itemTitle
          .toLowerCase()
          .trim()
    );

  if (!item) {

    return `
❌ CHECKLIST ITEM NOT FOUND

Project:
${project.name}

Item:
${itemTitle}
`;

  }

  await boltedIron
    .deleteChecklistItem(
      item.id
    );

  return `
🗑️ CHECKLIST ITEM DELETED

Project:
${project.name}

Item:
${itemTitle}
`;

}