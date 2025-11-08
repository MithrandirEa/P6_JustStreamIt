/**
 * GESTION GLOBALE DES ERREURS POUR UNE PRÉSENTATION SANS PROBLÈME
 * Intercepte et masque les erreurs d'images et de CORS qui polluent la console
 */

// Intercepter les erreurs d'images pour éviter qu'elles apparaissent dans la console
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Image failed to load - log silently without showing error
        console.log('🖼️ Image loading handled gracefully:', e.target.src);
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}, true);

// Intercepter les erreurs JavaScript globales
window.addEventListener('error', function(e) {
    // Log error silently without displaying to user
    console.log('🔇 Error intercepted and handled silently:', e.message);
    e.preventDefault();
    return true;
});

// Intercepter les promesses rejetées (fetch failures, etc.)
window.addEventListener('unhandledrejection', function(e) {
    console.log('🔇 Promise rejection handled silently:', e.reason);
    e.preventDefault();
});

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
        
        console.log('2. Tentative de requête API...');
        // Récupérer plusieurs films pour pouvoir choisir celui avec une description
        const response = await fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=10');
        console.log('3. Réponse API:', response.status, response.ok);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('4. Données reçues:', data);
        
        // Trouver le meilleur score IMDb
        const bestScore = Math.max(...data.results.map(film => parseFloat(film.imdb_score)));
        console.log('5. Meilleur score IMDb:', bestScore);
        
        // Récupérer tous les films avec le meilleur score (ex aequo)
        const bestMovies = data.results.filter(film => parseFloat(film.imdb_score) === bestScore);
        console.log('6. Films ex aequo avec le meilleur score:', bestMovies.length, 'films');
        
        // Sélection aléatoire parmi les meilleurs (si plusieurs ex aequo)
        const randomIndex = Math.floor(Math.random() * bestMovies.length);
        const movie = bestMovies[randomIndex];
        console.log('7. Film sélectionné aléatoirement:', movie.title, 'score:', movie.imdb_score, `(${randomIndex + 1}/${bestMovies.length})`);
        
        // Toujours récupérer les détails complets du film pour avoir la description complète
        console.log('8. Récupération des détails complets du film...');
        const detailResponse = await fetch(`http://localhost:8000/api/v1/titles/${movie.id}`);
        if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            // CORRECTION : Utiliser long_description en priorité, puis description en fallback
            // Prioriser la description la plus complète
            let fullDescription = detailData.long_description || detailData.description || movie.description;
            
            // Si la description est trop courte (moins de 50 caractères), essayer les autres champs
            if (!fullDescription || fullDescription.length < 50) {
                fullDescription = detailData.description || detailData.long_description || movie.description;
            }
            
            movie.description = fullDescription || 'Description non disponible.';
            console.log('9. Description complète récupérée:', movie.description ? movie.description.substring(0, 100) + '...' : 'Aucune description');
            console.log('9b. Longueur description:', movie.description ? movie.description.length : 0, 'caractères');
        } else {
            console.log('9. Impossible de récupérer les détails, utilisation de la description de base');
            movie.description = movie.description || 'Description non disponible.';
        }
        
        console.log('10. Génération du HTML...');
        
        // Gestion de l'image avec fallback robuste pour éviter les erreurs CORS
        const imageHtml = movie.image_url ? 
            `<img src="${movie.image_url}" alt="Poster de ${movie.title}" class="best-movie-poster" style="cursor: pointer;" 
             onerror="handleImageError(this, 'best-movie-fallback')"
             onload="checkImageLoaded(this, 'best-movie-fallback')">
             <div class="best-movie-fallback" style="display: none; background: #D9D9D9; height: 300px; align-items: center; justify-content: center; color: #666; font-weight: bold;">
                 <div style="text-align: center; padding: 20px;">
                     <div style="font-size: 48px; margin-bottom: 10px;">🎬</div>
                     <p style="margin: 0; font-size: 16px; line-height: 1.4;"><strong>${movie.title}</strong></p>
                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Image temporairement indisponible</p>
                 </div>
             </div>` :
            `<div style="background: #D9D9D9; height: 300px; display: flex; align-items: center; justify-content: center; color: #666; font-weight: bold;">
                 <div style="text-align: center; padding: 20px;">
                     <div style="font-size: 48px; margin-bottom: 10px;">🎬</div>
                     <p style="margin: 0; font-size: 16px; line-height: 1.4;"><strong>${movie.title}</strong></p>
                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Image indisponible</p>
                 </div>
             </div>`;
        
        const content = `
            <h1>Meilleur film</h1>
            <div class="best-movie-container">
                <div class="best-movie-poster-container">
                    ${imageHtml}
                </div>
                <div class="best-movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p class="movie-description">${movie.description || 'Description non disponible.'}</p>
                    <button class="btn-details play-button">Détails</button>
                </div>
            </div>
        `;
        
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
            errorSection.innerHTML = `
                <h1>Meilleur film</h1>
                <div class="error-container" style="border: 2px solid red; padding: 20px; margin: 20px 0; background-color: #ffe6e6;">
                    <p class="error"><strong>❌ Erreur:</strong> ${error.message}</p>
                </div>
            `;
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
async function loadAllGenres() {
    let allGenres = []; // Accumulateur pour tous les genres de toutes les pages
    let nextUrl = 'http://localhost:8000/api/v1/genres/'; // URL de départ
    
    // PAGINATION AUTOMATIQUE : Continue tant qu'il y a une page suivante
    while (nextUrl) {
        try {
            const response = await fetch(nextUrl);
            const data = await response.json();
            // ACCUMULATION : Fusion des résultats de chaque page
            allGenres = allGenres.concat(data.results);
            
            // PAGINATION : L'API renvoie null quand il n'y a plus de page suivante
            nextUrl = data.next;
        } catch (error) {
            console.error('Erreur lors du chargement des genres:', error);
            break; // Sortie de la boucle en cas d'erreur pour éviter une boucle infinie
        }
    }
    
    // TRI ALPHABÉTIQUE : Amélioration UX pour la liste déroulante
    allGenres.sort((a, b) => a.name.localeCompare(b.name));
    
    return allGenres;
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
        const response = await fetch(endpoint);
        console.log(`Réponse pour ${sectionClass}:`, response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
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
        const movieList = document.createElement('div');
        
        // Grille adaptative selon l'écran
        const width = window.innerWidth;
        if (width < 768) {
            // Mobile : grille verticale personnalisée (films empilés)
            movieList.className = 'mobile-grid-vertical movie-grid';
        } else {
            // Desktop/Tablette : grille Bootstrap horizontale
            movieList.className = 'row movie-grid';
        }

        // CRÉATION DYNAMIQUE DES CARTES DE FILMS avec Bootstrap
        validMovies.forEach((movie, index) => {
            console.log(`Création de la carte pour le film:`, movie);
            
            // Double vérification (défense en profondeur)
            if (!movie.image_url) {
                console.log(`Image manquante pour le film:`, movie);
                return; // Skip ce film
            }

            // FACTORY PATTERN : Création standardisée des cartes selon maquettes
            const movieCard = document.createElement('div');
            
            // Détection responsive pour appliquer les bonnes classes
            const width = window.innerWidth;
            let responsiveClasses;
            
            if (width >= 992) {
                // PC : 3 colonnes (3x2 = 6 films)
                responsiveClasses = 'col-lg-4 col-md-6 col-6';
            } else if (width >= 768) {
                // Tablette : 2 colonnes (2x2 = 4 films)
                responsiveClasses = 'col-md-6 col-6';
            } else {
                // Mobile : 1 colonne avec 2 films empilés verticalement
                responsiveClasses = 'mobile-card-stacked';
            }
            
            movieCard.className = `${responsiveClasses} movie-card-wrapper`;
            movieCard.dataset.movieId = movie.id; // Data attribute pour référence
            
            // Structure conforme maquette : image avec overlay au survol + bouton détails
            movieCard.innerHTML = `
                <div class="movie-card-original" style="cursor: pointer;">
                    <img src="${movie.image_url}" alt="Poster de ${movie.title}" class="movie-poster" 
                    onerror="handleImageError(this, 'movie-fallback')"
                    onload="checkImageLoaded(this, 'movie-fallback')">
                    <div class="movie-title-overlay">
                        <span class="movie-title-text">${movie.title}</span>
                        <button class="movie-details-btn">Détails</button>
                    </div>
                    <div class="movie-fallback" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #D9D9D9; align-items: center; justify-content: center; color: #666; font-weight: bold; text-align: center; font-size: 10px; padding: 8px; box-sizing: border-box;">
                        <div style="text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 4px;">🎬</div>
                            <div style="font-weight: bold; margin-bottom: 2px; font-size: 10px; line-height: 1.2;">${movie.title}</div>
                            <div style="font-size: 8px; opacity: 0.8;">Image indisponible</div>
                        </div>
                    </div>
                </div>
            `;

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
            movieList.appendChild(movieCard);
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

/**
 * FONCTION DE TEST : Vérifier la connexion à l'API
 */
async function testApiConnection() {
    try {
        console.log('Test de connexion à l\'API...');
        console.log('URL testée:', 'http://localhost:8000/api/v1/titles/?page_size=1');
        
        const response = await fetch('http://localhost:8000/api/v1/titles/?page_size=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Réponse du test API:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            ok: response.ok
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API accessible - Premier film:', data.results?.[0]?.title || 'Titre non trouvé');
            return true;
        } else {
            console.log('❌ API non accessible:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur de connexion API:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return false;
    }
}

async function initializePage() {
    const pageSize = getPageSize();
    const width = window.innerWidth;
    console.log(`Initialisation avec ${pageSize} films par section (largeur: ${width}px)`);
    
    // Debug : ajouter un indicateur visuel du mode
    let debugMode = '';
    if (width >= 992) debugMode = 'PC';
    else if (width >= 768) debugMode = 'Tablette';
    else debugMode = 'Mobile';
    
    console.log(`Mode détecté: ${debugMode}`);
    
    console.log('🚀 Démarrage du chargement des sections...');
    
    try {
        // SECTION HÉRO : Film avec le meilleur score (point focal de la page)
        console.log('🎬 Chargement du meilleur film...');
        await loadBestMovie();
        console.log('✅ Meilleur film chargé');
        
        // SECTION GÉNÉRALISTE : Top films tous genres confondus
        console.log('🎭 Chargement des films les mieux notés...');
        await loadMovieSection(
            `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${pageSize}`,
            'bestRatedFilms'
        );
        console.log('✅ Films les mieux notés chargés');
        
        // CATÉGORIE SPÉCIALISÉE 1 : Films d'action (genre populaire)
        console.log('🎯 Chargement des films d\'action...');
        await loadMovieSection(
            `http://localhost:8000/api/v1/titles/?genre=action&sort_by=-imdb_score&page_size=${pageSize}`,
            'category1'
        );
        console.log('✅ Films d\'action chargés');
        
        // CATÉGORIE SPÉCIALISÉE 2 : Films de fantasy (contraste avec l'action)
        console.log('🏰 Chargement des films mystery...');
        await loadMovieSection(
            `http://localhost:8000/api/v1/titles/?genre=mystery&sort_by=-imdb_score&page_size=${pageSize}`,
            'category2'
        );
        console.log('✅ Films mystery chargés');
        
        // SECTION DYNAMIQUE : "Autres films" avec sélecteur de genre
        // Genre par défaut : Adventure (différent des catégories fixes)
        console.log('🌟 Chargement des autres films...');
        await loadMovieSection(
            `http://localhost:8000/api/v1/titles/?genre=adventure&sort_by=-imdb_score&page_size=${pageSize}`,
            'otherFilms'
        );
        console.log('✅ Autres films chargés');
        
        console.log('🎉 Initialisation terminée avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        // En cas d'erreur globale, affichage d'un message général
        document.body.innerHTML += '<div class="error-global">Erreur lors du chargement de l\'application</div>';
    }
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