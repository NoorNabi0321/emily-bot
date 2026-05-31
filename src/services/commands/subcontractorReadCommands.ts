import { boltedIron }
from "../../clients/boltedIronClient";

export async function getSubcontractorDetail(
  name: string
): Promise<string> {

  const subcontractor =
    await boltedIron.searchSubcontractor(
      name
    );

  if (!subcontractor) {
    return `
❌ SUBCONTRACTOR NOT FOUND

Name:
${name}
`;
  }

  return `
👷 SUBCONTRACTOR

Company:
${subcontractor.companyName || "N/A"}

Contact:
${subcontractor.contactName || "N/A"}

Email:
${subcontractor.email || "N/A"}

Phone:
${subcontractor.phone || "N/A"}
`;
}   