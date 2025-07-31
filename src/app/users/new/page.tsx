"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [active, setActive] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, active })
      })
      if (!res.ok) throw new Error("Error al crear usuario")
      router.push("/users")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-6">Nuevo Usuario</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <label className="flex items-center">
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="mr-2" />
          Activo
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">{loading ? "Creando..." : "Crear Usuario"}</button>
      </form>
    </div>
  )
}
