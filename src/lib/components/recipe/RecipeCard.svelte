<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Card from '$lib/components/common/Card.svelte';
    import Button from '$lib/components/common/Button.svelte';
  
    // Props
    export let recipe: {
        id: string;
        imageUrl?: string;
        title: string;
        description: string;
        prepTime: number;
        cookTime: number;
        servings: number;
        type: string;
        difficulty: 'easy' | 'medium' | 'hard';
        tags?: string[];
    };
    export let isFavorite = false;
    
    // Créer un dispatcher d'événements
    const dispatch = createEventDispatcher();
    
    // Formatage du temps (minutes en format lisible)
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
    function translateDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
      const difficultyMap = {
        'easy': 'Facile',
        'medium': 'Moyen',
        'hard': 'Difficile'
      };
      return difficultyMap[difficulty] || difficulty;
    }
    
    // Gestion des événements
    function onFavoriteClick() {
      dispatch('toggleFavorite', { recipeId: recipe.id });
    }
</script>

<Card hoverable={true} elevation="low">
  <div class="recipe-card">
    <!-- Image de la recette -->
    <div class="recipe-image">
      {#if recipe.imageUrl}
        <img src={recipe.imageUrl} alt={recipe.title} />
      {:else}
        <div class="image-placeholder">
          <span>Pas d'image</span>
        </div>
      {/if}
      
      <!-- Badges -->
      <div class="badges">
        <span class="badge type">{recipe.type}</span>
        <span class="badge difficulty">{translateDifficulty(recipe.difficulty)}</span>
      </div>
      
      <!-- Bouton Favoris -->
      <button class="favorite-button" on:click|stopPropagation={onFavoriteClick}>
        {#if isFavorite}
          <span class="heart filled">❤</span>
        {:else}
          <span class="heart">♡</span>
        {/if}
      </button>
    </div>
    
    <!-- Contenu de la recette -->
    <div class="recipe-content">
      <h3 class="recipe-title">{recipe.title}</h3>
      
      <p class="recipe-description">{recipe.description}</p>
      
      <div class="recipe-meta">
        <span class="meta-item">
          <span class="meta-icon">🕒</span>
          {formatTime(recipe.prepTime + recipe.cookTime)}
        </span>
        
        <span class="meta-item">
          <span class="meta-icon">👥</span>
          {recipe.servings} {recipe.servings > 1 ? 'personnes' : 'personne'}
        </span>
      </div>
      
      <!-- Tags -->
      {#if recipe.tags && recipe.tags.length > 0}
        <div class="tags">
          {#each recipe.tags as tag}
            <span class="tag">#{tag}</span>
          {/each}
        </div>
      {/if}
      
      <!-- Bouton de détail -->
      <div class="recipe-actions">
        <a href="/recipes/{recipe.id}" class="view-button">
          <Button variant="ghost" size="small">
            Voir la recette
          </Button>
        </a>
      </div>
    </div>
  </div>
</Card>

<style>
  .recipe-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .recipe-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  .recipe-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .recipe-card:hover .recipe-image img {
    transform: scale(1.05);
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
  
  .badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 5px;
  }
  
  .badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .badge.type {
    background-color: #ff3e00;
    color: white;
  }
  
  .badge.difficulty {
    background-color: #676778;
    color: white;
  }
  
  .favorite-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .favorite-button:hover {
    transform: scale(1.1);
  }
  
  .heart {
    font-size: 1.25rem;
    color: #ff3e00;
  }
  
  .heart.filled {
    color: #ff3e00;
  }
  
  .recipe-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .recipe-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #333;
  }
  
  .recipe-description {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.875rem;
    line-height: 1.4;
    flex-grow: 1;
    
    /* Limiter à 3 lignes avec ellipsis */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .recipe-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    font-size: 0.813rem;
    color: #666;
  }
  
  .meta-icon {
    margin-right: 0.25rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .tag {
    font-size: 0.75rem;
    color: #666;
  }
  
  .recipe-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }
  
  .view-button {
    text-decoration: none;
  }
</style>