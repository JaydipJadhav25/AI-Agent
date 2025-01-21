
## Server

### Environment Variables

- `PORT`: The port on which the server will run.

### Dependencies

- `cors`: Middleware for enabling CORS.
- `dotenv`: Module to load environment variables from a `.env` file.
- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `nodemon`: Tool for automatically restarting the server during development.

### Scripts

- `dev`: Starts the server using nodemon.

### Files

- `server.js`: Entry point of the server. Connects to the database and starts the server.
- `index.js`: Sets up the Express application and middleware.
- `db/dbConnection.js`: Contains the function to connect to the MongoDB database.

### Example Usage

To start the server, run:

```sh
npm run dev