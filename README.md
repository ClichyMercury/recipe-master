# RecipeMaster

RecipeMaster est une application web moderne de gestion de recettes culinaires. Ce projet utilise SvelteKit pour le frontend et JSON Server pour simuler un backend RESTful, offrant ainsi une expérience utilisateur fluide et interactive.

## Fonctionnalités principales

- ✅ Consultation d'une bibliothèque de recettes avec filtrage avancé
- ✅ Création et modification de recettes personnelles
- ✅ Gestion de favoris pour retrouver facilement ses recettes préférées
- ✅ Interface multilingue (français, anglais, espagnol)
- ✅ Authentification simulée des utilisateurs

## Installation et démarrage

```bash
# Cloner le dépôt
git clone https://github.com/ClichyMercury/recipe-master.git
cd recipe-master

# Installer les dépendances
npm install

# Lancer l'application en mode développement (frontend + backend)
npm run dev:all

# Ou lancer les services séparément
npm run dev      # SvelteKit (frontend)
npm run api      # JSON Server (backend)
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173) et l'API sur [http://localhost:3001](http://localhost:3001).

## Architecture du projet

### Frontend (SvelteKit)

```
src/
├── lib/
│   ├── components/              # Composants réutilisables
│   │   ├── common/              # Boutons, champs de formulaire, etc.
│   │   ├── layout/              # Header, Footer
│   │   └── recipe/              # Composants spécifiques aux recettes
│   ├── stores/                  # Gestion d'état global
│   │   ├── auth.js              # Authentification
│   │   └── recipes.js           # Gestion des recettes
│   ├── services/                # Services API
│   │   ├── api.js               # Configuration Axios
│   │   ├── auth.js              # Service d'authentification
│   │   └── recipes.js           # Service de gestion des recettes
│   └── i18n/                    # Configuration internationalisation
│       ├── index.js
│       └── store.js
└── routes/                      # Pages de l'application
    ├── +layout.svelte           # Layout principal
    ├── +page.svelte             # Page d'accueil
    ├── recipes/                 # Routes pour les recettes
    │   ├── +page.svelte         # Liste des recettes
    │   ├── [id]/                # Détail d'une recette
    │   ├── create/              # Création de recette
    │   └── edit/[id]/           # Édition de recette
    ├── login/                   # Page de connexion
    ├── register/                # Page d'inscription
    └── profile/                 # Profil utilisateur
```

### Backend simulé (JSON Server)

Le fichier `db.json` à la racine du projet contient les données structurées utilisées par JSON Server :

- **users** : Utilisateurs de l'application
- **recipes** : Recettes avec tous leurs détails
- **favorites** : Relations entre utilisateurs et recettes favorites
- **categories** : Catégories pour classer les recettes
- **comments** : Commentaires sur les recettes

JSON Server génère automatiquement une API RESTful complète à partir de ce fichier.

## Technologies utilisées

- **SvelteKit** : Framework pour construire des applications web performantes
- **Svelte** : Bibliothèque UI réactive qui compile le code pour optimiser les performances
- **Paraglide** : Solution d'internationalisation pour le multilingue
- **Axios** : Client HTTP pour communiquer avec l'API
- **JSON Server** : Simulateur d'API REST
- **TypeScript** : Typage statique pour améliorer la maintenabilité

## Structure des données

### Recette

```typescript
interface Recipe {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: string;               // 'appetizer', 'main', 'dessert', etc.
  difficulty: string;         // 'easy', 'medium', 'hard'
  prepTime: number;           // en minutes
  cookTime: number;           // en minutes
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}
```

## Workflow de développement

1. Exécutez `npm run dev:all` pour lancer l'application complète
2. Modifiez les fichiers dans `src/` pour le développement frontend
3. Les modifications sont automatiquement rechargées grâce à Vite
4. Les changements apportés à `db.json` sont immédiatement disponibles via l'API

## Routes API principales

- `GET /recipes` : Liste de toutes les recettes
- `GET /recipes/:id` : Détails d'une recette spécifique
- `POST /recipes` : Création d'une nouvelle recette
- `PUT /recipes/:id` : Mise à jour d'une recette
- `DELETE /recipes/:id` : Suppression d'une recette
- `GET /favorites?userId=:id` : Favoris d'un utilisateur

## Fonctionnalités à venir

- [ ] Système de commentaires et notation
- [ ] Partage sur réseaux sociaux
- [ ] Planification de menus hebdomadaires
- [ ] Calcul automatique de valeurs nutritionnelles
- [ ] Backend réel avec base de données persistante

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests ou à ouvrir des issues pour améliorer le projet.

## Licence

Ce projet est sous licence MIT.



# Présentation détaillée du projet RecipeMaster

## Introduction au projet

RecipeMaster est une application web moderne dédiée à la gestion de recettes culinaires. Ce projet constitue un exemple complet d'application web utilisant les technologies JavaScript modernes, avec une architecture bien structurée. Il a été développé avec SvelteKit pour le frontend et JSON Server pour simuler un backend, offrant ainsi une expérience utilisateur fluide et réactive sans nécessiter un backend complexe.

## Sujet et objectifs du projet

Cette application répond à un besoin concret : offrir aux passionnés de cuisine une plateforme pour découvrir, créer, modifier et partager des recettes culinaires. Les objectifs principaux sont :

1. Permettre la consultation d'une bibliothèque de recettes avec filtrage
2. Offrir la possibilité de créer et d'éditer des recettes personnelles
3. Gérer un système de favoris pour retrouver facilement ses recettes préférées
4. Proposer une interface multilingue (français, anglais, espagnol)
5. Fournir une expérience utilisateur fluide et intuitive

## Technologies utilisées

### Frontend
- **SvelteKit** : Framework pour créer des applications web performantes
- **Svelte** : Bibliothèque UI réactive qui compile le code pour optimiser les performances
- **Paraglide** : Solution d'internationalisation pour gérer le multilingue
- **Axios** : Client HTTP pour communiquer avec l'API

### Backend simulé
- **JSON Server** : Simulateur d'API REST basé sur un fichier JSON
- Permet de prototyper rapidement sans développer un backend complet

### Outils de développement
- **TypeScript** : Typage statique pour améliorer la maintenabilité et réduire les erreurs
- **ESLint** : Linting du code pour maintenir une qualité constante
- **Vite** : Système de build rapide et moderne

## Architecture détaillée

L'architecture du projet RecipeMaster suit une structure modulaire bien organisée pour faciliter la maintenance et l'évolution.

### Structure des dossiers
```
recipe-master/
├── db.json                # Données pour JSON Server
├── messages/              # Fichiers de traduction
│   ├── en.json
│   ├── fr.json
│   └── es.json
├── src/
│   ├── lib/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── common/    # Boutons, formulaires, etc.
│   │   │   ├── layout/    # En-tête, pied de page
│   │   │   └── recipe/    # Composants spécifiques aux recettes
│   │   ├── stores/        # Gestion d'état global
│   │   │   ├── auth.js    # Authentification
│   │   │   └── recipes.js # Gestion des recettes
│   │   ├── services/      # Services API
│   │   │   ├── api.js     # Configuration Axios
│   │   │   ├── auth.js    # Service d'authentification
│   │   │   └── recipes.js # Service de gestion des recettes
│   │   └── i18n/          # Configuration internationalisation
│   │       ├── index.js
│   │       └── store.js
│   └── routes/            # Routes SvelteKit
│       ├── +layout.svelte # Layout principal
│       ├── +page.svelte   # Page d'accueil
│       ├── [lang]/        # Routes avec paramètre de langue
│           ├── +layout.svelte
│           ├── recipes/
│           │   ├── +page.svelte        # Liste des recettes
│           │   ├── [id]/
│           │   │   └── +page.svelte    # Détail d'une recette
│           │   ├── create/
│           │   │   └── +page.svelte    # Création de recette
│           │   └── edit/[id]/
│           │       └── +page.svelte    # Édition de recette
│           ├── login/
│           │   └── +page.svelte        # Page de connexion
│           └── register/
│               └── +page.svelte        # Page d'inscription
└── static/                # Fichiers statiques
    └── images/            # Images (recettes, UI)
```

### Modèle de données

L'application s'articule autour de plusieurs entités principales :

1. **Recettes** (recipes)
   - Attributs : titre, description, type, difficulté, temps de préparation, temps de cuisson, portions, etc.
   - Relations : créées par un utilisateur, peuvent être mises en favoris

2. **Utilisateurs** (users)
   - Attributs : nom d'utilisateur, email, mot de passe
   - Relations : créent des recettes, ont des favoris

3. **Favoris** (favorites)
   - Relation entre utilisateurs et recettes

4. **Catégories** (categories)
   - Permettent de classer les recettes

5. **Commentaires** (comments)
   - Avis et notations sur les recettes

### Gestion d'état avec les stores Svelte

L'application utilise le système de stores de Svelte pour gérer l'état global :

1. **Store d'authentification** (`authStore`)
   - Stocke l'état d'authentification de l'utilisateur
   - Gère les opérations de connexion, inscription et déconnexion
   - Persiste les informations d'authentification dans le localStorage

2. **Store de recettes** (`recipeStore`)
   - Gère la liste des recettes et la recette actuellement sélectionnée
   - Implémente la logique de filtrage et de recherche
   - Gère l'ajout et la suppression de favoris

### Système d'API et services

La communication avec le backend est abstraite dans des services :

1. **Configuration API** (`api.js`)
   - Configure Axios avec l'URL de base et les intercepteurs
   - Gère automatiquement l'ajout du token d'authentification
   - Gère les erreurs communes (401, timeout, etc.)

2. **Service d'authentification** (`auth.js`)
   - Méthodes : login, register, logout
   - Simule un système de JWT pour l'authentification

3. **Service de recettes** (`recipes.js`)
   - CRUD complet pour les recettes
   - Gestion des favoris
   - Filtrages et recherches

### Internationalisation

Le système multilingue utilise Paraglide :

1. **Fichiers de traduction** (`messages/*.json`)
   - Structure hiérarchique des clés de traduction
   - Versions pour chaque langue supportée

2. **Utilitaires d'internationalisation** (`src/lib/i18n/`)
   - Détection de la langue du navigateur
   - Changement de langue à la volée
   - Stockage des préférences linguistiques

### Système de routing

SvelteKit utilise un système de routing basé sur les fichiers :

- **[lang]/** : Paramètre dynamique pour la langue
- **recipes/[id]/** : Paramètre dynamique pour l'ID de recette
- **+page.svelte** : Composant de page
- **+layout.svelte** : Layouts réutilisables (entête, pied de page)

## Fonctionnalités implémentées

### Gestion des recettes
- Affichage de la liste des recettes avec filtres et recherche
- Vue détaillée d'une recette avec ingrédients et étapes
- Création et édition de recettes
- Suppression de recettes

### Système d'authentification
- Inscription et connexion des utilisateurs
- Protection des routes nécessitant une authentification
- Gestion de session avec stockage local

### Système de favoris
- Ajout et suppression de recettes aux favoris
- Affichage des favoris de l'utilisateur

### Interface multilingue
- Support pour français, anglais et espagnol
- Détection automatique de la langue du navigateur
- Changement de langue à la volée
- URLs internationalisées

### Interface utilisateur réactive
- Design responsive pour tous les appareils
- Composants réutilisables et consistants
- Feedback visuel pour les actions utilisateur

## Aspects techniques notables

### Communication frontend-backend
- Requêtes HTTP via Axios
- Gestion des erreurs et des états de chargement
- Simulations de latence réseau réalistes

### Réactivité avec Svelte
- Mise à jour automatique de l'UI lorsque les données changent
- Logique déclarative pour les interactions
- Animations et transitions fluides

### Réutilisabilité des composants
- Composants génériques pour les éléments d'UI communs
- Slots pour personnaliser l'affichage
- Props pour configurer le comportement

### Gestion de formulaires
- Validation des entrées
- Feedback d'erreurs
- Soumission asynchrone

## Extensions et améliorations possibles

Le projet est conçu pour évoluer facilement avec des améliorations futures :

1. **Backend réel**
   - Remplacer JSON Server par une API Node.js, Django ou autre
   - Authentification sécurisée avec JWT
   - Base de données persistante (MongoDB, PostgreSQL)

2. **Fonctionnalités avancées**
   - Système de commentaires et notation
   - Partage sur réseaux sociaux
   - Planification de menus hebdomadaires
   - Calcul automatique de valeurs nutritionnelles

3. **Améliorations techniques**
   - Tests unitaires et d'intégration
   - Déploiement continu
   - Optimisations de performance
   - PWA pour utilisation hors ligne

## Conclusion

RecipeMaster illustre comment construire une application web moderne complète avec une architecture bien pensée. Le projet démontre la puissance de SvelteKit pour créer des interfaces dynamiques et réactives, tout en maintenant une base de code claire et maintenable. La combinaison avec JSON Server offre un environnement de développement fluide qui permet de se concentrer sur les fonctionnalités et l'expérience utilisateur sans la complexité d'un backend complet.

Cette application peut servir de base pour des projets plus ambitieux ou comme exemple d'implémentation de bonnes pratiques de développement web moderne.
