# Bike Booking Application

This README provides instructions to set up and run the Bike Booking application from scratch. The project consists of two main parts: the client (frontend) and the server (backend).

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **TypeScript** (globally installed, optional but recommended)
- **MongoDB** (for the backend database)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Nasif-Islam/bootcamp-dcx-fullstack.git
cd bootcamp-dcx-fullstack/apps/bike-booking
```

### 2. Install Dependencies

#### Client

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

#### Server

Navigate to the server directory and install dependencies:

```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

#### Server

Create a `.env` file in the `server` directory with the following variables:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bike-booking
NODE_ENV=development
PORT=5001
VITE_API_BASE_URL=/api
```

Update the values as needed for your environment.

### 4. Seed the Database (Optional)

To populate the database with test data, run the following command in the `server` directory:

```bash
npm run seed
```

### 5. Run the Application

#### Start the Server

In the `server` directory, run:

```bash
npm run dev
```

The server will start on `http://localhost:5001` by default.

#### Start the Client

In the `client` directory, run:

```bash
npm run dev
```

The client will start on `http://localhost:5173` by default.

### 6. Run Tests

#### Client Tests

In the `client` directory, run:

```bash
npm run test
```

#### Server Tests

In the `server` directory, run:

```bash
npm run test
```

### 7. Build for Production

#### Client

To build the client for production, run:

```bash
npm run build
```

#### Server

The server does not require a build step. Ensure all dependencies are installed and the `.env` file is configured.

## Folder Structure

- **client/**: Contains the frontend code built with React and Vite.
- **server/**: Contains the backend code built with Express and MongoDB.

## Notes

- Ensure MongoDB is running locally or update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.
- Use `npm` or `yarn` consistently throughout the project.

## Setting Up MongoDB Database

To set up the MongoDB database for the Bike Booking application, follow these steps:

1. **Install MongoDB**:
   - Download and install MongoDB from the [official MongoDB website](https://www.mongodb.com/try/download/community).
   - Follow the installation instructions for your operating system.

2. **Start MongoDB**:
   - Ensure the MongoDB service is running. You can start it using the following command:

     ```bash
     mongod
     ```

   - By default, MongoDB runs on `mongodb://127.0.0.1:27017`.

3. **Create a Database**:
   - Open the MongoDB shell or a GUI tool like MongoDB Compass.
   - Create a new database named `bike-booking`:

     ```javascript
     use bike-booking
     ```

4. **Verify Connection**:
   - Ensure the `MONGO_URI` in the `.env` file matches your MongoDB instance:

     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/bike-booking
     ```

   - Update the URI if your MongoDB instance is hosted remotely or uses authentication.

5. **Seed the Database** (Optional):
   - Run the following command in the `server` directory to populate the database with test data:

     ```bash
     npm run seed
     ```

For any issues, please contact the project maintainers.
