const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.admin.findFirst()
    
    if (existingAdmin) {
      console.log('Ya existe un administrador en la base de datos')
      console.log(`Admin: ${existingAdmin.email}`)
      return
    }

    // Crear un admin por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@fitness.com',
        password: hashedPassword,
        name: 'Administrador'
      }
    })

    console.log('Administrador creado exitosamente:')
    console.log(`Email: ${admin.email}`)
    console.log('Contraseña: admin123')
    console.log('¡Recuerda cambiar la contraseña después del primer login!')

  } catch (error) {
    console.error('Error al crear administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
