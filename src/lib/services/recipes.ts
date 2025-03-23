import api from './api';

const recipeService = {
  /**
   * Récupérer toutes les recettes
   * @param {Object} params - Paramètres de filtre optionnels
   * @returns {Promise} - Promise contenant les recettes
   */
  async getAll(params: Record<string, any> = {}) {
    try {
      // Construire l'URL avec les paramètres de filtre
      let url = '/recipes';
      const queryParams = new URLSearchParams();
      
      // Ajouter les paramètres à l'URL
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      // Ajouter les paramètres à l'URL s'il y en a
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Récupérer une recette par son ID
   * @param {number} id - ID de la recette
   * @returns {Promise} - Promise contenant la recette
   */
  async getById(id: number) {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Créer une nouvelle recette
   * @param {Object} recipeData - Données de la recette
   * @returns {Promise} - Promise contenant la recette créée
   */
  async create(recipeData: Record<string, any>) {
    try {
      // Ajouter les timestamps
      const now = new Date().toISOString();
      const newRecipe = {
        ...recipeData,
        createdAt: now,
        updatedAt: now
      };
      
      const response = await api.post('/recipes', newRecipe);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Mettre à jour une recette
   * @param {number} id - ID de la recette
   * @param {Object} recipeData - Données à mettre à jour
   * @returns {Promise} - Promise contenant la recette mise à jour
   */
  async update(id: number, recipeData: Record<string, any>) {
    try {
      // Mettre à jour le timestamp
      const updatedRecipe = {
        ...recipeData,
        updatedAt: new Date().toISOString()
      };
      
      const response = await api.put(`/recipes/${id}`, updatedRecipe);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Supprimer une recette
   * @param {number} id - ID de la recette
   * @returns {Promise<boolean>} - Promise vide en cas de succès
   */
  async delete(id: number) {
    try {
      await api.delete(`/recipes/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Récupérer les recettes favorites d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object[]>} - Promise contenant les recettes favorites
   */
  async getFavorites(userId: number) {
    try {
      // D'abord, récupérer les IDs des favoris
      const favoritesResponse = await api.get(`/favorites?userId=${userId}`);
      const recipeIds = favoritesResponse.data.map((fav: { recipeId: number }) => fav.recipeId);
      
      // Si aucun favori, retourner un tableau vide
      if (recipeIds.length === 0) {
        return [];
      }
      
      // Récupérer les recettes correspondantes
      // Note: JSON Server ne supporte pas les requêtes IN, on simule ici
      const allRecipes = await this.getAll();
      return allRecipes.filter((recipe: { id: number }) => recipeIds.includes(recipe.id));
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Ajouter une recette aux favoris
   * @param {number} userId - ID de l'utilisateur
   * @param {number} recipeId - ID de la recette
   * @returns {Promise<Object>} - Promise contenant le favori créé
   */
  async addToFavorites(userId: number, recipeId: number) {
    try {
      // Vérifier si déjà en favoris
      const checkResponse = await api.get(`/favorites?userId=${userId}&recipeId=${recipeId}`);
      
      if (checkResponse.data.length > 0) {
        return checkResponse.data[0]; // Déjà en favoris
      }
      
      // Ajouter aux favoris
      const response = await api.post('/favorites', { userId, recipeId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Supprimer une recette des favoris
   * @param {number} userId - ID de l'utilisateur
   * @param {number} recipeId - ID de la recette
   * @returns {Promise<boolean>} - Promise vide en cas de succès
   */
  async removeFromFavorites(userId: number, recipeId: number): Promise<boolean> {
    try {
      // Trouver l'ID du favori
      const checkResponse = await api.get<{ id: number }[]>(`/favorites?userId=${userId}&recipeId=${recipeId}`);
      
      if (checkResponse.data.length === 0) {
        return true; // Pas dans les favoris
      }
      
      // Supprimer des favoris
      const favoriteId = checkResponse.data[0].id;
      await api.delete(`/favorites/${favoriteId}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Vérifier si une recette est dans les favoris
   * @param {number} userId - ID de l'utilisateur
   * @param {number} recipeId - ID de la recette
   * @returns {Promise<boolean>} - True si en favoris
   */
  async isFavorite(userId: number, recipeId: number) {
    try {
      const response = await api.get(`/favorites?userId=${userId}&recipeId=${recipeId}`);
      return response.data.length > 0;
    } catch (error) {
      throw error;
    }
  }
};

export default recipeService;