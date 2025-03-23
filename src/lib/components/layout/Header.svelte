<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import authStore from '$lib/stores/auth';
    import Button from '$lib/components/common/Button.svelte';
    
    // Stores
    let auth;
    let showMobileMenu = false;
    
    // S'abonner au store d'authentification
    onMount(() => {
      const unsubscribe = authStore.subscribe(value => {
        auth = value;
      });
      
      return unsubscribe;
    });
  
    // Fonction pour gérer la déconnexion
    function handleLogout() {
      authStore.logout();
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    }
  
    // Fonction pour basculer le menu mobile
    function toggleMobileMenu() {
      showMobileMenu = !showMobileMenu;
    }
  </script>
  
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo et titre -->
        <div class="logo">
          <a href="/">
            <span class="logo-icon">🍳</span>
            <span class="logo-text">RecipeMaster</span>
          </a>
        </div>
  
        <!-- Navigation -->
        <nav class="nav-desktop">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>
                Accueil
              </a>
            </li>
            <li class="nav-item">
              <a href="/recipes" class="nav-link" class:active={$page.url.pathname.includes('/recipes')}>
                Recettes
              </a>
            </li>
          </ul>
        </nav>
  
        <!-- Actions (authentification) -->
        <div class="header-actions">
          <!-- Authentification -->
          <div class="auth-buttons">
            {#if auth?.isAuthenticated}
              <a href="/profile" class="profile-link">
                <span class="user-icon">👤</span>
                <span class="username">{auth.user?.username}</span>
              </a>
              <Button variant="ghost" size="small" on:click={handleLogout}>
                Déconnexion
              </Button>
            {:else}
              <a href="/login">
                <Button variant="ghost" size="small">Connexion</Button>
              </a>
              <a href="/register">
                <Button variant="primary" size="small">Inscription</Button>
              </a>
            {/if}
          </div>
  
          <!-- Bouton menu mobile -->
          <button class="mobile-menu-toggle" on:click={toggleMobileMenu}>
            {#if showMobileMenu}
              <span class="close-icon">✕</span>
            {:else}
              <span class="menu-icon">☰</span>
            {/if}
          </button>
        </div>
      </div>
  
      <!-- Menu mobile -->
      {#if showMobileMenu}
        <div class="mobile-menu">
          <nav class="nav-mobile">
            <ul class="mobile-nav-list">
              <li class="mobile-nav-item">
                <a href="/" class="mobile-nav-link">
                  Accueil
                </a>
              </li>
              <li class="mobile-nav-item">
                <a href="/recipes" class="mobile-nav-link">
                  Recettes
                </a>
              </li>
              {#if auth?.isAuthenticated}
                <li class="mobile-nav-item">
                  <a href="/profile" class="mobile-nav-link">
                    Profil
                  </a>
                </li>
                <li class="mobile-nav-item">
                  <button class="mobile-nav-link logout-button" on:click={handleLogout}>
                    Déconnexion
                  </button>
                </li>
              {:else}
                <li class="mobile-nav-item">
                  <a href="/login" class="mobile-nav-link">
                    Connexion
                  </a>
                </li>
                <li class="mobile-nav-item">
                  <a href="/register" class="mobile-nav-link">
                    Inscription
                  </a>
                </li>
              {/if}
            </ul>
          </nav>
        </div>
      {/if}
    </div>
  </header>
  
  <style>
    .header {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
  
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
  
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
  
    /* Logo */
    .logo a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
    }
  
    .logo-icon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
  
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
    }
  
    /* Navigation desktop */
    .nav-desktop {
      display: none;
    }
  
    @media (min-width: 768px) {
      .nav-desktop {
        display: block;
      }
    }
  
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
  
    .nav-item {
      margin: 0 0.75rem;
    }
  
    .nav-link {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 0.5rem;
      transition: color 0.2s;
    }
  
    .nav-link:hover, .nav-link.active {
      color: #ff3e00;
    }
  
    /* Header actions */
    .header-actions {
      display: flex;
      align-items: center;
    }
  
    /* Auth buttons */
    .auth-buttons {
      display: none;
    }
  
    @media (min-width: 768px) {
      .auth-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  
    .profile-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
      margin-right: 0.5rem;
    }
  
    .user-icon {
      margin-right: 0.25rem;
    }
  
    .username {
      font-weight: 500;
    }
  
    /* Mobile menu toggle */
    .mobile-menu-toggle {
      display: block;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    }
  
    @media (min-width: 768px) {
      .mobile-menu-toggle {
        display: none;
      }
    }
  
    /* Mobile menu */
    .mobile-menu {
      padding: 1rem 0;
      border-top: 1px solid #eee;
    }
  
    .mobile-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  
    .mobile-nav-item {
      margin: 0.5rem 0;
    }
  
    .mobile-nav-link {
      display: block;
      padding: 0.75rem 0;
      text-decoration: none;
      color: #333;
      font-weight: 500;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }
  
    .logout-button {
      color: #d91b42;
    }
  </style>