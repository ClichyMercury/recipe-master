<script lang="ts">
  import { onMount } from 'svelte';
  import recipeStore from '$lib/stores/recipes';
  import authStore from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Alert from '$lib/components/common/Alert.svelte';
  import Loading from '$lib/components/common/Loading.svelte';
  import RecipeCard from '$lib/components/recipe/RecipeCard.svelte';
  
  // État de l'authentification
  let auth;
  let unsubscribeAuth;
  
  // État des recettes
  let userRecipes = [];
  let favoriteRecipes = [];
  let loading = true;
  let error = null;
  
  onMount(() => {
    // S'abonner au store d'authentification
    unsubscribeAuth = authStore.subscribe(value => {
      auth = value;
      
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      if (!auth.isAuthenticated && !auth.loading) {
        window.location.href = '/login';
      } else if (auth.isAuthenticated) {
        // Charger les données
        loadData();
      }
    });
    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  });
  
  // Charger les données
  async function loadData() {
    try {
      loading = true;
      
      // Récupérer les recettes de l'utilisateur
      const allRecipes = await recipeStore.fetchRecipes();
      userRecipes = allRecipes.filter(recipe => recipe.userId === auth.user.id);
      
      // Récupérer les recettes favorites
      favoriteRecipes = await recipeStore.fetchFavorites(auth.user.id);
      
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
      loading = false;
    }
  }
  
  // Gérer les favoris
  async function handleToggleFavorite(event) {
    const { recipeId } = event.detail;
    
    try {
      const isFav = favoriteRecipes.some(fav => fav.id === recipeId);
      
      if (isFav) {
        await recipeStore.removeFromFavorites(auth.user.id, recipeId);
      } else {
        await recipeStore.addToFavorites(auth.user.id, recipeId);
      }
      
      // Recharger les favoris
      favoriteRecipes = await recipeStore.fetchFavorites(auth.user.id);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
    }
  }
</script>

<div class="profile-page">
  <div class="container">
    {#if loading}
      <div class="loading-container">
        <Loading size="large" text="Chargement en cours..." />
      </div>
    {:else if error}
      <Alert type="error" dismissible={true}>
        {error}
      </Alert>
    {:else if auth?.isAuthenticated}
      <div class="profile-header">
        <div class="profile-info">
          <div class="avatar">
            <span class="avatar-text">{auth.user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div class="user-info">
            <h1 class="username">{auth.user.username}</h1>
            <p class="email">{auth.user.email}</p>
          </div>
        </div>
        
        <div class="profile-actions">
          <a href="/recipes/create">
            <Button variant="primary">Créer une recette</Button>
          </a>
          
          <Button 
            variant="ghost" 
            on:click={() => authStore.logout()}
          >
            Déconnexion
          </Button>
        </div>
      </div>
      
      <!-- Mes recettes -->
      <section class="profile-section">
        <h2 class="section-title">Mes recettes</h2>
        
        {#if userRecipes.length === 0}
          <div class="empty-state">
            <p>Vous n'avez pas encore créé de recettes.</p>
            <a href="/recipes/create">
              <Button variant="primary">Créer ma première recette</Button>
            </a>
          </div>
        {:else}
          <div class="recipes-grid">
            {#each userRecipes as recipe (recipe.id)}
              <div class="recipe-item">
                <RecipeCard 
                  {recipe} 
                  isFavorite={favoriteRecipes.some(fav => fav.id === recipe.id)}
                  on:toggleFavorite={handleToggleFavorite}
                />
              </div>
            {/each}
          </div>
        {/if}
      </section>
      
      <!-- Mes favoris -->
      <section class="profile-section">
        <h2 class="section-title">Mes favoris</h2>
        
        {#if favoriteRecipes.length === 0}
          <div class="empty-state">
            <p>Vous n'avez pas encore de recettes favorites.</p>
            <a href="/recipes">
              <Button variant="primary">Découvrir des recettes</Button>
            </a>
          </div>
        {:else}
          <div class="recipes-grid">
            {#each favoriteRecipes as recipe (recipe.id)}
              <div class="recipe-item">
                <RecipeCard 
                  {recipe} 
                  isFavorite={true}
                  on:toggleFavorite={handleToggleFavorite}
                />
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  </div>
</div>

<style>
  .profile-page {
    padding-bottom: 3rem;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
  }
  
  .profile-header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  @media (min-width: 768px) {
    .profile-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #ff3e00;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-text {
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-size: 1.5rem;
    margin: 0;
    color: #333;
  }
  
  .email {
    font-size: 1rem;
    color: #666;
    margin: 0.25rem 0 0 0;
  }
  
  .profile-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .profile-section {
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
    border-bottom: 2px solid #ff3e00;
    padding-bottom: 0.5rem;
    display: inline-block;
  }
  
  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .empty-state {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    text-align: center;
  }
  
  .empty-state p {
    margin-bottom: 1.5rem;
    color: #666;
  }
</style>