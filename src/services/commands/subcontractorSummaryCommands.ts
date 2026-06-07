import { boltedIron }
from "../../clients/boltedIronClient";

export async function getSubcontractorSummary(
  subcontractorName: string
): Promise<string> {

  const subcontractor =
    await boltedIron.searchSubcontractor(
      subcontractorName
    );

  if (!subcontractor) {

    return `
❌ SUBCONTRACTOR NOT FOUND

Search:
${subcontractorName}
`;

  }

  const [
    subcontractorInfo,
    projectsRaw
  ] = await Promise.all([

    boltedIron.getSubcontractor(
      subcontractor.id
    ),

    boltedIron.getProjectsForSubcontractor(
      subcontractor.id
    )

  ]);

  const sub =
    subcontractorInfo?.json ||
    subcontractorInfo;

  const projects =
    projectsRaw?.json ||
    projectsRaw ||
    [];

  const statusCount:any = {};

  projects.forEach(
    (project:any) => {

      statusCount[
        project.status
      ] =
        (
          statusCount[
            project.status
          ] || 0
        ) + 1;

    }
  );

  const urgentCount =
    projects.filter(
      (p:any) =>
        p.isUrgent
    ).length;

  const projectList =
    projects
      .slice(0, 10)
      .map(
        (p:any) =>
          `• ${p.name} (${p.status})${
            p.isUrgent
              ? " ⚡"
              : ""
          }`
      )
      .join("\n");

  const breakdown =
    Object.entries(
      statusCount
    )
      .map(
        ([status,count]) =>
          `${status}: ${count}`
      )
      .join("\n");

  return `
👷 SUBCONTRACTOR SUMMARY

Name:
${sub.companyName}

Contact:
${sub.contactName || "N/A"}

Email:
${sub.email || "N/A"}

Phone:
${sub.phone || "N/A"}

Trade:
${sub.trade || "N/A"}

Assigned Projects:
${projects.length}

Projects:

${projectList || "None"}

Status Breakdown:

${breakdown || "None"}

Urgent Projects:
${urgentCount}
`;

}