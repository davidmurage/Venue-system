import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoutes from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import venueRoute from './routes/venueRoute.js';
import bookingRoute from './routes/bookingRoutes.js';


//dotenv
dotenv.config();

//connect to database
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json());

app.use(cors(
  {
    origin: ["http://localhost:3001","https://venue-system.onrender.com"],
    methods: ['GET', 'POST', ],
    credentials: true
  }
));
app.use(morgan('dev'));
const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(cors(corsOptions));


//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/venue', venueRoute);
app.use('/api/v1/booking', bookingRoute)

//rest api
app.get('/', (req, res) => {
    res.send('API is running...');
});


//port
const PORT = process.env.PORT || 8080;


//listen
app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
        .white
    );
  });