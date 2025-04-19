# Noteboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

Noteboard is a modern web application built with Next.js and React. It provides a platform for managing notes and tasks in an organized manner.

## Features

### Pomodoro Timer

The app includes a Pomodoro Timer feature that helps you improve productivity using the Pomodoro Technique:

- **25-minute work intervals** followed by 5-minute breaks
- **Longer breaks** (15 minutes) after 4 cycles
- **Track Pomodoro sessions** tied to specific todos, habits, or workouts
- Simple and intuitive interface for timing work sessions

To use the Pomodoro Timer, navigate to `/pomodoro` in the application.

## Tech Stack

- **Framework**: [Next.js 15.2.4](https://nextjs.org/) with [Turbopack](https://turbo.build/pack)
- **UI**: [Shadcn UI](https://ui.shadcn.com/) with Radix UI primitives
- **Database**: [NeonDB](https://neon.tech/) (Serverless Postgres) with [Drizzle ORM 0.41.0](https://orm.drizzle.team/)
- **API**: [tRPC 11.0.2](https://trpc.io/) with [TanStack Query 5.71.5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with utilities:
  - [class-variance-authority 0.7.1](https://cva.style/docs)
  - [clsx 2.1.1](https://github.com/lukeed/clsx)
  - [tailwind-merge 3.1.0](https://github.com/dcastil/tailwind-merge)
  - [tw-animate-css 1.2.5](https://github.com/bentzibentz/tailwindcss-animate-css)
- **Form Handling**: 
  - [React Hook Form 7.55.0](https://react-hook-form.com/) 
  - [Zod 3.24.2](https://zod.dev/) for validation
- **State Management**: [Immer 10.1.1](https://immerjs.github.io/immer/) for immutable state updates
- **Date Handling**: [date-fns 4.1.0](https://date-fns.org/)
- **Icons**: [Lucide React 0.487.0](https://lucide.dev/guide/packages/lucide-react)
- **URL State Management**: [nuqs 2.4.1](https://github.com/47ng/nuqs)
- **React**: [React 19.0.0](https://react.dev/)
- **TypeScript**: [TypeScript 5](https://www.typescriptlang.org/) for type safety and better developer experience

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

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint to catch errors and enforce code style
- `npm run tsc` - Runs TypeScript type checking without emitting files

## Environment Management

This project uses Vercel's CLI for environment management:

- `npm run env:pull` - Pull environment variables from Vercel
- `npm run env:add` - Add new environment variables to Vercel
- `npm run env:ls` - List environment variables
- `npm run env:rm` - Remove environment variables

## Database Management

This project uses Drizzle ORM with NeonDB (serverless Postgres). For database operations:

### Development Environment
- `npm run db:generate` - Generate SQL migration files based on schema changes
- `npm run db:push` - Apply schema changes to the development database
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:drop` - Drop tables from the development database
- `npm run db:migrate` - Run migrations on the development database

### Production Environment
- `npm run db:generate:prod` - Generate SQL migration files for production
- `npm run db:push:prod` - Apply schema changes to the production database
- `npm run db:studio:prod` - Open Drizzle Studio for production database management
- `npm run db:migrate:prod` - Run migrations on the production database
- `npm run db:drop:prod` - Drop tables from the production database (use with caution!)

### Best Practices for Database Migrations

When you're ready to deploy your database changes to production, follow these steps:

1. **Create a Production Database Configuration**: 
   - This project has separate configurations for development and production environments
   - Use environment variables to manage your production database credentials securely

2. **Generate Migration SQL**:
   ```bash
   npm run db:generate:prod
   ```
   This will generate SQL migration files based on your schema changes.

3. **Review Migrations Before Applying**:
   - Always review the generated SQL files in the `migrations` directory before applying them to production
   - Test migrations on a development environment first

4. **Apply Migrations to Production**:
   ```bash
   npm run db:push:prod
   ```
   
5. **Best Practices**:
   - Always backup your production database before running migrations
   - Schedule migrations during low-traffic periods
   - Use transactions for complex migrations to ensure atomicity
   - Add proper logging for migration processes

## Project Structure

```
src/
├── app/                  # Next.js application pages and layouts
├── server/               # Backend server code
│   ├── database/         # Database configuration and schemas
│   │   └── drizzle/      # Drizzle ORM schemas and migrations
│   ├── todo/             # Todo feature module (router, service, validators)
│   └── types/            # Server-side type definitions
├── types/                # Shared type definitions
├── utils/                # Utility functions
├── docs/                 # Documentation
└── shared/               # Shared components and utilities
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
