export type TaskStatus = "todo" | "inprogress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  status: "todo" | "inprogress" | "done";
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  attachmentUrl?: string; 
}
