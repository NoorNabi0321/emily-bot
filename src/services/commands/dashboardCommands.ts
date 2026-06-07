import { boltedIron }
from "../../clients/boltedIronClient";

export async function getDashboard()
: Promise<string> {

  const [
    activeRaw,
    archivedRaw,
    unassignedRaw,
    subcontractorsRaw
  ] = await Promise.all([

    boltedIron.getActiveProjects(),

    boltedIron.getArchivedProjects(),

    boltedIron.getUnassignedProjects(),

    boltedIron.getSubcontractors()

  ]);

  const activeProjects =
    activeRaw?.json ||
    activeRaw ||
    [];

  const archivedProjects =
    archivedRaw?.json ||
    archivedRaw ||
    [];

  const unassignedProjects =
    unassignedRaw?.json ||
    unassignedRaw ||
    [];

  const subcontractors =
    subcontractorsRaw?.json ||
    subcontractorsRaw ||
    [];

  const statusCounts:any = {

    Review: 0,

    "Shop Drawings": 0,

    Fabrication: 0,

    "On-Site": 0,

    Installed: 0,

    "Inspection Passed": 0

  };

  activeProjects.forEach(
    (project:any) => {

      statusCounts[
        project.status
      ] =
        (
          statusCounts[
            project.status
          ] || 0
        ) + 1;

    }
  );

  const urgentProjects =
    activeProjects.filter(
      (p:any) =>
        p.isUrgent
    ).length;

  const totalProjects =
    activeProjects.length +
    archivedProjects.length;

  return `
📊 BIH DASHBOARD

PROJECTS

Total:
${totalProjects}

Active:
${activeProjects.length}

Archived:
${archivedProjects.length}

STATUS

Review:
${statusCounts["Review"]}

Shop Drawings:
${statusCounts["Shop Drawings"]}

Fabrication:
${statusCounts["Fabrication"]}

On-Site:
${statusCounts["On-Site"]}

Installed:
${statusCounts["Installed"]}

Inspection Passed:
${statusCounts["Inspection Passed"]}

ALERTS

⚡ Urgent:
${urgentProjects}

⚠️ Unassigned:
${unassignedProjects.length}

TEAM

Subcontractors:
${subcontractors.length}
`;

}