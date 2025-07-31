// Utilidad para manejar JWT_SECRET en tiempo de ejecución
export function getJWTSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está configurado")
  }
  return JWT_SECRET
}
