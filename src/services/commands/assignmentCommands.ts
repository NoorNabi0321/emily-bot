import { boltedIron }
from "../../clients/boltedIronClient";

export async function assignSubcontractorToProject(
  projectName: string,
  subcontractorName: string
): Promise<string> {

  const project =
    await boltedIron.searchProject(
      projectName
    );

  if (!project) {

    return `
❌ PROJECT NOT FOUND

${projectName}
`;

  }

  const subcontractor =
    await boltedIron.searchSubcontractor(
      subcontractorName
    );

    console.log(
    "SUBCONTRACTOR FOUND:",
    JSON.stringify(
        subcontractor,
        null,
        2
    )
    );

  if (!subcontractor) {

    return `
❌ SUBCONTRACTOR NOT FOUND

${subcontractorName}
`;

  }

  await boltedIron
    .assignSubcontractor(
      project.id,
      subcontractor.id
    );

  return `
✅ ASSIGNMENT CREATED

Project:
${project.name}

Subcontractor:
${subcontractor.companyName}
`;

}

export async function removeSubcontractorAssignment(
  projectName: string,
  subcontractorName: string
): Promise<string> {

  const project =
    await boltedIron.searchProject(
      projectName
    );

  if (!project) {

    return `
❌ PROJECT NOT FOUND

${projectName}
`;

  }

  const assignments =
    await boltedIron.getAssignments(
      project.id
    );

  const raw =
    assignments?.json ||
    assignments ||
    [];

  const assignment =
    raw.find(
      (a: any) => {

        const sub =
          a.subcontractor;

        return (
          sub?.companyName
            ?.toLowerCase()
            .includes(
              subcontractorName
                .toLowerCase()
            ) ||
          sub?.contactName
            ?.toLowerCase()
            .includes(
              subcontractorName
                .toLowerCase()
            )
        );

      }
    );

  if (!assignment) {

    return `
❌ ASSIGNMENT NOT FOUND
`;

  }

  await boltedIron
    .removeAssignment(
      assignment.id
    );

  return `
✅ ASSIGNMENT REMOVED

Project:
${project.name}

Subcontractor:
${subcontractorName}
`;

}