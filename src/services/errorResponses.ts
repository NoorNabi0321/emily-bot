export const ErrorResponses = {
  invalidStatus: (status: string) =>
    `❌ INVALID STATUS

Status: "${status}"

Valid statuses are:

• Review
• Shop Drawings
• Fabrication
• On-Site
• Installed
• Inspection Passed`,

  projectNotFound: (project: string) =>
    `❌ PROJECT NOT FOUND

Search: "${project}"`,

  subcontractorNotFound: (name: string) =>
    `❌ SUBCONTRACTOR NOT FOUND

Name: "${name}"`,

  permissionDenied: () =>
    `❌ PERMISSION DENIED`,

  unknownIntent: () =>
    `❌ UNKNOWN COMMAND`
};