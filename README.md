# 🏋️ Fitness Management System

Sistema de gestión para gimnasios y centros de fitness desarrollado con Next.js 15.

## ✨ Características

- 👥 Gestión de miembros
- 💰 Registro de pagos y membresías
- 📊 Dashboard con estadísticas en tiempo real
- 🔐 Autenticación JWT
- 📱 Interfaz responsive con Tailwind CSS
- 🗄️ Base de datos PostgreSQL con Prisma

## 🚀 Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL con Prisma
- **Autenticación**: JWT
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form
- **Despliegue**: Vercel

## 🔧 Configuración Local

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd fitness-nextjs
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env.local` basado en `.env.example`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/fitness_db"
JWT_SECRET="tu-jwt-secret-aqui"
NEXTAUTH_SECRET="tu-nextauth-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar base de datos
```bash
# Empujar el esquema a la base de datos
npm run db:push

# Generar el cliente de Prisma
npm run db:generate
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Despliegue en Vercel

### 1. Preparar la base de datos
Para producción, configura una base de datos PostgreSQL (recomendado: Railway, Supabase, o PlanetScale).

### 2. Configurar Prisma Accelerate (Recomendado)
```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=TU_API_KEY_AQUI"
```

### 3. Variables de entorno en Vercel
En el dashboard de Vercel, configura estas variables:

```env
DATABASE_URL=tu-url-de-base-de-datos
JWT_SECRET=tu-jwt-secret-seguro
NEXTAUTH_SECRET=tu-nextauth-secret-seguro
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### 4. Desplegar
```bash
npm install -g vercel
vercel --prod
```

O conecta tu repositorio GitHub directamente en Vercel.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/          # API Routes
│   │   ├── auth/     # Autenticación
│   │   ├── members/  # Gestión de miembros
│   │   ├── payments/ # Gestión de pagos
│   │   └── dashboard/# Estadísticas
│   ├── login/        # Página de login
│   ├── members/      # Gestión de miembros
│   ├── payments/     # Gestión de pagos
│   └── dashboard/    # Dashboard principal
├── components/       # Componentes reutilizables
├── hooks/           # Custom hooks
├── lib/             # Configuraciones (Prisma)
├── types/           # Tipos TypeScript
└── utils/           # Utilidades
```

## 🎯 Funcionalidades

### Dashboard
- Estadísticas de miembros activos
- Ingresos mensuales con crecimiento
- Alertas de membresías expiradas/próximas a expirar
- Distribución de tipos de pago

### Gestión de Miembros
- Agregar/editar miembros
- Historial de pagos individual
- Estado de membresía en tiempo real

### Gestión de Pagos
- Registro de pagos mensuales/anuales
- Actualización automática de fechas de membresía
- Notas y descripciones

## 🔒 Autenticación

El sistema utiliza JWT para autenticación:
- Login con email/contraseña
- Tokens almacenados en localStorage
- Protección de rutas API

## 🗄️ Base de Datos

Esquema principal:
- **User**: Usuarios del sistema
- **Member**: Miembros del gimnasio
- **Payment**: Registro de pagos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
