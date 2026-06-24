# Implant Swiss FC ⚽

Full-stack football club management platform.

## Backend
- Spring Boot 3.2 + Java 17
- RESTful API with JWT authentication
- Player, Match, Goal CRUD
- Role-based access (ADMIN, COACH, PLAYER)
- Swagger UI at /swagger-ui.html

## Frontend
- React + Vite + Tailwind CSS
- Dark mode design
- Sky Blue #3E8FCB / Burgundy #7A1E1E

## Quick Start
See backend/ and frontend/ for respective instructions.

### Backend
```bash
cd backend
export JAVA_HOME=~/jdk17 && export PATH=$JAVA_HOME/bin:$PATH
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
