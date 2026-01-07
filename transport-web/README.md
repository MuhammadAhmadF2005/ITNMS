# Intelligent Transport Network Management System (ITNMS)

A modern, high-performance dashboard for managing complex transportation networks. This application provides real-time visualization, analytics, and control over stations, routes, and vehicle fleets.

![Dashboard Preview](https://images.unsplash.com/photo-1556388169-d754f738cc6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80) 
*(Note: Replace with actual screenshot)*

## 🚀 Live Demo

**[Deployed on Vercel](https://your-project-name.vercel.app)** *(Update with your actual link)*

## ✨ Key Features

*   **Secure Authentication**: Role-based access control with Supabase Auth.
*   **Real-time Database**: Persistent storage for stations, vehicles, and passengers using Postgres.
*   **Interactive Network Graph**: Visualize stations and routes with D3.js force-directed graphs.
*   **Real-time Dashboard**: Monitor system status, passenger queues, and vehicle locations.
*   **Path Finding**: Calculate optimal routes using Dijkstra's Algorithm and BFS.
*   **Vehicle Fleet Manager**: track and manage buses, metros, trams, and more.
*   **Responsive Design**: A premium, "Navy Grid" aesthetic built with Tailwind CSS and Framer Motion.

## 🛠️ Technology Stack

*   **Frontend**: React (Create React App), TypeScript, Tailwind CSS
*   **Backend/Database**: Supabase (PostgreSQL, Auth)
*   **Visualization**: D3.js
*   **State & Simulation**: Custom client-side TypeScript service connected to Supabase
*   **Backend (Legacy)**: C++ (Optional, for local high-performance simulation)

## 📦 Getting Started

### 1. Prerequisites

*   Node.js & npm
*   A [Supabase](https://supabase.com/) project

### 2. Installation

```bash
git clone https://github.com/MuhammadAhmadF2005/ITNMS.git
cd ITNMS/transport-web/frontend
npm install
```

### 3. Database Setup

1.  Navigate to your **Supabase Dashboard** -> **SQL Editor**.
2.  Run the contents of `../supabase_schema.sql` to create the tables.
3.  (Optional) Run `../seed_data.sql` to populate with sample data.

### 4. Environment Variables

Create a `.env` file in `transport-web/frontend` (copy `.env.example` if available) and add your keys:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Locally

```bash
npm start
```
The app will open at `http://localhost:3000`.

## ☁️ Deployment (Vercel)

This project is optimized for Vercel.

1.  Push your code to GitHub.
2.  Import the repository into Vercel.
3.  Set the **Root Directory** to `transport-web/frontend`.
4.  Add your **Environment Variables** (Supabase URL & Key) in the Vercel Project Settings.
5.  Deploy!

## 📂 Project Structure

*   `frontend/`: The main React application.
    *   `src/lib/transport-service.ts`: Service layer interacting with Supabase.
    *   `src/components/`: UI components and data visualizations.
    *   `src/context/`: Auth context.
*   `supabase_schema.sql`: Database migration script.
*   `seed_data.sql`: Sample data script.
*   `backend/`: (Optional) C++ implementation of the core algorithms. Kept for reference.

## 📄 License

MIT