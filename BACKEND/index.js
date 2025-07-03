import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = 3001; // We'll use a different port than our frontend

// --- Middleware ---
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // Allow the server to understand JSON in request bodies

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello from the Course.ai Backend!');
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});