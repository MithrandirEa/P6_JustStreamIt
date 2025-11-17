/**
 * MOVIE CARD TEMPLATE
 * Template pour les cartes de films dans les sections
 * Gère l'affichage responsive avec overlay et fallback
 */

/**
 * Génère le template HTML d'une carte de film
 * @param {Object} movie - Données du film
 * @returns {string} HTML de la carte
 */
function generateMovieCardTemplate(movie) {
    return `
        <div class="movie-card-original" style="cursor: pointer;">
            <img src="${movie.image_url}" alt="Poster de ${movie.title}" class="movie-poster" 
            onerror="handleImageError(this, 'movie-fallback')"
            onload="checkImageLoaded(this, 'movie-fallback')">
            <div class="movie-fallback" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #D9D9D9;"></div>
            <div class="movie-title-overlay">
                <span class="movie-title-text">${movie.title}</span>
                <button class="movie-details-btn">Details</button>
            </div>
        </div>
    `;
}

/**
 * Détermine les classes CSS responsives
 * @returns {string} Classes CSS Bootstrap adaptées
 */
function getResponsiveClasses() {
    const width = window.innerWidth;
    
    if (width >= 992) {
        // Desktop : 3 colonnes
        return 'col-lg-4 col-md-6 col-6';
    } else if (width >= 768) {
        // Tablette : 2 colonnes
        return 'col-md-6 col-6';
    } else {
        // Mobile : 1 colonne
        return 'mobile-card-stacked';
    }
}

/**
 * Crée un élément DOM de carte de film
 * @param {Object} movie - Données du film
 * @returns {HTMLElement|null} Élément DOM ou null
 */
function createMovieCardElement(movie) {
    // Vérification de sécurité
    if (!movie.image_url) {
        console.log(`Film sans image ignore:`, movie);
        return null;
    }

    // Création de la carte
    const movieCard = document.createElement('div');
    
    const responsiveClasses = getResponsiveClasses();
    movieCard.className = `${responsiveClasses} movie-card-wrapper`;
    movieCard.dataset.movieId = movie.id;
    
    // Injection du template
    movieCard.innerHTML = generateMovieCardTemplate(movie);
    
    return movieCard;
}

// Export pour utilisation dans script.js via l'objet window
// Expose les fonctions de template pour la creation de cartes
if (typeof window !== 'undefined') {
    window.MovieCardTemplate = {
        generate: generateMovieCardTemplate,
        getResponsiveClasses: getResponsiveClasses,
        createElement: createMovieCardElement
    };
}