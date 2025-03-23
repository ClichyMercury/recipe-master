<script>
    import { onMount } from 'svelte';
    import recipeStore from '$lib/stores/recipes';
    import authStore from '$lib/stores/auth';
    import RecipeList from '$lib/components/recipe/RecipeList.svelte';
    import RecipeFilters from '$lib/components/recipe/RecipeFilters.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Alert from '$lib/components/common/Alert.svelte';
    
    // État des recettes
    let recipes = [];
    /**
   * @type {never[]}
   */
    let filteredRecipes = [];
    /**
   * @type {any[]}
   */
    let favorites = [];
    let loading = true;
    /**
   * @type {null}
   */
    let error = null;
    
    // État des filtres
    let filters = {
      search: '',
      type: '',
      difficulty: '',
      tags: []
    };
    
    // État de l'authentification
    /**
   * @type {{ isAuthenticated: any; user: { id: any; }; }}
   */
    let auth;
    /**
   * @type {() => void}
   */
    let unsubscribeAuth;
    
    // Liste de tous les tags disponibles
    /**
   * @type {any[]}
   */
    let allTags = [];
    
    onMount(async () => {
      // S'abonner au store d'authentification
      unsubscribeAuth = authStore.subscribe((/** @type {any} */ value) => {
        auth = value;
      });
      
      try {
        loading = true;
        
        // Récupérer toutes les recettes
        recipes = await recipeStore.fetchRecipes();
        
        // S'abonner au store des recettes filtrées
        const unsubscribeFiltered = recipeStore.filteredRecipes.subscribe((/** @type {any[]} */ value) => {
          filteredRecipes = value;
        });
        
        // Extraire tous les tags uniques des recettes
        allTags = [...new Set(recipes.flatMap((/** @type {{ tags: any; }} */ recipe) => recipe.tags || []))];
        
        // Si l'utilisateur est connecté, récupérer ses favoris
        if (auth.isAuthenticated) {
          favorites = await recipeStore.fetchFavorites(auth.user.id);
        }
        
        loading = false;
        
        return () => {
          unsubscribeFiltered();
          if (unsubscribeAuth) unsubscribeAuth();
        };
      } catch (err) {
        error = err.message;
        loading = false;
      }
    });
    
    // Fonction pour mettre à jour les filtres
    /**
   * @param {{ detail: { search: string; type: string; difficulty: string; tags: never[]; }; }} event
   */
    function handleFilterChange(event) {
      filters = event.detail;
      recipeStore.setFilters(filters);
    }
    
    // Fonction pour gérer les favoris
    /**
   * @param {{ detail: { recipeId: any; }; }} event
   */
    async function handleToggleFavorite(event) {
      if (!auth.isAuthenticated) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        window.location.href = `/login`;
        return;
      }
      
      const { recipeId } = event.detail;
      
      try {
        const isFav = favorites.some(fav => fav.id === recipeId);
        
        if (isFav) {
          await recipeStore.removeFromFavorites(auth.user.id, recipeId);
        } else {
          await recipeStore.addToFavorites(auth.user.id, recipeId);
        }
        
        // Mettre à jour la liste des favoris
        favorites = await recipeStore.fetchFavorites(auth.user.id);
      } catch (err) {
        error = err.message;
      }
    }
  </script>
  
  <div class="recipes-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Recettes</h1>
        
        <div class="page-actions">
          <a href="/recipes/create">
            <Button variant="primary">Ajouter une recette</Button>
          </a>
        </div>
      </div>
      
      {#if error}
        <Alert type="error" dismissible={true}>
          {error}
        </Alert>
      {/if}
      
      <div class="recipes-content">
        <!-- Sidebar avec filtres -->
        <aside class="sidebar">
          <RecipeFilters 
            bind:filters={filters} 
            allTags={allTags}
            on:filter={handleFilterChange}
          />
        </aside>
        
        <!-- Liste des recettes -->
        <div class="recipe-list-container">
          <RecipeList 
            recipes={filteredRecipes} 
            favorites={favorites}
            loading={loading}
            error={error}
            on:toggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .recipes-page {
      min-height: 100vh;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .page-title {
      margin: 0;
    }
    
    .recipes-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 768px) {
      .recipes-content {
        grid-template-columns: 280px 1fr;
      }
    }
    
    .sidebar {
      position: sticky;
      top: 90px; /* La hauteur du header + un peu d'espace */
      height: fit-content;
    }
  </style>