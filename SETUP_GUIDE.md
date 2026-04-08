# Gotcha Project Setup Guide

Complete setup instructions for the full-stack Gotcha application.

## Quick Start (5 minutes)

### Prerequisites Check
```bash
# Java version (should be 17+)
java -version

# Maven version (should be 3.9+)
mvn -v

# Node.js version (should be 18+)
node -v
npm -v

# Docker (should be running)
docker --version
docker-compose --version
```

### 1. Start Infrastructure (1 minute)

```bash
# From project root directory
docker-compose up -d

# Wait for services to be healthy
docker-compose ps
```

**Expected Output:**
```
NAME              STATUS
gotcha-postgres   Up (healthy)
gotcha-redis      Up (healthy)
```

### 2. Start Backend (2 minutes)

```bash
cd backend

# First time setup
mvn clean install

# Start the application
mvn spring-boot:run
```

**Success indicator:**
```
Started GotchaApplication in X.XXX seconds
```

### 3. Start Frontend (2 minutes)

In a **new terminal**:

```bash
cd frontend

# First time setup
npm install

# Start development server
npm start
```

**Success indicator:**
- Browser automatically opens to `http://localhost:5001`
- You see the Gotcha application

## Detailed Setup

### Step 1: Database & Cache Setup

#### Option A: Using Docker (Recommended)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (resets data)
docker-compose down -v
```

#### Option B: Manual Setup

Install PostgreSQL and Redis locally, then update `application.yml` with your connection details.

### Step 2: Backend Setup

#### Clone/Extract Project
```bash
# Navigate to backend directory
cd backend
```

#### Install Dependencies
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile Java code
- Run tests
- Build JAR file

#### Run Application
```bash
mvn spring-boot:run
```

Or run from IDE:
- Open as Maven project
- Run `GotchaApplication.java`

#### Verify Backend

```bash
# Test API health
curl http://localhost:5000/api/health

# View Swagger documentation
# Open browser to: http://localhost:5000/api/swagger-ui.html
```

### Step 3: Frontend Setup

#### Navigate to Frontend
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm start
```

The app will:
- Open automatically in browser
- Hot-reload on file changes
- Show build errors in console

#### Verify Frontend

- Confirm you can see the Gotcha homepage
- Navigation links work
- API calls reach the backend

## Development Workflow

### Making Backend Changes

1. Edit files in `backend/src/`
2. Save changes
3. DevTools will automatically rebuild
4. Test changes via Swagger UI or API calls

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Changes hot-reload instantly
3. View in browser

### Database Schema Changes

1. Edit entity classes in `entity/` package
2. JPA will automatically create/update tables
3. Check PostgreSQL to verify changes

### Restart Services

```bash
# If something breaks, restart the entire stack

# Stop everything
docker-compose down
mvn clean
npm clean

# Start fresh
docker-compose up -d
mvn clean install && mvn spring-boot:run
npm install && npm start
```

## API Testing

### Using Swagger UI
1. Open `http://localhost:5000/api/swagger-ui.html`
2. Expand API sections
3. Click "Try it out" on any endpoint
4. Fill in parameters
5. Click "Execute"

### Using curl

```bash
# Get all users
curl http://localhost:5000/api/users

# Get user by ID
curl http://localhost:5000/api/users/1

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123"}'

# Update user
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"username":"newname","email":"new@example.com"}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/1
```

### Using Postman/Insomnia

1. Import API docs from: `http://localhost:5000/api/v3/api-docs`
2. Or manually create requests using curl examples above

## Debugging

### Backend Debugging

#### View Logs
```bash
# If running in IDE, see Console tab
# If running from maven:
mvn spring-boot:run -X  # Verbose logging
```

#### Enable Debug Mode
Edit `application.yml`:
```yaml
logging:
  level:
    root: DEBUG
    com.example.gotcha: DEBUG
```

#### Debug in IDE
1. Set breakpoints in code
2. Run as "Debug" instead of "Run"
3. Execute API calls to hit breakpoints

### Frontend Debugging

1. Open Browser DevTools (F12)
2. Check Console tab for errors
3. Use Network tab to inspect API calls
4. Use React DevTools extension

#### Common Issues
- Port 3000 already in use: `lsof -i :3000` then `kill -9 <PID>`
- Backend not responding: Check if running on port 8080
- Database connection error: Check Docker containers are healthy

### Database Debugging

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U gotcha_user -d gotcha_db

# Common commands:
\dt                    # List tables
\d users               # Describe users table
SELECT * FROM users;   # Query users
```

## Common Tasks

### View Application Logs

```bash
# Backend logs
docker-compose logs postgres
docker-compose logs redis

# Or check Maven/IDE console
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove data volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Restart backend (will recreate tables)
mvn spring-boot:run
```

### Clear React Cache

```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Update Dependencies

**Backend:**
```bash
cd backend
mvn versions:display-dependency-updates
mvn versions:update-properties
```

**Frontend:**
```bash
cd frontend
npm outdated
npm update
```

## Performance Tuning

### Backend Performance
- Database connection pooling configured
- Redis caching enabled by default
- DevTools disabled in production configuration

### Frontend Performance
- Code splitting enabled with React Router
- Bundle size: Monitor with `npm run build`
- Network: Use browser DevTools Network tab

### Database Performance
- Use indexes for frequently queried columns
- Monitor slow queries in PostgreSQL logs
- Optimize N+1 queries with JOIN FETCH

## Production Deployment

This setup is for **development only**.

### For Production:

1. **Environment Variables**
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault)
   - Never commit `.env` files

2. **Authentication**
   - Implement JWT tokens
   - Use Spring Security
   - Hash passwords with bcrypt

3. **API Security**
   - CORS properly configured
   - Rate limiting
   - Input validation
   - SQL injection prevention

4. **Infrastructure**
   - Deploy behind reverse proxy (Nginx)
   - Use managed databases
   - Enable HTTPS/TLS
   - Set up monitoring and logging

5. **Container Deployment**
   - Create Dockerfile for backend
   - Use container registry (Docker Hub, ECR)
   - Deploy with Kubernetes or Docker Swarm

## Useful Resources

### Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [OpenAPI/Swagger](https://swagger.io/specification/)

### Tools
- [Postman](https://www.postman.com/) - API Testing
- [DBeaver](https://dbeaver.io/) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code Editor
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) - Java IDE

### Learning
- Spring Boot: `https://spring.io/guides`
- React Hooks: `https://react.dev/reference/react/hooks`
- RESTful API Design: `https://restfulapi.net/`

## Support & Troubleshooting

### Getting Help
1. Check README.md for detailed documentation
2. Review SETUP_GUIDE.md (this file)
3. Check application logs
4. Google the error message
5. Check Stack Overflow

### Reporting Issues
Include:
- Error message and stack trace
- What you were doing
- What you expected to happen
- Your environment (Java version, Node version, etc.)
- Full command output

## Next Steps

After successful setup:

1. **Explore the API** - Use Swagger UI to test endpoints
2. **Create sample data** - Add test users through the UI
3. **Customize** - Modify entities, controllers, and components
4. **Add features** - Implement authentication, more entities, etc.
5. **Write tests** - Add unit and integration tests
6. **Deploy** - Push to production when ready

Good luck! 🚀
