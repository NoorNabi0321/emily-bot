import { boltedIron }
from "../../clients/boltedIronClient";

export async function createProject(
  projectName: string
): Promise<string> {

  try {

    console.log(
      "[PROJECT CREATE]",
      projectName
    );

    const result =
      await boltedIron
        .createProject(
          projectName
        );

    console.log(
      "[PROJECT CREATE RESULT]",
      JSON.stringify(
        result,
        null,
        2
      )
    );

    const projectId =
      result?.json?.id ||
      result?.id ||
      "Created";

    return `
🏗️ PROJECT CREATED

Name:
${projectName}

Project ID:
${projectId}
`;

  } catch (error) {

    console.error(
      "[PROJECT CREATE ERROR]",
      error
    );

    return `
❌ PROJECT CREATION FAILED

Project:
${projectName}
`;

  }

}