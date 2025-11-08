/**
 * MOVIE CARD TEMPLATE
 * Template pour les cartes de films dans les sections (Films les mieux notes, categories, etc.)
 * Gere l'affichage responsive des cartes avec overlay et fallback d'images
 */

/**
 * Genere le template HTML pour une carte de film
 * Cree la structure HTML d'une carte avec :
 * - Image du poster avec gestion d'erreur
 * - Overlay avec titre et bouton details
 * - Fallback gris si l'image ne charge pas
 * @param {Object} movie - Objet contenant les donnees du film (id, title, image_url, etc.)
 * @returns {string} Chaine HTML de la carte prete a etre injectee
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
 * Determine les classes CSS responsives pour une carte de film
 * Calcule les classes Bootstrap selon la largeur d'ecran pour respecter les specifications :
 * - PC (>=992px) : 3 colonnes sur 2 rangees = 6 films
 * - Tablette (768-991px) : 2 colonnes sur 2 rangees = 4 films
 * - Mobile (<768px) : 1 colonne avec 2 films empiles = 2 films
 * @returns {string} Classes CSS Bootstrap responsives appropriees
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
        // Mobile : 1 colonne avec 2 films empiles verticalement
        return 'mobile-card-stacked';
    }
}

/**
 * Cree un element DOM de carte de film complet
 * Fonction factory qui combine la generation HTML et la creation d'element DOM
 * Inclut la verification de securite et l'attribution des classes responsives
 * @param {Object} movie - Objet contenant les donnees du film
 * @returns {HTMLElement|null} Element DOM de la carte pret a etre ajoute au DOM, ou null si pas d'image
 */
function createMovieCardElement(movie) {
    // Verification de securite - elimine les films sans image
    if (!movie.image_url) {
        console.log(`Film sans image ignore:`, movie);
        return null;
    }

    // FACTORY PATTERN : Creation standardisee des cartes selon maquettes
    const movieCard = document.createElement('div');
    
    const responsiveClasses = getResponsiveClasses();
    movieCard.className = `${responsiveClasses} movie-card-wrapper`;
    movieCard.dataset.movieId = movie.id; // Data attribute pour reference
    
    // Injection du template HTML
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