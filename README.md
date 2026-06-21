This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Documentación

Para replicar, migrar o adaptar este proyecto:

- [docs/00_PROJECT_OVERVIEW.md](docs/00_PROJECT_OVERVIEW.md) - Vista general del proyecto
- [docs/01_SETUP.md](docs/01_SETUP.md) - Instalación y configuración
- [docs/02_ROUTES.md](docs/02_ROUTES.md) - Rutas del proyecto
- [docs/03_ENVIRONMENT.md](docs/03_ENVIRONMENT.md) - Variables de entorno
- [docs/04_MIGRATION.md](docs/04_MIGRATION.md) - Guía de migración
- [docs/05_REPLICATION_PLAYBOOK.md](docs/05_REPLICATION_PLAYBOOK.md) - Replicabilidad
- [docs/06_IMPLEMENTATION_LOG.md](docs/06_IMPLEMENTATION_LOG.md) - Registro
- [docs/07_NEXT_STEPS.md](docs/07_NEXT_STEPS.md) - Próximos pasos
- [.env.example](.env.example) - Plantilla de variables

## Scripts Locales de Mantenimiento

- `scripts/generate-screenshot-sizes.js` - Genera versiones optimizadas (WebP) para miniaturas (thumbnails: 1200-1600px, WebP 82) y vistas de pantalla completa (full: 1800-2400px, WebP 88) de las capturas de demostración reales. Este script se ejecuta únicamente de manera local para optimizar las capturas y no contiene secretos. No modifica las imágenes originales.

