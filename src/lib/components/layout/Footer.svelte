<script>
    // Année actuelle pour le copyright
    const currentYear = new Date().getFullYear();
  </script>
  
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Logo et tagline -->
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🍳</span>
            <span class="logo-text">RecipeMaster</span>
          </div>
          <p class="tagline">Découvrez et partagez des recettes délicieuses</p>
        </div>
        
        <!-- Liens utiles -->
        <div class="footer-links">
          <h4 class="footer-heading">Liens</h4>
          <ul class="footer-list">
            <li><a href="/">Accueil</a></li>
            <li><a href="/recipes">Recettes</a></li>
            <li><a href="/login">Connexion</a></li>
            <li><a href="/register">Inscription</a></li>
          </ul>
        </div>
        
        <!-- À propos -->
        <div class="footer-about">
          <h4 class="footer-heading">À propos</h4>
          <ul class="footer-list">
            <li><a href="/about">À propos de nous</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/terms">Conditions d'utilisation</a></li>
            <li><a href="/privacy">Politique de confidentialité</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="footer-bottom">
        <p class="copyright">
          &copy; {currentYear} RecipeMaster. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
  
  <style>
    .footer {
      background-color: #333;
      color: #fff;
      padding: 3rem 0 1.5rem;
      margin-top: 3rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    @media (min-width: 768px) {
      .footer-content {
        grid-template-columns: 2fr 1fr 1fr;
      }
    }
    
    /* Logo et tagline */
    .footer-brand {
      margin-bottom: 1rem;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .logo-icon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
    }
    
    .tagline {
      font-size: 0.875rem;
      color: #ccc;
      margin: 0;
    }
    
    /* Titres */
    .footer-heading {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 1rem;
      color: #fff;
    }
    
    /* Listes */
    .footer-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .footer-list li {
      margin-bottom: 0.5rem;
    }
    
    .footer-list a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-list a:hover {
      color: #ff3e00;
    }
    
    /* Copyright */
    .footer-bottom {
      border-top: 1px solid #444;
      padding-top: 1.5rem;
      text-align: center;
    }
    
    .copyright {
      font-size: 0.875rem;
      color: #888;
      margin: 0;
    }
  </style>