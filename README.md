# RETAIL PRO - POS Inventory System

Retail Pro is a comprehensive, modern Point of Sale (POS) and Inventory Management System designed to streamline retail operations. It features a stunning, intuitive UI built with React, Vite, Tailwind CSS, and Shadcn UI.

## 🚀 Key Features

### 👤 Role-Based Access Control
- Secure login portal with role-based routing.
- Three dedicated portals: **Admin**, **Manager**, and **Cashier**, ensuring appropriate access to sensitive data.

### 💼 Manager Portal
- **Overview Dashboard:** Provides a top-level view of Total Products, Low Stock Items, Sales, and Pending Orders.
- **Inventory Management:** Detailed product table with tracking, categorization, search, and low-stock visual indicators.
- **Low Stock Alerts:** 
  - Tracks items running below minimum required stock (e.g., Critical, Low).
  - Displays Total Deficit cost required to restock.
  - One-click "Create PO" button for instant supplier orders.
- **Employee Management:** Attendance tracking system with check-in/out logs and active status indicators.

### 🛒 Cashier POS Portal (Point of Sale)
- **Visual Product Grid:** Relatable, High-Quality Product Photography powered by Unsplash with dynamic category-based fallbacks.
- **Smart Cart System:** Add, remove, and adjust quantities on the fly with real-time Subtotal, GST, and Total calculations.
- **Advanced Checkout Modal:**
  - Multiple payment types supported: **CASH, CARD, UPI, SPLIT**.
  - **Cash:** Built-in change calculator allowing cashiers to input received amount and view exact change to return.
  - **Card:** Mock interface for processing card details.
  - **UPI:** Dynamic QR code setup and UPI ID display.
  - Split Payments: Allow customers to pay partially via Cash and UPI/Card.
- **Digital Receipt Generation:** Beautiful, printable digital receipts generated immediately after payment confirmation.

## 📸 Screenshots & UI Previews
*The Cashier POS Portal showing the updated realistic product grid:*
![Cashier POS Interface](./client/public/products/pos-preview.png)

*(Note: Replace the image above with your actual screenshot file)*

## 🎨 UI / UX
- Premium aesthetic utilizing modern design paradigms (Glassmorphism, subtle micro-animations).
- Dark/Light mode thematic awareness.
- Fully responsive across desktop environments.

## 📁 Project Structure

This project is split into a frontend and a backend:
- `/client`: Frontend Application (Vite + React + Tailwind + Shadcn/UI + Framer Motion)
- `/server`: Backend Service (Node/Express Placeholder)

## 🛠️ Getting Started

To run the application locally:

### 1. Start the Frontend
```bash
cd client
npm install
npm run dev
```

### 2. Access the Portal
The application will be running on `http://localhost:5173`. You can start exploring the features through the landing page by navigating to the role-based login interfaces.
