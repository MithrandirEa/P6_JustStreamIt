/**
 * JUSTSTREAMIT - APPLICATION PRINCIPALE
 * Architecture modulaire avec services, templates et configuration centralises
 */

/**
 * Charge et affiche le meilleur film selon le score IMDb
 */
async function loadBestMovie() {
    try {
        const bestFilmSection = document.querySelector('.bestFilm');
        if (!bestFilmSection) return;
        
        const movies = await window.ApiService.getBestMovies(10);
        const bestScore = Math.max(...movies.map(film => parseFloat(film.imdb_score)));
        const bestMovies = movies.filter(film => parseFloat(film.imdb_score) === bestScore);
        const movie = bestMovies[Math.floor(Math.random() * bestMovies.length)];
        
        // Récupération des détails complets
        try {
            const detailData = await window.ApiService.getMovieDetails(movie.id);
            let fullDescription = detailData.long_description || detailData.description || movie.description;
            if (!fullDescription || fullDescription.length < 50) {
                fullDescription = detailData.description || detailData.long_description || movie.description;
            }
            movie.description = fullDescription || 'Description non disponible.';
        } catch (error) {
            movie.description = movie.description || 'Description non disponible.';
        }
        
        const content = window.BestMovieTemplate.generate(movie);
        bestFilmSection.innerHTML = content;

        // Event listeners
        const bestFilmSectionFinal = document.querySelector('.bestFilm');
        const poster = bestFilmSectionFinal.querySelector('.best-movie-poster');
        const button = bestFilmSectionFinal.querySelector('.play-button');
        
        const handleBestMovieClick = (event) => {
            event.preventDefault();
            openModal(movie.id);
        };

        if (poster) poster.addEventListener('click', handleBestMovieClick);
        if (button) button.addEventListener('click', handleBestMovieClick);
        
    } catch (error) {
        const errorSection = document.querySelector('.bestFilm');
        if (errorSection) {
            errorSection.innerHTML = window.BestMovieTemplate.generateError(error);
        }
    }
}



/**
 * Charger tous les genres disponibles
 */
async function loadAllGenres() {
    try {
        const genres = await window.ApiService.getAllGenres();
        return genres.sort((a, b) => a.localeCompare(b));
    } catch (error) {
        return [];
    }
}

/**
 * Charger une section de films
 */
async function loadMovieSection(endpoint, sectionClass) {
    try {
        const data = await window.ApiService.getMovieSection(endpoint);
        const movies = data.results;
        const validMovies = movies.filter(movie => movie.image_url);

        // Selection de la section cible dans le DOM
        const movieSection = document.querySelector(`.${sectionClass}`);
        
        // Creation de la grille via template centralise
        const movieList = window.SectionTemplate.createMovieGrid();

        validMovies.forEach((movie, index) => {
            const movieCard = window.MovieCardTemplate.createElement(movie);
            if (!movieCard) return;

            const handleClick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                openModal(movie.id);
            };

            movieCard.addEventListener('click', handleClick);
            const detailsBtn = movieCard.querySelector('.movie-details-btn');
            if (detailsBtn) detailsBtn.addEventListener('click', handleClick);
            if (movieCard && movieList) movieList.appendChild(movieCard);
        });

        // Pagination si pas assez de films
        if (validMovies.length < ResponsiveUtils.getPageSize() && data.next) {
            const nextResponse = await fetch(data.next);
            const nextData = await nextResponse.json();
            const nextMovies = nextData.results.filter(movie => movie.image_url);
            validMovies.push(...nextMovies.slice(0, ResponsiveUtils.getPageSize() - validMovies.length));
        }

        const title = movieSection.querySelector('h1');
        movieSection.innerHTML = '';

        // Gestion speciale section "Autres films"
        if (sectionClass === 'otherFilms') {
            const genres = await loadAllGenres();
            const titleSelectorContainer = document.createElement('div');
            titleSelectorContainer.className = 'title-selector-container';
            
            // Deplacer le titre dans le conteneur flex
            titleSelectorContainer.appendChild(title);
            
            const selectContainer = document.createElement('div');
            selectContainer.className = 'mb-3';
            
            const select = document.createElement('select');
            select.className = 'form-select'; // Classe Bootstrap pour les selects
            
            // Les genres sont deja tries dans loadAllGenres()
            

            select.innerHTML = `
                <option value="">Selectionnez un genre</option>
                ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
            `;
            

            select.addEventListener('change', async (e) => {
                if (e.target.value) {
                    // Construction de la nouvelle URL avec le genre selectionne
                    const newEndpoint = `http://localhost:8000/api/v1/titles/?genre=${e.target.value}&sort_by=-imdb_score&page_size=${ResponsiveUtils.getPageSize()}`;

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

        console.error(`Erreur lors du chargement de la section ${sectionClass}:`, error);
        
        // Interface gracieuse en cas d'erreur avec plus de details
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
            <p><em>Verifiez que l'API OCMovies-API fonctionne</em></p>
        `;
        movieSection.appendChild(errorDiv);
    }
}

/**
 * Ouverture de la fenetre modale
 */
function openModal(movieId) {

    if (!movieId) {
        console.error('Tentative d\'ouverture de modal sans ID de film');
        return;
    }
    

    

    window.location.href = `modalWindows.html?id=${movieId}`;
}




/**
 * Initialisation de l'application
 */



async function initializePage() {
    // Utilisation du gestionnaire d'initialisation centralise
    const initializer = new window.AppInitializer();
    await initializer.initialize();
}

/**
 * Gestion du responsive
 */
window.addEventListener('resize', () => {

    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;

        initializePage(); // Rechargement complet avec nouveaux breakpoints
    }, 250); // Delai de 250ms apres la fin du redimensionnement
});

/**
 * Initialisation au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    const sections = ['.bestFilm', '.bestRatedFilms', '.category1', '.category2', '.otherFilms'];
    sections.forEach(sectionClass => {
        const element = document.querySelector(sectionClass);
        if (!element) {
            console.error(`ERREUR ${sectionClass} NON TROUVE`);
        }
    });
    
    initializePage();
});