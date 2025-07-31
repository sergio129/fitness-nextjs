"use client";
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Error al cargar usuario")
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      })
      if (!res.ok) throw new Error("Error al actualizar usuario")
      router.push("/users")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar usuario")
      router.push("/users")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="max-w-md mx-auto py-8">Cargando...</div>
  if (error) return <div className="max-w-md mx-auto py-8 text-red-600">{error}</div>
  if (!user) return null

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-6">Editar Usuario</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} required className="w-full border px-3 py-2 rounded" />
        <input type="email" placeholder="Email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required className="w-full border px-3 py-2 rounded" />
        <input type="password" placeholder="Nueva contraseña (opcional)" onChange={e => setUser({ ...user, password: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })} className="w-full border px-3 py-2 rounded">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <label className="flex items-center">
          <input type="checkbox" checked={user.active} onChange={e => setUser({ ...user, active: e.target.checked })} className="mr-2" />
          Activo
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">{loading ? "Guardando..." : "Guardar Cambios"}</button>
      </form>
      <button onClick={handleDelete} disabled={loading} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">Eliminar Usuario</button>
    </div>
  )
}
