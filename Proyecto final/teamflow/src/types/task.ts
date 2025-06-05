export type TaskStatus = "todo" | "inprogress" | "done" | string;
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string; 
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; 
  projectId: string;
  createdAt?: number | object; 
}
