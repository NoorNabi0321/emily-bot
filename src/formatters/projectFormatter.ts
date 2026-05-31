function formatDate(
  date: any
): string {
  if (!date) {
    return "N/A";
  }

  try {
    return new Date(date)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
  } catch {
    return "N/A";
  }
}

export function formatProjectList(
  projects: any[]
): string {
  if (!projects?.length) {
    return "No projects found.";
  }

  return (
    `📋 PROJECTS (${projects.length})\n\n` +
    projects
      .slice(0, 20)
      .map(
        (p, i) =>
          `${i + 1}. ${p.name}\n` +
          `Status: ${p.status || "N/A"}`
      )
      .join("\n\n")
  );
}

export function formatProjectDetail(
  project: any,
  assignments: any[]
): string {
  const team =
    assignments?.length
      ? assignments
          .slice(0, 10)
          .map((a: any) => {
            const sub =
              a.subcontractor;

            return `• ${
              sub?.companyName ||
              sub?.contactName ||
              "Unknown"
            }`;
          })
          .join("\n")
      : "None";

  return `
📍 ${project.name}

Project ID:
${project.id}

Status:
${project.status || "N/A"}

Address:
${project.address || "N/A"}

Start:
${formatDate(
  project.startDate
)}

End:
${formatDate(
  project.endDate
)}

Assigned Team:

${team}
`;
}