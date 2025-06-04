import { ref, set } from "firebase/database";
import { db } from "../firebase/firebase";
import type { User } from "firebase/auth";

interface ExtraData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export const saveUserToDatabase = async (
  firebaseUser: User,
  { firstName, lastName, phone }: ExtraData
) => {
  const uid = firebaseUser.uid;

  const userRef = ref(db, `users/${uid}`);
  await set(userRef, {
    uid,
    email: firebaseUser.email,
    firstName,
    lastName,
    phone: phone || "",
    displayName: `${firstName} ${lastName}`,
    role: "member",
  });
};
