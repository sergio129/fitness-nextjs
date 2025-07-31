# PowerShell script para configurar el proyecto para Vercel
Write-Host "🚀 Configurando Fitness Management System para Vercel" -ForegroundColor Green

# Verificar si Vercel CLI está instalado
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI ya está instalado" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "`n🔧 Variables de entorno para Vercel:" -ForegroundColor Cyan
Write-Host "Ve al dashboard de Vercel y configura estas variables:" -ForegroundColor White
Write-Host ""
Write-Host "DATABASE_URL=tu-url-de-base-de-datos-postgresql" -ForegroundColor Gray
Write-Host "JWT_SECRET=tu-jwt-secret-seguro" -ForegroundColor Gray
Write-Host "NEXTAUTH_SECRET=tu-nextauth-secret-seguro" -ForegroundColor Gray
Write-Host "NEXTAUTH_URL=https://tu-dominio.vercel.app" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 Para usar Prisma Accelerate (recomendado):" -ForegroundColor Cyan
Write-Host "1. Ve a https://console.prisma.io/" -ForegroundColor White
Write-Host "2. Crea un proyecto y obtén tu API key" -ForegroundColor White
Write-Host "3. Usa esta URL en DATABASE_URL:" -ForegroundColor White
Write-Host "   prisma+postgres://accelerate.prisma-data.net/?api_key=TU_API_KEY" -ForegroundColor Gray
Write-Host ""

Write-Host "🗃️ Ejecutar migraciones en producción:" -ForegroundColor Cyan
Write-Host "npx prisma db push" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Para desplegar:" -ForegroundColor Cyan
Write-Host "vercel --prod" -ForegroundColor Yellow

Write-Host "`n✅ ¡Listo para desplegar en Vercel!" -ForegroundColor Green

# Opcional: Ejecutar el despliegue automáticamente
$deploy = Read-Host "`n¿Quieres desplegar ahora? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "🚀 Iniciando despliegue..." -ForegroundColor Yellow
    vercel --prod
}
