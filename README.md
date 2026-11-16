# CRM inmobiliario con Next.js

El CRM de Atalaya Inmobiliaria, una agencia inventada de Valencia, con la cartera de inmuebles y sus fotos, los clientes con lo que busca cada uno, el cruce automático entre las dos cosas y la agenda de visitas. Al dar de alta un piso ves qué clientes lo están buscando, y al dar de alta un cliente ves qué inmuebles le encajan.

Está hecho con Next.js 16 (App Router, Server Components y Server Actions), Prisma 7 sobre SQLite, Zod para validar los formularios y Tailwind para los estilos.

El tutorial completo, paso a paso, está en Neoguias: [Cómo crear un CRM inmobiliario con Next.js](https://www.neoguias.com/crear-crm-inmobiliario-nextjs/). Hay una versión del mismo CRM con Laravel y Livewire en [este otro repositorio](https://github.com/neoguias/tutorial-crm-inmobiliario-laravel).

## Cómo arrancarlo

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Abre `http://localhost:3000`. El seed carga diez inmuebles con una foto cada uno, cinco clientes con lo que buscan y dos visitas, así que el cruce ya tiene algo que enseñar desde el principio. Las fotos de ejemplo están generadas con IA y son de uso libre.

Los tests usan su propia base de datos SQLite, `test.db`, que se crea de cero en cada ejecución:

```bash
npm test
```

Requiere Node 22 o superior.

## Dónde está cada cosa

- [`prisma/schema.prisma`](prisma/schema.prisma): las tablas de inmuebles, clientes, demandas y visitas.
- [`lib/matching.ts`](lib/matching.ts): el cruce, en un sentido y en el otro, como condiciones de Prisma.
- [`lib/crm.ts`](lib/crm.ts): la agencia, sus zonas, los textos en español de cada valor y el formato de precios y fechas.
- [`lib/validation.ts`](lib/validation.ts): los esquemas de Zod de los formularios.
- [`app/actions.ts`](app/actions.ts): las Server Actions que guardan inmuebles, clientes, visitas y estados.
- [`lib/photos.ts`](lib/photos.ts) y [`app/fotos`](app/fotos): las fotos se guardan en `storage/photos` y las sirve un Route Handler, porque Next.js no sirve lo que se añade a `public` después de compilar.
- [`app/inmuebles`](app/inmuebles), [`app/clientes`](app/clientes) y [`app/visitas`](app/visitas): las cuatro pantallas del CRM.
- [`tests/crm.test.ts`](tests/crm.test.ts): el cruce, los formularios, las fotos y el formato de los precios.

## Autor

Creado por [Edu Lázaro](https://edulazaro.com) para [Neoguias](https://www.neoguias.com).

## Licencia

Este ejemplo es software libre con [licencia MIT](LICENSE).
