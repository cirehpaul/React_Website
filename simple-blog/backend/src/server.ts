import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.ts';
import blogroutes from './routes/blogroutes.ts';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/blogs', blogroutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend active on port ${PORT}`);
});

export default app;
