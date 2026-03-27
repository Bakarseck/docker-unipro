import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"

export interface LeaderboardEntry {
  id: string
  userEmail: string
  userId?: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  createdAt?: { seconds: number; nanoseconds: number }
}

interface SaveScoreInput {
  userEmail: string
  userId?: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
}

const LEADERBOARD_COLLECTION = "leaderboard"

export async function saveScore(input: SaveScoreInput) {
  if (!isFirebaseConfigured || !db) {
    return
  }

  const percentage = Math.round((input.score / input.totalQuestions) * 100)

  await addDoc(collection(db, LEADERBOARD_COLLECTION), {
    ...input,
    percentage,
    createdAt: serverTimestamp(),
  })
}

export async function getAllScores(): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured || !db) {
    return []
  }

  const snap = await getDocs(collection(db, LEADERBOARD_COLLECTION))
  const entries = snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<LeaderboardEntry, "id">),
  }))

  return entries.sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0
    const tb = b.createdAt?.seconds ?? 0
    return tb - ta
  })
}

export async function getTopScores(max = 10): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured || !db) {
    return []
  }

  const q = query(
    collection(db, LEADERBOARD_COLLECTION),
    orderBy("percentage", "desc"),
    limit(max)
  )

  const snap = await getDocs(q)

  return snap.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<LeaderboardEntry, "id">),
    }))
    .sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage
      if (b.score !== a.score) return b.score - a.score
      return (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
    })
}
