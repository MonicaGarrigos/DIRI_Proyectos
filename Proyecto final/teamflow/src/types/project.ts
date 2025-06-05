export interface Project {
  id: string;
  name: string;
  description: string;
  goal?: string;
  members?: Record<string, boolean>;
  archived?: boolean;
  owner?: string;
  createdAt?: number;
}


export interface ProjectToEdit {
  id: string;
  name: string;
  description: string;
  goal?: string;
  members: Record<string, boolean>;
  owner: string;
}
