import Link from "next/link"
import { Header } from "@/components/quiz/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { courseData } from "@/lib/course-data"
import { Download, Eye, FileText } from "lucide-react"

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Cours Docker</h2>
          <p className="mt-2 text-muted-foreground">
            Ouvrez un cours pour le lire directement dans la plateforme.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courseData.map((course) => (
            <Card key={course.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{course.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{course.description}</p>
                <div className="grid gap-2">
                  <Button asChild className="gap-2">
                    <Link href={`/cours/${course.id}`}>
                      <Eye className="h-4 w-4" />
                      Lire le cours
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <a href={course.file} download>
                      <Download className="h-4 w-4" />
                      Telecharger
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
