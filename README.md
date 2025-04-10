<<<<<<< HEAD
# Babe Coffee Shop - Cashiering System

A modern and feature-rich coffee shop management application with an intuitive user interface for efficient order processing, inventory management, and financial reporting.

![Babe Coffee Shop](public/coffee-shop-banner.png)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [System Architecture](#system-architecture)
- [Data Model](#data-model)
- [User Guide](#user-guide)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

Babe Coffee Shop Cashiering System is a comprehensive point-of-sale solution designed specifically for coffee shops and cafes. It streamlines the entire order process - from taking orders to generating receipts, while also providing inventory management and financial reporting capabilities.

## ✨ Features

- **User Authentication & Authorization**
  - Secure login/logout functionality
  - Role-based access control (Admin, Cashier, Manager)
  - User registration with email verification

- **Product Management**
  - Add, edit, and remove products
  - Categorize products (coffee, pastries, snacks, etc.)
  - Manage product inventory
  - Upload product images
  - Set product pricing and discounts

- **Order Processing**
  - Intuitive point-of-sale interface
  - Order customization options
  - Real-time order status tracking
  - Order history and search

- **Receipt Generation**
  - Digital and printable receipts
  - Customer information capture
  - Tax calculation
  - Discount application

- **Reporting & Analytics**
  - Daily, weekly, and monthly sales reports
  - Product popularity analysis
  - Revenue and profit calculations
  - Export reports in various formats (PDF, CSV)

- **Inventory Management**
  - Track stock levels
  - Automatic low stock alerts
  - Ingredient usage tracking
  - Supplier management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Components**: Radix UI, Shadcn UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **API Documentation**: Swagger/OpenAPI

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0+ and npm/pnpm
- Python 3.8+
- Windows OS (for batch files)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/babe-coffee-shop.git
   cd babe-coffee-shop
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Frontend Setup**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Initialize sample data** (optional but recommended for testing)
   ```bash
   .\init-data.bat
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   .\start-backend.bat
   ```
   The backend will run at http://localhost:8000

2. **Start the frontend development server**
   ```bash
   .\start-frontend.bat
   ```
   The frontend will run at http://localhost:3000

3. **Login with default credentials**
   - Username: `admin`
   - Password: `admin123`

## 📚 API Documentation

When the backend is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /token` - Login to obtain access token

#### Users
- `POST /users/` - Create a new user
- `GET /users/me/` - Get current user information

#### Products
- `POST /products/` - Create a new product
- `GET /products/` - List all products

#### Orders
- `POST /orders/` - Create a new order
- `GET /orders/` - List user's orders

## 🏗️ System Architecture

The application follows a modern client-server architecture:

1. **Frontend (Next.js)**
   - Server-side rendering for improved SEO and performance
   - Static site generation for faster page loads
   - Client-side rendering for dynamic content

2. **Backend (FastAPI)**
   - RESTful API design
   - CORS enabled for secure frontend-backend communication
   - Database abstraction layer with SQLAlchemy

3. **Database**
   - Relational database with SQLite (development)
   - Entity relationships for data integrity

## 💾 Data Model

The system uses the following core data entities:

- **User**: Store user information and authentication details
- **Product**: Store product information, pricing, and categories
- **Order**: Track customer orders and their status
- **OrderItem**: Individual items within an order
- **Category**: Product categorization
- **Inventory**: Track product stock levels

## 📖 User Guide

### Admin Dashboard
- Access comprehensive management features
- View sales reports and analytics
- Manage users, products, and inventory

### Cashier Interface
- Process customer orders quickly
- Apply discounts and promotions
- Generate and print receipts

### Customer Self-Service
- Browse menu and place orders
- View order history
- Track order status

## 👩‍💻 Development

### Project Structure
- `/app` - Next.js application pages and components
- `/components` - Reusable UI components
- `/lib` - Utility functions and helpers
- `/public` - Static assets
- `/styles` - Global CSS and Tailwind configuration
- `/backend` - FastAPI server and database models

### Development Workflow
1. Create a feature branch from main
2. Implement and test your changes
3. Submit a pull request for review

### Code Style
- Follow the established code style and conventions
- Use TypeScript for type safety
- Write unit tests for new features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 
=======
# PROCIA-BSIS
>>>>>>> c388038dee43613e501370f9bf2a09c745964df1
