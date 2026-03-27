"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { getTopScores, type LeaderboardEntry } from "@/lib/leaderboard"

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTopScores(10)
        setEntries(data)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top 10 des meilleurs scores</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun score enregistre pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">
                    #{idx + 1} - {entry.userEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.quizTitle}</p>
                </div>
                <p className="text-sm font-semibold">
                  {entry.score}/{entry.totalQuestions} ({entry.percentage}%)
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
