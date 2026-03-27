// =====================================================
// DONNÉES DES QUIZZ - MODIFIEZ ICI POUR AJOUTER VOS QUIZZ
// =====================================================
// Format:
// - Chaque quizz a un id unique, un titre, une description et des questions
// - Chaque question a un id, le texte de la question, les options, 
//   l'index de la bonne réponse (0-based) et une explication
// =====================================================

import type { QuizData } from "./quiz-types"

export const defaultQuizData: QuizData = {
  quizzes: [
    {
      id: "docker-fundamentaux",
      title: "Fondamentaux de Docker",
      description: "Testez vos connaissances sur les concepts de base de Docker et de la conteneurisation.",
      questions: [
        {
          id: "f1",
          question: "Qu'est-ce qu'un conteneur Docker ?",
          options: [
            "Une machine virtuelle légère",
            "Une unité logicielle standardisée qui empaquète le code et ses dépendances",
            "Un système d'exploitation complet",
            "Un serveur physique dédié"
          ],
          answerIndex: 1,
          explanation: "Un conteneur est une unité logicielle standardisée qui empaquète le code et toutes ses dépendances pour que l'application s'exécute rapidement et de manière fiable d'un environnement à l'autre."
        },
        {
          id: "f2",
          question: "Quel est le rôle du Docker Daemon ?",
          options: [
            "Créer des images Docker",
            "Gérer les conteneurs, images, réseaux et volumes",
            "Compiler le code source",
            "Connecter Docker au cloud"
          ],
          answerIndex: 1,
          explanation: "Le Docker Daemon (dockerd) est le service qui gère les objets Docker : conteneurs, images, réseaux et volumes. Il écoute les requêtes de l'API Docker."
        },
        {
          id: "f3",
          question: "Qu'est-ce qu'une image Docker ?",
          options: [
            "Un conteneur en cours d'exécution",
            "Un fichier de configuration",
            "Un modèle en lecture seule avec des instructions pour créer un conteneur",
            "Un snapshot de machine virtuelle"
          ],
          answerIndex: 2,
          explanation: "Une image Docker est un modèle en lecture seule qui contient un ensemble d'instructions pour créer un conteneur. Elle empaquète le code, les bibliothèques et les dépendances."
        },
        {
          id: "f4",
          question: "Que contient un Dockerfile ?",
          options: [
            "Les logs du conteneur",
            "Les instructions pour construire une image Docker",
            "Les données persistantes du conteneur",
            "La configuration réseau"
          ],
          answerIndex: 1,
          explanation: "Un Dockerfile est un fichier texte contenant toutes les commandes nécessaires pour construire une image Docker, comme FROM, COPY, RUN, CMD, etc."
        },
        {
          id: "f5",
          question: "Quelle est la différence principale entre un conteneur et une VM ?",
          options: [
            "Les conteneurs sont plus grands que les VMs",
            "Les conteneurs partagent le noyau de l'hôte, les VMs ont leur propre OS",
            "Les VMs sont plus rapides à démarrer",
            "Il n'y a aucune différence"
          ],
          answerIndex: 1,
          explanation: "Les conteneurs partagent le noyau du système hôte et isolent les processus, tandis que les VMs virtualisent un système complet avec son propre noyau, ce qui les rend plus lourdes."
        }
      ]
    },
    {
      id: "docker-commandes",
      title: "Commandes Docker",
      description: "Maîtrisez les commandes essentielles de Docker CLI.",
      questions: [
        {
          id: "c1",
          question: "Quelle commande permet de lister les conteneurs en cours d'exécution ?",
          options: [
            "docker images",
            "docker ps",
            "docker list",
            "docker containers"
          ],
          answerIndex: 1,
          explanation: "La commande 'docker ps' affiche la liste des conteneurs en cours d'exécution. Ajoutez -a pour voir tous les conteneurs (y compris arrêtés)."
        },
        {
          id: "c2",
          question: "Comment construire une image à partir d'un Dockerfile ?",
          options: [
            "docker create image",
            "docker build -t nom:tag .",
            "docker make image",
            "docker compile ."
          ],
          answerIndex: 1,
          explanation: "La commande 'docker build -t nom:tag .' construit une image à partir du Dockerfile dans le répertoire courant (.) avec le nom et tag spécifiés."
        },
        {
          id: "c3",
          question: "Quelle commande permet d'exécuter un conteneur en mode interactif ?",
          options: [
            "docker run -it image",
            "docker start -i image",
            "docker exec image",
            "docker interactive image"
          ],
          answerIndex: 0,
          explanation: "La commande 'docker run -it image' lance un conteneur en mode interactif (-i) avec un terminal attaché (-t), permettant d'interagir avec le conteneur."
        },
        {
          id: "c4",
          question: "Comment supprimer tous les conteneurs arrêtés ?",
          options: [
            "docker rm all",
            "docker clean containers",
            "docker container prune",
            "docker delete stopped"
          ],
          answerIndex: 2,
          explanation: "La commande 'docker container prune' supprime tous les conteneurs arrêtés. C'est une commande utile pour nettoyer votre système."
        },
        {
          id: "c5",
          question: "Quelle commande affiche les logs d'un conteneur ?",
          options: [
            "docker output container_id",
            "docker logs container_id",
            "docker print container_id",
            "docker show container_id"
          ],
          answerIndex: 1,
          explanation: "La commande 'docker logs container_id' affiche les logs (stdout et stderr) d'un conteneur. Utilisez -f pour suivre les logs en temps réel."
        }
      ]
    },
    {
      id: "virtualisation-conteneurisation",
      title: "Virtualisation vs Conteneurisation",
      description: "Comprenez les différences entre la virtualisation traditionnelle et la conteneurisation.",
      questions: [
        {
          id: "v1",
          question: "Quel composant est présent dans une VM mais pas dans un conteneur ?",
          options: [
            "Application",
            "Bibliothèques",
            "Système d'exploitation invité complet",
            "Fichiers de configuration"
          ],
          answerIndex: 2,
          explanation: "Une VM contient un OS invité complet (Guest OS) avec son propre noyau, alors qu'un conteneur partage le noyau de l'hôte et n'a pas besoin d'un OS complet."
        },
        {
          id: "v2",
          question: "Qu'est-ce qu'un hyperviseur ?",
          options: [
            "Un conteneur spécial",
            "Un logiciel qui crée et gère des machines virtuelles",
            "Un type de réseau Docker",
            "Un outil de monitoring"
          ],
          answerIndex: 1,
          explanation: "Un hyperviseur est un logiciel qui permet de créer et gérer des machines virtuelles en virtualisant les ressources matérielles (CPU, mémoire, stockage)."
        },
        {
          id: "v3",
          question: "Quel est l'avantage principal des conteneurs en termes de ressources ?",
          options: [
            "Ils utilisent plus de mémoire",
            "Ils sont plus légers et démarrent plus rapidement",
            "Ils nécessitent plus d'espace disque",
            "Ils consomment plus de CPU"
          ],
          answerIndex: 1,
          explanation: "Les conteneurs sont beaucoup plus légers que les VMs car ils partagent le noyau de l'hôte. Ils démarrent en secondes (vs minutes pour une VM) et utilisent moins de ressources."
        },
        {
          id: "v4",
          question: "Dans quel cas préférer une VM à un conteneur ?",
          options: [
            "Pour des microservices",
            "Pour un déploiement rapide",
            "Quand on a besoin d'un OS différent de l'hôte",
            "Pour des applications stateless"
          ],
          answerIndex: 2,
          explanation: "Les VMs sont préférables quand on a besoin d'exécuter un OS différent de l'hôte (ex: Windows sur Linux) ou quand on a besoin d'une isolation complète au niveau du noyau."
        },
        {
          id: "v5",
          question: "Quelle technologie Linux permet l'isolation des conteneurs ?",
          options: [
            "Apache",
            "Namespaces et cgroups",
            "SSH",
            "GRUB"
          ],
          answerIndex: 1,
          explanation: "Les namespaces Linux isolent les processus (PID, réseau, système de fichiers) et les cgroups limitent les ressources (CPU, mémoire). Ces technologies sont à la base de Docker."
        }
      ]
    }
  ]
}
