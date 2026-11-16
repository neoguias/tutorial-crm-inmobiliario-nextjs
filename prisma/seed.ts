import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { db } from '../lib/db'
import { deleteAllPhotos, savePhoto } from '../lib/photos'

/**
 * Datos de ejemplo de Atalaya Inmobiliaria: una cartera pequeña de inmuebles, unos cuantos
 * clientes con lo que buscan y alguna visita, para tener algo que cruzar desde el principio.
 */
async function main() {
  await db.visit.deleteMany()
  await db.demand.deleteMany()
  await db.contact.deleteMany()
  await db.property.deleteMany()
  await deleteAllPhotos()

  const properties: [string, string, string, string, string, number, number, number][] = [
    ['AT-101', 'Piso luminoso junto al mercado', 'sale', 'flat', 'Ruzafa', 289000, 3, 92],
    ['AT-102', 'Ático con terraza', 'sale', 'flat', 'El Carmen', 415000, 2, 78],
    ['AT-103', 'Piso para reformar', 'sale', 'flat', 'Benimaclet', 168000, 3, 85],
    ['AT-104', 'Casa de pueblo con patio', 'sale', 'house', 'Malvarrosa', 352000, 4, 140],
    ['AT-105', 'Estudio reformado', 'rent', 'flat', 'Ruzafa', 850, 1, 45],
    ['AT-106', 'Piso familiar con garaje', 'rent', 'flat', 'Campanar', 1250, 3, 110],
    ['AT-107', 'Local a pie de calle', 'rent', 'commercial', 'Patraix', 1100, 0, 120],
    ['AT-108', 'Piso exterior de cuatro dormitorios', 'sale', 'flat', 'Campanar', 325000, 4, 124],
    ['AT-109', 'Oficina con vistas', 'rent', 'office', 'El Carmen', 1450, 0, 95],
    ['AT-110', 'Bajo con jardín', 'sale', 'flat', 'Patraix', 239000, 2, 88],
  ]

  for (const [reference, title, operation, type, zone, price, bedrooms, area] of properties) {
    const property = await db.property.create({ data: { reference, title, operation, type, zone, price, bedrooms, area } })

    // Cada inmueble de ejemplo tiene su foto en prisma/photos.
    const photo = new File([await readFile(`prisma/photos/${reference}.jpg`)], `${reference}.jpg`, { type: 'image/jpeg' })
    await db.propertyPhoto.create({ data: { propertyId: property.id, path: await savePhoto(property.id, photo) } })
  }

  const lucia = await db.contact.create({
    data: { name: 'Lucía Ferrer', email: 'lucia@example.test', phone: '600 111 222', demands: { create: { operation: 'sale', type: 'flat', zone: 'Ruzafa', maxPrice: 300000, minBedrooms: 2 } } },
  })
  const marc = await db.contact.create({
    data: { name: 'Marc Soler', email: 'marc@example.test', demands: { create: { operation: 'sale', maxPrice: 340000, minBedrooms: 3, minArea: 100 } } },
  })
  await db.contact.create({
    data: { name: 'Ana Ruiz', phone: '611 333 444', demands: { create: { operation: 'rent', type: 'flat', maxPrice: 1000 } } },
  })
  await db.contact.create({
    data: { name: 'Jorge Martí', email: 'jorge@example.test', notes: 'Tiene un negocio de cerámica y busca local.', demands: { create: { operation: 'rent', type: 'commercial', maxPrice: 1200, minArea: 80 } } },
  })
  await db.contact.create({
    data: { name: 'Elena Gil', email: 'elena@example.test', demands: { create: { operation: 'sale', zone: 'El Carmen', maxPrice: 450000 } } },
  })

  const at = (days: number, hours: number, minutes: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  await db.visit.create({ data: { propertyId: (await db.property.findUniqueOrThrow({ where: { reference: 'AT-101' } })).id, contactId: lucia.id, scheduledAt: at(1, 10, 30) } })
  await db.visit.create({ data: { propertyId: (await db.property.findUniqueOrThrow({ where: { reference: 'AT-108' } })).id, contactId: marc.id, scheduledAt: at(2, 17, 0) } })
}

main().finally(() => db.$disconnect())
