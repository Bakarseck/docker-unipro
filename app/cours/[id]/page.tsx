import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/quiz/header"
import { Button } from "@/components/ui/button"
import { courseData } from "@/lib/course-data"
import { ArrowLeft, Download } from "lucide-react"

interface CourseReaderPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseReaderPage({ params }: CourseReaderPageProps) {
  const { id } = await params
  const course = courseData.find((item) => item.id === id)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 gap-2">
              <Link href="/cours">
                <ArrowLeft className="h-4 w-4" />
                Retour aux cours
              </Link>
            </Button>
            <h2 className="text-2xl font-bold text-foreground">{course.title}</h2>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>

          <Button asChild variant="outline" className="gap-2">
            <a href={course.file} download>
              <Download className="h-4 w-4" />
              Telecharger le PDF
            </a>
          </Button>
        </div>

        <div className="h-[80vh] overflow-hidden rounded-lg border bg-card">
          <iframe
            src={`${course.file}#view=fitH`}
            title={course.title}
            className="h-full w-full"
          />
        </div>
      </main>
    </div>
  )
}
