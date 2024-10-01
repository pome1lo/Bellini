# 🧠 **Intellectual Games Platform with Social Network Features (PSSIG)**

Welcome to **PSSIG** — a web application designed to organize and manage intellectual games with integrated social network elements, offering players engaging experiences, rich statistics, and dynamic interactions. This platform provides users with the ability to create, participate in, and manage games while fostering a vibrant community through player profiles, real-time interactions, and game analytics.

## 📜 **Table of Contents**

- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Future Plans](#future-plans)
- [License](#license)

---

## 🚀 **Features**

- **User Registration & Authentication**: Secure user management system with role-based access.
- **Profile Management**: Customizable user profiles with statistics and activity tracking.
- **Game Creation & Management**: Organize and run intellectual games, invite participants, and manage results.
- **Real-time Statistics**: In-depth analytics of games with personalized reports and performance tracking.
- **Social Network Features**: Comments, discussions, and interaction with other players during and after games.
- **Game History & Leaderboards**: Track user progress and global rankings.
- **Scalable Microservices**: Optimized for high-performance and scalable to support large numbers of users and games.

---

## 🏗️ **Architecture**

PSSIG utilizes a **three-layer architecture** to ensure scalability, maintainability, and flexibility:

1. **Data Access Layer (DAL)**:
   - Uses Entity Framework for data modeling and MS SQL Server for persistent storage.
   
2. **Business Logic Layer (BLL)**:
   - Contains core services such as game management, user profiles, statistics, and notifications.
   - Implements caching using Redis to optimize performance.
   
3. **Presentation Layer**:
   - RESTful API built with ASP.NET Core Web API.
   - Frontend developed with **React TypeScript** and **Shadcn UI**.

**API Gateway** and **nginx** handle routing and ensure secure access to the microservices.

---

## 💻 **Technologies**

- **Backend**:
  - ASP.NET Core Web API
  - Entity Framework Core
  - Redis (caching)
  - MS SQL Server
  - API Gateway (nginx)
  
- **Frontend**:
  - React (TypeScript)
  - Shadcn UI
  - jQuery (for Ajax requests)

- **Communication**:
  - WebSocket (for real-time interactions)

- **Tools**:
  - Docker (for containerization)
  - JetBrains Rider (IDE)
  - Postman (API testing)

---

## 🛠️ **Installation**

### Prerequisites
- .NET 7.0 SDK
- Node.js & npm
- MS SQL Server
- Docker

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pssig.git
   ```

2. **Navigate to the backend folder and install dependencies:**
   ```bash
   cd backend
   dotnet restore
   ```

3. **Navigate to the frontend folder and install dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup the database:**
   - Configure your `appsettings.json` with the MS SQL Server connection string.
   - Run the migrations:
     ```bash
     dotnet ef database update
     ```

5. **Run the backend:**
   ```bash
   dotnet run
   ```

6. **Run the frontend:**
   ```bash
   npm start
   ```

7. **Access the app:**
   Open `http://localhost:3000` in your browser.

---

## 📖 **Usage**

- **Admin Panel**: Manage users, games, and global settings.
- **Player Dashboard**: View and join available games, check personal statistics, and interact with other players.
- **Create a Game**: Organize a new game, set the rules, and invite players to participate.
- **Leaderboard**: View global rankings and personal achievements.

---

## 📚 **API Documentation**

All endpoints are documented using **Swagger**, accessible at `http://localhost:5000/swagger` once the backend is running.

Key API features include:

- **Authentication** (`/auth`)
- **User Profiles** (`/users`)
- **Game Management** (`/games`)
- **Statistics** (`/stats`)
- **Social Interactions** (`/comments`)

---

## 🔮 **Future Plans**

- **Mobile App**: Native mobile application for iOS and Android using Flutter.
- **Game Variations**: Introduce new game types and genres.
- **Advanced Analytics**: Provide deeper insights using machine learning for personalized performance recommendations.
- **Monetization Features**: Integrate premium features for enhanced game experiences.

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Thank you for using PSSIG!**

Happy gaming and let the intellectual challenges begin! ✨
