<script>
    /**
     * Liste déroulante réutilisable
     */
    export let id = '';
    export let name = '';
    export let label = '';
    export let value = '';
    /** @type {{value: string, label: string}[]} */
    export let options = []; // [{value: 'value1', label: 'Label 1'}, ...]
    export let placeholder = '';
    export let required = false;
    export let disabled = false;
    export let error = '';
    export let fullWidth = false;
  </script>
  
  <div class="select-container {fullWidth ? 'full-width' : ''}">
    {#if label}
      <label for={id} class="label">
        {label}
        {#if required}<span class="required">*</span>{/if}
      </label>
    {/if}
    
    <div class="select-wrapper">
      <select
        {id}
        {name}
        {required}
        {disabled}
        bind:value
        class="select {error ? 'has-error' : ''}"
        on:change
      >
        {#if placeholder}
          <option value="" disabled selected>{placeholder}</option>
        {/if}
        
        {#each options as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      <span class="select-arrow">&#9662;</span>
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
  </div>
  
  <style>
    .select-container {
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
    
    .select-wrapper {
      position: relative;
    }
    
    .select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      appearance: none;
      background-color: white;
      transition: border-color 0.2s;
    }
    
    .select:focus {
      outline: none;
      border-color: #ff3e00;
    }
    
    .select:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    
    .select-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #666;
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