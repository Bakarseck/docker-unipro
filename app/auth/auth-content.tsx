"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/quiz/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getAuthErrorMessage } from "@/lib/auth-errors"

function safeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/"
  }
  return path
}

export function AuthContent() {
  const { login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const afterAuthPath = safeRedirect(searchParams.get("redirect"))

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setRegisterError("")
    setIsSubmittingLogin(true)
    try {
      await login(loginEmail.trim(), loginPassword)
      router.push(afterAuthPath)
    } catch (err) {
      setLoginError(getAuthErrorMessage(err))
    } finally {
      setIsSubmittingLogin(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setLoginError("")
    setIsSubmittingRegister(true)
    try {
      await register(registerEmail.trim(), registerPassword)
      router.push(afterAuthPath)
    } catch (err) {
      setRegisterError(getAuthErrorMessage(err))
    } finally {
      setIsSubmittingRegister(false)
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
                    <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                  </div>
                  {loginError ? (
                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                      {loginError}
                    </p>
                  ) : null}
                  <Button type="submit" className="w-full" disabled={isSubmittingLogin}>
                    Se connecter
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required autoComplete="email" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input id="register-password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} minLength={6} required autoComplete="new-password" />
                  </div>
                  {registerError ? (
                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                      {registerError}
                    </p>
                  ) : null}
                  <Button type="submit" className="w-full" disabled={isSubmittingRegister}>
                    Creer un compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground">
              Une fois connecté, vos résultats au quizz seront enregistrés dans le classement.
            </p>
            <Link href="/" className="text-sm underline underline-offset-4">
              Retour à l&apos;accueil
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
