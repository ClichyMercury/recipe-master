<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Input from '$lib/components/common/Input.svelte';
    import Select from '$lib/components/common/Select.svelte';
    import Button from '$lib/components/common/Button.svelte';
    
    // Props
    export let filters: { search: string; type: string; difficulty: string; tags: string[] } = {
      search: '',
      type: '',
      difficulty: '',
      tags: []
    };
    export let allTags: any[] = []; // Liste de tous les tags disponibles
    
    // Créer un dispatcher d'événements
    const dispatch = createEventDispatcher();
    
    // Options pour les listes déroulantes
    const typeOptions = [
      { value: '', label: 'Tous les types' },
      { value: 'appetizer', label: 'Entrée' },
      { value: 'main', label: 'Plat principal' },
      { value: 'dessert', label: 'Dessert' },
      { value: 'drink', label: 'Boisson' },
      { value: 'snack', label: 'En-cas' }
    ];
    
    const difficultyOptions = [
      { value: '', label: 'Toutes les difficultés' },
      { value: 'easy', label: 'Facile' },
      { value: 'medium', label: 'Moyen' },
      { value: 'hard', label: 'Difficile' }
    ];
    
    // État local pour les tags sélectionnés
    let selectedTag = '';
    
    // Ajouter un tag aux filtres
    function addTag() {
      if (selectedTag && !filters.tags.includes(selectedTag)) {
        const newTags = [...filters.tags, selectedTag];
        filters = { ...filters, tags: newTags };
        dispatch('filter', filters);
        selectedTag = '';
      }
    }
    
    // Supprimer un tag des filtres
    function removeTag(tag: string) {
      const newTags = filters.tags.filter(t => t !== tag);
      filters = { ...filters, tags: newTags };
      dispatch('filter', filters);
    }
    
    // Réinitialiser tous les filtres
    function resetFilters() {
      filters = {
        search: '',
        type: '',
        difficulty: '',
        tags: []
      };
      dispatch('filter', filters);
    }
    
    // Gérer les changements dans les filtres
    function handleFilterChange() {
      dispatch('filter', filters);
    }
  </script>
  
  <div class="filters-container">
    <h3 class="filters-title">Filtrer</h3>
    
    <div class="filter-row">
      <Input
        id="search"
        label="Rechercher"
        type="text"
        bind:value={filters.search}
        on:input={handleFilterChange}
        fullWidth={true}
      />
    </div>
    
    <div class="filter-grid">
      <Select
        id="type"
        label="Type"
        options={typeOptions}
        bind:value={filters.type}
        on:change={handleFilterChange}
        fullWidth={true}
      />
      
      <Select
        id="difficulty"
        label="Difficulté"
        options={difficultyOptions}
        bind:value={filters.difficulty}
        on:change={handleFilterChange}
        fullWidth={true}
      />
    </div>
    
    <div class="tags-section">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label class="tag-label">Tags</label>
      
      <div class="tag-input-row">
        <Select
          id="tag-select"
          placeholder="Sélectionner un tag"
          options={allTags.map(tag => ({ value: tag, label: tag }))}
          bind:value={selectedTag}
          fullWidth={true}
        />
        
        <button class="add-tag-button" on:click={addTag} disabled={!selectedTag}>
          +
        </button>
      </div>
      
      {#if filters.tags.length > 0}
        <div class="selected-tags">
          {#each filters.tags as tag (tag)}
            <div class="tag-pill">
              <span class="tag-text">#{tag}</span>
              <button class="remove-tag" on:click={() => removeTag(tag)}>×</button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <div class="filter-actions">
      <Button variant="ghost" size="small" on:click={resetFilters}>
        Réinitialiser
      </Button>
    </div>
  </div>
  
  <style>
    .filters-container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .filters-title {
      margin-top: 0;
      margin-bottom: 1.25rem;
      font-size: 1.25rem;
      color: #333;
    }
    
    .filter-row {
      margin-bottom: 1rem;
    }
    
    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .tags-section {
      margin-bottom: 1.5rem;
    }
    
    .tag-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    .tag-input-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .add-tag-button {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ff3e00;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .add-tag-button:hover:not(:disabled) {
      background-color: #e63700;
    }
    
    .add-tag-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tag-pill {
      display: flex;
      align-items: center;
      background-color: #efefef;
      border-radius: 16px;
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }
    
    .tag-text {
      margin-right: 0.5rem;
    }
    
    .remove-tag {
      background: none;
      border: none;
      color: #666;
      font-size: 1rem;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .filter-actions {
      display: flex;
      justify-content: flex-end;
    }
  </style>