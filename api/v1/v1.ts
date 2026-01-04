import { auth, db } from "@/config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export const users = collection(db, 'users');

export async function getUserByEmail(email:string) {
    const q = query(users, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docSnapshot = querySnapshot.docs[0];
    return { id: docSnapshot.id, ...(docSnapshot.data()) };
}

export const logout = () => signOut(auth);

export async function login(email:string, password:string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}
