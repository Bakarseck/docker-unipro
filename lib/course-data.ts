export interface CourseItem {
  id: string
  title: string
  description: string
  file: string
}

export const courseData: CourseItem[] = [
  {
    id: "cours-1",
    title: "Cours 1 - Docker et Conteneurisation",
    description: "Introduction a Docker, concepts fondamentaux et premiers pas avec les conteneurs.",
    file: "/cours/cours-1-docker-conteneurisation.pdf",
  },
  {
    id: "cours-2",
    title: "Cours 2 - Construire et publier son image",
    description: "Dockerfile, layers, optimisation et publication sur Docker Hub.",
    file: "/cours/cours-2-construire-publier-image.pdf",
  },
  {
    id: "cours-3",
    title: "Cours 3 - Docker Compose",
    description: "Orchestration multi-conteneurs avec Docker Compose.",
    file: "/cours/cours-3-docker-compose.pdf",
  },
]
