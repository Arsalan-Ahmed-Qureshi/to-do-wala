# ToDoTask Backend API

RESTful API built with Spring Boot 3.3.1 and PostgreSQL for the ToDoTask application.

## Prerequisites

- Java 21+
- Maven 3.8+
- PostgreSQL 12+
- Git

## Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE todotask_db;
CREATE DATABASE todotask_db_dev;

# Exit psql
\q
```

Or use pgAdmin GUI to create the databases.

## Build

```bash
# Clean build
mvn clean install

# Skip tests
mvn clean install -DskipTests
```

## Run

```bash
# Development mode (with hot reload)
mvn spring-boot:run

# Production mode
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

Server runs at: `http://localhost:8080`

## API Endpoints

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/active` | Get active todos |
| GET | `/api/todos/completed` | Get completed todos |
| GET | `/api/todos/{id}` | Get todo by ID |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/{id}` | Update todo |
| DELETE | `/api/todos/{id}` | Delete todo |
| DELETE | `/api/todos` | Delete all todos |

### Create Todo

```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Spring Boot",
    "description": "Complete Spring Boot tutorial",
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59"
  }'
```

### Get All Todos

```bash
curl http://localhost:8080/api/todos
```

### Update Todo

```bash
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "completed": true
  }'
```

## Testing

```bash
mvn test
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/todotask/
│   │   │   ├── controller/      # REST endpoints
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   └── ToDoTaskApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/
├── pom.xml
└── README.md
```

## Dependencies

- **Spring Boot Web**: REST API framework
- **Spring Data JPA**: Database ORM
- **PostgreSQL Driver**: Database connector
- **Lombok**: Boilerplate reduction
- **Spring Boot Validation**: Input validation
- **JUnit 5**: Testing framework

## Development Notes

- CORS is enabled for frontend at `http://localhost:5173` and `http://localhost:3000`
- Hot reload is enabled via Spring DevTools
- Database schema auto-updates on startup
- All timestamps are in UTC

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running and database exists:

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Or on macOS
brew services list | grep postgresql
```

### Port Already in Use

Change port in `application.properties`:

```properties
server.port=8081
```

## License

MIT
