import axios from 'axios';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, l'ajouter aux headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer l'authentification expirée (401)
    if (error.response && error.response.status === 401) {
      // Supprimer le token et rediriger vers la page de login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dans un contexte réel, on redirigerait vers la page de login
      // comme nous sommes dans un module, nous laisserons le composant gérer cela
    }
    
    return Promise.reject(error);
  }
);

export default api;