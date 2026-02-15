# 🔗 URL Shortener

REST API for shortening URLs, with click tracking and automatic redirection.

## 📋 Features

- ✅ Shorten long URLs by generating unique codes
- ✅ URL validation (http/https, protocol and TLD required)
- ✅ Automatic redirection to original URL
- ✅ Real-time click tracking
- ✅ List all created links
- ✅ JWT authentication system
- ✅ Protected routes with JWT middleware
- ✅ Interactive API documentation with Swagger/OpenAPI
- ✅ Configurable base URL for shortened links

## 🚀 Technologies

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express](https://expressjs.com/)** - Minimalist web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Prisma](https://www.prisma.io/)** - Modern ORM for Node.js
- **[SQLite](https://www.sqlite.org/)** - Lightweight relational database
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - High-performance SQLite driver
- **[Validator](https://github.com/validatorjs/validator.js)** - String validation library
- **[JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** - JSON Web Token implementation
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing library
- **[Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)** - Auto-generated API documentation
- **[Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)** - JSDoc annotations for OpenAPI

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
BASE_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

| Variable       | Required | Description                                                   |
| -------------- | -------- | ------------------------------------------------------------- |
| `PORT`         | Yes      | Port the server will listen on                                |
| `DATABASE_URL` | Yes      | SQLite connection string (e.g. `file:./dev.db`)               |
| `BASE_URL`     | Yes      | Base URL for shortened links (e.g. `http://localhost:3000`)   |
| `JWT_SECRET`   | Yes      | Secret key for JWT token signing (use a strong random string) |

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

### 📚 Interactive Documentation

Access the complete interactive API documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out feature to test endpoints directly
- Authentication support (JWT tokens)

---

### Authentication Endpoints

#### 1. Register new user

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (201):**

```json
{
    "message": "User Created"
}
```

**Error Responses:**

- **400 Bad Request:** Email or password missing
- **409 Conflict:** User already exists

#### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):** Unauthorized - Invalid credentials

---

### Link Endpoints

#### 1. Health Check

```http
GET /ping
```

**Response:**

```json
{
    "message": "pong"
}
```

#### 2. Create shortened link

🔒 **Protected route - Requires authentication**

```http
POST /links
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "original": "https://example.com/very-long-url"
}
```

**Success Response (201):**

```json
{
    "message": "Link criado com sucesso!",
    "shortCode": "abc123",
    "url": "http://localhost:3000/abc123"
}
```

**Error Responses:**

- **400 Bad Request:** Invalid URL (missing protocol, invalid format, etc.)
    ```json
    { "message": "URL inválida" }
    ```
- **401 Unauthorized:** Missing or invalid JWT token

#### 3. Redirect to original URL

```http
GET /:code
```

Example: `GET /abc123`

Redirects (HTTP 302) to the original URL and increments the click counter.

**Error Response (404):** Link not found

```json
{
    "message": "Link não encontrado"
}
```

#### 4. List all links

🔒 **Protected route - Requires authentication**

```http
GET /links/all
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**

```json
[
    {
        "id": "clxyz123...",
        "original": "https://example.com/page",
        "shortCode": "abc123",
        "clicks": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
    }
]
```

**Error Response:**

- **401 Unauthorized:** Missing or invalid JWT token

## 🗄️ Database Structure

### Model: Link

| Field     | Type     | Description                 |
| --------- | -------- | --------------------------- |
| id        | String   | Unique ID (CUID)            |
| original  | String   | Original URL                |
| shortCode | String   | Unique short code (6 chars) |
| clicks    | Int      | Click counter               |
| createdAt | DateTime | Creation date               |

### Model: User

| Field        | Type     | Description            |
| ------------ | -------- | ---------------------- |
| id           | String   | Unique ID (CUID)       |
| email        | String   | User email (unique)    |
| passwordHash | String   | Bcrypt hashed password |
| createdAt    | DateTime | Account creation date  |

## 📁 Project Structure

```
api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Prisma migrations
│   └── prisma.config.ts       # Prisma configuration
├── src/
│   ├── config/
│   │   └── swagger.ts         # Swagger/OpenAPI configuration
│   ├── db/
│   │   └── db-config.ts       # SQLite adapter configuration
│   ├── middlewares/
│   │   └── jwtMiddleware.ts   # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoute.ts       # Authentication routes
│   │   ├── linkRoute.ts       # Links routes
│   │   ├── auth/
│   │   │   ├── login.ts       # Login handler
│   │   │   └── register.ts    # User registration handler
│   │   └── links/
│   │       ├── create.ts      # Create shortened link
│   │       ├── findAll.ts     # List all links
│   │       ├── redirect.ts    # Redirect by short code
│   │       └── validator/
│   │           └── urlValidator.ts # URL validation
│   └── index.ts               # Main server
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── .env                       # Environment variables (create this)
```

## 🛠️ Available Scripts

- `npm run dev` - Start server in development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start server in production mode
- `npx prisma studio` - Open visual database interface
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma generate` - Generate Prisma Client

## 🐳 Docker

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

To use a custom base URL with Docker, add `BASE_URL` to the `environment` section in `docker-compose.yml`:

```yaml
environment:
    - NODE_ENV=production
    - PORT=3000
    - DATABASE_URL=file:/app/data/dev.db
    - BASE_URL=https://seusite.com
```

### Using Docker directly

```bash
# Build image
docker build -t url-shortener-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="file:/app/data/dev.db" \
  -e BASE_URL="http://localhost:3000" \
  -v url-shortener-data:/app/data \
  url-shortener-api
```

The API will be available at `http://localhost:3000`

## 📝 Usage Examples

### Authentication Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123"}'

# 2. Login to get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123"}'

# Response: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Link Management

```bash
# 3. Create a shortened link (using the token from login)
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"original": "https://github.com/prisma/prisma"}'

# 4. List all links (requires authentication)
curl http://localhost:3000/links/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# 5. Access the shortened link (no authentication needed)
curl -L http://localhost:3000/abc123
```

### Interactive Testing

For easier testing, use the Swagger UI at `http://localhost:3000/api-docs`:

1. Click "Authorize" button
2. Enter your JWT token: `Bearer YOUR_TOKEN_HERE`
3. Test all endpoints interactively

## 🔒 Graceful Shutdown

The server is configured to safely disconnect the Prisma Client when receiving the SIGINT signal (Ctrl+C).
