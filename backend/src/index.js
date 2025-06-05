import express from 'express';
// import { connect } from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to the uploads directory
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// MongoDB Connection
// connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saven-serve', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.log('MongoDB Connection Error:', err));

// MongoDB Atlas Connection
const uri = "mongodb+srv://thaibaovu0212:Bao021203@savenserve-test.yl4clbp.mongodb.net/?retryWrites=true&w=majority&appName=savenserve-test";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

// Connect to MongoDB
connectToMongoDB();

// Routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 