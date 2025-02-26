import { Project, ProjectsResponse } from "@/types/project";
import { get } from "./httpHelper";

export async function getUserProjects(): Promise<Project[]> {
  try {
    return [
      {
        id: 1,
        name: "Project 1",
        description: "Description 1",
        color: "#ff0000",
        taskCount: 10,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
      },
      {
        id: 1,
        name: "Project 1",
        description: "Description 1",
        color: "#00ff00",
        taskCount: 10,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
      },
      {
        id: 1,
        name: "Project 1",
        description: "Description 1",
        color: "#ffff00",
        taskCount: 10,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
      },
    ];
    const response = await get<ProjectsResponse>("/api/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
}
