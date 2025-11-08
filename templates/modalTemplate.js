/**
 * MODAL TEMPLATE
 * Templates pour l'affichage des détails de films dans les modales
 * Génère le contenu HTML pour les sections desktop et mobile des modales
 */

/**
 * Génère le HTML pour la section titre
 * @param {Object} movie - Données du film
 * @returns {string} HTML du titre
 */
function generateTitleSection(movie) {
    return `<h1>${movie.title}</h1>`;
}

/**
 * Génère le HTML pour la section détails
 * @param {Object} movie - Données du film
 * @returns {string} HTML des détails
 */
function generateDetailsSection(movie) {
    return `
        <p><strong>${movie.year} -</strong> ${movie.genres.join(', ')}, ${movie.rated || 'Non classé'}</p>
        <p><strong>PG-13 -</strong> ${movie.duration} minutes (${movie.countries.join(' / ')})</p>
        <p><strong>IMDB score :</strong> ${movie.imdb_score}/10</p>
        <p><strong>Recettes au box office :</strong> ${movie.worldwide_gross_income ? new Intl.NumberFormat('fr-FR').format(movie.worldwide_gross_income) + '$' : 'Non disponible'}</p>
    `;
}

/**
 * Génère le HTML pour la section réalisateur
 * @param {Object} movie - Données du film
 * @returns {string} HTML du réalisateur
 */
function generateDirectorSection(movie) {
    return `
        <p><strong>Réalisé par :</strong></p>
        <p>${movie.directors.join(', ')}</p>
    `;
}

/**
 * Génère le HTML pour la section résumé
 * @param {Object} movie - Données du film
 * @returns {string} HTML du résumé
 */
function generateSummarySection(movie) {
    return `<p>${movie.long_description || movie.description}</p>`;
}

/**
 * Génère le HTML pour la section acteurs
 * @param {Object} movie - Données du film
 * @returns {string} HTML des acteurs
 */
function generateActorsSection(movie) {
    return `
        <p>Avec : <br> 
        <span class="actors_names">${movie.actors.join(', ')}</span></p>
    `;
}

/**
 * Configure une image de poster avec gestion d'erreur
 * @param {HTMLImageElement} poster - Élément image
 * @param {Object} movie - Données du film
 * @param {boolean} isMobile - Si c'est la version mobile
 */
function configurePosterImage(poster, movie, isMobile = false) {
    poster.src = movie.image_url;
    poster.alt = `Poster de ${movie.title}`;
    poster.title = movie.title;
    
    if (isMobile) {
        poster.className = 'modal-poster mobile-poster';
    } else {
        poster.className = 'modal-poster';
    }
}

/**
 * Génère le template d'erreur pour la modale
 * @param {Error} error - Erreur survenue
 * @returns {string} HTML d'erreur
 */
function generateModalErrorTemplate(error) {
    return `
        <div class="modal-error" style="text-align: center; padding: 40px;">
            <h1>Erreur de chargement</h1>
            <p><strong>Erreur :</strong> ${error.message}</p>
            <p>Impossible de charger les détails du film.</p>
            <a href="index.html" class="btn-close-modal">Retour à l'accueil</a>
        </div>
    `;
}

// Export pour utilisation via l'objet window
if (typeof window !== 'undefined') {
    window.ModalTemplate = {
        generateTitleSection,
        generateDetailsSection,
        generateDirectorSection,
        generateSummarySection,
        generateActorsSection,
        configurePosterImage,
        generateError: generateModalErrorTemplate
    };
}