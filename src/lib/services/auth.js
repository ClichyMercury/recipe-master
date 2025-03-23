import api from './api';
import { browser } from '$app/environment';

// Note: JSON Server ne gère pas nativement l'authentification.
// Cette implémentation simule un service d'authentification.

const authService = {
  /**
   * Connexion utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<{user: {id: number, username: string, email: string}, token: string}>} - Promise contenant les données utilisateur et le token
   */
  async login(email, password) {
    try {
      // Rechercher l'utilisateur par email
      const response = await api.get(`/users?email=${email}`);
      
      if (response.data.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const user = response.data[0];
      
      // Vérifier le mot de passe (dans un cas réel, cela serait fait côté serveur)
      // Note: Dans une application réelle, le mot de passe serait hashé
      if (user.password !== password) {
        throw new Error('Mot de passe incorrect');
      }
      
      // Générer un token simulé
      const token = `simulated-jwt-token-${user.id}-${Date.now()}`;
      
      // Retourner l'utilisateur et le token
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Inscription utilisateur
   * @param {{ email: string, password: string, username: string }} userData - Données de l'utilisateur
   * @returns {Promise<{user: {id: number, username: string, email: string}, token: string}>} - Promise contenant les données utilisateur et le token
   */
  async register(userData) {
    try {
      // Vérifier si l'email existe déjà
      const emailCheck = await api.get(`/users?email=${userData.email}`);
      
      if (emailCheck.data.length > 0) {
        throw new Error('Email déjà utilisé');
      }
      
      // Créer l'utilisateur
      const response = await api.post('/users', userData);
      const user = response.data;
      
      // Générer un token simulé
      const token = `simulated-jwt-token-${user.id}-${Date.now()}`;
      
      // Retourner l'utilisateur et le token
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Déconnexion
   */
  logout() {
    // Supprimer les informations de localStorage
    if (browser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} - True si l'utilisateur est connecté
   */
  isLoggedIn() {
    return browser ? !!localStorage.getItem('token') : false;
  },
  
  /**
   * Récupérer l'utilisateur actuel
   * @returns {Object|null} - Utilisateur ou null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;