GOAL
A production-deployable app (Next.js + Prisma) that receives any HTTP request at a URL containing a project identifier, forwards the request to that project’s configured forwarder base URL (preserving method, path, query, headers, and body), and returns the upstream response (status, headers, body) back to the caller. It also provides a minimal UI (Next.js + Tailwind + shadcn/ui) to create, list, edit, and delete projects, plus view request/response logs per project. No authentication for now.

PLATFORM AND TECH

Next.js (App Router, TypeScript). Runtime: Node.js (not Edge), because we must stream raw bodies and use Prisma.

UI: Tailwind CSS + shadcn/ui components.

Database: Prisma ORM. Use SQLite for local development; Postgres (Neon/Planetscale/Render) for production. Ensure serverless-friendly settings (Prisma Data Proxy optional).

Hosting targets: Vercel or Netlify. Prefer Vercel for simplicity.

CORE REQUIREMENTS

Multi-project support (reusable for multiple use cases).

Each project has:

name (string)

slug (slugified name)

unique numeric suffix appended to slug to generate a globally unique path segment, e.g. “test-project-1246578”

forwarder_base_url (string, e.g. “https://mytemourl.ngrok”
 or any HTTPS base)

timestamps

Forwarding rule:

Incoming request to BASE_URL/<projectPathSegment>[/optional/rest/of/path][?query]

Find project by its unique path segment (slug + numeric suffix).

Forward to: forwarder_base_url + “/” + same trailing path and query.
Example:
incoming: https://mystaticurl.vercel.app/lenco/hooks
 for project “test-project-1246578”
If the route is actually BASE_URL/test-project-1246578/lenco/hooks
and forwarder_base_url = https://mytemourl.ngrok

then outgoing = https://mytemourl.ngrok/lenco/hooks

Preserve method, headers, query string, and body. Do not strip content-type or custom headers. Add X-Forwarded-* headers.

Return upstream response status, headers, and body as-is to the client.

Logging:

For each forwarded request, persist a RequestLog with:
id, projectId, method, incomingPath, fullIncomingUrl, forwardedUrl, requestHeaders (JSON), query (string), requestBody (text or base64 if binary), responseStatus, responseHeaders (JSON), responseBody (text or base64 if binary), durationMs, error (nullable), createdAt.

Store up to a safe size (e.g., truncate request/response body at 1 MB) to avoid DB bloat. Note truncation in the record if applied.

UI:

Home page (BASE_URL/): list all projects, with search/filter.

“Create new project” on home page:
fields: project name, forwarder base URL.
on submit:

slugify project name (lowercase, hyphens)

generate a random 6–8 digit numeric suffix (e.g., 1246578)

compute unique pathSegment = ${slug}-${suffix}

save to DB

show the project card with its public forwarding endpoint hint: BASE_URL/<pathSegment>

Project detail page (read-only summary + edit/delete):
shows name, forwarder base URL, path segment, created/updated timestamps, and “copy endpoint” action.
provides “Edit project” (update forwarder base URL and name; slug stays same; pathSegment remains fixed), and “Delete project.”
shows latest N request logs (paginated), with columns: time, method, incomingPath, status, durationMs. Each row links to a request details page.

Request details page:
displays request metadata and formatted JSON for requestHeaders and responseHeaders, the forwardedUrl, and formatted request/response bodies (attempt JSON parse; otherwise show text; if binary/base64, indicate as such and show size).

Minimal, clean design using shadcn/ui (Button, Card, Table, Dialog, Form, Input, Textarea, Badge, Separator, Tooltip, Toast if helpful).

No authentication for now.

Routing layout:

Reserve the root path segment for forwarder endpoints. To avoid conflicts with the UI, place the UI under /dashboard.
Example pages:
/ -> redirect to /dashboard
/dashboard -> list projects + “New Project” button
/dashboard/new -> new project form
/dashboard/p/[pathSegment] -> project detail page
/dashboard/p/[pathSegment]/requests -> logs list (or include in detail page)
/dashboard/p/[pathSegment]/requests/[requestId] -> request details

Forwarding handler:
a catch-all API route at /[pathSegment]/[...rest] that matches any method (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD).
This handler:
- extracts [pathSegment] and [...rest]
- looks up project by pathSegment
- builds target URL as ${project.forwarder_base_url}/${rest.join('/')} (unless rest is empty)
- preserves query string
- streams the original request body to the target
- relays upstream response back to the client
- logs the request/response

Config/data validation:

Validate forwarder_base_url: must be absolute HTTP(S) URL and disallow localhost for production hints (but allow during dev).

Ensure unique pathSegment in DB.

Add safe timeouts (e.g., 30s) and surface gateway errors (504) with a JSON error payload. Still log failures.

Developer ergonomics:

Provide seed script to create a sample project.

Provide a minimal “Send Test Request” button on the project page (client-side fetch to your own forwarder endpoint) to verify wiring.

Provide environment variables: DATABASE_URL, optionally PRISMA_GENERATE_DATAPROXY=1 if using Data Proxy.

Document local dev (npm run dev), migration (prisma migrate dev), and deployment steps (Vercel).

Security and privacy notes (still no auth):

Display a banner in the UI warning that logs may contain sensitive data; for production, recommend adding auth, IP allowlists, and encryption at rest.

Mask very large bodies and common secrets in UI (e.g., redact Authorization headers in the log view), but still store raw in DB if within size limit (or store masked if you prefer simpler).


DELIVERABLES

Next.js project with App Router.

Tailwind configured and shadcn/ui initialized. Include reusable UI primitives: Card, Button, Table, Input, Dialog, Form, Badge, Separator, Toast.

Prisma schema and migrations.

Pages and API routes as described.

README with:

overview and architecture diagram (text description is fine)

environment setup

prisma migrate steps

running locally

deploying to Vercel

how to create a project and obtain the forwarding URL

caveats about no auth and sensitive logs

PRISMA MODELS (describe; the AI should generate the .prisma)

Project:
id (cuid)
name (string)
slug (string)
suffix (string) // numeric, e.g., “1246578”
pathSegment (string, unique) // ${slug}-${suffix}
forwarderBaseUrl (string)
createdAt (DateTime, default now)
updatedAt (DateTime, updatedAt)

RequestLog:
id (cuid)
projectId (string, FK -> Project.id)
method (string)
incomingPath (string)
fullIncomingUrl (string)
forwardedUrl (string)
requestHeaders (Json)
query (string)
requestBody (bytes or text; if bytes unavailable, text with base64 flag)
responseStatus (int)
responseHeaders (Json)
responseBody (bytes or text; as above)
durationMs (int)
error (string, nullable)
createdAt (DateTime, default now)

ROUTE HANDLERS (describe; the AI should create files)

Forwarder: app/[pathSegment]/[[...rest]]/route.ts
Exports handlers for all HTTP methods.
Steps per request:

Resolve project by pathSegment

Build target URL = forwarderBaseUrl + “/” + rest (if rest exists) + original query string

Create a new outgoing request using fetch(targetUrl, { method, headers (filtered), body (raw), redirect: “manual” })

Remove hop-by-hop headers (connection, keep-alive, transfer-encoding, etc.)

Add X-Forwarded-For, X-Forwarded-Host, X-Forwarded-Proto

Read raw body via request.arrayBuffer() to preserve signatures

Time the request

Stream or buffer the response; mirror status and headers back to client

Persist RequestLog (truncate large bodies; mark base64 if binary)

Projects API:
app/api/projects/route.ts: GET (list), POST (create)
app/api/projects/[pathSegment]/route.ts: GET (detail), PUT (update name/forwarderBaseUrl), DELETE
app/api/projects/[pathSegment]/requests/route.ts: GET (list with pagination)
app/api/projects/[pathSegment]/requests/[requestId]/route.ts: GET (details)
Note: prefer using pathSegment in APIs for consistency.

UI Pages (App Router, server components where possible):
/dashboard -> list projects; “New Project” dialog/form
/dashboard/new -> (optional) dedicated create page
/dashboard/p/[pathSegment] -> project details + inline edit dialog
/dashboard/p/[pathSegment]/requests -> list
/dashboard/p/[pathSegment]/requests/[requestId] -> details view
Include toasts for success/error, confirmation dialog for delete.

UI BEHAVIOR DETAILS

New Project Form:
Inputs: name (required), forwarder base URL (required, must be absolute http/https).
On submit:

slugify name (lowercase, a–z0–9, hyphens; collapse repeats; trim)

generate numeric suffix (6–8 digits)

compute pathSegment = ${slug}-${suffix}

POST to /api/projects; on success, show the resulting forwarding endpoint:
BASE_URL/<pathSegment>

Project Detail:
Show copyable endpoint, forwarderBaseUrl, created/updated times.
Show Edit button (Dialog using shadcn Form) to update name and forwarderBaseUrl.
Show Delete button with confirmation.
Show last 50 requests (paginated), link to details.

Request Details:
Show metadata: method, status, duration, timestamps, incomingPath, forwardedUrl.
Pretty-print headers (JSON), highlight JSON bodies; if non-JSON, show plaintext preview; if base64, show note and size.

VALIDATION AND EDGE CASES

If project not found for pathSegment: return 404 JSON { error: “Unknown project” } and do not forward.

If forwarderBaseUrl is missing or invalid: 500 JSON { error: “Invalid forwarder url” }.

If upstream fails or times out: return 502/504 with JSON error; still log error.

Preserve request bodies for signature verification (do not mutate content-type; handle raw bytes).

Respect large payloads and streaming where possible; otherwise buffer with size limit and truncate.

DEV AND DEPLOY STEPS (the AI should generate README with exact commands)

Initialize Next.js + Tailwind + shadcn/ui; set up Tailwind config and shadcn registry.

Initialize Prisma, create schema, run prisma migrate dev.

Implement route handlers and pages.

Add seed script to insert a sample project.

Local run with SQLite; provide .env.example with DATABASE_URL.

Vercel deployment instructions; ensure Prisma generate runs in build; if Postgres, include connection string and optional Data Proxy.

ACCEPTANCE CRITERIA

Creating a project yields a unique pathSegment and a visible forwarding endpoint.

Requests to BASE_URL/<pathSegment>/anything are forwarded to the configured base URL with the same path and query, preserving method/headers/body, and the upstream response is relayed back to the caller.

Request/response are logged and visible in the UI.

Projects can be edited (especially forwarderBaseUrl) and deleted.

The app functions on Vercel with no additional manual configuration.

Non-goals for this iteration

No authentication/authorization.

No rate limiting or quota enforcement.

No custom per-project secrets or signature validation (future work).

Produce the entire codebase with this structure, including Prisma schema, migrations, Next.js routes and pages, Tailwind + shadcn setup, and a thorough README.