import { Suspense } from "react"
import { AuthContent } from "./auth-content"

function AuthFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Chargement…</p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthContent />
    </Suspense>
  )
}
