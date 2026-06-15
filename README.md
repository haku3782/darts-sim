# Darts Physics Simulator

*Read this in other languages: [English](README.md), [日本語](README.ja.md)*

An interactive 3D darts physics simulation and setting optimization web application. Built with a decoupled cloud-native architecture — a React/TypeScript frontend for 3D rendering and a Spring Boot/Java backend for physics computation.

🚀 **[Live Demo](https://darts-sim-web.vercel.app/)**
🔗 **API Endpoint:** `https://darts-sim-api.onrender.com/api`

---

## 🎯 Key Features

- **3D Physics Visualization:** Real-time rendering of dart trajectories, factoring in barrel/shaft weight distribution and aerodynamics.
- **Setting Simulator:** Interactive configuration to test different combinations of barrels, shafts, and flights.
- **Physics Engine:** Calculates dart flight paths based on parameters such as barrel weight, shaft length, and flight drag.
- **Containerized Architecture:** Fully Dockerized backend using multi-stage builds for consistent environments from local to production.
- **Automated CI/CD:** GitHub Actions pipeline for automated testing and deployment of both frontend and backend.

---

## 🛠 Tech Stack

### Frontend (`darts-sim-web`)

| | |
|---|---|
| Framework | React 18 (TypeScript) |
| Build Tool | Vite |
| Hosting | Vercel |

### Backend (`darts-sim-api`)

| | |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3 |
| Build Tool | Maven |
| Containerization | Docker |
| Hosting | Render |

---

## 🏗 System Architecture

```mermaid
graph TD
    Dev((Developer))
    User((End User))

    subgraph "Frontend Hosting (Vercel)"
        React[React / TypeScript<br/>UI & 3D Rendering]
    end

    subgraph "Backend Hosting (Render)"
        Spring[Spring Boot / Java 21<br/>Physics Engine API]
        Docker((Docker Container))
        Spring --- Docker
    end

    subgraph "CI/CD & Source Control"
        Repo[(GitHub)]
        Actions[GitHub Actions<br/>Automated Testing]
    end

    Dev -->|"1. Push Code"| Repo
    Repo -->|"2. Trigger"| Actions
    Actions -->|"3. Deploy if Test Passes"| Spring
    Repo -->|"Auto Deploy"| React

    User -->|"A. Access Site"| React
    React -->|"B. REST API (JSON)<br/>Request Physics Calc"| Spring
    Spring -.->|"C. Return Computation"| React
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Java 21 (JDK)**
- **Maven** (optional — Maven Wrapper is included)
- **Docker** (optional — for containerized backend)

### Clone the repository

```bash
git clone https://github.com/haku3782/darts-sim.git
cd darts-sim
```

### Frontend

```bash
cd darts-sim-web
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

> To fetch live data locally, ensure the backend is running on `http://localhost:8080`.

### Backend

```bash
cd darts-sim-api
./mvnw spring-boot:run
# On Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`.

#### Running with Docker

```bash
cd darts-sim-api
docker build -t darts-sim-api .
docker run -p 8080:8080 darts-sim-api
```

---

## 📈 CI/CD & Deployment

| | Hosting | Trigger |
|---|---|---|
| Frontend | Vercel | Auto-deploy on push to `main` |
| Backend | Render (Docker) | Auto-deploy on push to `main` |

Both are validated by a unified GitHub Actions workflow (`.github/workflows/ci.yml`) that runs frontend build/test and backend unit tests on every push.
