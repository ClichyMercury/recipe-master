<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import type { Unsubscriber } from 'svelte/store';
    import recipeStore from '$lib/stores/recipes';
    import authStore from '$lib/stores/auth';
    import Button from '$lib/components/common/Button.svelte';
    import Alert from '$lib/components/common/Alert.svelte';
    import Loading from '$lib/components/common/Loading.svelte';
    
    // Récupérer les paramètres depuis l'URL
    $: recipeId = parseInt($page.params.id);
    
    // État de la recette
    let recipe: { 
        title: any; 
        type: any; 
        difficulty: any; 
        prepTime: any; 
        cookTime: any; 
        servings: any; 
        description: any; 
        userId: any; 
        imageUrl: any; 
        ingredients: any; 
        steps: any; 
        tags: string | any[]; 
    } | null = null;
    let loading = true;
    let error: string | null = null;
    let isFavorite = false;
    
    // État de l'authentification
    let auth: { 
        isAuthenticated: any; 
        user: any; 
        loading?: boolean; 
        error?: string | null; 
    };
    let unsubscribeAuth: Unsubscriber;
    
    onMount(() => {
      // S'abonner au store d'authentification
      unsubscribeAuth = authStore.subscribe(value => {
        auth = value;
      });
      
      // Fonction asynchrone séparée pour le chargement des données
      async function loadData() {
        try {
          loading = true;
          
          // Récupérer la recette par son ID
          recipe = await recipeStore.fetchRecipeById(recipeId);
          
          // Vérifier si la recette est en favoris si l'utilisateur est connecté
          if (auth.isAuthenticated) {
            const favorites = await recipeStore.fetchFavorites(auth.user.id);
            isFavorite = favorites.some((fav: { id: number; }) => fav.id === recipeId);
          }
          
          loading = false;
        } catch (err) {
          error = err instanceof Error ? err.message : 'An unknown error occurred';
          loading = false;
        }
      }
      
      // Appeler la fonction de chargement
      loadData();
      
      // Retourner la fonction de nettoyage
      return () => {
        if (unsubscribeAuth) unsubscribeAuth();
      };
    });
    
    // Formatage du temps
    function formatTime(minutes: number) {
      if (minutes < 60) {
        return `${minutes} minutes`;
      }
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m` 
        : `${hours}h`;
    }
    
    // Traduction du niveau de difficulté
    function translateDifficulty(difficulty: string) {
      const difficultyMap: Record<string, string> = {
        'easy': 'Facile',
        'medium': 'Moyen',
        'hard': 'Difficile'
      };
      return difficultyMap[difficulty] || difficulty;
    }
    
    // Fonction pour gérer les favoris
    async function toggleFavorite() {
      if (!auth.isAuthenticated) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        window.location.href = `/login`;
        return;
      }
      
      try {
        if (isFavorite) {
          await recipeStore.removeFromFavorites(auth.user.id, recipeId);
        } else {
          await recipeStore.addToFavorites(auth.user.id, recipeId);
        }
        
        // Inverser l'état des favoris
        isFavorite = !isFavorite;
      } catch (err) {
        error = err instanceof Error ? err.message : 'An unknown error occurred';
      }
    }
    
    // Fonction pour supprimer une recette
    async function deleteRecipe() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
        try {
          await recipeStore.deleteRecipe(recipeId);
          // Rediriger vers la liste des recettes
          window.location.href = `/recipes`;
        } catch (err) {
          error = err instanceof Error ? err.message : 'An unknown error occurred';
        }
      }
    }
</script>
  <div class="recipe-detail-page">
    <div class="container">
      {#if loading}
        <div class="loading-container">
          <Loading size="large" text="Chargement en cours..." />
        </div>
      {:else if error}
        <Alert type="error" dismissible={true}>
          {error}
        </Alert>
        
        <div class="back-button">
          <a href="/recipes">
            <Button variant="ghost">Retour aux recettes</Button>
          </a>
        </div>
      {:else if recipe}
        <div class="recipe-detail">
          <!-- En-tête de la recette -->
          <div class="recipe-header">
            <div class="recipe-header-content">
              <h1 class="recipe-title">{recipe.title}</h1>
              
              <div class="recipe-meta">
                <span class="recipe-type">{recipe.type}</span>
                <span class="recipe-difficulty">{translateDifficulty(recipe.difficulty)}</span>
                <span class="recipe-time">
                  Temps total: {formatTime(recipe.prepTime + recipe.cookTime)}
                </span>
                <span class="recipe-servings">
                  Portions: {recipe.servings}
                </span>
              </div>
              
              <p class="recipe-description">{recipe.description}</p>
              
              <div class="recipe-actions">
                <Button 
                  variant={isFavorite ? 'ghost' : 'primary'} 
                  on:click={toggleFavorite}
                >
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
                
                {#if auth?.isAuthenticated && auth.user.id === recipe.userId}
                  <a href="/recipes/edit/{recipeId}">
                    <Button variant="ghost">Modifier</Button>
                  </a>
                  
                  <Button variant="danger" on:click={deleteRecipe}>
                    Supprimer
                  </Button>
                {/if}
              </div>
            </div>
            
            <div class="recipe-image">
              {#if recipe.imageUrl}
                <img src={recipe.imageUrl} alt={recipe.title} />
              {:else}
                <div class="image-placeholder">
                  <span>Pas d'image</span>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Contenu principal de la recette -->
          <div class="recipe-content">
            <!-- Ingrédients -->
            <section class="recipe-section ingredients-section">
              <h2 class="section-title">Ingrédients</h2>
              
              <ul class="ingredients-list">
                {#each recipe.ingredients as ingredient}
                  <li class="ingredient-item">
                    <span class="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span class="ingredient-name">{ingredient.name}</span>
                  </li>
                {/each}
              </ul>
            </section>
            
            <!-- Étapes de préparation -->
            <section class="recipe-section steps-section">
              <h2 class="section-title">Préparation</h2>
              
              <ol class="steps-list">
                {#each recipe.steps as step, index}
                  <li class="step-item">
                    <div class="step-number">{index + 1}</div>
                    <div class="step-text">{step}</div>
                  </li>
                {/each}
              </ol>
            </section>
          </div>
          
          <!-- Tags -->
          {#if recipe.tags && recipe.tags.length > 0}
            <div class="recipe-tags">
              <h3 class="tags-title">Tags</h3>
              <div class="tags-list">
                {#each recipe.tags as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Bouton de retour -->
          <div class="back-button">
            <a href="/recipes">
              <Button variant="ghost">Retour aux recettes</Button>
            </a>
          </div>
        </div>
      {:else}
        <Alert type="error">
          Recette non trouvée
        </Alert>
        
        <div class="back-button">
          <a href="/recipes">
            <Button variant="ghost">Retour aux recettes</Button>
          </a>
        </div>
      {/if}
    </div>
  </div>
  
  <style>
    .recipe-detail-page {
      min-height: 100vh;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem 0;
    }
    
    .recipe-detail {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    /* En-tête de la recette */
    .recipe-header {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    @media (min-width: 768px) {
      .recipe-header {
        grid-template-columns: 3fr 2fr;
      }
    }
    
    .recipe-title {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .recipe-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .recipe-type,
    .recipe-difficulty,
    .recipe-time,
    .recipe-servings {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      background-color: #f0f0f0;
      color: #666;
    }
    
    .recipe-description {
      font-size: 1rem;
      color: #555;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .recipe-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .recipe-image {
      width: 100%;
      height: 100%;
      max-height: 300px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .recipe-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
    }
    
    /* Contenu de la recette */
    .recipe-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    @media (min-width: 768px) {
      .recipe-content {
        grid-template-columns: 1fr 2fr;
      }
    }
    
    .recipe-section {
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #ff3e00;
    }
    
    /* Ingrédients */
    .ingredients-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .ingredient-item {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .ingredient-amount {
      min-width: 70px;
      font-weight: 600;
      color: #666;
    }
    
    /* Étapes */
    .steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .step-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #ff3e00;
      color: white;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .step-text {
      padding-top: 0.5rem;
      line-height: 1.6;
    }
    
    /* Tags */
    .recipe-tags {
      margin-bottom: 2rem;
    }
    
    .tags-title {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tag {
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      background-color: #f0f0f0;
      color: #666;
      font-size: 0.875rem;
    }
    
    /* Bouton de retour */
    .back-button {
      margin-top: 2rem;
    }
  </style>