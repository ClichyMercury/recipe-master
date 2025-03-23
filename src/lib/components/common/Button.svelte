<script lang="ts">
    /**
     * Bouton réutilisable avec différentes variantes
     */
    export let type: 'button' | 'submit' | 'reset' = 'button'; // type du bouton: 'button', 'submit', 'reset'
    export let variant = 'primary'; // 'primary', 'secondary', 'danger', 'ghost'
    export let disabled = false;
    export let fullWidth = false;
    export let size = 'medium'; // 'small', 'medium', 'large'
  </script>
  
  <button 
    {type} 
    {disabled}
    class="button {variant} {size} {fullWidth ? 'full-width' : ''}"
    on:click
  >
    <slot />
  </button>
  
  <style>
    .button {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s, opacity 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Variantes */
    .primary {
      background-color: #ff3e00;
      color: white;
    }
    
    .primary:hover:not(:disabled) {
      background-color: #e63700;
    }
    
    .secondary {
      background-color: #676778;
      color: white;
    }
    
    .secondary:hover:not(:disabled) {
      background-color: #585865;
    }
    
    .danger {
      background-color: #d91b42;
      color: white;
    }
    
    .danger:hover:not(:disabled) {
      background-color: #c2173b;
    }
    
    .ghost {
      background-color: transparent;
      color: #333;
      border: 1px solid #ccc;
    }
    
    .ghost:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    /* Tailles */
    .small {
      padding: 6px 12px;
      font-size: 0.875rem;
    }
    
    .medium {
      padding: 8px 16px;
      font-size: 1rem;
    }
    
    .large {
      padding: 12px 24px;
      font-size: 1.125rem;
    }
    
    /* Largeur complète */
    .full-width {
      width: 100%;
    }
  </style>