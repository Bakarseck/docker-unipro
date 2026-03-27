import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import type { User } from "firebase/auth"
import { db, isFirebaseConfigured } from "./firebase"

export interface RegisteredUser {
  uid: string
  email: string
  registeredAt?: { seconds: number; nanoseconds: number }
  lastSeenAt?: { seconds: number; nanoseconds: number }
}

const USERS_COLLECTION = "users"

export async function ensureUserProfile(user: User): Promise<void> {
  if (!isFirebaseConfigured || !db || !user.email) {
    return
  }

  const ref = doc(db, USERS_COLLECTION, user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      registeredAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    })
  } else {
    await updateDoc(ref, {
      email: user.email,
      lastSeenAt: serverTimestamp(),
    })
  }
}

export async function getRegisteredUsers(): Promise<RegisteredUser[]> {
  if (!isFirebaseConfigured || !db) {
    return []
  }

  const snap = await getDocs(collection(db, USERS_COLLECTION))
  return snap.docs.map((d) => {
    const data = d.data() as Omit<RegisteredUser, "uid"> & { uid?: string }
    return {
      uid: d.id,
      email: data.email ?? "",
      registeredAt: data.registeredAt as RegisteredUser["registeredAt"],
      lastSeenAt: data.lastSeenAt as RegisteredUser["lastSeenAt"],
    }
  })
}
