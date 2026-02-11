# 🔗 URL Shortener

REST API for shortening URLs, with click tracking and automatic redirection.

## 📋 Features

- ✅ Shorten long URLs by generating unique codes
- ✅ Automatic redirection to original URL
- ✅ Real-time click tracking
- ✅ List created links
- ✅ Data persistence with SQLite

## 🚀 Technologies

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express](https://expressjs.com/)** - Minimalist web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Prisma](https://www.prisma.io/)** - Modern ORM for Node.js
- **[SQLite](https://www.sqlite.org/)** - Lightweight relational database
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - High-performance SQLite driver

## 📦 Prerequisites

- Node.js 18+ or Bun
- npm or bun

## 🔧 Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd api
```

2. **Install dependencies:**

```bash
npm install
# or
bun install
```

3. **Configure environment variables:**

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

4. **Run database migrations:**

```bash
npx prisma migrate dev
```

5. **Generate Prisma Client:**

```bash
npx prisma generate
```

## ▶️ Running the project

### Development mode

```bash
npm run dev
# or
bun run dev
```

The server will be running at `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check

```http
GET /ping
```

**Response:**

```json
{
    "message": "pong"
}
```

### 2. Create shortened link

```http
POST /links
Content-Type: application/json

{
  "original": "https://example.com/very-long-url"
}
```

**Response:**

```json
{
    "message": "Link criado com sucesso!",
    "url": "http://localhost:3000/abc123"
}
```

### 3. Redirect to original URL

```http
GET /:code
```

Example: `GET /abc123`

Redirects (HTTP 302) to the original URL and increments the click counter.

## 🗄️ Database Structure

### Model: Link

| Field     | Type     | Description                 |
| --------- | -------- | --------------------------- |
| id        | String   | Unique ID (CUID)            |
| original  | String   | Original URL                |
| shortCode | String   | Unique short code (6 chars) |
| clicks    | Int      | Click counter               |
| createdAt | DateTime | Creation date               |

## 📁 Project Structure

```
api/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Prisma migrations
├── src/
│   ├── db/
│   │   └── db-config.ts    # SQLite adapter configuration
│   ├── links/
│   │   └── route.ts        # Links routes
│   └── index.ts            # Main server
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── .env                    # Environment variables (create this)
```

## 🛠️ Available Scripts

- `npm run dev` - Start server in development mode with hot reload
- `npx prisma studio` - Open visual database interface
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma generate` - Generate Prisma Client

## 📝 Usage Example

```bash
# Create a shortened link
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"original": "https://github.com/prisma/prisma"}'

# Access the shortened link (via browser or curl)
curl -L http://localhost:3000/abc123
```

## 🔒 Graceful Shutdown

The server is configured to safely disconnect the Prisma Client when receiving the SIGINT signal (Ctrl+C).
