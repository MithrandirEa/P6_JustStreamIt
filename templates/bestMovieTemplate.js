/**
 * BEST MOVIE TEMPLATE
 * Template pour la section du meilleur film de la page d'accueil
 * Gere l'affichage du film avec le meilleur score IMDb
 */

/**
 * Genere le template HTML pour le meilleur film
 * Cree la structure HTML complete pour afficher le meilleur film avec :
 * - Image du poster avec gestion d'erreur de chargement
 * - Titre et description du film
 * - Bouton pour ouvrir les details en modal
 * @param {Object} movie - Objet contenant les donnees du film (title, image_url, description, etc.)
 * @returns {string} Chaine HTML prete a etre injectee dans le DOM
 */
function generateBestMovieTemplate(movie) {
    // Gestion de l'image avec fallback robuste pour eviter les erreurs CORS
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
 * Genere le template d'erreur pour la section du meilleur film
 * Affiche un message d'erreur comprehensible a l'utilisateur avec option de rechargement
 * @param {Error} error - Objet Error contenant les details de l'erreur survenue
 * @returns {string} HTML d'erreur avec message explicatif et bouton de rechargement
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