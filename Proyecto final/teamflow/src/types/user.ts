export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active?: boolean;
}