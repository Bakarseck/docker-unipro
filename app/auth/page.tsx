"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/quiz/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

export default function AuthPage() {
  const { login, register } = useAuth()
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      await login(loginEmail, loginPassword)
      router.push("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Echec de connexion."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      await register(registerEmail, registerPassword)
      router.push("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Echec de creation du compte."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex max-w-md px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Authentification</CardTitle>
            <CardDescription>Inscrivez-vous ou connectez-vous avec email et mot de passe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Se connecter
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input id="register-password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} minLength={6} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Creer un compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <p className="text-xs text-muted-foreground">
              En revenant a l&apos;accueil, vos resultats de quizz seront enregistres dans le leaderboard.
            </p>
            <Link href="/" className="text-sm underline underline-offset-4">
              Retour a l&apos;accueil
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
