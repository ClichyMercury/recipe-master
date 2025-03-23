<script>
    /**
     * Carte réutilisable pour afficher du contenu
     */
    export let padded = true;
    export let elevation = 'medium'; // 'none', 'low', 'medium', 'high'
    export let hoverable = false;
  </script>
  
  <div class="card {elevation} {hoverable ? 'hoverable' : ''} {padded ? 'padded' : ''}">
    <slot />
  </div>
  
  <style>
    .card {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.3s, transform 0.3s;
    }
    
    .padded {
      padding: 1.5rem;
    }
    
    /* Élévations */
    .none {
      border: 1px solid #eaeaea;
    }
    
    .low {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .medium {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .high {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    /* Effet au survol */
    .hoverable:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    }
  </style>