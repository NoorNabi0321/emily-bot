// emily-bot/src/clients/boltedIronClient.ts

import fetch from "node-fetch";

interface TrpcResponse {
  result?: {
    data?: any;
  };
  error?: any;
  [key: string]: any;
}

/**
 * Call tRPC procedure with Bearer token authentication
 */
async function callTrpc(
  procedure: string,
  input: any
): Promise<any> {
  const apiUrl = process.env.BOLTED_IRON_API_URL;
  const bearerToken = process.env.BOLTED_IRON_BEARER_TOKEN;

  if (!apiUrl || !bearerToken) {
    throw new Error(
      "Missing BOLTED_IRON_API_URL or BOLTED_IRON_BEARER_TOKEN"
    );
  }

  console.log(`[BIH] Calling ${procedure}...`);

  const response = await fetch(`${apiUrl}/${procedure}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(input),
  });

  console.log(`[BIH] ${procedure} - Status: ${response.status}`);

  const raw = await response.text();
  console.log(`[BIH] ${procedure} - Response:`, raw.substring(0, 200));

  if (!response.ok) {
    const errorData = JSON.parse(raw);
    const errorMsg = errorData?.error?.json?.message || response.statusText;
    throw new Error(`BIH Error calling ${procedure}: ${response.status} - ${errorMsg}`);
  }

  const data = JSON.parse(raw) as TrpcResponse;

  // tRPC returns { result: { data: ... } }
  if (data.result?.data) {
    return data.result.data;
  }

  return data;
}

export const boltedIron = {
  /**
   * Get all projects
   */
  async getProjects() {
    return callTrpc("projects.list", {});
  },

  /**
   * Get project by ID
   */
  async getProject(projectId: number) {
    return callTrpc("projects.get", { id: projectId });
  },

  /**
   * Get projects by status
   */
  async getProjectsByStatus(status: string) {
    return callTrpc("projects.getByStatus", { status });
  },

  /**
   * Update project status
   */
  async updateProjectStatus(projectId: number, status: string) {
    return callTrpc("projects.updateStatus", {
      id: projectId,
      status,
    });
  },

  /**
   * Assign subcontractor to project
   */
  async assignSubcontractor(
    projectId: number,
    subcontractorId: number,
    role: string
  ) {
    return callTrpc("projects.addAssignment", {
      projectId,
      subcontractorId,
      role,
    });
  },

  /**
   * Remove subcontractor from project
   */
  async removeSubcontractor(assignmentId: number) {
    return callTrpc("projects.deleteAssignment", {
      id: assignmentId,
    });
  },

  /**
   * Get all subcontractors
   */
  async getSubcontractors() {
    return callTrpc("subcontractors.list", {});
  },

  /**
   * Get checklist items for a project
   */
  async getChecklistItems(projectId: number) {
    return callTrpc("checklists.getByProject", { projectId });
  },

  /**
   * Update checklist item status
   */
  async updateChecklistItem(itemId: number, completed: boolean) {
    return callTrpc("checklists.update", {
      id: itemId,
      completed,
    });
  },

  /**
   * Get project notes
   */
  async getProjectNotes(projectId: number) {
    return callTrpc("notes.getByProject", { projectId });
  },

  /**
   * Add note to project
   */
  async addProjectNote(projectId: number, content: string) {
    return callTrpc("notes.create", {
      projectId,
      content,
    });
  },
};