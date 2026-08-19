# CyberShield NGO - Windows Setup

## 1. Install PostgreSQL

Install PostgreSQL locally and remember the password for the `postgres` role. You can also use pgAdmin if `psql.exe` is not on PATH.

Create a database named `cybershield`.

## 2. Configure environment

Copy `.env.example` to `.env` and replace `YOUR_POSTGRES_PASSWORD` with the real password for the `postgres` role.

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_REAL_PASSWORD@127.0.0.1:5432/cybershield
JWT_SECRET=use-a-long-random-development-secret
NODE_ENV=development
```

Do not commit `.env`.

## 3. Install dependencies

```powershell
npm install
```

## 4. Verify Drizzle Kit

```powershell
npx drizzle-kit --version
```

The project pins `drizzle-kit` to `0.31.10`.

## 5. Create/update the database schema

```powershell
npm run db:push
```

The project now uses `drizzle.config.ts`, which reads `DATABASE_URL` from `.env`. There is no hardcoded production database password in the Drizzle config.

## 6. Start the application

```powershell
npm run dev
```

Open `http://localhost:3000`.

## 7. Seed demo data

Use the local development seed endpoint to create the demo organization, users, assessment data, recommendations, roadmap, policies, KPIs, and incident.

Demo credentials:

- System administrator: `admin` / `Admin@123`
- NGO administrator: `ngo_admin` / `Ngo@123`

## If `psql` is not recognized

This only means `psql.exe` is not on PATH. PostgreSQL can still be installed.

Check:

```powershell
Get-Service *postgres*
```

If PostgreSQL is installed, use pgAdmin to create the `cybershield` database, or run `psql.exe` using its full path, for example:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h 127.0.0.1 -p 5432
```

Replace `17` with the installed PostgreSQL version.
