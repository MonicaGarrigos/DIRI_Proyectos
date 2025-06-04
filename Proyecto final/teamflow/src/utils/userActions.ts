import { ref, update } from "firebase/database";
import { db } from "../firebase/firebase";

export const updateUserRole = async (uid: string, newRole: string) => {
  const userRef = ref(db, `users/${uid}`);
  await update(userRef, { role: newRole });
};

export const toggleUserActive = async (uid: string, currentStatus: boolean) => {
  const userRef = ref(db, `users/${uid}`);
  await update(userRef, { active: !currentStatus });
};
