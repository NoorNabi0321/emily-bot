import { boltedIron } from "../../clients/boltedIronClient";

export async function getProjectChecklist(
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

  const checklist =
    await boltedIron.getChecklist(
      project.id
    );

    console.log(
    "CHECKLIST RAW:",
    JSON.stringify(
        checklist,
        null,
        2
    )
    );

  const items =
    checklist?.json ||
    checklist ||
    [];

  if (!items.length) {

    return `
📋 CHECKLIST

Project:
${project.name}

No checklist items found.
`;

  }

return `
📋 CHECKLIST

Project:
${project.name}

${items
  .slice(0, 50)
  .map(
    (item: any) =>
      `${item.isCompleted ? "✅" : "⬜"} ${
        item.text
      }`
  )
  .join("\n")}
`;

}