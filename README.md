# Forwarder Service

This is a production-deployable Next.js application that acts as a request forwarder, allowing you to create multiple projects, each with its own forwarding base URL. It preserves HTTP methods, paths, queries, headers, and bodies, and logs all requests and responses.

## Architecture Overview

- **Next.js (App Router, TypeScript):** Frontend and API routes.
- **Prisma ORM:** Database interaction (SQLite for local, PostgreSQL for production).
- **Tailwind CSS + shadcn/ui:** UI components.

### Core Functionality

1.  **Request Forwarding:** Incoming requests to `BASE_URL/<projectPathSegment>/...` are forwarded to the configured `forwarderBaseUrl` for that project, preserving all request details.
2.  **Logging:** Every forwarded request and its corresponding response are logged to the database, including headers, bodies, and duration.
3.  **Dashboard UI:** A minimal UI to manage projects (create, list, edit, delete) and view detailed request/response logs.

## Environment Setup

1.  **Node.js:** Ensure you have Node.js (LTS recommended) installed.
2.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd forwarder-service
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Prisma Migrate Steps

This project uses Prisma for database management. For local development, it uses SQLite.

1.  **Set up your database URL:**
    Create a `.env` file in the root of the project with the following content:
    ```
    DATABASE_URL="file:./dev.db"
    ```
    For production, you would replace this with your PostgreSQL connection string.

2.  **Run migrations:**
    ```bash
    npx prisma migrate dev
    ```
    This command will create the `dev.db` file (for SQLite) and apply all necessary migrations to set up your database schema.

3.  **Generate Prisma Client:**
    The `migrate dev` command automatically generates the Prisma Client. If you ever need to manually generate it (e.g., after changing `schema.prisma` without a migration), run:
    ```bash
    npx prisma generate
    ```

## Running Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

2.  **Access the dashboard:**
    Open `http://localhost:3000/dashboard` in your browser.

3.  **Seed sample data (optional):**
    To create a sample project, run the seed script:
    ```bash
    npm run seed
    ```

## Deploying to Vercel

This project is configured for easy deployment to Vercel.

1.  **Create a new Vercel project:**
    Import your Git repository into Vercel.

2.  **Configure Environment Variables:**
    In your Vercel project settings, add the `DATABASE_URL` environment variable with your production PostgreSQL connection string.

3.  **Build & Deploy:**
    Vercel will automatically detect the Next.js project and deploy it. Prisma migrations will run during the build process.

## How to Create a Project and Obtain the Forwarding URL

1.  **Navigate to the Dashboard:** Go to `http://localhost:3000/dashboard` (or your deployed URL).
2.  **Click "New Project":** Fill in the project name and the `forwarderBaseUrl` (the URL where you want requests to be forwarded).
3.  **Save the Project:** After creation, the project will be listed on the dashboard. The forwarding endpoint will be displayed as `YOUR_APP_BASE_URL/<projectPathSegment>`.
4.  **Send Requests:** You can now send HTTP requests to this forwarding endpoint, and they will be relayed to your configured `forwarderBaseUrl`.

## Caveats

-   **No Authentication/Authorization:** This application currently lacks any authentication or authorization mechanisms. It is intended for internal or trusted environments. For production use cases requiring security, implement appropriate authentication and access control.
-   **Sensitive Logs:** The request and response logs may contain sensitive data. For production deployments, consider implementing encryption at rest for your database and restricting access to the log viewing interface.