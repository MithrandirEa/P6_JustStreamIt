/**
 * BEST MOVIE TEMPLATE
 * Template pour la section héro du meilleur film
 */

/**
 * Génère le template HTML du meilleur film
 * @param {Object} movie - Données du film
 * @returns {string} HTML complet de la section
 */
function generateBestMovieTemplate(movie) {
    // Gestion d'image avec fallback
    const imageHtml = movie.image_url ? 
        `<img src="${movie.image_url}" alt="Poster de ${movie.title}" class="best-movie-poster" style="cursor: pointer;" 
         onerror="handleImageError(this, 'best-movie-fallback')"
         onload="checkImageLoaded(this, 'best-movie-fallback')">
         <div class="best-movie-fallback" style="display: none; background: #D9D9D9; height: 300px;"></div>` :
        `<div style="background: #D9D9D9; height: 300px;"></div>`;
    
    return `
        <h1>Meilleur film</h1>
        <div class="best-movie-container">
            <div class="best-movie-poster-container">
                ${imageHtml}
            </div>
            <div class="best-movie-info">
                <h2 class="movie-title">${movie.title}</h2>
                <p class="movie-description">${movie.description || 'Description non disponible.'}</p>
                <button class="btn-details play-button">Details</button>
            </div>
        </div>
    `;
}

/**
 * Génère le template d'erreur
 * @param {Error} error - Erreur survenue
 * @returns {string} HTML d'erreur avec rechargement
 */
function generateBestMovieErrorTemplate(error) {
    return `
        <h1>Meilleur film</h1>
        <div class="error-container" style="border: 2px solid red; padding: 20px; margin: 20px 0; background-color: #ffe6e6;">
            <p class="error"><strong>ERREUR:</strong> ${error.message}</p>
            <p><strong>Details:</strong> Impossible de charger le meilleur film depuis l'API.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Recharger</button>
        </div>
    `;
}

// Export pour utilisation dans script.js via l'objet window
// Permet d'acceder aux fonctions de template depuis le fichier principal
if (typeof window !== 'undefined') {
    window.BestMovieTemplate = {
        generate: generateBestMovieTemplate,
        generateError: generateBestMovieErrorTemplate
    };
}