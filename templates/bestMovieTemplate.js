/**
 * 🎬 BEST MOVIE TEMPLATE
 * Template pour la section du meilleur film
 */

/**
 * Génère le template HTML pour le meilleur film
 * @param {Object} movie - Données du film
 * @returns {string} HTML du meilleur film
 */
function generateBestMovieTemplate(movie) {
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
    
    return `
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
}

/**
 * Génère le template d'erreur pour la section du meilleur film
 * @param {Error} error - L'erreur survenue
 * @returns {string} HTML d'erreur
 */
function generateBestMovieErrorTemplate(error) {
    return `
        <h1>Meilleur film</h1>
        <div class="error-container" style="border: 2px solid red; padding: 20px; margin: 20px 0; background-color: #ffe6e6;">
            <p class="error"><strong>❌ Erreur:</strong> ${error.message}</p>
            <p><strong>Détails:</strong> Impossible de charger le meilleur film depuis l'API.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Recharger</button>
        </div>
    `;
}

// Export pour utilisation dans script.js
if (typeof window !== 'undefined') {
    window.BestMovieTemplate = {
        generate: generateBestMovieTemplate,
        generateError: generateBestMovieErrorTemplate
    };
}