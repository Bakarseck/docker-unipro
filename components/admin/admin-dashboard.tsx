"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAllScores, type LeaderboardEntry } from "@/lib/leaderboard"
import { getRegisteredUsers, type RegisteredUser } from "@/lib/users"
import { RefreshCw, Users } from "lucide-react"

function formatFirestoreDate(value: unknown): string {
  if (!value) return "—"
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    })
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    const s = (value as { seconds: number }).seconds
    return new Date(s * 1000).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    })
  }
  return "—"
}

function scoreSortKey(entry: LeaderboardEntry): number {
  const c = entry.createdAt as { seconds?: number } | undefined
  return c?.seconds ?? 0
}

function scoresForUser(user: RegisteredUser, all: LeaderboardEntry[]): LeaderboardEntry[] {
  const email = user.email.toLowerCase()
  return all
    .filter(
      (s) =>
        s.userId === user.uid || s.userEmail.toLowerCase() === email
    )
    .sort((a, b) => scoreSortKey(b) - scoreSortKey(a))
}

export function AdminDashboard() {
  const { user: firebaseUser, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [u, s] = await Promise.all([getRegisteredUsers(), getAllScores()])
      setUsers(
        u.sort((a, b) => {
          const ta = a.registeredAt?.seconds ?? 0
          const tb = b.registeredAt?.seconds ?? 0
          return tb - ta
        })
      )
      setScores(s)
    } catch {
      setError("Impossible de charger les données. Vérifiez Firestore et la connexion.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const registeredEmails = new Set(users.map((u) => u.email.toLowerCase()))
  const orphanByEmail = new Map<string, LeaderboardEntry[]>()
  for (const s of scores) {
    if (registeredEmails.has(s.userEmail.toLowerCase())) continue
    const key = s.userEmail.toLowerCase()
    if (!orphanByEmail.has(key)) orphanByEmail.set(key, [])
    orphanByEmail.get(key)!.push(s)
  }
  for (const arr of orphanByEmail.values()) {
    arr.sort((a, b) => scoreSortKey(b) - scoreSortKey(a))
  }

  return (
    <div className="space-y-6">
      {!authLoading && !firebaseUser ? (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardContent className="pt-6 text-sm text-foreground">
            <p className="font-medium">Connexion Firebase recommandée</p>
            <p className="mt-1 text-muted-foreground">
              Si vos règles Firestore limitent la lecture aux utilisateurs connectés, connectez-vous avec un compte
              élève/enseignant sur la plateforme pour afficher les inscrits et les notes.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href="/auth?redirect=/admin">Se connecter à Firebase</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
          <p className="text-sm text-muted-foreground">
            Inscrits (Firebase) et toutes les tentatives enregistrées (notes par quizz).
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personnes inscrites ({users.length})
              </CardTitle>
              <CardDescription>
                Chaque connexion met à jour la dernière activité. Les notes proviennent des quizz terminés.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun compte enregistré dans Firestore pour l’instant. Les élèves apparaîtront après inscription ou connexion.
                </p>
              ) : (
                users.map((user) => {
                  const attempts = scoresForUser(user, scores)
                  return (
                    <div key={user.uid} className="rounded-lg border border-border">
                      <div className="border-b border-border bg-muted/40 px-4 py-3">
                        <p className="font-medium text-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Inscription : {formatFirestoreDate(user.registeredAt)} · Dernière activité :{" "}
                          {formatFirestoreDate(user.lastSeenAt)}
                        </p>
                      </div>
                      {attempts.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-muted-foreground">Aucune tentative de quizz enregistrée.</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Quizz</TableHead>
                              <TableHead>Note</TableHead>
                              <TableHead>%</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attempts.map((a) => (
                              <TableRow key={a.id}>
                                <TableCell className="max-w-[220px] truncate font-medium">{a.quizTitle}</TableCell>
                                <TableCell>
                                  {a.score}/{a.totalQuestions}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{a.percentage}%</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                  {formatFirestoreDate(a.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {orphanByEmail.size > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Autres tentatives (email sans fiche utilisateur)</CardTitle>
                <CardDescription>
                  Anciennes tentatives ou comptes créés avant l’enregistrement des profils. Les nouvelles connexions créent une fiche dans « Personnes inscrites ».
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[...orphanByEmail.entries()].map(([email, list]) => (
                  <div key={email} className="rounded-lg border border-border">
                    <div className="border-b border-border bg-muted/40 px-4 py-3">
                      <p className="font-medium text-foreground">{list[0]?.userEmail ?? email}</p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quizz</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>%</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell className="max-w-[220px] truncate font-medium">{a.quizTitle}</TableCell>
                            <TableCell>
                              {a.score}/{a.totalQuestions}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{a.percentage}%</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {formatFirestoreDate(a.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  )
}
