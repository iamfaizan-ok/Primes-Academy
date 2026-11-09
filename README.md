# Primes Academy - IELTS Academy Management System

A complete, production-ready, secure IELTS Academy Management System built with **React.js**, **Django REST Framework**, and **PostgreSQL**.

---

## 🏛 System Architecture & Roles

The system consists of four strictly isolated components:

1. **Admin Frontend**: Comprehensive administrative control portal (Students, Performance & IELTS Mock Bands, 4-Day Rolling Attendance Matrix, and Tuition Fee Installment Tracking).
2. **Student Frontend**: Dedicated student portal accessible via **Student Name + 4-Digit Unique ID** (View overall & weekly band progress, detailed test module breakdowns, complete attendance history, and paid fee receipts).
3. **Django REST API Backend**: Clean modular architecture (`accounts`, `students`, `performance`, `attendance`, `finance`), token/session management, and validation.
4. **PostgreSQL Database**: Relational schema with database-enforced unique constraints, foreign keys with cascading policies, and automated migrations.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.11+ or 3.12+ (or `uv`)
- **PostgreSQL**: PostgreSQL 14+ / 16+ / 18+

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (using python or uv)
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure your environment in backend/.env:
# DB_NAME=primes_academy
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432

# Apply database migrations
python manage.py migrate

# Initialize Administrator and database seed data
python init_db.py

# Run Django development server
python manage.py runserver 8000
```

The Django REST API runs on: `http://127.0.0.1:8000/api/`

---

### 3. Frontend Setup

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite React development server
npm run dev
```

The React frontend runs on: `http://localhost:5173/`

---

## 🔐 Credentials & Access

### Default Admin Credentials
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@primesacademy.com`
- **Password**: `admin123`

### Pre-seeded Student Credentials
- **URL**: `http://localhost:5173/login`
- **Student 1**: Name: `Ali Khan` | Unique ID: `1234`
- **Student 2**: Name: `Sara Ahmed` | Unique ID: `5678`
- **Student 3**: Name: `Usman Ali` | Unique ID: `9012`

---

## 📊 IELTS Scoring & Rounding Standard
The backend calculates the overall IELTS band score based on official IELTS rounding conventions:
$$\text{Average} = \frac{\text{Listening} + \text{Reading} + \text{Writing} + \text{Speaking}}{4}$$

- Fractional part $< 0.25$ $\rightarrow$ Rounds down to nearest whole band (e.g., $6.125 \rightarrow 6.0$)
- Fractional part $\ge 0.25$ and $< 0.75$ $\rightarrow$ Rounds to nearest half band ($0.5$) (e.g., $6.25 \rightarrow 6.5$, $6.625 \rightarrow 6.5$)
- Fractional part $\ge 0.75$ $\rightarrow$ Rounds up to next whole band (e.g., $6.875 \rightarrow 7.0$)

---

## 🧪 Verification & Automated Tests

To run the complete automated test suite:
```bash
cd backend
python test_api.py
```
This tests:
- Official IELTS band calculation and rounding formula
- Admin authentication & session security
- Student Name + 4-digit ID authentication
- Student creation & unique 4-digit ID auto-generation
- Immutability of Unique Student ID on updates
- Test recording and automatic overall band calculation
- Four-day rolling attendance grid and bulk saving
- Finance installment tracking and balance calculation
- Cascading deletion of student records

