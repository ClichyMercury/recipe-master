<script>
    /**
     * Champ de saisie réutilisable avec différentes variantes
     */
    export let id = '';
    export let name = '';
    export let label = '';
    export let type = 'text';
    export let value = '';
    export let placeholder = '';
    export let required = false;
    export let disabled = false;
    export let error = '';
    export let fullWidth = false;
  </script>
  
  <div class="input-container {fullWidth ? 'full-width' : ''}">
    {#if label}
      <label for={id} class="label">
        {label}
        {#if required}<span class="required">*</span>{/if}
      </label>
    {/if}
    
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input {error ? 'has-error' : ''}"
      on:input
      on:focus
      on:blur
    />
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
  </div>
  
  <style>
    .input-container {
      margin-bottom: 1rem;
    }
    
    .full-width {
      width: 100%;
    }
    
    .label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    .required {
      color: #d91b42;
      margin-left: 2px;
    }
    
    .input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .input:focus {
      outline: none;
      border-color: #ff3e00;
    }
    
    .input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    
    .has-error {
      border-color: #d91b42;
    }
    
    .error-message {
      color: #d91b42;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  </style>