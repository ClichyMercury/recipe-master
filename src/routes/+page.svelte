<script>
    import recipeStore from '$lib/stores/recipes';
    import RecipeCard from '$lib/components/recipe/RecipeCard.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import { onMount } from 'svelte';
    
    // État des recettes
    /**
   * @type {string | any[]}
   */
    let featuredRecipes = [];
    let loading = true;
    /**
   * @type {string | null}
   */
    let error = null;
    
    onMount(async () => {
      try {
        // Récupérer les recettes récentes
        const recipes = await recipeStore.fetchRecipes();
        
        // Prendre les 3 recettes les plus récentes pour la mise en avant
        featuredRecipes = recipes
          .sort((/** @type {{ createdAt: string | number | Date; }} */ a, /** @type {{ createdAt: string | number | Date; }} */ b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        loading = false;
      } catch (err) {
        error = (err instanceof Error) ? err.message : 'An unknown error occurred';
        loading = false;
      }
    });
  </script>
  
  <div class="home-page">
    <!-- Hero section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">RecipeMaster</h1>
          <p class="hero-tagline">Découvrez et partagez des recettes délicieuses</p>
          <div class="hero-buttons">
            <a href="/recipes">
              <Button variant="primary" size="large">Voir toutes les recettes</Button>
            </a>
            <a href="/recipes/create">
              <Button variant="ghost" size="large">Ajouter une recette</Button>
            </a>
          </div>
        </div>
        <div class="hero-image">
          <img src="images/hero-image.jpg" alt="Cooking" />
        </div>
      </div>
    </section>
    
    <!-- Featured recipes section -->
    <section class="featured-recipes">
      <div class="container">
        <h2 class="section-title">Recettes à la Une</h2>
        
        {#if loading}
          <div class="loading-message">
            Chargement en cours...
          </div>
        {:else if error}
          <div class="error-message">
            {error}
          </div>
        {:else if featuredRecipes.length === 0}
          <div class="empty-message">
            Aucune recette trouvée.
          </div>
        {:else}
          <div class="recipe-grid">
            {#each featuredRecipes as recipe (recipe.id)}
              <div class="recipe-item">
                <RecipeCard {recipe} />
              </div>
            {/each}
          </div>
          
          <div class="view-all">
            <a href="/recipes">
              <Button variant="ghost">Voir toutes les recettes</Button>
            </a>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Features section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Fonctionnalités</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3 class="feature-title">Créez vos recettes</h3>
            <p class="feature-description">
              Ajoutez facilement vos propres recettes avec des ingrédients, des étapes et des photos.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Découvrez des recettes</h3>
            <p class="feature-description">
              Parcourez une large sélection de recettes de différentes cuisines.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">❤️</div>
            <h3 class="feature-title">Enregistrez vos favoris</h3>
            <p class="feature-description">
              Marquez vos recettes préférées pour les retrouver facilement.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
  
  <style>
    /* Hero section */
    .hero {
      background-color: #fff;
      padding: 4rem 0;
      margin-bottom: 3rem;
    }
    
    .hero .container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
    }
    
    @media (min-width: 768px) {
      .hero .container {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .hero-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .hero-tagline {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 2rem;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .hero-image img {
      width: 100%;
      max-width: 500px;
      border-radius: 8px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    /* Featured recipes section */
    .featured-recipes {
      margin-bottom: 3rem;
    }
    
    .section-title {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .loading-message, .error-message, .empty-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    .view-all {
      text-align: center;
      margin-top: 1rem;
    }
    
    /* Features section */
    .features {
      background-color: #fff;
      padding: 4rem 0;
      border-radius: 8px;
      margin-bottom: 3rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      text-align: center;
      padding: 1.5rem;
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .feature-title {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    
    .feature-description {
      color: #666;
      margin: 0;
    }
  </style>