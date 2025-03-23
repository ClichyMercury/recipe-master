import { writable, derived } from 'svelte/store';
import recipeService from '../services/recipes';

function createRecipeStore() {
  // État initial
  const initialState: {
    recipes: {
      id: number; title: string; description: string; type: string; difficulty: string; tags: string[] 
}[];
    currentRecipe: any;
    favorites: any[];
    loading: boolean;
    error: string | null;
    filters: {
      search: string;
      type: string;
      difficulty: string;
      tags: string[];
    };
  } = {
    recipes: [],
    currentRecipe: null,
    favorites: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      type: '',
      difficulty: '',
      tags: []
    }
  };
  
  // Créer le store writable
  const { subscribe, set, update } = writable(initialState);
  
  // Store dérivé pour les recettes filtrées
  const filteredRecipes = derived(
    { subscribe },
    $state => {
      const { recipes, filters } = $state;
      
      return recipes.filter(recipe => {
        // Filtre par recherche (titre ou description)
        if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase()) && 
            !recipe.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        // Filtre par type
        if (filters.type && recipe.type !== filters.type) {
          return false;
        }
        
        // Filtre par difficulté
        if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
          return false;
        }
        
        // Filtre par tags
        if (filters.tags.length > 0 && !filters.tags.some(tag => recipe.tags.includes(tag))) {
          return false;
        }
        
        return true;
      });
    }
  );
  
  return {
    subscribe,
    filteredRecipes: { subscribe: filteredRecipes.subscribe },
    
    // Récupérer toutes les recettes
    async fetchRecipes(params = {}) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const recipes = await recipeService.getAll(params);
        
        update(state => ({
          ...state,
          recipes,
          loading: false
        }));
        
        return recipes;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: (error as any).message || 'Erreur lors de la récupération des recettes'
        }));
        
        throw error;
      }
    },
    
    // Récupérer une recette par son ID
    async fetchRecipeById(id: number): Promise<any> {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
      const recipe = await recipeService.getById(id);
      
      update(state => ({
        ...state,
        currentRecipe: recipe,
        loading: false
      }));
      
      return recipe;
      } catch (error) {
      update(state => ({
        ...state,
        loading: false,
        error: (error as any).message || 'Erreur lors de la récupération de la recette'
      }));
      
      throw error;
      }
    },
    
    // Créer une nouvelle recette
    async createRecipe(recipeData: Record<string, any>) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const newRecipe = await recipeService.create(recipeData);
        
        update(state => ({
          ...state,
          recipes: [...state.recipes, newRecipe],
          currentRecipe: newRecipe,
          loading: false
        }));
        
        return newRecipe;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: (error as any).message || 'Erreur lors de la création de la recette'
        }));
        
        throw error;
      }
    },
    
    // Mettre à jour une recette
    async updateRecipe(id: number, recipeData: Record<string, any>) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const updatedRecipe = await recipeService.update(id, recipeData);
        
        update(state => ({
          ...state,
          recipes: state.recipes.map(recipe => 
            recipe.id === id ? updatedRecipe : recipe
          ),
          currentRecipe: updatedRecipe,
          loading: false
        }));
        
        return updatedRecipe;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: (error as any).message || 'Erreur lors de la mise à jour de la recette'
        }));
        
        throw error;
      }
    },
    
    // Supprimer une recette
    async deleteRecipe(id: number) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        await recipeService.delete(id);
        
        update(state => ({
          ...state,
          recipes: state.recipes.filter(recipe => recipe.id !== id),
          currentRecipe: state.currentRecipe?.id === id ? null : state.currentRecipe,
          loading: false
        }));
        
        return true;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: (error as any).message || 'Erreur lors de la suppression de la recette'
        }));
        
        throw error;
      }
    },
    
    // Récupérer les recettes favorites
    async fetchFavorites(userId: number) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const favorites = await recipeService.getFavorites(userId);
        
        update(state => ({
          ...state,
          favorites,
          loading: false
        }));
        
        return favorites;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: (error as any).message || 'Erreur lors de la récupération des favoris'
        }));
        
        throw error;
      }
    },
    
    // Ajouter une recette aux favoris
    async addToFavorites(userId: number, recipeId: number) {
      try {
        await recipeService.addToFavorites(userId, recipeId);
        
        // Mettre à jour les favoris dans le store
        this.fetchFavorites(userId);
        
        return true;
      } catch (error) {
        update(state => ({
          ...state,
          error: (error as any).message || 'Erreur lors de l\'ajout aux favoris'
        }));
        
        throw error;
      }
    },
    
    // Supprimer une recette des favoris
    async removeFromFavorites(userId: number, recipeId: number) {
      try {
        await recipeService.removeFromFavorites(userId, recipeId);
        
        // Mettre à jour les favoris dans le store
        this.fetchFavorites(userId);
        
        return true;
      } catch (error) {
        update(state => ({
          ...state,
          error: (error as any).message || 'Erreur lors de la suppression des favoris'
        }));
        
        throw error;
      }
    },
    
    // Mettre à jour les filtres
    setFilters(filters: { search: string; type: string; difficulty: string; tags: string[] | never[]; }) {
      update(state => ({
        ...state,
        filters: { ...state.filters, ...filters }
      }));
    },
    
    // Réinitialiser les filtres
    resetFilters() {
      update(state => ({
        ...state,
        filters: {
          search: '',
          type: '',
          difficulty: '',
          tags: []
        }
      }));
    },
    
    // Réinitialiser les erreurs
    clearErrors() {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Exporter le store
const recipeStore = createRecipeStore();
export default recipeStore;