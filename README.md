# 🎬 Movie Ticket Booking System

<div align="center">

![Movie Ticket Booking](https://img.shields.io/badge/Project-Movie%20Ticket%20Booking-blueviolet?style=for-the-badge&logo=googlemovies)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-orange?style=for-the-badge)

### 🎟️ *"Book Your Seat, Skip the Queue"* 🎟️

</div>

---

## 👥 Team Members

| Index Number | Role |
|:---|:---|
| `ITBNM-2313-0039` | Author-Service |
| `ITBNM-2313-0027` | Movie-Service |
| `ITBNM-2313-0007` | Booking-Service |
| `ITBNM-2313-004` | Notification-Service |
| `ITBNM-2313-0021` | Payment-Service |

---
 
 
# 🎬 Distributed Cinema Booking Microservices Architecture

> A production-grade, distributed microservices architecture for an online cinema ticket booking platform.

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot" />
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring%20Cloud-API%20Gateway-blue?logo=spring" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Docker-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/API%20Docs-Swagger%20%2F%20OpenAPI%203.0-85EA2D?logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-06B6D4?logo=react&logoColor=white" />
</p>

## 📖 Overview

This project is a **distributed, production-grade microservices system** built to power an end-to-end online cinema ticket booking platform. Each core domain — authentication, movies, bookings, notifications, and payments — is implemented as an **independent Spring Boot service**, all fronted by a centralized **Spring Cloud API Gateway** and backed by isolated **MongoDB** databases.

### 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Spring Boot 3.3.5 (Java 21) |
| **API Gateway** | Spring Cloud Gateway |
| **Database** | MongoDB Atlas / MongoDB (Docker Container) |
| **API Documentation** | Swagger UI / OpenAPI 3.0 |
| **Frontend** | React + Tailwind CSS |

---


## 🏛️ System Architecture

This project follows a **microservices architecture**, orchestrated through a central API Gateway.

### 1️⃣ Client Layer
- **React + Tailwind UI** — runs on `Port 3000`
- Sends every request to the API Gateway with:
  - Header: `X-Client-Secret: CinemaClientSecret2026!`
  - Header: `Authorization: Bearer <JWT>`

### 2️⃣ API Gateway
- **Central API Gateway** — runs on `Port 8080`
- Acts as the single entry point for the frontend (Unified Swagger UI Portal included)
- Validates the client secret & JWT, then forwards requests to the relevant microservice
- Injects an internal header before forwarding: `X-API-KEY: SecretApiKey12345`

### 3️⃣ Microservices
| Service | Port | Responsibility |
|---|---|---|
| 🔐 **auth-service** | `8081` | Handles login, registration, JWT issuing |
| 🎬 **movie-service** | `8082` | Manages movies, showtimes, listings |
| 🎟️ **booking-service** | `8083` | Handles seat selection & ticket bookings |
| 📩 **notification-service** | `8084` | Sends booking confirmations / alerts |
| 💳 **payment-service** | `8085` | Processes payments for bookings |

### 4️⃣ Database Layer
Each microservice owns its **own isolated MongoDB database** (Database-per-Service pattern):
- `auth_db` — used by auth-service
- `movie_db` — used by movie-service
- `booking_db` — used by booking-service
- `notification_db` — used by notification-service
- `payment_db` — used by payment-service

### 🔑 Key Design Points
- **Single entry point:** all client traffic goes only through the API Gateway
- **Security:** double-layer verification — client secret + JWT (frontend↔gateway) and API key (gateway↔services)
- **Loose coupling:** each service has its own database, so services can scale/deploy independently
- **Documentation:** unified Swagger UI accessible via the gateway for all service APIs
---

## 🔒 Security Architecture & Headers

The system implements a **dual-layer security perimeter**:

### 1. Client-to-Gateway Secret Key Security
All client HTTP requests communicating with the Central API Gateway (`Port 8080`) must supply the client secret header:

```http
X-Client-Secret: CinemaClientSecret2026!
```

> Requests missing or having an invalid client secret are immediately rejected with HTTP `401 Unauthorized`.

### 2. User Authentication & Authorization (OAuth2 / JWT)
Protected endpoints (such as ticket booking, viewing payment history, managing movies, and dispatching notifications) require a valid **Bearer JWT token** obtained from `/auth/login` or `/auth/register`:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 3. Internal Gateway-to-Microservice Security
Direct access to internal microservices on ports `8081–8085` is strictly guarded. The API Gateway automatically attaches an internal security signature:

```http
X-API-KEY: SecretApiKey12345
```

---

## 📖 Interactive Swagger UI & API Documentation

### Central Aggregated Swagger UI Hub
Open **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)** in your browser.

Use the **Select a definition** dropdown in the top-right corner to switch between all services:

| Definition in Dropdown | Target Microservice | Direct Swagger UI URL |
| :--- | :--- | :--- |
| 1. Central API Gateway | Gateway Routes & Proxy | `http://localhost:8080/swagger-ui.html` |
| 2. Auth Service (Port 8081) | User Registration, Login, JWT |

 👥 Microservices Work Division Matrix

| Student / Module | Microservice API | Port | MongoDB Database | Key Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| Student 1 | `auth-service` | 8081 | `auth_db.users` | `POST /auth/register`<br>`POST /auth/login`<br>`POST /auth/change-password`<br>`GET /auth/profile/{email}`<br>`GET /auth/users`<br>`POST /auth/validate` |
| Student 2 | `movie-service` | 8082 | `movie_db.movies` | `GET /movies`<br>`GET /movies/{id}`<br>`POST /movies`<br>`PUT /movies/{id}`<br>`DELETE /movies/{id}`<br>`GET /movies/coming-soon`<br>`GET /movies/offers` |
| Student| `booking-service` | 8083 | `booking_db.bookings` | `GET /bookings`<br>`GET /bookings/{id}`<br>`GET /bookings/user/{email}`<br>`POST /bookings`<br>`PUT /bookings/{id}/status`<br>`DELETE /bookings/{id}` |
| Student 4| `notification-service` | 8084 | `notification_db.notifications` | `GET /notifications`<br>`GET /notifications/user/{email}`<br>`POST /notifications/send`<br>`PUT /notifications/{id}/read`<br>`DELETE /notifications/{id}` |
| Student 5 / Extra | `payment-service` | 8085 | `payment_db.payments` | `POST /payments/process`<br>`GET /payments`<br>`GET /payments/user/{email}`<br>`GET /payments/bill/{id}` (PDF Receipt)<br>`DELETE /payments/{id}` |
| Orchestration | `api-gateway` | 8080 | — | Central reverse proxy, Client Secret validation, JWT authentication, Rate Limiting, Swagger Aggregation |
| Frontend| React Client App | 3000 | — | Modern React + Tailwind CSS client with automatic `X-Client-Secret` injection |

---

 🚀 Running with Docker Compose (Recommended)

 1. Build and Run all Services in Containers
Execute the single-click build script:
```cmd
build-docker.bat
```
Or run directly in terminal:
```bash
docker compose up --build -d
```

 2. Verify Container Health
```bash
docker compose ps
```

 3. Access Applications
- 🌐 React Client App: [http://localhost:3000](http://localhost:3000)
- 📘 Central Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- ⚡ API Gateway Health: [http://localhost:8080/](http://localhost:8080/)

---

💻 Running Locally (Without Docker)

 1. Start MongoDB
Ensure MongoDB is running on port `27017` or configured via `SPRING_DATA_MONGODB_URI`.

2. Launch Services
Execute the local runner script:
```cmd
run-local.bat
```
Or start each service manually:
```bash
cd auth-service && mvn spring-boot:run
cd movie-service && mvn spring-boot:run
cd booking-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd payment-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
cd frontend && npm run dev
```

---

 🧪 Testing with cURL / Postman

 1. Test Client-to-Gateway Secret Key Security
Without Secret Key (Should return 401 Unauthorized):
```bash
curl -i -X GET http://localhost:8080/movies
```

With Valid Secret Key (Should return 200 OK):
```bash
curl -i -X GET http://localhost:8080/movies \
  -H "X-Client-Secret: CinemaClientSecret2026!"
```

 2. User Registration & Login
```bash
Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"ROLE_USER"}'

 Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -d '{"email":"john@example.com","password":"password123"}'
```

 3. Create Ticket Booking & Process Payment
```bash
curl -X POST http://localhost:8080/bookings \
  -H "Content-Type: application/json" \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "movieTitle": "Dharmayuddhaya 2",
    "customerName": "John Doe",
    "userEmail": "john@example.com",
    "contactNumber": "0771234567",
    "showDate": "2026-08-20",
    "showTime": "18:30",
    "numberOfTickets": 2,
    "ticketPrice": 1500.0,
    "paymentMethod": "Credit / Debit Card"
  }'
```

 4. Download PDF Billing Invoice
```bash
curl -X GET http://localhost:8080/payments/bill/{paymentId} \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  --output invoice.pdf
```
