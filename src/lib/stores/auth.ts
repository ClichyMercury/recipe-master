import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import authService from '../services/auth';

// Fonction pour initialiser le store avec les données de localStorage
function createAuthStore() {
  // Récupérer l'utilisateur depuis localStorage si disponible
  const initialUser = browser 
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;
  
  // Créer le store writable
  const { subscribe, set, update } = writable<{
    user: any;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }>({
    user: initialUser,
    isAuthenticated: !!initialUser,
    loading: false,
    error: null
  });
  
  return {
    subscribe,
    
    // Connexion utilisateur
    /**
       * @param {string} email
       * @param {string} password
       */
    async login(email: string, password: string) {
      // Mettre à jour le state pour indiquer le chargement
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Appeler le service d'authentification
        const { user, token } = await authService.login(email, password);
        
        // Stocker les informations dans localStorage
        if (browser) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Mettre à jour le store
        set({
          user,
          isAuthenticated: true,
          loading: false,
          error: null
        });
        
        return user;
      } catch (error: any) {
        // Gérer les erreurs
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Une erreur est survenue lors de la connexion'
        }));
        
        throw error;
      }
    },
    
    // Inscription utilisateur
    /**
     * @param {{ email: string; password: string; username: string; }} userData
     */
    async register(userData: { username: string; email: string; password: string; }) {
      // Mettre à jour le state pour indiquer le chargement
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Appeler le service d'authentification
        const { user, token } = await authService.register(userData);
        
        // Stocker les informations dans localStorage
        if (browser) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Mettre à jour le store
        set({
          user,
          isAuthenticated: true,
          loading: false,
          error: null
        });
        
        return user;
      } catch (error) {
        // Gérer les erreurs
        update(state => ({
          ...state,
          loading: false,
          error: (error as Error).message || 'Une erreur est survenue lors de l\'inscription'
        }));
        
        throw error;
      }
    },
    
    // Déconnexion utilisateur
    logout() {
      // Appeler le service d'authentification
      authService.logout();
      
      // Mettre à jour le store
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    },
    
    // Réinitialiser les erreurs
    clearErrors() {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Exporter le store
const authStore = createAuthStore();
export default authStore;