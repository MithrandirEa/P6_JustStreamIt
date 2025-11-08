/**
 * 🎭 MOVIE CARD TEMPLATE
 * Template pour les cartes de films dans les sections
 */

/**
 * Génère le template HTML pour une carte de film
 * @param {Object} movie - Données du film
 * @returns {string} HTML de la carte de film
 */
function generateMovieCardTemplate(movie) {
    return `
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
}

/**
 * Détermine les classes CSS responsives pour une carte de film
 * @returns {string} Classes CSS Bootstrap responsives
 */
function getResponsiveClasses() {
    const width = window.innerWidth;
    
    if (width >= 992) {
        // PC : 3 colonnes (3x2 = 6 films)
        return 'col-lg-4 col-md-6 col-6';
    } else if (width >= 768) {
        // Tablette : 2 colonnes (2x2 = 4 films)
        return 'col-md-6 col-6';
    } else {
        // Mobile : 1 colonne avec 2 films empilés verticalement
        return 'mobile-card-stacked';
    }
}

/**
 * Crée un élément DOM de carte de film complet
 * @param {Object} movie - Données du film
 * @returns {HTMLElement} Élément DOM de la carte
 */
function createMovieCardElement(movie) {
    // Vérification de sécurité
    if (!movie.image_url) {
        console.log(`Film sans image ignoré:`, movie);
        return null;
    }

    // FACTORY PATTERN : Création standardisée des cartes selon maquettes
    const movieCard = document.createElement('div');
    
    const responsiveClasses = getResponsiveClasses();
    movieCard.className = `${responsiveClasses} movie-card-wrapper`;
    movieCard.dataset.movieId = movie.id; // Data attribute pour référence
    
    // Injection du template HTML
    movieCard.innerHTML = generateMovieCardTemplate(movie);
    
    return movieCard;
}

// Export pour utilisation dans script.js
if (typeof window !== 'undefined') {
    window.MovieCardTemplate = {
        generate: generateMovieCardTemplate,
        getResponsiveClasses: getResponsiveClasses,
        createElement: createMovieCardElement
    };
}