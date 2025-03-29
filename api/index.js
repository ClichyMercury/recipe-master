// api/index.js
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Ajoutez des headers CORS pour autoriser les requêtes
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Gérer les requêtes OPTIONS pour le pre-flight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rendre les routes disponibles sans préfixe
server.use(router);

// Important: exporter le serveur pour les fonctions serverless de Vercel
module.exports = server;

server.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });