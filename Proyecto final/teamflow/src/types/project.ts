export interface Project {
  id: string;
  name: string;
  description: string;
  members: Record<string, boolean>;
  archived: boolean;
  createdAt: number;
}
