<script>
    import { onMount } from 'svelte';
    import authStore from '$lib/stores/auth';
    import Input from '$lib/components/common/Input.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Alert from '$lib/components/common/Alert.svelte';
    
    // État du formulaire
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: ''
    };
    let loading = false;
    
    // État de l'authentification
    let auth;
    /**
   * @type {import("svelte/store").Unsubscriber}
   */
    let unsubscribeAuth;
    
    onMount(() => {
      // S'abonner au store d'authentification
      unsubscribeAuth = authStore.subscribe(value => {
        auth = value;
        
        // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
        if (auth.isAuthenticated) {
          window.location.href = `/`;
        }
        
        // Récupérer l'erreur du store
        if (auth.error) {
          errors.form = auth.error;
        }
      });
      
      return () => {
        if (unsubscribeAuth) unsubscribeAuth();
      };
    });
    
    // Validation du formulaire
    function validateForm() {
      let isValid = true;
      errors = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        form: ''
      };
      
      // Valider le nom d'utilisateur
      if (!username.trim()) {
        errors.username = 'Le nom d\'utilisateur est requis';
        isValid = false;
      } else if (username.trim().length < 3) {
        errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        isValid = false;
      }
      
      // Valider l'email
      if (!email.trim()) {
        errors.email = 'L\'email est requis';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'L\'email est invalide';
        isValid = false;
      }
      
      // Valider le mot de passe
      if (!password.trim()) {
        errors.password = 'Le mot de passe est requis';
        isValid = false;
      } else if (password.trim().length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        isValid = false;
      }
      
      // Valider la confirmation du mot de passe
      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'La confirmation du mot de passe est requise';
        isValid = false;
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        isValid = false;
      }
      
      return isValid;
    }
    
    // Soumission du formulaire
    async function handleSubmit() {
      // Réinitialiser les erreurs du store
      authStore.clearErrors();
      
      // Valider le formulaire
      if (!validateForm()) {
        return;
      }
      
      loading = true;
      
      try {
        // Préparer les données utilisateur
        const userData = {
          username,
          email,
          password
        };
        
        // Appeler le store d'authentification pour l'inscription
        await authStore.register(userData);
        
        // Rediriger vers la page d'accueil en cas de succès
        window.location.href = `/`;
      } catch (err) {
        // Les erreurs sont gérées par le store et affichées via le composant Alert
        loading = false;
      }
    }
  </script>
  
  <div class="register-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Inscription</h1>
          
          {#if errors.form}
            <Alert type="error" dismissible={true}>
              {errors.form}
            </Alert>
          {/if}
          
          <form class="auth-form" on:submit|preventDefault={handleSubmit}>
            <Input
              id="username"
              name="username"
              type="text"
              label="Nom d'utilisateur"
              bind:value={username}
              error={errors.username}
              required={true}
              fullWidth={true}
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Adresse email"
              bind:value={email}
              error={errors.email}
              required={true}
              fullWidth={true}
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              bind:value={password}
              error={errors.password}
              required={true}
              fullWidth={true}
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmer le mot de passe"
              bind:value={confirmPassword}
              error={errors.confirmPassword}
              required={true}
              fullWidth={true}
            />
            
            <div class="form-actions">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading} 
                fullWidth={true}
              >
                {loading ? 'Chargement...' : 'S\'inscrire'}
              </Button>
            </div>
          </form>
          
          <div class="auth-footer">
            <p>
              Vous avez déjà un compte ? 
              <a href="/login">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .register-page {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
    }
    
    .auth-container {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
    }
    
    .auth-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }
    
    .auth-title {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .auth-form {
      margin-bottom: 1.5rem;
    }
    
    .form-actions {
      margin-top: 1.5rem;
    }
    
    .auth-footer {
      text-align: center;
      font-size: 0.875rem;
      color: #666;
    }
    
    .auth-footer a {
      color: #ff3e00;
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  </style>