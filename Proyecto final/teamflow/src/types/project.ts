export interface Project {
  id: string;
  name: string;
  description: string;
  members: Record<string, boolean>;
  createdAt: number;
}
