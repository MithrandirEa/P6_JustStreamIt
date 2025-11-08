/**
 * SECTION TEMPLATE
 * Templates pour les sections de films et les selecteurs de genre
 * Gere la creation des structures HTML pour les differentes sections de films
 */

/**
 * Genere le template HTML pour un selecteur de genre
 * Cree les options HTML d'un element select pour choisir un genre de film
 * @param {Array} genres - Liste des noms de genres disponibles (chaines de caracteres)
 * @returns {string} HTML des options du selecteur pret a etre injecte dans un select
 */
function generateGenreSelectorTemplate(genres) {
    return `
        <option value="">Selectionnez un genre</option>
        ${genres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('')}
    `;
}

/**
 * Cree un element de titre avec selecteur de genre
 * Construit un conteneur avec titre de section et optionnellement un selecteur de genre
 * Utilise pour la section "Autres films" qui permet de filtrer par genre
 * @param {string} titleText - Texte du titre de la section a afficher
 * @param {Array} genres - Liste des genres disponibles (optionnel, pour section Autres films)
 * @returns {Object} Objet avec container (element DOM) et selector (element select ou null)
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
 * Genere le template d'erreur pour une section de films
 * Cree un affichage d'erreur comprehensible avec details et option de rechargement
 * Utilise en cas d'echec de chargement d'une section de films
 * @param {string} sectionName - Nom de la section qui a echoue (ex: "Films les mieux notes")
 * @param {Error} error - Objet Error avec les details de l'erreur
 * @returns {string} HTML d'erreur style avec message explicatif
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
 * Cree la grille responsive pour les films
 * Genere le conteneur principal qui accueillera les cartes de films
 * Adapte automatiquement la structure selon la taille d'ecran
 * @returns {HTMLElement} Element DOM de la grille pret a recevoir les cartes
 */
function createMovieGrid() {
    const movieList = document.createElement('div');
    
    // Grille adaptative selon l'ecran
    const width = window.innerWidth;
    if (width < 768) {
        // Mobile : grille verticale personnalisee (films empiles)
        movieList.className = 'mobile-grid-vertical movie-grid';
    } else {
        // Desktop/Tablette : grille Bootstrap horizontale
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