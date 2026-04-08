<<<<<<< HEAD
# 技术栈

该项目使用以下技术栈
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


# 开发流程

1. 参考用户需求，调整 src/index.css 与 tailwind.config.ts 的主题风格
2. 根据用户需求，划分出所需要实现的页面
3. 整理好每个页面需要实现的功能，在 pages 下创建对应的文件夹及其下入口 Index.tsx
4. 在 App.tsx 中创建路由配置，引入刚才的各个入口文件 Index.tsx
5. 根据刚才整理的需求，如果需求简单，可以直接在 Index.tsx 中完成该页面的全部工作
6. 如果需求复杂，可以将 page 拆分为若干个组件来实现，目录结构如下：
    - Index.tsx 入口
    - /components/ 组件
    - /hooks/ 钩子
    - /stores/ 如果有复杂交互通信时，可以使用 zustand 进行通信
7. 在完成需求后，需要进行 pnpm i 安装依赖，并使用 npm run lint & npx tsc --noEmit -p tsconfig.app.json --strict 进行检查，并修复问题

# 接入后端接口
- 当需要新增接口或者操作 supabase 时，需要先在 src/api 新增对应 api 文件，并导出对应的数据类型，可以参考 src/demo.ts 文件，如果是 supabase 还需要做好实现
- 前端与 supabase 做实现时，都需要完全按照数据类型进行实现，尽可能避免修改定好的数据类型，如果出现修改，需要检查所有引用该类型的文件
=======
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
>>>>>>> 9132c72ceabb071b91fbf0d0be81d2893f1a44f2
