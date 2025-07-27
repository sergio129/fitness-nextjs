# Script para migrar componentes y páginas principales

# 1. Generar cliente Prisma
npx prisma generate

# 2. Crear estructura básica
mkdir -p src/components
mkdir -p src/app/login
mkdir -p src/app/members  
mkdir -p src/app/payments

# 3. Crear página de login
echo 'export default function LoginPage() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gray-50\">
      <div className=\"max-w-md w-full space-y-8\">
        <div>
          <h2 className=\"mt-6 text-center text-3xl font-extrabold text-gray-900\">
            Fitness Club
          </h2>
        </div>
        <form className=\"mt-8 space-y-6\">
          <div>
            <input
              type=\"email\"
              placeholder=\"Email\"
              className=\"relative block w-full rounded-md border-gray-300 px-3 py-2\"
            />
          </div>
          <div>
            <input
              type=\"password\"
              placeholder=\"Contraseña\"
              className=\"relative block w-full rounded-md border-gray-300 px-3 py-2\"
            />
          </div>
          <div>
            <button
              type=\"submit\"
              className=\"group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500\"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}' > src/app/login/page.tsx

# 4. Crear página principal
echo 'import Layout from \"@/components/Layout\"

export default function HomePage() {
  return (
    <Layout>
      <div>
        <h1 className=\"text-2xl font-bold text-gray-900\">Dashboard</h1>
        <div className=\"mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3\">
          <div className=\"bg-white overflow-hidden shadow rounded-lg\">
            <div className=\"p-5\">
              <div className=\"flex items-center\">
                <div className=\"w-0 flex-1\">
                  <dl>
                    <dt className=\"text-sm font-medium text-gray-500 truncate\">
                      Total Afiliados
                    </dt>
                    <dd className=\"text-lg font-medium text-gray-900\">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}' > src/app/page.tsx

echo \"Estructura básica creada. Ejecuta 'npm run dev' para probar.\"
