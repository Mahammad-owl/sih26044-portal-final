# SKILLSETU: Setup and Execution Guide
## Problem Statement: SIH26044
**Zero-to-Hero Local Installation & Execution Handbook for Beginners**

---

## 1. Prerequisites & Required Software

Ensure your machine has Node.js and npm installed:
* **Operating System**: Linux, macOS, or Windows 10/11
* **Node.js**: Version 18.0.0 or higher (Tested up to Node v24)
* **npm**: Version 9.0.0 or higher
* **Memory**: Minimum 4GB RAM
* **Disk Space**: 500MB free disk space

To verify your environment, open your terminal and run:
```bash
node -v
npm -v
```

---

## 2. Quick-Start in 2 Minutes

### Step 1: Open the Project Directory
```bash
cd "/home/shaik-mahammad-riyaz/Desktop/SIH (Copy)"
```

### Step 2: Install Dependencies
The project dependencies are already installed in `node_modules`. If you are setting up on a new machine:
```bash
npm install
```

### Step 3: (Optional) Initialize / Reset SQLite Database
The database comes pre-seeded with realistic multi-branch engineering data. If you ever want to reset it back to factory defaults:
```bash
npm run seed
```
*(This creates and populates `database/sih_portal.sqlite` with 19 demo users, 5 engineering branches, opportunities, and assessments).*

---

## 3. Starting the Platform

The platform consists of two lightweight processes:
1. **Backend Server** (Node.js + Express + SQLite on port 5000)
2. **Frontend Development Server** (Vite + React 18 on port 5173)

### Terminal 1: Start Backend
In your first terminal tab:
```bash
npm run server
```
*You should see:*
```
🚀 SIH26044 Backend running on http://localhost:5000
📡 Health Check: http://localhost:5000/api/health
```

### Terminal 2: Start Frontend
In a second terminal tab:
```bash
npm run dev
```
*You should see:*
```
  VITE v6.0.7  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Your Browser
Open your web browser and navigate to:
```
http://localhost:5173
```

---

## 4. Demo Accounts & Credentials

You can use the 1-click switcher in the top navigation bar or log in with these credentials:

| Role | Demo Email (SIH Domain) | Standard Alias | Password | Identity Details |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student.demo@demo.sih` | `student@demo.com` | `demo123` | **Ananya Sharma** (ECE, 3rd Yr, Embedded Goal) |
| **Industry** | `industry.demo@demo.sih` | `industry@demo.com` | `demo123` | **Bosch Talent Gateway** (Automotive & IoT) |
| **Academia** | `academia.demo@demo.sih` | `faculty@demo.com` | `demo123` | **Dr. K. S. Ramanathan** (HOD, ECE Dept) |
| **Admin** | `admin.demo@demo.sih` | `admin@demo.com` | `demo123` | **Dr. S. K. Mehra** (NIT Dean of Industry Relations) |

---

## 5. Production Build & Verification

To verify that the application compiles without any TypeScript or bundling errors:
```bash
npm run build
```
To preview the compiled production build locally:
```bash
npm run preview
```

---

## 6. How to Stop Services
In any terminal running `npm run dev` or `npm run server`:
* Press `Ctrl + C` on Linux/Windows, or `Cmd + C` on macOS.

---

## 7. Troubleshooting Common Errors

### Error: `Port 5000 is already in use (EADDRINUSE)`
* **Cause**: An earlier backend server instance is still running in the background.
* **Fix (Linux/macOS)**:
  ```bash
  fuser -k 5000/tcp
  ```
  Or kill the existing node process and restart:
  ```bash
  killall node
  npm run server
  ```

### Error: `Cannot find module 'better-sqlite3'` or `'bcryptjs'`
* **Cause**: Node cannot locate the native binary module.
* **Fix**: Run the command from the root directory or ensure `backend/node_modules` is present:
  ```bash
  npm run server
  ```
  The server script automatically resolves `backend/node_modules` into the search path.

### Error: Database Locked
* **Cause**: Multiple write operations attempted simultaneously.
* **Fix**: The backend uses atomic transactions and WAL pragma. If locked, simply restart the backend server:
  ```bash
  npm run server
  ```
