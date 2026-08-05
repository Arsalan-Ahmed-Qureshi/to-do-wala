# Project Handover & Configuration Guide

Quick setup documentation to configure and run the Todo Task application.

---

## 1. Backend Configuration (Spring Boot)

Database settings are configured in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

### Database Settings (PostgreSQL)
Ensure PostgreSQL is running and update the settings as required:
- **Database URL**: `jdbc:postgresql://localhost:5432/todotask_db`
- **Username**: `postgres` (or your Postgres username)
- **Password**: `admin` (or your Postgres password)

### How to Run:
```bash
cd backend
mvn clean spring-boot:run
```

---

## 2. Frontend Configuration (Vite/React)

The React web application uses HTTP endpoints to communicate with the Spring Boot backend. 

### API Base URL Setting
Check or update Settings in [frontend/src/services/api.js](frontend/src/services/api.js) or [frontend/src/services/authAPI.js](frontend/src/services/authAPI.js) to configure backend communication context.

### How to Run:
```bash
cd frontend
npm install
npm run dev
```

---

## 3. Mobile App Configuration (React Native / Expo)

Offline synchronization mechanics and API contexts are hosted in the `mobile` workspace.

### Setting the Base URL 
The Mobile application calls the backend via [mobile/src/services/api/axiosConfig.js](mobile/src/services/api/axiosConfig.js). 
To point the app to your active backend (e.g. your local server or tunnel):

1. Open [mobile/src/services/api/axiosConfig.js](mobile/src/services/api/axiosConfig.js).
2. Change the `API_BASE_URL` value:
   ```javascript
   // For Simulator/Emulator or Ngrok testing:
   const API_BASE_URL = 'https://YOUR-NGROK-SUBDOMAIN.ngrok-free.app/api'; 
   // Or point directly to your system IP if testing on same LAN:
   const API_BASE_URL = 'http://192.168.x.x:8080/api';
   ```

### How to Run:
```bash
cd mobile
npm install
npx expo start
```
