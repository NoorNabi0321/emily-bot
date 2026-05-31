import { boltedIron }
from "../../clients/boltedIronClient";

export async function completeChecklistItem(
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
        x.text
          ?.toLowerCase()
          .includes(
            itemTitle.toLowerCase()
          )
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
    .markChecklistComplete(
      item.id
    );

  return `
✅ CHECKLIST COMPLETED

Project:
${project.name}

Item:
${item.text}
`;

}