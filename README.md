Omnichannel Retail POS & Inventory System


Retail Pro is modern Point of Sale (POS) and retail management system built for scalability and performance. It seamlessly connects daily checkout operations with high-level administrative functions such as multi-store management, attendance tracking, role-based access control (RBAC), and deep financial analytics. The platform features an ultra-responsive, dynamic UI heavily leveraging animations and premium aesthetic patterns.

---

## 2. System Architecture & Technology Stack

### 2.1 Frontend (Client)
- **Frameworks & Core**: React 18 with TypeScript running on Vite for lightning-fast Hot Module Replacement (HMR).
- **Routing**: `react-router-dom` implemented for declarative, client-side, dynamic routing protected by an Auth state layer.
- **Styling**: Tailwind CSS v3 utilized for utility-first styling, providing instant custom configurations, typography processing, and layout generation.
- **UI Architecture**: Deeply integrated with Shadcn UI (Radix UI primitives). This ensures absolute maximum accessibility (a11y) while delivering beautifully animated layouts.
- **Animations**: `framer-motion` tracks micro-interactions (e.g., spring-based drawer collapsing, modal fading, page transitions).
- **Charting**: `recharts` leveraged for SVG-based reactive data visualizations (Area charts for sales, Doughnut charts for categorization).
- **Notifications**: `sonner` is utilized for non-blocking, stackable toast notifications across the UI.

### 1.2 Backend (Server - REST API)
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

## 3. Directory Map & Web Pages Functionality

The application natively guards routes based on an Authentication hook and User Roles (`Admin`, `Manager`, `Staff/Cashier`). 

### 3.1 Public & Authentication
- **`Landing.tsx` (Public Route - `/`)**: Modern marketing page dynamically showcasing the project scale. Features a floating animated Navbar, Hero sections powered by framer-motion fades, feature grids, competitive pricing metrics, and a dynamic Footer.
- **`Login.tsx` (Public Route - `/login`)**: The gateway to the software. Handles user payloads, authenticates via the backend JWT system, and routes users to appropriate Dashboard views securely.

### 3.2 Point of Sale Terminal (`POS.tsx`)
- **Interactive Register System**: Designed for high-speed counter checkouts. Cashiers use this to search or scan products via SKU/Barcodes.
- **Cart Tracking**: Displays the current cart array containing items, specific variants, unit price, tax deductions, and total computed sums dynamically calculated in state.
- **Functionality**: Integrates Cash/Card/UPI transactions clearing mechanisms. Sends absolute payload to the `/orders` backend endpoints and deducts directly from the master inventory.

### 3.3 Dashboard & Analytics (`Dashboard.tsx` & `AdminDashboard.tsx`)
- **Key Performance Indicators (KPI)**: Visual scorecards displaying *Total Sales*, *Orders*, *Gross Profit*, and *Active Customers*. Calculates rolling 7-day average trends.
- **Revenue Mapping**: Massive React `AreaChart` mapping localized daily or overall monthly net revenue mapped across a responsive grid.
- **Low Stock Aggregation**: Dedicated modal space tracking critical `Product` items dipping under Minimum-Order-Quantity (MOQ).

### 3.4 Product & Inventory Management (`Products.tsx` & `Inventory.tsx`)
- **Product Directory**: Grid or Table formats rendering all physical stock items linked with Images, IDs, assigned Categories, and Selling/Cost pricing grids.
- **Inventory Tracking**: The back-of-house logistics portal, focusing on warehousing metrics, tracking incoming shipments, and recording "audit" stock levels.

### 3.5 Employees & Attendance (`Employees.tsx`)
- **Personnel Database**: Tracks all active staff.
- **Live Attendance Tracking**: Managers mark staff **Present**, **Absent**, **Late**, or **Half Day**. Features robust UI protections issuing Toast warnings if checking an employee twice in a single day. Includes a "Mark All Present" fast-action.
- **Permissions Framework**: Admins utilize this screen to modify RBAC authorizations using an embedded settings switchboard.

### 3.6 Stakeholder CRM (`Customers.tsx` & `Suppliers.tsx`)
- **Customers**: Contains purchasing history, Lifetime Value (LTV) metric calculations, and basic demographic data (Phone, Email, Member Points). 
- **Suppliers**: Procurement directory holding vendor contacts, payment terms (e.g., Net 30/60 days), and historically placed order ledgers.

### 3.7 Orders & Finance Modules
- **Transactional History (`Orders.tsx`)**: Absolute log of every checkout processed. Capability to review invoices, fetch line-items, and trigger receipt re-prints/PDFs.
- **Accounting (`FinanceContent.tsx`)**: Visualizes Total Income vs Expense via Doughnut and Bar charts. Capable of exporting localized JSON state data to formatted PDF, CSV, or Excel reports bound to non-blocking `<Toaster>` notifications.

---

## 4. Workflows & State Lifecycle Strategy

- **State Hook Pipeline**: Deep reliance on `useState`, `useEffect`, and `useMemo`. For example: DataTables `useMemo` the heavy sorting mechanisms resulting in pure sub-10ms filter searches locally within large cached arrays rather than hammering the backend.
- **Responsive Layout Execution**: `SidebarLayout.tsx` actively watches `window.innerWidth`. On mobile (<768px), it collapses gracefully into a backdrop-blurred overlay drawer preventing screen-crush entirely.
- **Table Constraints**: A strict `overflow-x-auto` architecture over tabular data guarantees phone/tablet users can drag table contents smoothly.
- **Role Distribution UX**: Boundary containers intercept incoming requests. If an unauthorized attempt happens (e.g., Cashier trying to open Finance), users are strictly bounced backward or shown a 404 block.

---

## 5. API Reference Outline (Express Endpoints)

The REST API is structured modularly. Standard requests attach a `Bearer [Token]` in the Authorization header. Wait for CORS allowance strictly permitted from `localhost`.

| Module | Route Hierarchy | Role Required | Methods | Description |
|---|---|---|---|---|
| **Auth** | `/api/auth/*` | *None / All* | POST, GET | Handles `login`, `register`, and active session `verify` tokens. |
| **Users** | `/api/users/*` | `Admin`, `Manager` | GET, PUT, DEL | Edit staff profiles, change access privileges, fetch attendance logs. |
| **Products**| `/api/products/*` | *All* (Read-only) | GET, POST, PUT | Synchronize master inventory lists, batch update SKUs. |
| **Orders**| `/api/orders/*` | *All* | GET, POST | Submits POS cart payloads. Registers gross sums against daily ledgers. |
| **Reports**| `/api/reports/*` | `Admin` | GET | Protected, compute-heavy aggregations building the JSON for the dashboard charts. |

---

## 6. Future Hardware Roadmap & Scaling Features

For future iterations or facility growth, here are the targeted expansion features mapping cleanly onto the existing architecture:

1. **Hardware Bindings**: Utilize WebUSB API to directly interface Receipt Printers (Epson/Star Micronics ESC/POS codes), physical Cash Drawer fire-pins, and high-speed Zebra Barcode Scanners.
2. **Offline-Mode Synchronization**: Integrate standard `ServiceWorkers` (PWA setup) allowing the POS to operate fully during internet outages and mass-syncing queued cache receipts back to MongoDB when connectivity restores.
3. **Advanced Integrations**: Setup webhooks integrating Quickbooks / Xero for live automated accounting parsing, removing the need for manual CSV exports.

