#!/bin/bash
# Script para configurar el proyecto en Vercel

echo "🚀 Configurando Fitness Management System para Vercel"

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 Configurando variables de entorno..."
echo "Ve al dashboard de Vercel y configura estas variables:"
echo ""
echo "DATABASE_URL=tu-url-de-base-de-datos-postgresql"
echo "JWT_SECRET=tu-jwt-secret-seguro"
echo "NEXTAUTH_SECRET=tu-nextauth-secret-seguro"
echo "NEXTAUTH_URL=https://tu-dominio.vercel.app"
echo ""

echo "📊 Para usar Prisma Accelerate (recomendado):"
echo "1. Ve a https://console.prisma.io/"
echo "2. Crea un proyecto y obtén tu API key"
echo "3. Usa esta URL en DATABASE_URL:"
echo "   prisma+postgres://accelerate.prisma-data.net/?api_key=TU_API_KEY"
echo ""

echo "🚀 Para desplegar:"
echo "vercel --prod"

echo ""
echo "✅ ¡Listo para desplegar en Vercel!"
