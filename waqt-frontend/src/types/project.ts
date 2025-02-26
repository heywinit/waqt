export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  message?: string;
}
