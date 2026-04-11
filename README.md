##  Omnichannel Retail POS & Inventory Management System

Retail Pro is modern Point of Sale (POS) and retail management system built for scalability and performance. It seamlessly connects daily checkout operations with high-level administrative functions such as multi-store management, attendance tracking, role-based access control (RBAC), and deep financial analytics. The platform features an ultra-responsive, dynamic UI heavily leveraging animations and premium aesthetic patterns.
This is a full-stack POS Inventory Management System built using MERN stack. It supports product management, order processing, and role-based access control for Admin, Manager, and Cashier.


### 1. System Architecture & Technology Stack
      
      Frontend: React.js, Tailwind CSS
      Backend: Node.js, Express.js
      Database: MongoDB
      Cache: Redis
      Auth: JWT + bcrypt
      
### Frontend (Client)
- **Frameworks & Core**: React 18 with TypeScript running on Vite for lightning-fast Hot Module Replacement (HMR).
- **Routing**: `react-router-dom` implemented for declarative, client-side, dynamic routing protected by an Auth state layer.
- **Styling**: Tailwind CSS v3 utilized for utility-first styling, providing instant custom configurations, typography processing, and layout generation.
- **UI Architecture**: Deeply integrated with Shadcn UI (Radix UI primitives). This ensures absolute maximum accessibility while delivering beautifully animated layouts.
- **Animations**: `framer-motion` tracks micro-interactions (e.g., spring-based drawer collapsing, modal fading, page transitions).
- **Charting**: `recharts` leveraged for SVG-based reactive data visualizations (Area charts for sales, Doughnut charts for categorization).
- **Notifications**: `sonner` is utilized for non-blocking, stackable toast notifications across the UI.

### Backend (Server - REST API)
- **Framework**: Node.js + Express.js backend.
- **Database Architecture**: MongoDB hosted via MongoDB Atlas (Cloud) / Local environments, modeled utilizing `Mongoose` schema validations.
- **Authentication**: JWT (JSON Web Tokens) generated upon login and passed via Bearer auth headers for stateful API route protection.
- **File Containerization**: Environment structured entirely utilizing Docker & `docker-compose.yaml`.

---

## 2. Setup & Installation Guide

This system supports both native bare-metal execution and isolated Docker containerization.

### 2.1 Using Docker (Recommended for Production)
Ensure Docker Desktop is installed.
1. Configure your `.env` connection string in the `server` directory (or map it within `docker-compose.yaml`).
2. Navigate to the root directory and run:
   ```bash
   docker-compose up --build
   ```
3. The platform will automatically provision a Node environment, install all dependencies, build the Vite app, and map port `8080` to the frontend and `5000` to the backend.

### 2.2 Using Terminal (Development Mode)
Great for live editing the code.

**For the Backend:**
1. `cd server`
2. `npm install`
3. Check `server/.env` and ensure `MONGO_URI` is set (e.g., `MONGO_URI="mongodb://127.0.0.1:27017/pos_system"` or your Atlas URI).
4. `npm run dev` (starts the Nodemon server on `http://localhost:5000`).

**For the Frontend:**
1. `cd client`
2. `npm install`
3. `npm run dev` (starts the Vite frontend server on `http://localhost:8080`).

---
