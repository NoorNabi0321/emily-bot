import { boltedIron }
from "../../clients/boltedIronClient";

function toUnixMs(
  dateString: string
): number {

  return new Date(
    dateString
  ).getTime();

}

export async function updateProjectDate(
  projectName: string,
  updates: Record<string, unknown>
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

  const payload: Record<
    string,
    unknown
  > = {};

  if (updates.startDate) {

    payload.startDate =
      toUnixMs(
        String(
          updates.startDate
        )
      );

  }

  if (updates.estimatedEndDate) {

    payload.estimatedEndDate =
      toUnixMs(
        String(
          updates.estimatedEndDate
        )
      );

  }

  if (updates.actualEndDate) {

    payload.actualEndDate =
      toUnixMs(
        String(
          updates.actualEndDate
        )
      );

  }

  await boltedIron
    .updateProjectDates(
      project.id,
      payload
    );

  return `
📅 PROJECT DATES UPDATED

Project:
${project.name}
`;

}