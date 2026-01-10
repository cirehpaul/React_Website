import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
  console.log('REGISTER:', req.body);

  res.status(201).json({
    id: Date.now(),
    email: req.body.email,
  });
});

app.post('/api/login', (req, res) => {
  res.json({
    id: 1,
    email: req.body.email,
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
