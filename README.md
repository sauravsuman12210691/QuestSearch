
---

# QuestSearch

QuestSearch is a question search application built with a gRPC backend and React frontend. It allows users to search for questions in a database and provides a simple UI to display the results.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or above) - For running both the backend and frontend.
- **MongoDB** - For storing questions and related data.
- **Protoc** (Protocol Buffers compiler) - For generating gRPC client code.
- **gRPC-Web Plugin** - For generating client code for the frontend.

### Install Dependencies

1. **Install Node.js**:
   Download and install Node.js from [here](https://nodejs.org/).

2. **Install MongoDB**:
   You can run MongoDB locally or use a cloud-based service. For local installation, follow the [official MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).

3. **Install Protoc**:
   Follow the steps below to install `protoc`:

   - Download the `protoc` binary from the [GitHub releases page](https://github.com/protocolbuffers/protobuf/releases).
   - Extract the binary and add its path to the system’s environment variables.

4. **Install gRPC-Web Plugin**:
   ```bash
   npm install -g protoc-gen-grpc-web
   ```

## Setup Instructions

### 1. **Backend Setup (gRPC Server)**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/QuestSearch.git
   cd QuestSearch
   ```

2. **Navigate to the server folder**:
   ```bash
   cd server
   ```

3. **Install server dependencies**:
   ```bash
   npm install
   ```

4. **Create `.env` file**:
   Create a `.env` file in the `server` folder and add the following:

   ```env
   MONGO_URI=mongodb://localhost:27017/questsearch
GRPC_PORT=50051
REST_PORT=5000

   ```

   Replace `localhost:27017` with your MongoDB URI if you're using a cloud database.

5. **Start the server**:
   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:50051`.

### 2. **Frontend Setup (React App)**

1. **Navigate to the client folder**:
   ```bash
   cd ../client
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Protobuf Client Code**:
   Run the following command to generate the gRPC client code:
   ```bash
   protoc --proto_path=./proto --js_out=import_style=commonjs:./src/proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/proto ./proto/questions.proto
   ```

4. **Start the React app**:
   ```bash
   npm run dev
   ```

   The frontend should now be running on `http://localhost:3000`.

### 3. **Testing the Application**

1. **Ensure MongoDB is running**.
2. **Make sure the backend (gRPC server) is running** on `http://localhost:50051`.
3. **Make sure the frontend (React app) is running** on `http://localhost:3000`.
4. Open the frontend URL (`http://localhost:3000`) in your browser.
5. You can now search for questions from the database, and the results will be displayed on the UI.

## Directory Structure

```
QuestSearch/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── proto/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/
│   ├── proto/
│   │   └── questions.proto
│   ├── index.js
│   ├── searchController.js
│   ├── package.json
│   └── .env
└── README.md
```

## Troubleshooting

- **Error: `protoc` not recognized**:
   - Ensure `protoc` is installed and its path is added to your system's `PATH` environment variable.
   - Restart your terminal and try again.

- **MongoDB connection issues**:
   - Ensure MongoDB is running locally or use a cloud database URI.

- **gRPC server not reachable**:
   - Make sure the backend is running and accessible at `http://localhost:50051`.
   - Check for any firewall issues or port conflicts.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you'd like to add anything else or need further modifications!
