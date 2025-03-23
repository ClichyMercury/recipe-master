<script lang="ts">
    /**
     * Composant d'alerte pour afficher des messages à l'utilisateur
     */
    export let type = 'info'; // 'info', 'success', 'warning', 'error'
    export let title = '';
    export let dismissible = false;
    
    // État local pour gérer la fermeture
    let visible = true;
    
    // Icônes selon le type
    const icons = {
      info: 'ⓘ',
      success: '✓',
      warning: '⚠',
      error: '✕'
    };
    
    // Fonction pour fermer l'alerte
    function close() {
      visible = false;
    }
  </script>
  
  {#if visible}
    <div class="alert {type}" role="alert">
      <div class="alert-icon">{icons[type as keyof typeof icons]}</div>
      
      <div class="alert-content">
        {#if title}
          <h4 class="alert-title">{title}</h4>
        {/if}
        <div class="alert-message">
          <slot />
        </div>
      </div>
      
      {#if dismissible}
        <button class="alert-close" on:click={close} aria-label="Fermer">
          &times;
        </button>
      {/if}
    </div>
  {/if}
  
  <style>
    .alert {
      display: flex;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      align-items: flex-start;
    }
    
    .alert-icon {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }
    
    .alert-content {
      flex: 1;
    }
    
    .alert-title {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .alert-message {
      font-size: 0.875rem;
    }
    
    .alert-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0 0.25rem;
      margin-left: 0.5rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    
    .alert-close:hover {
      opacity: 1;
    }
    
    /* Variantes d'alerte */
    .info {
      background-color: #e3f2fd;
      color: #0277bd;
    }
    
    .success {
      background-color: #e8f5e9;
      color: #388e3c;
    }
    
    .warning {
      background-color: #fff8e1;
      color: #f57c00;
    }
    
    .error {
      background-color: #feebee;
      color: #d32f2f;
    }
  </style>