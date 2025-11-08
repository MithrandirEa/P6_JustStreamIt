/**
 * 🎬 JUSTSTREAMIT - APPLICATION PRINCIPALE
 * Architecture modulaire avec services, templates et configuration centralisés
 */

/**
 * FONCTION 1 : Charger le meilleur film (celui avec le meilleur score IMDb)
 * 
 * CHOIX TECHNIQUE : async/await pour une gestion claire de l'asynchrone
 * ENDPOINT API : Tri par score décroissant, limite à 1 résultat pour la performance
 * GESTION ERREURS : try/catch pour capturer les erreurs réseau ou de parsing JSON
 */
async function loadBestMovie() {
    console.log('=== DÉBUT loadBestMovie ===');
    
    try {
        console.log('1. Vérification de l\'élément DOM...');
        const bestFilmSection = document.querySelector('.bestFilm');
        if (!bestFilmSection) {
            console.error('❌ Section .bestFilm non trouvée !');
            return;
        }
        console.log('✅ Section bestFilm trouvée:', bestFilmSection);
        
        console.log('2. Récupération des meilleurs films via API Service...');
        // Utilisation du service API centralisé
        const movies = await window.ApiService.getBestMovies(10);
        console.log('3. Films reçus:', movies.length);
        
        // Trouver le meilleur score IMDb
        const bestScore = Math.max(...movies.map(film => parseFloat(film.imdb_score)));
        console.log('4. Meilleur score IMDb:', bestScore);
        
        // Récupérer tous les films avec le meilleur score (ex aequo)
        const bestMovies = movies.filter(film => parseFloat(film.imdb_score) === bestScore);
        console.log('5. Films ex aequo avec le meilleur score:', bestMovies.length, 'films');
        
        // Sélection aléatoire parmi les meilleurs (si plusieurs ex aequo)
        const randomIndex = Math.floor(Math.random() * bestMovies.length);
        const movie = bestMovies[randomIndex];
        console.log('6. Film sélectionné aléatoirement:', movie.title, 'score:', movie.imdb_score, `(${randomIndex + 1}/${bestMovies.length})`);
        
        // Récupération des détails complets via API Service
        console.log('7. Récupération des détails complets du film...');
        try {
            const detailData = await window.ApiService.getMovieDetails(movie.id);
            // CORRECTION : Utiliser long_description en priorité, puis description en fallback
            let fullDescription = detailData.long_description || detailData.description || movie.description;
            
            // Si la description est trop courte (moins de 50 caractères), essayer les autres champs
            if (!fullDescription || fullDescription.length < 50) {
                fullDescription = detailData.description || detailData.long_description || movie.description;
            }
            
            movie.description = fullDescription || 'Description non disponible.';
            console.log('8. Description complète récupérée:', movie.description ? movie.description.substring(0, 100) + '...' : 'Aucune description');
        } catch (error) {
            console.log('8. Impossible de récupérer les détails, utilisation de la description de base');
            movie.description = movie.description || 'Description non disponible.';
        }
        
        console.log('9. Génération du HTML via template...');
        
        // Utilisation du template centralisé
        const content = window.BestMovieTemplate.generate(movie);
        
        console.log('11. Injection du HTML...');
        bestFilmSection.innerHTML = content;
        console.log('12. ✅ HTML injecté avec succès');

        console.log('13. Ajout des event listeners...');
        
        // EVENT DELEGATION : Ajout des event listeners APRÈS la création du DOM
        const bestFilmSectionFinal = document.querySelector('.bestFilm');
        const poster = bestFilmSectionFinal.querySelector('.best-movie-poster');
        const button = bestFilmSectionFinal.querySelector('.play-button');
        
        // CLOSURE : La fonction capture movie.id dans son scope
        // CHOIX UX : Même action pour image et bouton (cohérence utilisateur)
        const handleBestMovieClick = (event) => {
            event.preventDefault(); // Empêche les comportements par défaut du navigateur
            console.log(`Clic sur le meilleur film: ${movie.title} (ID: ${movie.id})`);
            openModal(movie.id); // Ouverture de la fenêtre modale
        };

        // Vérification de l'existence avant ajout d'événements (robustesse)
        if (poster) {
            poster.addEventListener('click', handleBestMovieClick);
        }
        if (button) {
            button.addEventListener('click', handleBestMovieClick);
        }
        
        console.log('14. ✅ SUCCÈS - loadBestMovie terminé');
    } catch (error) {
        console.error('❌ ERREUR dans loadBestMovie:', error);
        console.log('=== FIN loadBestMovie (ERREUR) ===');
        
        const errorSection = document.querySelector('.bestFilm');
        if (errorSection) {
            errorSection.innerHTML = window.BestMovieTemplate.generateError(error);
        }
    }
    
    console.log('=== FIN loadBestMovie ===');
}



/**
 * FONCTION 2 : Charger tous les genres disponibles
 * 
 * PROBLÈME RÉSOLU : L'API pagine les genres (5 par page maximum)
 * SOLUTION : Boucle while avec pagination automatique
 * CHOIX TECHNIQUE : Accumulation des résultats avec concat()
 */
// DÉPLACÉ vers services/apiService.js - CORRIGÉ
async function loadAllGenres() {
    try {
        const genres = await window.ApiService.getAllGenres();
        // TRI ALPHABÉTIQUE : Amélioration UX pour la liste déroulante
        return genres.sort((a, b) => a.localeCompare(b));
    } catch (error) {
        console.error('Erreur dans loadAllGenres:', error);
        return [];
    }
}

/**
 * FONCTION 3 : Charger une section de films
 * 
 * PARAMÈTRES :
 * - endpoint : URL de l'API avec filtres spécifiques (genre, tri, etc.)
 * - sectionClass : Classe CSS de la section à remplir (bestRatedFilms, category1, etc.)
 * 
 * FONCTIONNALITÉS :
 * - Filtrage des films sans image (amélioration qualité)
 * - Pagination automatique si pas assez de films valides
 * - Gestion spéciale pour la section "Autres films" (dropdown)
 */
async function loadMovieSection(endpoint, sectionClass) {
    try {
        console.log(`Chargement de la section ${sectionClass} depuis ${endpoint}`);
        // Utilisation du service API centralisé
        const data = await window.ApiService.getMovieSection(endpoint);
        console.log(`Données reçues pour ${sectionClass}:`, data);
        const movies = data.results;
        
        // FILTRAGE QUALITÉ : Élimination des films sans poster
        // CHOIX UX : Mieux vaut moins de films mais avec des images
        const validMovies = movies.filter(movie => {
            if (!movie.image_url) {
                console.log(`Film sans image ignoré:`, movie);
                return false;
            }
            return true;
        });

        // Sélection de la section cible dans le DOM
        const movieSection = document.querySelector(`.${sectionClass}`);
        
        // Création de la grille via template centralisé
        const movieList = window.SectionTemplate.createMovieGrid();

        // CRÉATION DYNAMIQUE DES CARTES DE FILMS avec template
        validMovies.forEach((movie, index) => {
            console.log(`Création de la carte pour le film:`, movie);
            
            // Création de la carte via template centralisé
            const movieCard = window.MovieCardTemplate.createElement(movie);
            
            // Vérification de sécurité (le template retourne null si pas d'image)
            if (!movieCard) {
                return; // Skip ce film
            }

            // EVENT DELEGATION avec CLOSURE pour carte et bouton
            const handleClick = (event) => {
                event.preventDefault(); // Empêche la navigation par défaut
                event.stopPropagation(); // Empêche la propagation
                console.log(`Clic sur le film: ${movie.title} (ID: ${movie.id})`);
                openModal(movie.id); // Redirection vers la modale
            };

            // Événements sur la carte et le bouton détails
            movieCard.addEventListener('click', handleClick);
            
            // Événement spécifique pour le bouton détails
            const detailsBtn = movieCard.querySelector('.movie-details-btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', handleClick);
            }
            
            // SÉCURITÉ : Vérification avant appendChild
            if (movieCard && movieList) {
                movieList.appendChild(movieCard);
            }
        });

        // PAGINATION INTELLIGENTE : Vérifions si nous avons assez de films
        if (validMovies.length < getPageSize()) {
            // CHARGEMENT AUTOMATIQUE : Si pas assez de films, charger la page suivante
            if (data.next) {
                console.log(`Chargement de films supplémentaires depuis: ${data.next}`);
                const nextResponse = await fetch(data.next);
                const nextData = await nextResponse.json();
                const nextMovies = nextData.results.filter(movie => movie.image_url);
                
                // SPREAD OPERATOR + SLICE : Ajout du nombre exact de films manquants
                validMovies.push(...nextMovies.slice(0, getPageSize() - validMovies.length));
            }
        }

        // RECONSTRUCTION DU DOM : Préservation du titre, remplacement du contenu
        const title = movieSection.querySelector('h1');
        movieSection.innerHTML = ''; // Vidage complet
        // Le titre sera ajouté plus tard selon la section

        // GESTION SPÉCIALE : Section "Autres films" avec sélecteur de genre Bootstrap
        if (sectionClass === 'otherFilms') {
            const genres = await loadAllGenres(); // Chargement de tous les genres
            
            // Créer un conteneur flex pour titre + sélecteur
            const titleSelectorContainer = document.createElement('div');
            titleSelectorContainer.className = 'title-selector-container';
            
            // Déplacer le titre dans le conteneur flex
            titleSelectorContainer.appendChild(title);
            
            const selectContainer = document.createElement('div');
            selectContainer.className = 'mb-3';
            
            const select = document.createElement('select');
            select.className = 'form-select'; // Classe Bootstrap pour les selects
            
            // Les genres sont déjà triés dans loadAllGenres()
            
            // CONSTRUCTION DYNAMIQUE : Template literals avec map() et join()
            select.innerHTML = `
                <option value="">Sélectionnez un genre</option>
                ${genres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('')}
            `;
            
            // EVENT LISTENER : Rechargement de la section lors du changement de genre
            select.addEventListener('change', async (e) => {
                if (e.target.value) {
                    // Construction de la nouvelle URL avec le genre sélectionné
                    const newEndpoint = `http://localhost:8000/api/v1/titles/?genre=${e.target.value}&sort_by=-imdb_score&page_size=${getPageSize()}`;
                    // RÉCURSION : Rechargement de la même section avec les nouveaux critères
                    await loadMovieSection(newEndpoint, sectionClass);
                }
            });
            
            selectContainer.appendChild(select);
            titleSelectorContainer.appendChild(selectContainer);
            movieSection.appendChild(titleSelectorContainer);
        } else {
            // Pour les autres sections, ajouter le titre normalement
            movieSection.appendChild(title);
        }
        
        // Ajout de la liste des films au DOM
        movieSection.appendChild(movieList);
    } catch (error) {
        // GESTION D'ERREURS : Log + message utilisateur détaillé
        console.error(`Erreur lors du chargement de la section ${sectionClass}:`, error);
        
        // Interface gracieuse en cas d'erreur avec plus de détails
        const movieSection = document.querySelector(`.${sectionClass}`);
        const title = movieSection.querySelector('h1');
        movieSection.innerHTML = '';
        movieSection.appendChild(title);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-container';
        errorDiv.style.cssText = 'border: 2px solid red; padding: 15px; margin: 15px 0; background-color: #ffe6e6; border-radius: 5px;';
        errorDiv.innerHTML = `
            <p class="error"><strong>Erreur de chargement:</strong></p>
            <p>${error.message}</p>
            <p><em>Endpoint: ${endpoint}</em></p>
            <p><em>Vérifiez que l'API OCMovies-API fonctionne</em></p>
        `;
        movieSection.appendChild(errorDiv);
    }
}

/**
 * FONCTION 4 : Ouverture de la fenêtre modale
 * 
 * CHOIX TECHNIQUE : Navigation simple avec paramètres URL
 * ALTERNATIVE POSSIBLE : Modal overlay avec fetch des détails (SPA complète)
 * AVANTAGE ACTUEL : Simplicité + URL partageable + bouton retour navigateur
 */
function openModal(movieId) {
    // VALIDATION D'ENTRÉE : Défense contre les erreurs de développement
    if (!movieId) {
        console.error('Tentative d\'ouverture de modal sans ID de film');
        return;
    }
    
    console.log(`Ouverture de la modal pour le film ID: ${movieId}`);
    
    // NAVIGATION : Passage de l'ID via paramètre URL
    window.location.href = `modalWindows.html?id=${movieId}`;
}

/**
 * FONCTION 5 : Calcul du nombre de films responsive
 * 
 * SPÉCIFICATIONS EXACTES SELON MAQUETTES :
 * - PC (≥992px) : 6 films (2 rangées de 3 films)
 * - Tablette (768px-991px) : 4 films (2 rangées de 2 films)  
 * - Mobile (<768px) : 2 films (1 colonne de 2 films)
 */
// DÉPLACÉ vers utils/responsive.js
// Utilisation: ResponsiveUtils.getPageSize()
function getPageSize() {
    return ResponsiveUtils.getPageSize();
}

/**
 * FONCTION 6 : Initialisation complète de l'application
 * 
 * STRATÉGIE : Chargement séquentiel des sections
 * CHOIX : await séquentiel plutôt que Promise.all() pour éviter la surcharge serveur
 * DIVERSITÉ : Genres variés pour offrir un contenu éclectique
 */
/**
 * FONCTION UTILITAIRE : Gérer les échecs de chargement d'images
 */
// DÉPLACÉ vers utils/imageHandler.js
// Utilisation: ImageHandler.*
function handleImageError(img, fallbackClass = 'movie-fallback') {
    return ImageHandler.handleImageError(img, fallbackClass);
}

function checkImageLoaded(img, fallbackClass = 'movie-fallback') {
    return ImageHandler.checkImageLoaded(img, fallbackClass);
}

function showFallback(img, fallbackClass) {
    return ImageHandler.showFallback(img, fallbackClass);
}



async function initializePage() {
    // Utilisation du gestionnaire d'initialisation centralisé
    const initializer = new window.AppInitializer();
    await initializer.initialize();
}

/**
 * FONCTION 7 : Gestion du responsive en temps réel
 * 
 * STRATÉGIE : Debouncing pour éviter les appels excessifs
 * CHOIX : Réinitialisation complète (simple mais efficace)
 * ALTERNATIVE : Recalcul intelligent des seules sections modifiées
 */
window.addEventListener('resize', () => {
    // DEBOUNCING : Évite les rechargements excessifs pendant le redimensionnement
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        console.log(`Redimensionnement détecté vers ${newWidth}px, réinitialisation...`);
        initializePage(); // Rechargement complet avec nouveaux breakpoints
    }, 250); // Délai de 250ms après la fin du redimensionnement
});

/**
 * POINT D'ENTRÉE DE L'APPLICATION
 * 
 * ÉVÉNEMENT : DOMContentLoaded (plus rapide que window.onload)
 * AVANTAGE : N'attend pas les images, CSS externes, etc.
 * STRATÉGIE : Single Point of Entry pour contrôle centralisé
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation de l\'application...');
    
    // Vérification que tous les éléments DOM nécessaires existent
    const sections = ['.bestFilm', '.bestRatedFilms', '.category1', '.category2', '.otherFilms'];
    console.log('Vérification des sections DOM:');
    
    sections.forEach(sectionClass => {
        const element = document.querySelector(sectionClass);
        if (element) {
            console.log(`✅ ${sectionClass} trouvé`);
        } else {
            console.error(`❌ ${sectionClass} NON TROUVÉ`);
        }
    });
    
    console.log('Début de l\'initialisation...');
    initializePage();
});

/**
 * RÉSUMÉ DES CHOIX TECHNIQUES DE CE FICHIER :
 * 
 * 1. ARCHITECTURE :
 *    - Fonctions modulaires et réutilisables
 *    - Séparation claire des responsabilités
 *    - Gestion d'erreurs à tous les niveaux
 * 
 * 2. PERFORMANCE :
 *    - Chargement adaptatif selon l'écran
 *    - Pagination intelligente
 *    - Filtrage côté client pour la qualité
 * 
 * 3. UX/UI :
 *    - Responsive design natif
 *    - Feedback utilisateur constant
 *    - Navigation intuitive
 * 
 * 4. MAINTENABILITÉ :
 *    - Code commenté et documenté
 *    - Conventions de nommage claires
 *    - Structure logique et prévisible
 * 
 * 5. ROBUSTESSE :
 *    - Validation des données
 *    - Gestion gracieuse des erreurs
 *    - Logs détaillés pour le débogage
 */