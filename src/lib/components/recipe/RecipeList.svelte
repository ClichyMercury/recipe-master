<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import RecipeCard from './RecipeCard.svelte';
    import Loading from '$lib/components/common/Loading.svelte';
    import Alert from '$lib/components/common/Alert.svelte';
    
    // Props
    /** @type {Array<{ id: number, [key: string]: any }>} */
    export let recipes: string | any[] = [];
    export let favorites: any[] = [];
    export let loading = false;
    export let error = null;
    
    // Créer un dispatcher d'événements
    const dispatch = createEventDispatcher();
    
    // Vérifier si une recette est dans les favoris
    function isFavorite(recipeId: any) {
      return favorites.some(fav => fav.id === recipeId);
    }
    
    // Gestion des événements
    function handleToggleFavorite(event: { detail: any; }) {
      dispatch('toggleFavorite', event.detail);
    }
</script>
  
<div class="recipe-list">
  {#if loading}
    <div class="loading-container">
      <Loading size="large" text="Chargement..." />
    </div>
  {:else if error}
    <Alert type="error" title="Erreur">
      {error}
    </Alert>
  {:else if recipes.length === 0}
    <div class="no-recipes">
      <p>Aucune recette trouvée</p>
    </div>
  {:else}
    <div class="grid">
      {#each recipes as recipe (recipe.id)}
        <div class="grid-item">
          <RecipeCard 
            {recipe} 
            isFavorite={isFavorite(recipe.id)} 
            on:toggleFavorite={handleToggleFavorite} 
          />
        </div>
      {/each}
    </div>
  {/if}
</div>
  
<style>
  .recipe-list {
    width: 100%;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
  }
  
  .no-recipes {
    text-align: center;
    padding: 3rem 0;
    color: #666;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>