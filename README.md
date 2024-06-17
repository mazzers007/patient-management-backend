# Patient Management Backend

This is the backend for a patient management system, built with Node.js and MongoDB.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Testing](#test)

## Project Description

The Patient Management Backend is a Node.js application designed to handle the backend operations of a patient management system. It provides APIs for managing patient data, appointments, and other related information.

## Features

- User authentication and authorization
- CRUD operations for patient data
- Appointment scheduling
- Secure handling of sensitive information

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running

## Installation

To install the project, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/mazzers007/patient-management-backend.git
    cd patient-management-backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
DB_LINK=mongodb://username:password@host:port/database
SECRET_KEY=your_jwt_secret
PORT=3000
```

## Usage

To run the application in development mode:

```sh
npm run dev
```

To run the application in production mode:

```sh
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register: Register a new user
- POST /api/auth/login: Authenticate a user and get a token
### Patients
- GET /api/patients: Get a list of all patients
- POST /api/patients: Add a new patient
- GET /api/patients/:id: Get patient details by ID
- PUT /api/patients/:id: Update patient details by ID
- DELETE /api/patients/:id: Delete a patient by ID
### Appointments
- GET /api/appointments: Get a list of all appointments
- POST /api/appointments: Schedule a new appointment
- GET /api/appointments/:id: Get appointment details by ID
- PUT /api/appointments/:id: Update appointment details by ID
- DELETE /api/appointments/:id: Delete an appointment by ID

## Contributing

Contributions are always welcome! To contribute, follow these steps:

1. Fork the repository.

2. Create a new branch:

```sh
git checkout -b feature/your-feature-name
```

3. Make your changes and commit them:

```sh
git commit -m 'Add some feature'
```

4. Push to the branch:

```sh
git push origin feature/your-feature-name
```

5. Open a pull request.

## Testing

I have used POSTMAN to test the APIs.