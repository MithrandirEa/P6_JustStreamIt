# JustStreamIt

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

JustStreamIt est une page web affichant des films et leurs informations relatives. Ce projet s'inscrit dans le cadre de la formation de développeur d'application Python d'OpenClassrooms.

## Fonctionnalités principales

L'application offre une vue d'ensemble du catalogue de films avec plusieurs zones clés :

*   **Film à la une** : Mise en avant automatique du film le mieux noté du catalogue.
*   **Catégories thématiques** : Navigation horizontale pour les films les mieux notés, Action, et Mystery.
*   **Catalogue complet** : Une section "Autres" permettant de filtrer les films par genre via un menu déroulant dynamique.
*   **Interface Responsive** : L'affichage s'adapte intelligemment à la taille de l'écran :
    *   **Desktop** : 6 films visibles.
    *   **Tablette** : 4 films visibles.
    *   **Mobile** : 2 films visibles par catégorie.
    *   Un bouton **"Voir plus"** permet de déployer la liste complète sur les petits écrans.
*   **Détails du film** : Une fenêtre modale affiche les informations complètes (synopsis, réalisateur, acteurs, score Imdb, résultat au Box Office, etc.) au clic sur une affiche.

## Prérequis techniques

Ce projet est le front-end de l'application. Pour qu'il fonctionne correctement, il doit communiquer avec l'API locale *OCMovies-API*.

L'application nécessite l'API OCMovies fonctionnelle sur `http://localhost:8000`.

### Installation de l'API

```bash
# Cloner le repository de l'API
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR

# Créer un environnement virtuel Python
python -m venv venv
# Sur Windows:
venv\Scripts\activate
# Sur Mac/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données et charger les films
python manage.py create_db

# Lancer le serveur API
python manage.py runserver
```

L'API sera accessible sur : `http://localhost:8000`

## Installation et lancement

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/MithrandirEa/P6_JustStreamIt.git
    cd JustStreamIt
    ```

2.  **Lancer l'application** :
    Le projet étant composé de fichiers statiques (HTML, CSS, JS), vous pouvez simplement ouvrir le fichier `index.html` dans votre navigateur.

    ```bash
    # Avec Python 3
    python -m http.server 5500
    ```
    Ouvrez ensuite `http://localhost:5500` dans votre navigateur.

## Stack Technique

*   **HTML5 & CSS3** : Structure sémantique et styles personnalisés.
*   **JavaScript (ES6+)** : Gestion asynchrone des appels API (`fetch`, `async/await`), manipulation du DOM.
*   **Bootstrap 5** : Utilisé pour la grille (Grid system) et le composant Modal.
*   **Responsive Design** : Media queries personnalisées pour gérer les points de rupture spécifiques (Mobile < 768px, Tablette < 992px).

## Auteurs

Projet réalisé par SCIPION Clément.
