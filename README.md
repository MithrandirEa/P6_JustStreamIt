# 🎬 JustStreamIt - Application Web de Recommandation de Films

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![W3C Valid](https://img.shields.io/badge/W3C-Valid-green)](https://validator.w3.org/)

Application web responsive permettant de découvrir les meilleurs films via l'API OCMovies. Interface élégante avec système de recommandations par catégories et fenêtres modales de détails.

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [API](#-api)
- [Responsive Design](#-responsive-design)
- [Contributions](#-contributions)
- [Licence](#-licence)

## 🎯 Aperçu

JustStreamIt est une application web moderne qui affiche les films les mieux notés et permet de naviguer par catégories. L'interface présente :

- **Section héro** : Le meilleur film avec poster et description
- **4 catégories de films** : Films les mieux notés, Action, Mystery, et une catégorie personnalisable
- **Système de navigation** : Sélecteur de genres dynamique
- **Fenêtres modales** : Détails complets des films au clic

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
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │ │ 7 │   │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘   │
│                                                 │
│  Action / Mystery / Autres...                   │
└─────────────────────────────────────────────────┘
```

## ✨ Fonctionnalités

### Page principale (index.html)
- ✅ **Meilleur film** : Affichage automatique du film avec le meilleur score IMDb
- ✅ **7 films par catégorie** : 3 colonnes desktop, 2 colonnes mobile
- ✅ **4 catégories** : Configurables via `config/appConfig.js`
- ✅ **Overlay au survol** : Titre + bouton "Détails" sur chaque carte
- ✅ **Sélecteur de genres** : Changement dynamique de la section "Autres films"
- ✅ **Fallbacks intelligents** : Affichage de remplacement pour images manquantes
- ✅ **Rechargement adaptatif** : Recalcul du nombre de films selon la taille d'écran

### Page modale (modalWindows.html)
- ✅ **Détails complets** : Titre, année, durée, note IMDb, genres, réalisateur, acteurs, résumé
- ✅ **Layouts dual** : Version desktop (2 colonnes) et mobile (vertical)
- ✅ **Boutons de fermeture** : X en haut à droite (mobile) + bouton "Fermer" (desktop)
- ✅ **Bordure distinctive** : Cadre noir 6px pour différencier de la page principale
- ✅ **Responsive** : Breakpoint spécial à 788px (différent du site principal)

### Fonctionnalités techniques
- ✅ **Architecture modulaire** : CSS et JS séparés par responsabilité
- ✅ **Variables CSS** : Configuration centralisée des couleurs, espacements, tailles
- ✅ **Code valide W3C** : HTML et CSS conformes aux standards
- ✅ **Gestion d'erreurs** : Fallbacks pour images manquantes, gestion API
- ✅ **Performance** : Debounce sur redimensionnement, lazy loading

## 🔧 Prérequis

### Logiciels requis
- **Navigateur web moderne** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Serveur local** (recommandé) : 
  - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code)
  - [Python HTTP Server](https://docs.python.org/3/library/http.server.html)
  - [Node.js http-server](https://www.npmjs.com/package/http-server)

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

## 📥 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/MithrandirEa/P6_JustStreamIt.git
cd P6_JustStreamIt
```

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

## 🚀 Utilisation

### Navigation de base
1. **Consulter le meilleur film** : Section en haut avec poster et description
2. **Parcourir les catégories** : Scroller verticalement pour voir les 4 sections
3. **Voir les détails** : Cliquer sur "DÉTAILS" ou sur une carte de film
4. **Changer de genre** : Utiliser le sélecteur dans la section "Autres films"

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
    moviesPerCategory: 7
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

## 🏗️ Architecture

### Architecture CSS Modulaire
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

## 🛠️ Technologies

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

## 📡 API

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

L'application récupère automatiquement plusieurs pages pour obtenir 7 films par catégorie :
```javascript
// Exemple : Récupérer 7 films
// Page 1 : 5 films
// Page 2 : 2 films supplémentaires
```

## 📱 Responsive Design

### Breakpoints
| Taille d'écran | Breakpoint | Colonnes | Films affichés |
|---------------|-----------|----------|---------------|
| Desktop Large | > 1200px | 3 | 7 (2 lignes) |
| Desktop | 992-1199px | 3 | 7 (2 lignes) |
| Tablette | 768-991px | 2-3 | 7 (3 lignes) |
| Mobile | 576-767px | 2 | 6 (3 lignes) |
| Petit mobile | < 576px | 1 | 4 (verticale) |

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

## 🤝 Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** : `git checkout -b feature/amelioration`
3. **Commit** : `git commit -m 'Ajout fonctionnalité X'`
4. **Push** : `git push origin feature/amelioration`
5. **Pull Request** : Ouvrir une PR avec description détaillée

### Standards de code
- HTML valide W3C
- CSS organisé et commenté
- JavaScript ES6+ avec JSDoc
- Nommage en camelCase
- Indentation 4 espaces

## 📄 Licence

Ce projet est développé dans le cadre de la formation OpenClassrooms - Développeur d'application Python.

**Ressources utilisées** :
- API OCMovies (OpenClassrooms)
- Bootstrap 5.3.0 (MIT License)
- Google Fonts - Oswald (Open Font License)

---

## 📞 Support

Pour toute question ou problème :
- **Issues GitHub** : [Ouvrir une issue](https://github.com/MithrandirEa/P6_JustStreamIt/issues)
- **Documentation complète** : Voir `DOCUMENTATION.md`

---

**Projet réalisé par MithrandirEa** | OpenClassrooms 2025
