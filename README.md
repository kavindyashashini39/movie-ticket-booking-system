# 🎬 Distributed Cinema Booking Microservices Architecture

A production-grade, distributed microservices architecture built with **Spring Boot 3.3.5 (Java 21)**, **Spring Cloud API Gateway**, **MongoDB Atlas / MongoDB Docker Container**, **Swagger UI / OpenAPI 3.0**, and a **React + Tailwind CSS** client application.

---

## 🏛️ System Architecture

```
                                 ┌─────────────────────────────────┐
                                 │       React + Tailwind UI       │
                                 │        (Port 3000 / Web)        │
                                 └────────────────┬────────────────┘
                                                  │ 
                                                  │ Header: X-Client-Secret: CinemaClientSecret2026!
                                                  │ Header: Authorization: Bearer <JWT>
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │       Central API Gateway       │
                                 │           (Port 8080)           │
                                 │    Unified Swagger UI Portal    │
                                 └────────────────┬────────────────┘
                                                  │ Injects Header: X-API-KEY: SecretApiKey12345
        ┌──────────────────┬──────────────────────┼──────────────────────┬──────────────────┐
        │                  │                      │                      │                  │
        ▼                  ▼                      ▼                      ▼                  ▼
┌──────────────┐   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐   ┌──────────────┐
│ auth-service │   │movie-service │       │booking-servic│       │notification- │   │payment-servic│
│ (Port 8081)  │   │ (Port 8082)  │       │ (Port 8083)  │       │ (Port 8084)  │   │ (Port 8085)  │
└──────┬───────┘   └──────┬───────┘       └──────┬───────┘       └──────┬───────┘   └──────┬───────┘
       │                  │                      │                      │                  │
       ▼                  ▼                      ▼                      ▼                  ▼
┌──────────────┐   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐   ┌──────────────┐
│  auth_db     │   │  movie_db    │       │  booking_db  │       │notification_d│   │  payment_db  │
│  (MongoDB)   │   │  (MongoDB)   │       │  (MongoDB)   │       │  (MongoDB)   │   │  (MongoDB)   │
└──────────────┘   └──────────────┘       └──────────────┘       └──────────────┘   └──────────────┘
```

---

## 🔒 Security Architecture & Headers

The system implements a dual-layer security perimeter:

### 1. Client-to-Gateway Secret Key Security
All client HTTP requests communicating with the **Central API Gateway (Port 8080)** must supply the client secret header:
```http
X-Client-Secret: CinemaClientSecret2026!
```
*Requests missing or having an invalid client secret are immediately rejected with HTTP `401 Unauthorized`.*

### 2. User Authentication & Authorization (OAuth2 / JWT)
Protected endpoints (such as ticket booking, viewing payment history, managing movies, and dispatching notifications) require a valid Bearer JWT token obtained from `/auth/login` or `/auth/register`:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 3. Internal Gateway-to-Microservice Security
Direct access to internal microservices on ports 8081–8085 is strictly guarded. The API Gateway automatically attaches an internal security signature:
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
| **1. Central API Gateway** | Gateway Routes & Proxy | `http://localhost:8080/swagger-ui.html` |
| **2. Auth Service (Port 8081)** | User Registration, Login, JWT | `http://localhost:8081/swagger-ui.html` |
| **3. Movie Service (Port 8082)** | Movie Catalog CRUD & Trailers | `http://localhost:8082/swagger-ui.html` |
| **4. Booking Service (Port 8083)** | Ticket Reservations & Orders | `http://localhost:8083/swagger-ui.html` |
| **5. Notification Service (Port 8084)** | Email & SMS Notifications | `http://localhost:8084/swagger-ui.html` |
| **6. Payment Service (Port 8085)** | Payment Gateway & PDF Bills | `http://localhost:8085/swagger-ui.html` |

---

## 👥 Microservices Work Division Matrix

| Student / Module | Microservice API | Port | MongoDB Database | Key Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Student 1** | `auth-service` | 8081 | `auth_db.users` | `POST /auth/register`<br>`POST /auth/login`<br>`POST /auth/change-password`<br>`GET /auth/profile/{email}`<br>`GET /auth/users`<br>`POST /auth/validate` |
| **Student 2** | `movie-service` | 8082 | `movie_db.movies` | `GET /movies`<br>`GET /movies/{id}`<br>`POST /movies`<br>`PUT /movies/{id}`<br>`DELETE /movies/{id}`<br>`GET /movies/coming-soon`<br>`GET /movies/offers` |
| **Student 3** | `booking-service` | 8083 | `booking_db.bookings` | `GET /bookings`<br>`GET /bookings/{id}`<br>`GET /bookings/user/{email}`<br>`POST /bookings`<br>`PUT /bookings/{id}/status`<br>`DELETE /bookings/{id}` |
| **Student 4** | `notification-service` | 8084 | `notification_db.notifications` | `GET /notifications`<br>`GET /notifications/user/{email}`<br>`POST /notifications/send`<br>`PUT /notifications/{id}/read`<br>`DELETE /notifications/{id}` |
| **Student 5 / Extra** | `payment-service` | 8085 | `payment_db.payments` | `POST /payments/process`<br>`GET /payments`<br>`GET /payments/user/{email}`<br>`GET /payments/bill/{id}` (PDF Receipt)<br>`DELETE /payments/{id}` |
| **Orchestration** | `api-gateway` | 8080 | — | Central reverse proxy, Client Secret validation, JWT authentication, Rate Limiting, Swagger Aggregation |
| **Frontend** | React Client App | 3000 | — | Modern React + Tailwind CSS client with automatic `X-Client-Secret` injection |

---

## 🚀 Running with Docker Compose (Recommended)

### 1. Build and Run all Services in Containers
Execute the single-click build script:
```cmd
build-docker.bat
```
Or run directly in terminal:
```bash
docker compose up --build -d
```

### 2. Verify Container Health
```bash
docker compose ps
```

### 3. Access Applications
- 🌐 **React Client App**: [http://localhost:3000](http://localhost:3000)
- 📘 **Central Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- ⚡ **API Gateway Health**: [http://localhost:8080/](http://localhost:8080/)

---

## 💻 Running Locally (Without Docker)

### 1. Start MongoDB
Ensure MongoDB is running on port `27017` or configured via `SPRING_DATA_MONGODB_URI`.

### 2. Launch Services
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

## 🧪 Testing with cURL / Postman

### 1. Test Client-to-Gateway Secret Key Security
**Without Secret Key (Should return 401 Unauthorized):**
```bash
curl -i -X GET http://localhost:8080/movies
```

**With Valid Secret Key (Should return 200 OK):**
```bash
curl -i -X GET http://localhost:8080/movies \
  -H "X-Client-Secret: CinemaClientSecret2026!"
```

### 2. User Registration & Login
```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"ROLE_USER"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3. Create Ticket Booking & Process Payment
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

### 4. Download PDF Billing Invoice
```bash
curl -X GET http://localhost:8080/payments/bill/{paymentId} \
  -H "X-Client-Secret: CinemaClientSecret2026!" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  --output invoice.pdf
```
