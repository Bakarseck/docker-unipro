/**
 * Messages utilisateur en français pour les erreurs Firebase Auth.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("n'est pas configure")) {
      return "L’authentification n’est pas configurée (Firebase). Vérifiez votre fichier .env et la console Firebase."
    }
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code)
    const messages: Record<string, string> = {
      "auth/invalid-email": "L’adresse e-mail n’est pas valide.",
      "auth/user-disabled": "Ce compte a été désactivé. Contactez l’administrateur.",
      "auth/user-not-found": "Aucun compte ne correspond à cet e-mail.",
      "auth/wrong-password": "Mot de passe incorrect.",
      "auth/invalid-credential":
        "E-mail ou mot de passe incorrect. Vérifiez vos identifiants.",
      "auth/invalid-login-credentials":
        "E-mail ou mot de passe incorrect. Vérifiez vos identifiants.",
      "auth/too-many-requests":
        "Trop de tentatives. Réessayez dans quelques minutes.",
      "auth/network-request-failed":
        "Problème de connexion réseau. Vérifiez votre internet.",
      "auth/email-already-in-use":
        "Cet e-mail est déjà utilisé. Connectez-vous ou utilisez un autre e-mail.",
      "auth/weak-password":
        "Le mot de passe est trop faible (minimum 6 caractères recommandé).",
      "auth/operation-not-allowed":
        "La connexion par e-mail/mot de passe n’est pas activée dans Firebase.",
      "auth/requires-recent-login":
        "Pour des raisons de sécurité, reconnectez-vous puis réessayez.",
      "auth/missing-email": "Veuillez saisir votre adresse e-mail.",
      "auth/missing-password": "Veuillez saisir votre mot de passe.",
    }
    if (messages[code]) {
      return messages[code]
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Une erreur inattendue s’est produite. Réessayez."
}
