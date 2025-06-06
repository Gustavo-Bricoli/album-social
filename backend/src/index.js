const express = require('express');
const connectToDatabase = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API da rede social de álbuns está online!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);