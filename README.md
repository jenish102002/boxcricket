# 🏏 BoxCricket Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38B2AC)

A modern, production-ready full-stack web application for reserving time slots at box cricket venues.

Built with an **"Editorial / Quiet Premium"** design system, the platform provides a seamless booking experience for players and a powerful analytics-driven dashboard for venue administrators.

---

## ✨ Features

### 👤 For Users (Public Portal)
- **Browse & Search Venues**: Explore available venues with rich image previews, pricing, and location details.
- **Real-Time Booking**: Interactive 7-day date strip picker to view and book available time slots.
- **Booking Management**: View past and upcoming bookings, and cancel future reservations.
- **Secure Authentication**: JWT-based secure user registration and login.

### 🛡️ For Administrators (Admin Dashboard)
- **Revenue Analytics**: Visual dashboard with KPI cards, revenue area charts, and slot status distribution (powered by Recharts).
- **Venue Management**: Full CRUD capabilities to add, edit, or toggle the active status of venues.
- **Slot Generation**: Flexible slot management allowing single-slot creation or bulk generation across dates and time intervals.
- **Booking Administration**: Complete overview of all platform bookings with status filtering and administrative cancellation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, TanStack (React) Query, Zustand, Axios, Recharts, React Hook Form + Zod |
| **Backend** | Spring Boot 3.x, Java 17, Spring Web, Spring Security (JWT), Spring Data JPA |
| **Database** | SQLite (via `hibernate-community-dialects`) |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
- [Java 17+](https://adoptium.net/)
- [Maven 3.8+](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/boxcricket.git
cd boxcricket
```

### 2. Start the Backend API

The backend is a standard Spring Boot application.

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

- The backend server will start at `http://localhost:8080`.
- The SQLite database file (`boxcricket.db`) will be automatically generated inside the `data/` directory.
- **API Documentation**: Once running, access the interactive Swagger UI at `http://localhost:8080/swagger-ui.html`.

### 3. Start the Frontend Application

The frontend uses Vite for lightning-fast development.

```bash
cd ../frontend
npm install
npm run dev
```

- The frontend server will start at `http://localhost:5173`.
- The Vite dev server is pre-configured to proxy `/api` requests to the Spring Boot backend (`http://localhost:8080`), avoiding CORS issues during development.

---

## 🔐 Accessing the Admin Dashboard

Because the database initializes empty on the first run, you will need to manually create an Admin user to access the `/admin` dashboard.

1. Start the application and register a new user through the standard registration page.
2. Open your SQLite viewer/client and connect to `backend/data/boxcricket.db`.
3. Locate the newly registered user in the `users` table and change their `role` column from `USER` to `ADMIN`.
4. Log back in to the application to access the Admin Dashboard.

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots of your application)*

| Public Home | Admin Dashboard |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350.png?text=Public+Homepage" alt="Public Homepage" width="400"/> | <img src="https://via.placeholder.com/600x350.png?text=Admin+Dashboard" alt="Admin Dashboard" width="400"/> |

| Venue Details & Booking | Bulk Slot Generation |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350.png?text=Booking+Flow" alt="Booking Flow" width="400"/> | <img src="https://via.placeholder.com/600x350.png?text=Bulk+Slots" alt="Bulk Slots" width="400"/> |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
