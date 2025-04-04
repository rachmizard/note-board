# Noteboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

Noteboard is a modern web application built with Next.js and React. It provides a platform for managing notes and tasks in an organized manner.

## Tech Stack

- **Framework**: [Next.js 15.2.4](https://nextjs.org/) with [Turbopack](https://turbo.build/pack)
- **Shadcn UI**: [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [NeonDB](https://neon.tech/) (Serverless Postgres) with [Drizzle ORM](https://orm.drizzle.team/)
- **API**: [tRPC](https://trpc.io/) with [React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with utilities:
  - [class-variance-authority](https://cva.style/docs)
  - [clsx](https://github.com/lukeed/clsx)
  - [tailwind-merge](https://github.com/dcastil/tailwind-merge)
  - [tw-animate-css](https://github.com/bentzibentz/tailwindcss-animate-css)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Validation**: [Zod](https://zod.dev/)
- **TypeScript**: For type safety and better developer experience

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

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint to catch errors and enforce code style

## Database Management

This project uses Drizzle ORM with NeonDB (serverless Postgres). For database migrations:

```bash
npx drizzle-kit push
```

### Migrating Database to Production

When you're ready to deploy your database changes to production, follow these steps:

1. **Create a Production Database Configuration**: 
   - In your database configuration file, ensure you have separate connection settings for development and production environments.
   - Use environment variables to manage your production database credentials securely.

2. **Generate Migration SQL**:
   ```bash
   bun db:generate:prod
   ```
   This will generate SQL migration files based on your schema changes.

3. **Review Migrations Before Applying**:
   - Always review the generated SQL files in the `migrations` directory before applying them to production.
   - Test migrations on a staging environment first if possible.

4. **Apply Migrations to Production**:
   ```bash
   bun db:push:prod
   ```
   
5. **Best Practices**:
   - Always backup your production database before running migrations
   - Schedule migrations during low-traffic periods
   - Use transactions for complex migrations to ensure atomicity
   - Add proper logging for migration processes

For more information, check out the [Drizzle ORM migration documentation](https://orm.drizzle.team/docs/migrations).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
