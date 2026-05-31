import { boltedIron } from "../../clients/boltedIronClient";

export async function getProjectNotes(
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

  const notes =
    await boltedIron.getNotes(
      project.id
    );

  const items =
    notes?.json ||
    notes ||
    [];

  if (!items.length) {

    return `
📝 NOTES

Project:
${project.name}

No notes found.
`;

  }

  return `
📝 NOTES

Project:
${project.name}

${items
  .slice(0, 20)
  .map(
    (note: any) =>
      `• ${
        note.content ||
        note.note ||
        note.text ||
        "Note"
      }`
  )
  .join("\n")}
`;

}