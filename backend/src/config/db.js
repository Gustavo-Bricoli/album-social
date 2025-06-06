const mongoose = require('mongoose');
require('dotenv').config();

function connectToDatabase() {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Erro de conexão com MongoDB:'));
  db.once('open', () => {
    console.log('Conectado ao MongoDB com sucesso!');
  });
}

module.exports = connectToDatabase;
