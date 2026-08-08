# ToDoTask - Full Stack Application

A modern, full-stack task management application built with **Spring Boot** (Backend) and **React + Vite** (Frontend). Designed for productivity with a clean, intuitive interface.

## 🚀 Quick Start

### Prerequisites

- **Java 21+** and Maven 3.8+
- **Node.js 18+** and npm 9+
- **PostgreSQL 12+**

### 1. Database Setup

Create PostgreSQL databases:

```bash
psql -U postgres

CREATE DATABASE todotask_db;
CREATE DATABASE todotask_db_dev;

\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Run development server
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📁 Project Structure

```
TODO-Project-Expriments/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/todotask/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── entity/             # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   └── ToDoTaskApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-dev.properties
│   ├── pom.xml
│   └── README.md
│
├── frontend/                   # React + Vite App
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
│
├── .gitignore
└── README.md
```

## 🔧 Technology Stack

### Backend
- **Spring Boot 3.3.1** - REST API framework
- **Spring Data JPA** - ORM & database abstraction
- **PostgreSQL 42.7.1** - Database
- **Lombok** - Reduce boilerplate
- **Maven** - Build automation
- **Java 21** - Programming language

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool (lightning fast)
- **Axios** - HTTP client
- **React Router 6** - Routing (future mobile)
- **CSS Modules** - Component-scoped styling

## 📋 Features

### Current (Web)
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Filter tasks (All, Active, Completed)
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Due date management
- ✅ Task descriptions
- ✅ Responsive design
- ✅ Real-time API integration

### Future (Mobile)
- 📱 React Native mobile app
- 📲 Push notifications
- 🔔 Task reminders
- 📊 Analytics dashboard
- 👥 Collaboration features
- ☁️ Cloud sync

## 🎯 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all tasks |
| GET | `/todos/active` | Get active tasks |
| GET | `/todos/completed` | Get completed tasks |
| GET | `/todos/{id}` | Get task by ID |
| POST | `/todos` | Create new task |
| PUT | `/todos/{id}` | Update task |
| DELETE | `/todos/{id}` | Delete task |
| DELETE | `/todos` | Delete all tasks |

### Request/Response Examples

**Create Task**
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the ToDoTask project",
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59"
  }'
```

**Response**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the ToDoTask project",
  "priority": "HIGH",
  "completed": false,
  "dueDate": "2024-12-31T23:59:59",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

## 🏗️ Development

### Running Tests

**Backend**
```bash
cd backend
mvn test
```

**Frontend**
```bash
cd frontend
npm test
```

### Build for Production

**Backend**
```bash
cd backend
mvn clean package -DskipTests
```

**Frontend**
```bash
cd frontend
npm run build
```

## 🔐 Database Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todotask_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## 📝 Environment Variables

### Backend
Create `.env` file in backend directory (optional):
```
DB_URL=jdbc:postgresql://localhost:5432/todotask_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### Frontend
Create `.env` file in frontend directory (optional):
```
VITE_API_URL=http://localhost:8080/api
```

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database exists: `psql -U postgres -d todotask_db`
- Check port 8080 is available

### Frontend API calls fail
- Ensure backend is running on `http://localhost:8080`
- Check CORS settings in `ToDoTaskApplication.java`
- Verify proxy config in `vite.config.js`

### Database errors
- Reset database:
  ```bash
  DROP DATABASE todotask_db;
  CREATE DATABASE todotask_db;
  ```
- Check `application-dev.properties` has `ddl-auto=create-drop`

## 📚 Useful Commands

```bash
# Backend: Hot reload
mvn spring-boot:run

# Frontend: Development mode
npm run dev

# Format code (both)
mvn spotless:apply        # Backend
npm run lint:fix          # Frontend (add to package.json)

# Check dependencies for vulnerabilities
mvn dependency-check:check # Backend
npm audit                 # Frontend
```

## 🚀 Deployment
### Docker
The backend now includes Docker support and a Docker Compose setup to run the API with PostgreSQL for development.

Files added:
- `backend/Dockerfile`
- `backend/.dockerignore`
- `docker-compose.yml` (project root)

Build and run the backend image (connect to a host DB or use Compose):
```bash
docker build -t todotask-backend:latest backend
docker run \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/todotask_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -p 8080:8080 \
  todotask-backend:latest
```

Run backend + Postgres with Docker Compose (recommended for development):
```bash
docker compose up --build
```

Notes:
- The application reads DB configuration from environment variables: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
- When using Compose the backend connects to the DB at `jdbc:postgresql://db:5432/todotask_db` (set in `docker-compose.yml`).
- Use `host.docker.internal` when the database runs on your host and a container needs to reach it.

### Cloud Deployment
- AWS ECS
- Azure Container Instances
- Google Cloud Run

## 📖 Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 👨‍💻 Development Team

Built with ❤️ by an experienced software engineer

## 📄 License

MIT License - feel free to use this project!

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Happy tasking! 🎉**
