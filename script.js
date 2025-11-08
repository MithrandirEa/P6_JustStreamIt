/**
 * JUSTSTREAMIT - APPLICATION PRINCIPALE
 * Architecture modulaire avec services, templates et configuration centralises
 */

/**
 * FONCTION 1 : Charger le meilleur film (celui avec le meilleur score IMDb)
 * 
 * CHOIX TECHNIQUE : async/await pour une gestion claire de l'asynchrone
 * ENDPOINT API : Tri par score decroissant, limite a 1 resultat pour la performance
 * GESTION ERREURS : try/catch pour capturer les erreurs reseau ou de parsing JSON
 */
async function loadBestMovie() {
    console.log('=== DEBUT loadBestMovie ===');
    
    try {
        console.log('1. Verification de l\'element DOM...');
        const bestFilmSection = document.querySelector('.bestFilm');
        if (!bestFilmSection) {
            console.error('ERREUR: Section .bestFilm non trouvee !');
            return;
        }
        console.log('SUCCESS: Section bestFilm trouvee:', bestFilmSection);
        
        console.log('2. Recuperation des meilleurs films via API Service...');
        // Utilisation du service API centralise
        const movies = await window.ApiService.getBestMovies(10);
        console.log('3. Films recus:', movies.length);
        
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
        console.log('7. Recuperation des details complets du film...');
        try {
            const detailData = await window.ApiService.getMovieDetails(movie.id);
            // CORRECTION : Utiliser long_description en priorite, puis description en fallback
            let fullDescription = detailData.long_description || detailData.description || movie.description;
            
            // Si la description est trop courte (moins de 50 caracteres), essayer les autres champs
            if (!fullDescription || fullDescription.length < 50) {
                fullDescription = detailData.description || detailData.long_description || movie.description;
            }
            
            movie.description = fullDescription || 'Description non disponible.';
            console.log('8. Description complete recuperee:', movie.description ? movie.description.substring(0, 100) + '...' : 'Aucune description');
        } catch (error) {
            console.log('8. Impossible de recuperer les details, utilisation de la description de base');
            movie.description = movie.description || 'Description non disponible.';
        }
        
        console.log('9. Generation du HTML via template...');
        
        // Utilisation du template centralise
        const content = window.BestMovieTemplate.generate(movie);
        
        console.log('11. Injection du HTML...');
        bestFilmSection.innerHTML = content;
        console.log('12. SUCCESS: HTML injecte avec succes');

        console.log('13. Ajout des event listeners...');
        
        // EVENT DELEGATION : Ajout des event listeners APRES la creation du DOM
        const bestFilmSectionFinal = document.querySelector('.bestFilm');
        const poster = bestFilmSectionFinal.querySelector('.best-movie-poster');
        const button = bestFilmSectionFinal.querySelector('.play-button');
        
        // CLOSURE : La fonction capture movie.id dans son scope
        // CHOIX UX : Meme action pour image et bouton (coherence utilisateur)
        const handleBestMovieClick = (event) => {
            event.preventDefault(); // Empeche les comportements par defaut du navigateur
            console.log(`Clic sur le meilleur film: ${movie.title} (ID: ${movie.id})`);
            openModal(movie.id); // Ouverture de la fenetre modale
        };

        // Verification de l'existence avant ajout d'evenements (robustesse)
        if (poster) {
            poster.addEventListener('click', handleBestMovieClick);
        }
        if (button) {
            button.addEventListener('click', handleBestMovieClick);
        }
        
        console.log('14. SUCCESS - loadBestMovie termine');
    } catch (error) {
        console.error('ERREUR dans loadBestMovie:', error);
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
 * PROBLEME RESOLU : L'API pagine les genres (5 par page maximum)
 * SOLUTION : Boucle while avec pagination automatique
 * CHOIX TECHNIQUE : Accumulation des resultats avec concat()
 */
// DEPLACE vers services/apiService.js - CORRIGE
async function loadAllGenres() {
    try {
        const genres = await window.ApiService.getAllGenres();
        // TRI ALPHABETIQUE : Amelioration UX pour la liste deroulante
        return genres.sort((a, b) => a.localeCompare(b));
    } catch (error) {
        console.error('Erreur dans loadAllGenres:', error);
        return [];
    }
}

/**
 * FONCTION 3 : Charger une section de films
 * 
 * PARAMETRES :
 * - endpoint : URL de l'API avec filtres specifiques (genre, tri, etc.)
 * - sectionClass : Classe CSS de la section a remplir (bestRatedFilms, category1, etc.)
 * 
 * FONCTIONNALITES :
 * - Filtrage des films sans image (amelioration qualite)
 * - Pagination automatique si pas assez de films valides
 * - Gestion speciale pour la section "Autres films" (dropdown)
 */
async function loadMovieSection(endpoint, sectionClass) {
    try {
        console.log(`Chargement de la section ${sectionClass} depuis ${endpoint}`);
        // Utilisation du service API centralise
        const data = await window.ApiService.getMovieSection(endpoint);
        console.log(`Donnees recues pour ${sectionClass}:`, data);
        const movies = data.results;
        
        // FILTRAGE QUALITE : Elimination des films sans poster
        // CHOIX UX : Mieux vaut moins de films mais avec des images
        const validMovies = movies.filter(movie => {
            if (!movie.image_url) {
                console.log(`Film sans image ignore:`, movie);
                return false;
            }
            return true;
        });

        // Selection de la section cible dans le DOM
        const movieSection = document.querySelector(`.${sectionClass}`);
        
        // Creation de la grille via template centralise
        const movieList = window.SectionTemplate.createMovieGrid();

        // CREATION DYNAMIQUE DES CARTES DE FILMS avec template
        validMovies.forEach((movie, index) => {
            console.log(`Creation de la carte pour le film:`, movie);
            
            // Creation de la carte via template centralise
            const movieCard = window.MovieCardTemplate.createElement(movie);
            
            // Verification de securite (le template retourne null si pas d'image)
            if (!movieCard) {
                return; // Skip ce film
            }

            // EVENT DELEGATION avec CLOSURE pour carte et bouton
            const handleClick = (event) => {
                event.preventDefault(); // Empeche la navigation par defaut
                event.stopPropagation(); // Empeche la propagation
                console.log(`Clic sur le film: ${movie.title} (ID: ${movie.id})`);
                openModal(movie.id); // Redirection vers la modale
            };

            // Evenements sur la carte et le bouton details
            movieCard.addEventListener('click', handleClick);
            
            // Evenement specifique pour le bouton details
            const detailsBtn = movieCard.querySelector('.movie-details-btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', handleClick);
            }
            
            // SECURITE : Verification avant appendChild
            if (movieCard && movieList) {
                movieList.appendChild(movieCard);
            }
        });

        // PAGINATION INTELLIGENTE : Verifions si nous avons assez de films
        if (validMovies.length < getPageSize()) {
            // CHARGEMENT AUTOMATIQUE : Si pas assez de films, charger la page suivante
            if (data.next) {
                console.log(`Chargement de films supplementaires depuis: ${data.next}`);
                const nextResponse = await fetch(data.next);
                const nextData = await nextResponse.json();
                const nextMovies = nextData.results.filter(movie => movie.image_url);
                
                // SPREAD OPERATOR + SLICE : Ajout du nombre exact de films manquants
                validMovies.push(...nextMovies.slice(0, getPageSize() - validMovies.length));
            }
        }

        // RECONSTRUCTION DU DOM : Preservation du titre, remplacement du contenu
        const title = movieSection.querySelector('h1');
        movieSection.innerHTML = ''; // Vidage complet
        // Le titre sera ajoute plus tard selon la section

        // GESTION SPECIALE : Section "Autres films" avec selecteur de genre Bootstrap
        if (sectionClass === 'otherFilms') {
            const genres = await loadAllGenres(); // Chargement de tous les genres
            
            // Creer un conteneur flex pour titre + selecteur
            const titleSelectorContainer = document.createElement('div');
            titleSelectorContainer.className = 'title-selector-container';
            
            // Deplacer le titre dans le conteneur flex
            titleSelectorContainer.appendChild(title);
            
            const selectContainer = document.createElement('div');
            selectContainer.className = 'mb-3';
            
            const select = document.createElement('select');
            select.className = 'form-select'; // Classe Bootstrap pour les selects
            
            // Les genres sont deja tries dans loadAllGenres()
            
            // CONSTRUCTION DYNAMIQUE : Template literals avec map() et join()
            select.innerHTML = `
                <option value="">Selectionnez un genre</option>
                ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
            `;
            
            // EVENT LISTENER : Rechargement de la section lors du changement de genre
            select.addEventListener('change', async (e) => {
                if (e.target.value) {
                    // Construction de la nouvelle URL avec le genre selectionne
                    const newEndpoint = `http://localhost:8000/api/v1/titles/?genre=${e.target.value}&sort_by=-imdb_score&page_size=${getPageSize()}`;
                    // RECURSION : Rechargement de la meme section avec les nouveaux criteres
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
        // GESTION D'ERREURS : Log + message utilisateur detaille
        console.error(`Erreur lors du chargement de la section ${sectionClass}:`, error);
        
        // Interface gracieuse en cas d'erreur avec plus de details
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
            <p><em>Verifiez que l'API OCMovies-API fonctionne</em></p>
        `;
        movieSection.appendChild(errorDiv);
    }
}

/**
 * FONCTION 4 : Ouverture de la fenetre modale
 * 
 * CHOIX TECHNIQUE : Navigation simple avec parametres URL
 * ALTERNATIVE POSSIBLE : Modal overlay avec fetch des details (SPA complete)
 * AVANTAGE ACTUEL : Simplicite + URL partageable + bouton retour navigateur
 */
function openModal(movieId) {
    // VALIDATION D'ENTREE : Defense contre les erreurs de developpement
    if (!movieId) {
        console.error('Tentative d\'ouverture de modal sans ID de film');
        return;
    }
    
    console.log(`Ouverture de la modal pour le film ID: ${movieId}`);
    
    // NAVIGATION : Passage de l'ID via parametre URL
    window.location.href = `modalWindows.html?id=${movieId}`;
}

/**
 * FONCTION 5 : Calcul du nombre de films responsive
 * 
 * SPECIFICATIONS EXACTES SELON MAQUETTES :
 * - PC (>=992px) : 6 films (2 rangees de 3 films)
 * - Tablette (768px-991px) : 4 films (2 rangees de 2 films)  
 * - Mobile (<768px) : 2 films (1 colonne de 2 films)
 */
// DEPLACE vers utils/responsive.js
// Utilisation: ResponsiveUtils.getPageSize()
function getPageSize() {
    return ResponsiveUtils.getPageSize();
}

/**
 * FONCTION 6 : Initialisation complete de l'application
 * 
 * STRATEGIE : Chargement sequentiel des sections
 * CHOIX : await sequentiel plutot que Promise.all() pour eviter la surcharge serveur
 * DIVERSITE : Genres varies pour offrir un contenu eclectique
 */
/**
 * FONCTION UTILITAIRE : Gerer les echecs de chargement d'images
 */
// DEPLACE vers utils/imageHandler.js
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
    // Utilisation du gestionnaire d'initialisation centralise
    const initializer = new window.AppInitializer();
    await initializer.initialize();
}

/**
 * FONCTION 7 : Gestion du responsive en temps reel
 * 
 * STRATEGIE : Debouncing pour eviter les appels excessifs
 * CHOIX : Reinitialisation complete (simple mais efficace)
 * ALTERNATIVE : Recalcul intelligent des seules sections modifiees
 */
window.addEventListener('resize', () => {
    // DEBOUNCING : Evite les rechargements excessifs pendant le redimensionnement
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        console.log(`Redimensionnement detecte vers ${newWidth}px, reinitialisation...`);
        initializePage(); // Rechargement complet avec nouveaux breakpoints
    }, 250); // Delai de 250ms apres la fin du redimensionnement
});

/**
 * POINT D'ENTREE DE L'APPLICATION
 * 
 * EVENEMENT : DOMContentLoaded (plus rapide que window.onload)
 * AVANTAGE : N'attend pas les images, CSS externes, etc.
 * STRATEGIE : Single Point of Entry pour controle centralise
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM charge, initialisation de l\'application...');
    
    // Verification que tous les elements DOM necessaires existent
    const sections = ['.bestFilm', '.bestRatedFilms', '.category1', '.category2', '.otherFilms'];
    console.log('Verification des sections DOM:');
    
    sections.forEach(sectionClass => {
        const element = document.querySelector(sectionClass);
        if (element) {
            console.log(`SUCCESS ${sectionClass} trouve`);
        } else {
            console.error(`ERREUR ${sectionClass} NON TROUVE`);
        }
    });
    
    console.log('Debut de l\'initialisation...');
    initializePage();
});

/**
 * RESUME DES CHOIX TECHNIQUES DE CE FICHIER :
 * 
 * 1. ARCHITECTURE :
 *    - Fonctions modulaires et reutilisables
 *    - Separation claire des responsabilites
 *    - Gestion d'erreurs a tous les niveaux
 * 
 * 2. PERFORMANCE :
 *    - Chargement adaptatif selon l'ecran
 *    - Pagination intelligente
 *    - Filtrage cote client pour la qualite
 * 
 * 3. UX/UI :
 *    - Responsive design natif
 *    - Feedback utilisateur constant
 *    - Navigation intuitive
 * 
 * 4. MAINTENABILITE :
 *    - Code commente et documente
 *    - Conventions de nommage claires
 *    - Structure logique et previsible
 * 
 * 5. ROBUSTESSE :
 *    - Validation des donnees
 *    - Gestion gracieuse des erreurs
 *    - Logs detailles pour le debogage
 */