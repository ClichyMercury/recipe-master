<script>
    /**
     * Indicateur de chargement
     */
    export let size = 'medium'; // 'small', 'medium', 'large'
    export let fullPage = false; // Si true, l'indicateur prendra toute la page
    export let text = ''; // Texte optionnel à afficher
  </script>
  
  {#if fullPage}
    <div class="loading-overlay">
      <div class="loading-container">
        <div class="spinner {size}"></div>
        {#if text}
          <p class="loading-text">{text}</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class="loading-container inline">
      <div class="spinner {size}"></div>
      {#if text}
        <p class="loading-text">{text}</p>
      {/if}
    </div>
  {/if}
  
  <style>
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .inline {
      margin: 1rem 0;
    }
    
    .spinner {
      border-radius: 50%;
      border-top: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-left: 3px solid #ff3e00;
      animation: spin 1s linear infinite;
    }
    
    .small {
      width: 16px;
      height: 16px;
    }
    
    .medium {
      width: 32px;
      height: 32px;
    }
    
    .large {
      width: 48px;
      height: 48px;
    }
    
    .loading-text {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>