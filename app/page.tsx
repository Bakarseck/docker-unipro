"use client"

import { Header } from "@/components/quiz/header"
import { QuizList } from "@/components/quiz/quiz-list"
import { QuizProvider } from "@/lib/quiz-context"
import { Container, FileText, Download, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { courseData } from "@/lib/course-data"

export default function HomePage() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="mx-auto max-w-5xl px-4 py-12">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Container className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Testez vos connaissances Docker
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Bienvenue dans le Docker Quiz Lab ! Ce module interactif vous permet de valider 
              vos acquis sur Docker et la conteneurisation. Choisissez un quizz ci-dessous 
              et evaluez vos competences.
            </p>
          </section>

          {/* Courses Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Supports de cours</h3>
              <p className="text-sm text-muted-foreground">Lisez le cours directement sur la plateforme</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courseData.map((course) => (
                <Card key={course.id} className="group transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="mb-1 font-semibold text-foreground">{course.title}</h4>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="grid gap-2">
                      <Button asChild size="sm" className="w-full gap-2">
                        <Link href={`/cours/${course.id}`}>
                          <Eye className="h-4 w-4" />
                          Lire le cours
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full gap-2">
                        <a href={course.file} download>
                          <Download className="h-4 w-4" />
                          Telecharger
                        </a>
                      </Button>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="mt-2 w-full gap-2">
                      <Link href="/cours">
                        <FileText className="h-4 w-4" />
                        Tous les cours
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quiz List Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Quizz disponibles</h3>
                <p className="text-sm text-muted-foreground">Selectionnez un quizz pour commencer</p>
              </div>
            </div>
            <QuizList />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
            <p>Docker Quiz Lab - Cours Docker & Conteneurisation</p>
            <p className="mt-1">Niveau Licence / Dev Web</p>
          </div>
        </footer>
      </div>
    </QuizProvider>
  )
}
