# Gotcha 🎯

Full-stack web application built with React (frontend) and Spring Boot (backend).

## Tech Stack

### Backend
- **Spring Boot 3.2** - Java web framework
- **Spring Data JPA** - ORM for database operations
- **Spring Data Redis** - Redis caching
- **PostgreSQL** - Primary database
- **Swagger/OpenAPI 3.0** - API documentation
- **Maven** - Build tool
- **Lombok** - Java boilerplate reduction
- **Spring Boot DevTools** - Hot reload during development

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management (optional)

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL 16** - Relational database
- **Redis 7** - In-memory cache

## Project Structure

```
gotcha/
├── backend/                          # Spring Boot application
│   ├── pom.xml                      # Maven configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/gotcha/
│   │   │   │   ├── GotchaApplication.java
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data access
│   │   │   │   └── dto/             # Data transfer objects
│   │   │   └── resources/
│   │   │       └── application.yml  # Configuration
│   │   └── test/                    # Test files
│   └── target/                      # Build output
│
├── frontend/                         # React application
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── App.css
│       └── pages/                   # Page components
│           ├── UserList.js
│           ├── UserDetail.js
│           └── CreateUser.js
│
├── docker-compose.yml               # Docker services configuration
└── README.md
```

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Docker & Docker Compose** (for database and cache)
- **Maven 3.9+** (for building backend)

## Getting Started

### 1. Start Database and Cache Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

Verify services are running:
```bash
docker-compose ps
```

### 2. Build and Run Backend

```bash
cd backend

# Install dependencies and build
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

Backend will be available at: `http://localhost:5000/api`

#### Access Swagger UI
- Navigate to: `http://localhost:5000/api/swagger-ui.html`
- API docs (JSON): `http://localhost:5000/api/v3/api-docs`

### 3. Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will automatically open at: `http://localhost:5001`

## API Endpoints

All endpoints are prefixed with `/api`

### User Management
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `GET /users/username/{username}` - Get user by username
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /health` - API health check

### Request/Response Example

**Create User (POST /users)**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

## Configuration

### Backend Configuration (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/gotcha_db
    username: gotcha_user
    password: gotcha_password
  
  redis:
    host: localhost
    port: 6379
  
  jpa:
    hibernate:
      ddl-auto: update

server:
  port: 8080
  servlet:
    context-path: /api
```

### Frontend Configuration

Frontend connects to backend via proxy configured in `package.json`:
```json
"proxy": "http://localhost:5000/api"
```

## Database

### Tables Created by JPA

The application will automatically create the following table:

**users**
- `id` (BIGSERIAL) - Primary key
- `username` (VARCHAR, UNIQUE) - User's username
- `email` (VARCHAR, UNIQUE) - User's email
- `password` (VARCHAR) - User's password
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Caching

Redis is configured for caching user data:

- `@Cacheable` - Caches method results
- `@CacheEvict` - Invalidates cache on updates
- Cache key format: `users::{id or username}`

## Development

### Hot Reload

**Backend**: Spring Boot DevTools enables automatic restart when files change.

**Frontend**: React development server hot-reloads when you save files.

### Running Tests

**Backend**:
```bash
cd backend
mvn test
```

**Frontend**:
```bash
cd frontend
npm test
```

### Building for Production

**Backend**:
```bash
cd backend
mvn clean package
# JAR will be in backend/target/gotcha-1.0.0.jar
```

**Frontend**:
```bash
cd frontend
npm run build
# Build will be in frontend/build/
```

## Docker Deployment

### Build Docker Image for Backend

```bash
cd backend
docker build -t gotcha-backend:latest .
```

### Deploy with Docker Compose (production setup)

Create a `docker-compose.prod.yml` to include the backend service.

## Troubleshooting

### PostgreSQL Connection Failed
- Ensure PostgreSQL is running: `docker-compose ps`
- Check credentials in `application.yml`
- Verify port 5432 is not blocked

### Redis Connection Failed
- Ensure Redis is running: `docker-compose ps`
- Check Redis is accessible: `redis-cli ping`

### Port Already in Use
- Backend (8080): `lsof -i :8080` and kill the process
- Frontend (3000): `lsof -i :3000` and kill the process
- PostgreSQL (5432): Docker may need restart

### Frontend Can't Connect to Backend
- Ensure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify proxy configuration in `frontend/package.json`

## Security Notes

⚠️ **This is a development setup. For production:**

- Use environment variables for sensitive data (database credentials, API keys)
- Implement proper authentication (JWT, OAuth2)
- Add input validation and sanitization
- Use HTTPS
- Implement rate limiting
- Add comprehensive error handling
- Use secrets management tools

## Performance Optimization Tips

1. **Database**
   - Add indexes on frequently queried columns
   - Use pagination for large datasets
   - Implement query optimization

2. **Caching**
   - Configure appropriate TTL for cached data
   - Monitor cache hit rates
   - Clear cache on data changes

3. **Frontend**
   - Code splitting with React Router
   - Lazy load components
   - Optimize images
   - Minify CSS/JS for production

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT License

## Support

For issues and questions:
1. Check troubleshooting section
2. Review API documentation (Swagger UI)
3. Check application logs

## Next Steps

1. Implement authentication (Spring Security)
2. Add input validation (Validation starter)
3. Create unit and integration tests
4. Implement error handling
5. Add API pagination and filtering
6. Deploy to cloud platform (AWS, Azure, GCP)
7. Set up CI/CD pipeline
