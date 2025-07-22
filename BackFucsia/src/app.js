const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const { passport } = require('./passport');
const { JWT_SECRET_KEY , FRONTEND_URL} = require('./config/envs');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(morgan('dev'));
app.use(passport.initialize());

// ✅ CORS CORREGIDO PARA DESARROLLO Y PRODUCCIÓN
const allowedOrigins = [
  FRONTEND_URL, // ✅ Usar variable de entorno
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:5174',
  'https://tienda-fucsia.vercel.app',
  // Agregar más origins si es necesario
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// ✅ HEADERS ADICIONALES PARA COMPATIBILIDAD
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

// Routes
app.use('/', routes);

// Not Found Middleware
app.use('*', (req, res) => {
  res.status(404).send({
    error: true,
    message: 'Not found',
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).send({
    error: true,
    message: err.message || 'Something broke!',
  });
});

module.exports = app;