<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import recipeStore from '$lib/stores/recipes';
  import authStore from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import Select from '$lib/components/common/Select.svelte';
  import Alert from '$lib/components/common/Alert.svelte';
  import Loading from '$lib/components/common/Loading.svelte';
  
  // Récupérer l'ID de la recette
  $: recipeId = parseInt($page.params.id);
  
  // État de l'authentification
  let auth;
  let unsubscribeAuth;
  
  // État de la recette
  let recipe = null;
  let initialRecipe = null;
  let loading = true;
  let error = null;
  let success = false;
  let newTag = '';
  
  // Options pour les listes déroulantes
  const typeOptions = [
    { value: 'appetizer', label: 'Entrée' },
    { value: 'main', label: 'Plat principal' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'drink', label: 'Boisson' },
    { value: 'snack', label: 'En-cas' }
  ];
  
  const difficultyOptions = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' }
  ];
  
  onMount(() => {
    // S'abonner au store d'authentification
    unsubscribeAuth = authStore.subscribe(value => {
      auth = value;
    });
    
    // Charger la recette
    loadRecipe();
    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  });
  
  // Charger la recette
  async function loadRecipe() {
    try {
      loading = true;
      
      // Récupérer la recette
      const loadedRecipe = await recipeStore.fetchRecipeById(recipeId);
      
      // Vérifier si l'utilisateur est le propriétaire
      if (auth.isAuthenticated && auth.user.id !== loadedRecipe.userId) {
        error = "Vous n'êtes pas autorisé à modifier cette recette";
        loading = false;
        return;
      }
      
      // Assurer que les tableaux existent
      if (!loadedRecipe.ingredients) loadedRecipe.ingredients = [];
      if (!loadedRecipe.steps) loadedRecipe.steps = [];
      if (!loadedRecipe.tags) loadedRecipe.tags = [];
      
      // Stocker la recette
      recipe = loadedRecipe;
      initialRecipe = JSON.parse(JSON.stringify(loadedRecipe)); // Copie profonde
      
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
      loading = false;
    }
  }
  
  // Ajouter un ingrédient
  function addIngredient() {
    recipe.ingredients = [...recipe.ingredients, { name: '', amount: '', unit: '' }];
  }
  
  // Supprimer un ingrédient
  function removeIngredient(index) {
    recipe.ingredients = recipe.ingredients.filter((_, i) => i !== index);
  }
  
  // Ajouter une étape
  function addStep() {
    recipe.steps = [...recipe.steps, ''];
  }
  
  // Supprimer une étape
  function removeStep(index) {
    recipe.steps = recipe.steps.filter((_, i) => i !== index);
  }
  
  // Ajouter un tag
  function addTag() {
    if (newTag && !recipe.tags.includes(newTag)) {
      recipe.tags = [...recipe.tags, newTag];
      newTag = '';
    }
  }
  
  // Supprimer un tag
  function removeTag(tag) {
    recipe.tags = recipe.tags.filter(t => t !== tag);
  }
  
  // Soumettre le formulaire
  async function handleSubmit() {
    try {
      loading = true;
      error = null;
      
      // Valider les données
      if (!recipe.title) {
        error = "Le titre est requis";
        loading = false;
        return;
      }
      
      // Filtrer les ingrédients vides
      recipe.ingredients = recipe.ingredients.filter(ing => ing.name.trim());
      
      // Filtrer les étapes vides
      recipe.steps = recipe.steps.filter(step => step.trim());
      
      // Mettre à jour la recette
      await recipeStore.updateRecipe(recipeId, recipe);
      
      success = true;
      loading = false;
      
      // Rediriger vers la page de détail après 2 secondes
      setTimeout(() => {
        window.location.href = `/recipes/${recipeId}`;
      }, 2000);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
      loading = false;
    }
  }
</script>

<div class="edit-recipe-page">
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
        <a href="/recipes/{recipeId}">
          <Button variant="ghost">Retour à la recette</Button>
        </a>
      </div>
    {:else if recipe}
      <h1 class="page-title">Modifier la recette</h1>
      
      {#if success}
        <Alert type="success">
          Recette mise à jour avec succès ! Redirection en cours...
        </Alert>
      {:else}
        <div class="recipe-form-container">
          <form class="recipe-form" on:submit|preventDefault={handleSubmit}>
            <!-- Informations générales -->
            <div class="form-section">
              <h2 class="section-title">Informations générales</h2>
              
              <Input
                id="title"
                label="Titre"
                bind:value={recipe.title}
                required={true}
                fullWidth={true}
              />
              
              <div class="form-row">
                <Select
                  id="type"
                  label="Type"
                  options={typeOptions}
                  bind:value={recipe.type}
                  fullWidth={true}
                />
                
                <Select
                  id="difficulty"
                  label="Difficulté"
                  options={difficultyOptions}
                  bind:value={recipe.difficulty}
                  fullWidth={true}
                />
              </div>
              
              <div class="form-row">
                <Input
                  id="prepTime"
                  label="Temps de préparation (min)"
                  type="number"
                  bind:value={recipe.prepTime}
                  min="0"
                  fullWidth={true}
                />
                
                <Input
                  id="cookTime"
                  label="Temps de cuisson (min)"
                  type="number"
                  bind:value={recipe.cookTime}
                  min="0"
                  fullWidth={true}
                />
                
                <Input
                  id="servings"
                  label="Portions"
                  type="number"
                  bind:value={recipe.servings}
                  min="1"
                  fullWidth={true}
                />
              </div>
              
              <div class="form-row">
                <div class="form-field full-width">
                  <label for="description">Description</label>
                  <textarea
                    id="description"
                    bind:value={recipe.description}
                    rows="4"
                    class="textarea"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Ingrédients -->
            <div class="form-section">
              <h2 class="section-title">Ingrédients</h2>
              
              {#each recipe.ingredients as ingredient, index}
                <div class="form-row ingredient-row">
                  <Input
                    id={`ingredient-name-${index}`}
                    placeholder="Nom de l'ingrédient"
                    bind:value={ingredient.name}
                    fullWidth={true}
                  />
                  
                  <Input
                    id={`ingredient-amount-${index}`}
                    placeholder="Quantité"
                    bind:value={ingredient.amount}
                    fullWidth={true}
                  />
                  
                  <Input
                    id={`ingredient-unit-${index}`}
                    placeholder="Unité"
                    bind:value={ingredient.unit}
                    fullWidth={true}
                  />
                  
                  <button
                    type="button"
                    class="remove-button"
                    on:click={() => removeIngredient(index)}
                  >
                    ✕
                  </button>
                </div>
              {/each}
              
              <Button
                type="button"
                variant="ghost"
                on:click={addIngredient}
              >
                + Ajouter un ingrédient
              </Button>
            </div>
            
            <!-- Étapes -->
            <div class="form-section">
              <h2 class="section-title">Étapes de préparation</h2>
              
              {#each recipe.steps as step, index}
                <div class="form-row step-row">
                  <div class="step-number">{index + 1}</div>
                  <div class="form-field full-width">
                    <textarea
                      id={`step-${index}`}
                      bind:value={recipe.steps[index]}
                      rows="2"
                      class="textarea"
                      placeholder="Décrivez cette étape..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="button"
                    class="remove-button"
                    on:click={() => removeStep(index)}
                  >
                    ✕
                  </button>
                </div>
              {/each}
              
              <Button
                type="button"
                variant="ghost"
                on:click={addStep}
              >
                + Ajouter une étape
              </Button>
            </div>
            
            <!-- Tags -->
            <div class="form-section">
              <h2 class="section-title">Tags</h2>
              
              <div class="form-row">
                <Input
                  id="tag"
                  placeholder="Tag"
                  bind:value={newTag}
                  fullWidth={true}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  on:click={addTag}
                >
                  Ajouter
                </Button>
              </div>
              
              {#if recipe.tags.length > 0}
                <div class="tags-list">
                  {#each recipe.tags as tag}
                    <div class="tag-pill">
                      <span>#{tag}</span>
                      <button
                        type="button"
                        class="tag-remove"
                        on:click={() => removeTag(tag)}
                      >
                        ✕
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
            
            <div class="form-actions">
              <a href="/recipes/{recipeId}">
                <Button variant="ghost">Annuler</Button>
              </a>
              
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Mise à jour en cours...' : 'Mettre à jour la recette'}
              </Button>
            </div>
          </form>
        </div>
      {/if}
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
  .edit-recipe-page {
    padding-bottom: 3rem;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
  }
  
  .recipe-form-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .form-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) {
    .form-row {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }
  
  .form-field {
    margin-bottom: 1rem;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
  
  .textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
  }
  
  .ingredient-row {
    align-items: center;
  }
  
  .step-row {
    display: flex;
    align-items: center;
    gap: 1rem;
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
  
  .remove-button {
    background: none;
    border: none;
    color: #d91b42;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .tag-pill {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 16px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .tag-remove {
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>