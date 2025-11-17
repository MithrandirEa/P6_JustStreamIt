/**
 * SECTION TEMPLATE
 * Templates pour les sections de films et sélecteurs de genre
 */

/**
 * Génère le template d'un sélecteur de genre
 * @param {Array} genres - Liste des genres disponibles
 * @returns {string} HTML des options du select
 */
function generateGenreSelectorTemplate(genres) {
    return `
        <option value="">Selectionnez un genre</option>
        ${genres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('')}
    `;
}

/**
 * Crée un titre avec sélecteur de genre
 * @param {string} titleText - Texte du titre
 * @param {Array} genres - Liste des genres (optionnel)
 * @returns {Object} {container, selector}
 */
function createTitleWithSelector(titleText, genres = null) {
    const titleSelectorContainer = document.createElement('div');
    titleSelectorContainer.className = 'section-header mb-3';
    
    // Titre principal
    const title = document.createElement('h2');
    title.textContent = titleText;
    title.className = 'section-title';
    titleSelectorContainer.appendChild(title);
    
    // Selecteur de genre si fourni
    if (genres && genres.length > 0) {
        const selectContainer = document.createElement('div');
        selectContainer.className = 'genre-selector-container mt-2';
        
        const select = document.createElement('select');
        select.className = 'form-select genre-selector';
        select.innerHTML = generateGenreSelectorTemplate(genres);
        
        selectContainer.appendChild(select);
        titleSelectorContainer.appendChild(selectContainer);
        
        return { container: titleSelectorContainer, selector: select };
    }
    
    return { container: titleSelectorContainer, selector: null };
}

/**
 * Génère le template d'erreur pour une section
 * @param {string} sectionName - Nom de la section
 * @param {Error} error - Erreur survenue
 * @returns {string} HTML d'erreur avec rechargement
 */
function generateSectionErrorTemplate(sectionName, error) {
    return `
        <div class="error-container" style="border: 2px solid red; padding: 20px; margin: 20px 0; background-color: #ffe6e6; border-radius: 8px;">
            <h3 style="color: #d32f2f; margin-top: 0;">ERREUR de chargement</h3>
            <p><strong>Section:</strong> ${sectionName}</p>
            <p><strong>Erreur:</strong> ${error.message}</p>
            <p><strong>Details:</strong> Impossible de charger les films depuis l'API.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                Recharger la page
            </button>
        </div>
    `;
}

/**
 * Crée la grille responsive pour les films
 * @returns {HTMLElement} Conteneur de grille adapté
 */
function createMovieGrid() {
    const movieList = document.createElement('div');
    
    // Grille adaptée selon l'écran
    const width = window.innerWidth;
    if (width <= 456) {
        // Mobile : grille verticale
        movieList.className = 'mobile-grid-vertical movie-grid';
    } else {
        // Desktop/Tablette : grille horizontale
        movieList.className = 'row movie-grid';
    }
    
    return movieList;
}

// Export pour utilisation dans script.js via l'objet window
// Expose les fonctions de template pour la creation de sections
if (typeof window !== 'undefined') {
    window.SectionTemplate = {
        generateGenreSelector: generateGenreSelectorTemplate,
        createTitleWithSelector: createTitleWithSelector,
        generateError: generateSectionErrorTemplate,
        createMovieGrid: createMovieGrid
    };
}