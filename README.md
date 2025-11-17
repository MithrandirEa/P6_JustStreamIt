# JustStreamIt

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![W3C Valid](https://img.shields.io/badge/W3C-Valid-green)](https://validator.w3.org/)
[![License](https://img.shields.io/badge/License-Educational-blue)](LICENSE)

Application web responsive de découverte et recommandation de films, développée dans le cadre du projet 6 de la formation OpenClassrooms "Développeur d'application Python".

**JustStreamIt** exploite l'API REST OCMovies pour présenter une sélection dynamique de films triés par score IMDb, organisés en catégories personnalisables avec une interface utilisateur moderne et intuitive.

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Architecture technique](#architecture-technique)
- [Stack technologique](#stack-technologique)
- [API REST OCMovies](#api-rest-ocmovies)
- [Design responsive](#design-responsive)
- [Développement](#développement)
- [Support et contribution](#support-et-contribution)
- [Licence](#licence)

## Aperçu

JustStreamIt est une application web monopage (SPA) construite en JavaScript vanilla qui consomme l'API REST OCMovies pour présenter une interface de découverte de films organisée et intuitive.

### Composants principaux

**Page principale (index.html)**
- Section hero présentant le film ayant le meilleur score IMDb
- 4 catégories configurables affichant 6 films chacune
- Grille responsive adaptative (3/2/1 colonnes selon la largeur d'écran)
- Sélecteur de genres dynamique pour personnaliser la dernière catégorie
- Overlays interactifs au survol avec boutons d'action

**Fenêtre modale (modalWindows.html)**
- Page dédiée affichant les détails complets d'un film
- Architecture dual-layout (horizontal desktop / vertical mobile)
- Boutons de fermeture contextuels selon le type d'appareil
- Chargement asynchrone des données via l'API

### Captures d'écran

```
┌─────────────────────────────────────────────────┐
│  🎬 JustStreamIt - Vidéos à la demande         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Meilleur film                                  │
│  ┌──────────┐  Titre du film                   │
│  │  Poster  │  Description complète...          │
│  │          │  [DÉTAILS]                        │
│  └──────────┘                                   │
│                                                 │
│  Films les mieux notés                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │         │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘         │
│                                                 │
│  Action / Mystery / Autres...                   │
└─────────────────────────────────────────────────┘
```

## Fonctionnalités principales

### Interface utilisateur

**Affichage des films**
- Tri automatique par score IMDb décroissant
- Grille responsive adaptative selon la largeur d'écran
- 6 films par catégorie avec pagination automatique de l'API
- Images avec fallback en cas d'échec de chargement
- Overlays interactifs au survol (titre + bouton d'action)

**Navigation et interaction**
- Sélecteur de genres dynamique (35+ genres disponibles)
- Ouverture de fenêtres modales au clic sur les cartes
- Fermeture contextuelle selon le type d'appareil
- Rechargement adaptatif lors du redimensionnement de la fenêtre

**Affichage des détails (modale)**
- Informations complètes : titre, année, durée, note IMDb, genres, réalisateur, acteurs, pays, classification, résumé
- Poster haute résolution avec fallback
- Layout adaptatif : 2 colonnes (desktop) / vertical (mobile)
- Breakpoint dédié à 788px

### Fonctionnalités techniques

**Architecture logicielle**
- Architecture modulaire avec séparation des responsabilités
- Pattern Factory pour la génération de templates HTML
- Service centralisé pour les appels API
- Gestion d'erreurs robuste avec fallbacks

**Performance et optimisation**
- Debounce sur les événements de redimensionnement (250ms)
- Chargement asynchrone des données via Promises
- Variables CSS pour éviter la duplication de code
- Code minimaliste sans framework lourd

**Standards et qualité**
- Validation W3C pour HTML et CSS
- JavaScript ES6+ (modules, async/await, template literals)
- Commentaires professionnels et documentation JSDoc
- Responsive design mobile-first

## Prérequis

### Environnement d'exécution

**Navigateur web moderne** (support ES6+ requis)
- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

**Serveur HTTP local** (recommandé pour éviter les restrictions CORS)

Options disponibles :
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (Extension VS Code)
- Python HTTP Server : `python -m http.server 8080`
- Node.js http-server : `npx http-server -p 8080`

### API OCMovies
L'application nécessite l'API OCMovies fonctionnelle sur `http://localhost:8000`

**Installation de l'API** :
```bash
# Cloner le repository de l'API
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR

# Créer un environnement virtuel Python
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données et charger les films
python manage.py create_db

# Lancer le serveur API
python manage.py runserver
```

L'API sera accessible sur : `http://localhost:8000`

## Installation

### Clonage du projet

```bash
git clone https://github.com/MithrandirEa/P6_JustStreamIt.git
cd P6_JustStreamIt
```

**Aucune installation de dépendances requise** : le projet utilise uniquement JavaScript vanilla et Bootstrap CDN.

### 2. Structure du projet
```
JustStreamIt/
├── index.html              # Page principale
├── modalWindows.html       # Page de détails film
├── script.js              # Point d'entrée JavaScript
├── modalWindows.js        # Logique de la modale
├── css/
│   ├── main.css           # Point d'entrée CSS (imports)
│   ├── variables.css      # Variables CSS globales
│   ├── layout.css         # Structure et layout
│   ├── components.css     # Composants réutilisables
│   ├── modal.css          # Styles de la modale
│   └── responsive.css     # Media queries
├── services/
│   └── apiService.js      # Appels API
├── utils/
│   ├── appInitializer.js  # Initialisation application
│   ├── imageHandler.js    # Gestion images/fallbacks
│   ├── modalHandler.js    # Gestion ouverture modales
│   └── responsive.js      # Calculs responsive
├── templates/
│   ├── bestMovieTemplate.js   # Template meilleur film
│   ├── movieCardTemplate.js   # Template carte film
│   ├── modalTemplate.js       # Template modale
│   └── sectionTemplate.js     # Template sections
├── config/
│   └── appConfig.js       # Configuration catégories
└── images/
    └── logo.png           # Logo de l'application
```

### 3. Lancer l'application

**Option 1 : Live Server (VS Code)**
```bash
# Installer l'extension Live Server dans VS Code
# Clic droit sur index.html > "Open with Live Server"
```

**Option 2 : Python HTTP Server**
```bash
# Depuis le dossier du projet
python -m http.server 8080

# Ouvrir dans le navigateur
# http://localhost:8080
```

**Option 3 : Node.js http-server**
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer depuis le dossier du projet
http-server -p 8080

# Ouvrir dans le navigateur
# http://localhost:8080
```

## Utilisation

### Démarrage rapide

1. **S'assurer que l'API OCMovies est active** sur `http://localhost:8000`
2. **Lancer un serveur HTTP local** dans le dossier du projet
3. **Ouvrir** `http://localhost:8080` dans un navigateur

### Navigation

**Exploration des films**
- Consulter le film ayant le meilleur score IMDb dans la section hero
- Parcourir les 4 catégories en scrollant verticalement
- Survoler une carte pour afficher le titre et le bouton d'action

**Accès aux détails**
- Cliquer sur une carte de film ou sur le bouton "DÉTAILS"
- Consulter les informations complètes dans la fenêtre modale
- Fermer la modale via le bouton X (mobile) ou "Fermer" (desktop)

**Personnalisation**
- Utiliser le sélecteur de genres dans "Autres films" pour changer la catégorie dynamiquement

### Interactions
- **Survol de carte** : Affiche un overlay avec titre + bouton
- **Clic sur carte** : Ouvre la modale de détails
- **Fermer la modale** : 
  - Desktop : Bouton rouge "Fermer" en bas
  - Mobile : Bouton X en haut à droite
- **Redimensionnement** : L'interface s'adapte automatiquement

### Configuration

**Modifier les catégories** (`config/appConfig.js`) :
```javascript
const APP_CONFIG = {
    categories: [
        { name: 'bestRatedFilms', genre: null },           // Meilleurs films
        { name: 'category1', genre: 'Action' },            // Action
        { name: 'category2', genre: 'Mystery' },           // Mystery
        { name: 'otherFilms', genre: 'Sci-Fi', dynamic: true }  // Dynamique
    ],
    apiBaseUrl: 'http://localhost:8000/api/v1',
    itemsPerPage: 5,
    moviesPerCategory: 6  // 6 films par catégorie
};
```

**Modifier les couleurs** (`css/variables.css`) :
```css
:root {
    --color-primary: #61787f;      /* Couleur header */
    --color-secondary: #dc3545;    /* Couleur boutons */
    --color-white: #FFFFFF;        /* Fond */
    --color-black: #000000;        /* Texte */
}
```

## Architecture technique

### Architecture CSS modulaire
```
main.css (point d'entrée)
├── variables.css    → Configuration globale (couleurs, tailles, espacements)
├── layout.css       → Structure page (body, header, sections)
├── components.css   → Composants réutilisables (cartes, boutons, posters)
├── modal.css        → Styles fenêtre modale
└── responsive.css   → Adaptations mobile/tablette
```

**Avantages** :
- ✅ Séparation des responsabilités
- ✅ Maintenance facilitée
- ✅ Réutilisabilité du code
- ✅ Variables CSS centralisées

### Architecture JavaScript Modulaire
```
script.js (point d'entrée)
├── config/appConfig.js           → Configuration catégories/API
├── services/apiService.js        → Appels API (fetch)
├── utils/
│   ├── appInitializer.js         → Initialisation + événements
│   ├── imageHandler.js           → Gestion images/fallbacks
│   ├── modalHandler.js           → Ouverture modales
│   └── responsive.js             → Calculs nombre films
└── templates/
    ├── bestMovieTemplate.js      → HTML meilleur film
    ├── movieCardTemplate.js      → HTML carte film
    ├── modalTemplate.js          → HTML modale détails
    └── sectionTemplate.js        → HTML sections
```

**Principes** :
- ✅ Single Responsibility Principle
- ✅ Séparation logique/présentation
- ✅ Fonctions pures et réutilisables
- ✅ Gestion d'erreurs robuste

### Flux de données

```
┌─────────────────┐
│  index.html     │
│  chargement     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ appInitializer  │
│ - config load   │
│ - event setup   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  apiService     │◄─────┤ OCMovies API │
│  - fetchMovies  │      └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   templates     │
│ - generate HTML │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   DOM update    │
│ - inject HTML   │
│ - attach events │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User actions   │
│ - hover/click   │
│ - open modal    │
└─────────────────┘
```

## Stack technologique

### Frontend
- **HTML5** : Structure sémantique, validation W3C
- **CSS3** : Variables CSS, Flexbox, Grid, Media Queries
- **JavaScript ES6+** : Modules, Promises, Async/Await, Template Literals
- **Bootstrap 5.3.0** : Grid system, utilitaires CSS

### API
- **OCMovies API REST** : Endpoints `/api/v1/titles/`
- **Pagination** : Gestion automatique des pages multiples
- **Tri** : Par score IMDb décroissant

### Outils
- **Git** : Contrôle de version
- **VS Code** : Développement (recommandé)
- **Live Server** : Serveur de développement
- **Chrome DevTools** : Débogage

## API REST OCMovies

### Documentation des endpoints

L'application consomme deux endpoints principaux de l'API OCMovies.

### Endpoints utilisés

#### 1. Liste des films triés
```
GET http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=1
```
**Paramètres** :
- `sort_by=-imdb_score` : Tri décroissant par note IMDb
- `page=1` : Numéro de page (5 résultats/page)
- `genre=Action` : Filtrer par genre (optionnel)

**Réponse** :
```json
{
    "count": 1000,
    "next": "http://localhost:8000/api/v1/titles/?page=2",
    "previous": null,
    "results": [
        {
            "id": 12345,
            "title": "Film Title",
            "image_url": "https://example.com/poster.jpg",
            "imdb_score": 9.3
        }
    ]
}
```

#### 2. Détails d'un film
```
GET http://localhost:8000/api/v1/titles/{id}/
```
**Réponse** :
```json
{
    "id": 12345,
    "title": "Film Title",
    "year": 2023,
    "duration": 142,
    "imdb_score": 9.3,
    "genres": ["Action", "Sci-Fi"],
    "directors": ["Director Name"],
    "actors": ["Actor 1", "Actor 2"],
    "description": "Full movie description...",
    "image_url": "https://example.com/poster.jpg",
    "countries": ["USA"],
    "rated": "PG-13"
}
```

### Gestion de la pagination

L'application récupère automatiquement plusieurs pages pour obtenir 6 films par catégorie :
```javascript
// Exemple : Récupérer 6 films
// Page 1 : 5 films
// Page 2 : 1 film supplémentaire
```

## Design responsive

### Système de breakpoints

L'application utilise un système responsive à 3 niveaux défini dans `css/variables.css` :

```css
--breakpoint-desktop: 789px;   /* ≥ 789px : Desktop */
--breakpoint-tablet: 788px;    /* 788px → 457px : Tablette */
--breakpoint-phone: 456px;     /* ≤ 456px : Mobile */
```

### Adaptations par taille d'écranage | Grille | Films/catégorie |
|----------|-------|--------|----------------|
| Desktop | ≥ 789px | 3 colonnes | 6 films (2 lignes) |
| Tablette | 788px → 457px | 2 colonnes | 6 films (3 lignes) |
| Mobile | ≤ 456px | 1 colonne | 6 films (verticale) |

### Adaptations spécifiques

**Desktop (> 992px)** :
- Meilleur film : Layout horizontal (poster gauche + infos droite)
- Grilles : 3 colonnes (col-lg-4)
- Header : Logo 127x94px, titre 40px

**Tablette (768-991px)** :
- Meilleur film : Layout vertical (poster haut + infos bas)
- Grilles : 2-3 colonnes selon largeur
- Header : Logo réduit, titre 32px

**Mobile (< 768px)** :
- Meilleur film : Layout vertical centré
- Grilles : 2 colonnes ou 1 colonne centrée
- Header : Logo 60x45px, titre 24px
- Overlay : Textes réduits (11px → 9px)

**Modale responsive** :
- Desktop (> 788px) : 2 colonnes (infos + poster)
- Mobile (≤ 788px) : 1 colonne verticale
- Bouton X mobile uniquement

### Rechargement adaptatif
```javascript
// Recalcule le nombre de films selon la largeur d'écran
window.addEventListener('resize', debounce(() => {
    location.reload(); // Recharge avec nouveau calcul
}, 250));
```

## Développement

### Standards de code

**HTML**
- Validation W3C stricte
- Sémantique HTML5
- Accessibilité ARIA (à améliorer)

**CSS**
- Architecture modulaire (6 fichiers séparés)
- Variables CSS pour la configuration globale
- Commentaires professionnels en français
- Nommage BEM-like pour les composants

**JavaScript**
- ES6+ (modules, async/await, destructuring)
- Architecture modulaire avec séparation des responsabilités
- JSDoc pour la documentation des fonctions
- Gestion d'erreurs avec try/catch
- Nommage en camelCase

### Contribution

Les contributions sont les bienvenues. Pour proposer une amélioration :

1. Fork du projet
2. Création d'une branche feature : `git checkout -b feature/nom-feature`
3. Commit des modifications : `git commit -m 'feat: description'`
4. Push vers la branche : `git push origin feature/nom-feature`
5. Ouverture d'une Pull Request avec description détaillée

**Format des messages de commit** (Conventional Commits) :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage CSS/code
- `refactor:` Refactorisation
- `perf:` Amélioration de performance
- `test:` Ajout de tests

## Support et contribution

### Signalement de bugs

Pour signaler un bug ou proposer une amélioration :
- [Ouvrir une issue](https://github.com/MithrandirEa/P6_JustStreamIt/issues) sur GitHub
- Décrire le comportement attendu vs observé
- Inclure les étapes de reproduction
- Préciser le navigateur et la version

### Documentation

Consulter le fichier `GUIDE_PERSONNALISATION_CSS.md` pour des instructions détaillées sur la personnalisation de l'interface.

---

## Licence

**Projet éducatif** développé dans le cadre de la formation OpenClassrooms - Parcours Développeur d'application Python (Projet 6).

### Ressources tierces

- **API OCMovies** : Fournie par OpenClassrooms (usage éducatif)
- **Bootstrap 5.3.0** : Framework CSS ([Licence MIT](https://github.com/twbs/bootstrap/blob/main/LICENSE))
- **Google Fonts - Oswald** : Police de caractères ([Open Font License](https://fonts.google.com/specimen/Oswald/about))

### Droits d'auteur

© 2025 MithrandirEa - Projet éducatif OpenClassrooms

---

**Auteur** : MithrandirEa  
**Formation** : OpenClassrooms - Développeur d'application Python  
**Projet** : P6 - Développez une interface utilisateur pour une application web Python  
**Année** : 2025
