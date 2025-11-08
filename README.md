# JustStreamIt# JustStreamIt



Interface web responsive pour découvrir et explorer des films via l'API OCMovies-API.Interface web responsive pour découvrir et explorer des films via l'API OCMovies-API.



## Description## Description



JustStreamIt est une application web frontend qui permet de découvrir des films selon différentes catégories. L'application affiche le meilleur film du moment en vedette, ainsi que des sections thématiques de films triés par note IMDb.JustStreamIt est une application web frontend qui permet de découvrir des films selon différentes catégories. L'application affiche le meilleur film du moment en vedette, ainsi que des sections thématiques de films triés par note IMDb.



### Fonctionnalités### Fonctionnalités



- **Film vedette** : Affichage du film avec le meilleur score IMDb- **Film vedette** : Affichage du film avec le meilleur score IMDb

- **Sections thématiques** : Films les mieux notés, Action, Mystery- **Sections thématiques** : Films les mieux notés, Action, Mystery

- **Section personnalisable** : "Autres films" avec sélecteur de genre- **Section personnalisable** : "Autres films" avec sélecteur de genre

- **Design responsive** : Adapté aux écrans desktop, tablette et mobile- **Design responsive** : Adapté aux écrans desktop, tablette et mobile

- **Modal détaillée** : Informations complètes pour chaque film- **Modal détaillée** : Informations complètes pour chaque film

- **Gestion d'erreurs** : Fallbacks pour les images manquantes- **Gestion d'erreurs** : Fallbacks pour les images manquantes



## Architecture technique## Architecture technique



### Structure du projet### Structure du projet



``````

JustStreamIt/JustStreamIt/

├── index.html              # Page principale├── index.html              # Page principale

├── modalWindows.html       # Page de détails des films├── modalWindows.html       # Page de détails des films

├── script.js              # Logique principale de l'application├── script.js              # Logique principale de l'application

├── modal.js               # Gestion de la fenêtre modale├── modal.js               # Gestion de la fenêtre modale

├── presentation-mode.js    # Mode présentation├── presentation-mode.js    # Mode présentation

├── config/├── config/

│   └── appConfig.js       # Configuration centralisée│   └── appConfig.js       # Configuration centralisée

├── services/├── services/

│   └── apiService.js      # Service API avec cache│   └── apiService.js      # Service API avec cache

├── templates/├── templates/

│   ├── bestMovieTemplate.js    # Template du meilleur film│   ├── bestMovieTemplate.js    # Template du meilleur film

│   ├── movieCardTemplate.js    # Template des cartes de films│   ├── movieCardTemplate.js    # Template des cartes de films

│   └── sectionTemplate.js      # Template des sections│   └── sectionTemplate.js      # Template des sections

├── utils/├── utils/

│   ├── appInitializer.js  # Gestionnaire d'initialisation│   ├── appInitializer.js  # Gestionnaire d'initialisation

│   ├── imageHandler.js    # Gestion des images et fallbacks│   ├── imageHandler.js    # Gestion des images et fallbacks

│   └── responsive.js      # Utilitaires responsive│   └── responsive.js      # Utilitaires responsive

├── css/├── css/

│   ├── main.css          # Styles principaux│   ├── main.css          # Styles principaux

│   ├── layout.css        # Mise en page et responsive│   ├── layout.css        # Mise en page et responsive

│   ├── modal.css         # Styles de la modal│   ├── modal.css         # Styles de la modal

│   ├── components.css    # Styles des composants│   ├── components.css    # Styles des composants

│   ├── responsive.css    # Styles responsive│   ├── responsive.css    # Styles responsive

│   └── variables.css     # Variables CSS│   └── variables.css     # Variables CSS

└── images/               # Ressources graphiques└── images/               # Ressources graphiques

``````

- **Performance** : Chargement adaptatif du contenu

### Architecture logicielle

## 🛠️ Technologies Utilisées

L'application suit une architecture modulaire avec séparation des responsabilités :

- **HTML5** : Structure sémantique moderne

- **Configuration** : Centralisation des paramètres dans `config/appConfig.js`- **CSS3** : Flexbox, Grid, Media Queries

- **Services** : API centralisée avec cache dans `services/apiService.js`- **JavaScript ES6+** : Async/Await, Fetch API, Modules

- **Templates** : Génération HTML modulaire dans `templates/`- **API REST** : OCMovies pour les données dynamiques

- **Utilitaires** : Fonctions helpers dans `utils/`

- **Styles** : CSS organisé par domaine fonctionnel## 📁 Structure du Projet



### Responsive Design```

JustStreamIt/

L'application s'adapte automatiquement selon la taille d'écran :├── index.html                 # Page d'accueil

├── modalWindows.html         # Page modale détails

- **Desktop (≥992px)** : 6 films par section (grille 3×2)├── script.js                 # Logique JavaScript principale

- **Tablette (768-991px)** : 4 films par section (grille 2×2)├── script_avec_commentaires.js # Version commentée pour formation

- **Mobile (<768px)** : 2 films par section (colonne verticale)├── modal.js                  # Gestion de la fenêtre modale

├── style_accueil.css         # Styles page d'accueil

## Prérequis├── style_modal.css           # Styles page modale

├── NOTES_SOUTENANCE.md       # Notes pour présentation

- Navigateur web moderne (Chrome, Firefox, Safari, Edge)├── README.md                 # Documentation technique

- API OCMovies-API fonctionnelle sur `http://localhost:8000`└── images/                   # Assets graphiques

- Serveur web local pour servir les fichiers```



## Installation et lancement## 🔧 Installation et Utilisation



### 1. Démarrer l'API OCMovies-API### Prérequis

1. **API OCMovies** : Cloner et lancer le serveur API

```bash   ```bash

# Cloner et démarrer l'API (selon sa documentation)   git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git

git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git   cd OCMovies-API-EN-FR

cd OCMovies-API-EN-FR   python -m venv env

pip install -r requirements.txt   source env/bin/activate  # ou env\Scripts\activate sur Windows

python manage.py runserver   pip install -r requirements.txt

```   python manage.py create_db

   python manage.py runserver

L'API doit être accessible sur `http://localhost:8000`.   ```



### 2. Lancer l'application JustStreamIt2. **Navigateur Moderne** : Chrome, Firefox, Safari, Edge récents



```bash### Lancement

# Démarrer un serveur web local depuis le dossier du projet1. Vérifier que l'API fonctionne sur `http://localhost:8000`

cd JustStreamIt2. Ouvrir `index.html` dans un navigateur

3. Navigation : cliquer sur les films pour ouvrir les détails

# Option 1 : Avec Python

python -m http.server 8080## Installation



# Option 2 : Avec Node.jsCette API exécutable localement peut être installée en suivant les étapes décrites ci-dessous.

npx http-server -p 8080

### Installation et exécution de l'application

# Option 3 : Avec PHP

php -S localhost:80801. Clonez ce dépôt de code à l'aide de la commande `$ git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git` (vous pouvez également télécharger une [archive zip](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR/archive/refs/heads/master.zip))

```2. Rendez-vous depuis un terminal à la racine du répertoire ocmovies-api-fr avec la commande `$ cd ocmovies-api-fr`

3. Créez un environnement virtuel pour le projet avec `$ python -m venv env` sous windows ou `$ python3 -m venv env` sous macos ou linux.

### 3. Accéder à l'application4. Activez l'environnement virtuel avec `$ env\Scripts\activate` sous windows ou `$ source env/bin/activate` sous macos ou linux.

5. Installez les dépendances du projet avec la commande `$ pip install -r requirements.txt`

Ouvrir dans le navigateur : `http://localhost:8080`6. Créez et alimentez la base de données avec la commande `$ python manage.py create_db`

7. Démarrez le serveur avec `$ python manage.py runserver`

## Utilisation

Lorsque le serveur fonctionne, après l'étape 7 de la procédure, l'API OCMovies peut être interrogée à partir des points d'entrée commençant par l'url de base [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/). Le point d'entrée principal permettant de consulter les films est [http://localhost:8000/api/v1/titles](http://localhost:8000/api/v1/titles/). Si vous accédez à cette url depuis un navigateur, ce dernier vous présentera une interface navigable servant de documentation et de laboratoire d'expérimentation. Vous trouverez également une documentation plus formelle en bas de ce README.

### Navigation principale

Les étapes 1 à 6 ne sont requises que pour l'installation initiale. Pour les lancements ultérieurs du serveur de l'API, il suffit d'exécuter les étapes 4 et 7 à partir du répertoire racine du projet.

1. **Page d'accueil** (`index.html`) :

   - Film vedette avec bouton "Détails"## Utilisation et documentation des points d'entrée

   - 4 sections de films avec cartes cliquables

   - Sélecteur de genre pour la section "Autres films"Une fois que vous avez lancé le serveur, vous pouvez lire la documentation depuis un navigateur web par le biais de l'interface navigable disponible ici [http://localhost:8000/api/v1/titles/](http://localhost:8000/api/v1/titles/). Cette interface navigable vous sert à la fois de source de documentation et de laboratoire d'expérimentation. L'API actuelle ne fournit que les points d'entrée suivants. Tous ces points d'entrée sont en lecture seule et supportent exclusivement les requêtes HTTP utilisant la **méthode GET**: 



2. **Page de détails** (`modalWindows.html`) :- Rechercher et filtrer des films: [http://localhost:8000/api/v1/titles/](http://localhost:8000/api/v1/titles/). Vous pouvez tester directement chaque filtre en accédant à l'URL ci-dessus depuis un navigateur web. Les filtres disponibles sont:

   - Informations complètes du film sélectionné

   - Navigation retour vers l'accueil   - `year=<year>`, `min_year=<year>` ou `max_year=<year>` pour obtenir des films filtrés par année. Le premier de ces filtres réalise une correspondance exacte lors de la recherche.

   - `imdb_score_min=<score>` et `imdb_score_max<score>` pour obtenir des films avec un score imdb inférieur ou supérieur à une note donnée.

### Fonctionnalités interactives   - `title=<title>` ou `title_contains=<string>` pour obtenir des films dont le titre correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second recherche les titres contenant le terme recherché. La recherche est indédendante de la casse.

   - `director=<director-name>` ou `director_contains=<string>` pour obtenir des films dont un réalisateur correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des réalisateurs contenant le terme recherché. La recherche est indédendante de la casse.

- **Clic sur une carte de film** : Ouvre la page de détails   - `writer=<name>` ou `writer_contains=<string>` pour obtenir des films dont un auteur correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des auteurs contenant le terme recherché. La recherche est indédendante de la casse.

- **Sélecteur de genre** : Filtre les films de la section "Autres films"   - `actor=<name>` ou `actor_contains=<string>` pour obtenir des films dont un des acteurs correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des acteurs contenant le terme recherché. La recherche est indédendante de la casse.

- **Responsive automatique** : Redimensionnement adaptatif   - `genre=<name>` ou `genre_contains=<string>` pour obtenir des films dont un genre correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des genres contenant le terme recherché. La recherche est indédendante de la casse.

   - `country=<name>` ou `country_contains=<string>` pour obtenir des films dont un pays correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des pays contenant le terme recherché. La recherche est indédendante de la casse.

## Configuration   - `lang=<name>` ou `lang_contains=<string>` pour obtenir des films dont la langue correspond la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des langues contenant le terme recherché. La recherche est indédendante de la casse.

   - `company=<name>` ou `company_contains=<string>` pour obtenir des films dont la compagnie de production correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des compagnies contenant le terme recherché. La recherche est indédendante de la casse.

### Modification des sections   - `rating=<name>` ou `rating_contains=<string>` pour obtenir des films dont la classification correspond à la chaîne de caractères recherchée. Le premier effectue une recherche avec une correspondance exacte tandis que le second filtre en fonction des classifications contenant le terme recherché. La recherche est indédendante de la casse.

   - `sort_by=<field>` pour obtenir des films triés selon un ordre particulier. Par exemple, utiliser `sort_by=title` pour trier les films selon l'ordre alphabétique de teur titre et `sort_by=-title` pour trier les films dans le sens inverse. Il est également possible de trier par des critères multiples en séparant les critères par des virgules comme dans `sort_by=-year,title` qui affiche d'abord les films les plus récents, puis trie les films de la même année par ordre alphabétique.

Éditer `config/appConfig.js` pour personnaliser les sections :

- Demander des informations détaillées sur un film dont on connait l'identifiant: [http://localhost:8000/api/v1/titles/499549](http://localhost:8000/api/v1/titles/499549) où 499549 est l'identifiant (`id`) du film "Avatar".

```javascript- Rechercher les genres disponibles: [http://localhost:8000/api/v1/genres/](http://localhost:8000/api/v1/genres/). Les filtres disponibles sont:

const FILM_SECTIONS = {   - `name_contains=<search string>` pour n'afficher que les genres dont la nom contient la chaîne de caractères recherchée.

    bestRated: {   - `movie_title_contains=<search string>` pour rechercher les genres associés à un film dont le titre contient la chaîne de caractères recherchée.

        title: 'Films les mieux notes',

        endpoint: '/titles/?sort_by=-imdb_score',# OCMovies-API: Test API providing movie information

        sectionClass: 'bestRatedFilms'

    },The OCMovies-API project is a REST API application to be executed locally in the context

    // Ajouter d'autres sections...of educational projects. It provides movie information from GET http endpoints.

};The API provides these endpoints to get detailed infomation about movies filtered by

```various criteria such as genre, IMDB score or year. Endpoints allow users to retrieve

information for individual movies or lists of movies.

### Paramètres responsive

## Installation

Modifier les breakpoints dans `utils/responsive.js` :

This locally-executable API can be installed and executed from [http://localhost:8000/api/v1/titles/](http://localhost:8000/api/v1/titles/) using the following steps.

```javascript

const RESPONSIVE_CONFIG = {1. Clone this repository using `$ git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git` (you can also download the code [as a zip file](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR/archive/refs/heads/master.zip))

    breakpoints: {2. Move to the ocmovies-api root folder with `$ cd ocmovies-api-en`

        mobile: { max: 767, pageSize: 2 },3. Create a virtual environment for the project with `$ python -m venv env` on windows or `$ python3 -m venv env` on macos or linux.

        tablet: { min: 768, max: 991, pageSize: 4 },4. Activate the virtual environment with `$ env\Scripts\activate` on windows or `$ source env/bin/activate` on macos or linux.

        desktop: { min: 992, pageSize: 6 }5. Install project dependencies with `$ pip install -r requirements.txt`

    }6. Create and populate the project database with `$ python manage.py create_db`

};7. Run the server with `$ python manage.py runserver`

```

When the server is running after step 7 of the procedure, the OCMovies API can be requested from endpoints starting with the following base URL: http://localhost:8000/api/v1/titles/.

## API

Steps 1 to 6 are only required for initial installation. For subsequent launches of the API, you only have to execute steps 4 and 7 from the root folder of the project.

L'application utilise l'API OCMovies-API avec les endpoints suivants :

## Usage and detailed endpoint documentation

- `GET /api/v1/titles/` - Liste des films avec filtres

- `GET /api/v1/titles/{id}` - Détails d'un filmOne you have launched the server, you can read the documentation through the

- `GET /api/v1/genres/` - Liste des genresbrowseable documentation interface of the API by visiting [http://localhost:8000/api/v1/titles/](http://localhost:8000/api/v1/titles/).



### Paramètres supportésThe API provides the following endpoints. All these endpoints are read-only and exclusively support HTTP requests using the **GET method**:



- `sort_by` : Tri des résultats (ex: `-imdb_score`)- Search and filter movies: [http://localhost:8000/api/v1/titles/](http://localhost:8000/api/v1/titles/). The filters available are:

- `genre` : Filtrage par genre

- `page_size` : Nombre de résultats par page   - `year=<year>`, `min_year=<year>` or `max_year=<year>` to get movies 

   filterd by year. The first does an exact match of the year.

## Gestion d'erreurs   - `imdb_score_min=<score>` and `imdb_score_max<score>` to get movies with only a 

   given imdb score.

L'application gère plusieurs types d'erreurs :   - `title=<title>` or `title_contains=<string>` to get movies matching 

   the searched string. The first performs an exact match while the second

- **Connexion API** : Messages d'erreur explicites   searches titles containing the search term. The search 

- **Images manquantes** : Fallbacks gris avec texte   is independent of character case.

- **Données invalides** : Filtrage et validation   - `director=<director-name>` or `director_contains=<string>` to get movies

- **Erreurs réseau** : Retry et cache local   whose directors correspond to the searched string. The first performs an exact match 

   with the director name while the second searches director names containing the 

## Développement   search term. The search is independent of character case.

   - `writer=<name>` or `writer_contains=<string>` to get movies

### Structure du code   whose writers contain to the searched string. The first performs an exact match 

   with the writer name while the second searches writer names containing the 

- **Modularité** : Chaque fichier a une responsabilité spécifique   search term. The search is independent of character case.

- **Réutilisabilité** : Templates et utilitaires partagés   - `actor=<name>` or `actor_contains=<string>` to get movies

- **Maintenabilité** : Code commenté et documenté   whose actors correspond to the searched string. The first performs an exact match 

- **Performance** : Cache API et chargement adaptatif   with the actor name while the second searches actor names containing the 

   search term. The search is independent of character case.

### Conventions   - `genre=<name>` or `genre_contains=<string>` to get movies

   whose genres correspond to the searched string. The first performs an exact match 

- **Nommage** : camelCase pour JavaScript, kebab-case pour CSS   with the genre name while the second searches genre names containing the 

- **Commentaires** : Documentation exhaustive des fonctions   search term. The search is independent of character case.

- **Logging** : Console détaillée pour le débogage   - `country=<name>` or `country_contains=<string>` to get movies

- **Organisation** : Séparation logique par dossiers   whose countries correspond to the searched string. The first performs an exact match 

   with the country name while the second searches country names containing the 

## Compatibilité   search term. The search is independant of character case.

   - `lang=<name>` or `lang_contains=<string>` to get movies

- **Navigateurs** : Chrome 80+, Firefox 75+, Safari 13+, Edge 80+   whose languages corresponds to the searched string. The first performs an exact match 

- **JavaScript** : ES6+ (async/await, template literals, modules)   with the language name while the second searches language names containing the 

- **CSS** : Flexbox, CSS Grid, Media Queries   search term. The search is independent of character case.

- **Bootstrap** : Classes utilitaires (compatible 5.x)   - `company=<name>` or `company_contains=<string>` to get movies

   whose company corresponds to the searched string. The first performs an exact match 

## Performance   with the company name while the second searches company names containing the 

   search term. The search is independent of character case.

### Optimisations implémentées   - `rating=<name>` or `rating_contains=<string>` to get movies

   whose rating corresponds to the searched string. The first performs an exact match 

- **Cache API** : Évite les appels redondants   with the rating name while the second searches rating names containing the 

- **Chargement adaptatif** : Nombre de films selon l'écran   search term. The search is independent of character case.

- **Images lazy** : Chargement différé des posters   - `sort_by=<field>` to sort movies in a particular order. For example,

- **Pagination intelligente** : Chargement supplémentaire si nécessaire   use `sort_by=title` to order the movies alphabetically by title and 

   `sort_by=-title` to order the movies in the reverse direction. You can also

### Métriques typiques   sort with multiple criteria by separating the criteria using commas as in `sort_by=-year,title` that filters the movie with the most recent ones first.

   Then, within a same year, movies are filtered alphabetically according to

- **Temps de chargement initial** : < 2 secondes   their title.

- **Temps de navigation** : < 500ms

- **Utilisation mémoire** : < 50MB- Request detailed info about a movie: [http://localhost:8000/api/v1/titles/499549](http://localhost:8000/api/v1/titles/499549) where 499549 is the `id` of the 

- **Requêtes API** : 5-8 par chargement completmovie "Avatar".

- Search the available genres: [http://localhost:8000/api/v1/genres/](http://localhost:8000/api/v1/genres/). The filters available are:

## Support   - `name_contains=<search string>` to filter only the genres containing the

   searched string.

Pour signaler un problème ou suggérer une amélioration :   - `movie_title_contains=<search string>` to find the genres associated with

   a particular movie searched by title.

1. Vérifier que l'API OCMovies-API fonctionne correctement

2. Consulter la console du navigateur pour les erreurs

3. Tester sur différentes tailles d'écran
4. Documenter les étapes de reproduction

## Licence

Projet éducatif OpenClassrooms - Parcours Développeur d'application Python.