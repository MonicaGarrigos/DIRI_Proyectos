export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: "admin" | "member";
  active?: boolean;
}
