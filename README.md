# University Research Opportunity Portal

## Project Overview
The University Research Opportunity Portal is a web-based application that allows students to view and manage university research opportunities. Faculty research opportunities can be created, viewed, updated, closed, and deleted through a REST API.

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: MySQL
- API Testing: Postman
- Version Control: Git and GitHub

## Features
- Create research opportunities
- View all available opportunities
- View an opportunity by ID
- Update opportunity information
- Close an opportunity
- Delete an opportunity
- Validate required fields
- Return appropriate HTTP status codes for errors

## Project Structure
- `backend/` — server, database connection, and API routes
- `database/` — MySQL database schema
- `frontend/` — website interface
- `postman/` — Postman API collections
- `.gitignore` — excludes private configuration and unnecessary files

## Requirements
- Node.js and npm
- MySQL Server
- Visual Studio Code
- Postman (for API testing)

## Setup Instructions

### 1. Set Up the Database
Open MySQL Workbench and run the SQL script in `database/schema.sql`.

### 2. Configure the Backend
Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with your own MySQL settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=research_portal
PORT=3000
```

Replace `YOUR_MYSQL_PASSWORD` with your own MySQL password. Do not upload this file to GitHub.

### 3. Start the Backend
From the `backend/` folder, run:

```bash
node server.js
```

The API will run at `http://localhost:3000`.

### 4. Start the Frontend
Open `frontend/index.html` using the VS Code Live Server extension.

### 5. Test the API
Import the Postman collection from the `postman/` folder and send requests to:

`http://localhost:3000/api/opportunities`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/opportunities` | Create an opportunity |
| GET | `/api/opportunities` | Retrieve all opportunities |
| GET | `/api/opportunities/:id` | Retrieve one opportunity |
| PUT | `/api/opportunities/:id` | Update an opportunity |
| PATCH | `/api/opportunities/:id/close` | Close an opportunity |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

## Error Handling
The API validates required fields and uses HTTP status codes such as 201, 400, and 404 where appropriate. Server-side errors are handled by the backend.

## GitHub Repository
https://github.com/Mueezkhalid12/Research-Opportunity-Portal