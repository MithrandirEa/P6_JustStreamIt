async function loadBestMovie() {
    try {
        const response = await fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1');
        const data = await response.json();
        const movie = data.results[0];

        const bestFilmSection = document.querySelector('.bestFilm');
        const content = `
            <h1>Meilleur film</h1>
            <div class="best-movie-content">
                <img src="${movie.image_url}" alt="Poster de ${movie.title}" class="best-movie-poster">
                <div class="best-movie-info">
                    <h2>${movie.title}</h2>
                    <p class="movie-description">${movie.description}</p>
                    <button class="play-button">Détails</button>
                </div>
            </div>
        `;
        bestFilmSection.innerHTML = content;
        
        // Ajouter les event listeners après avoir mis à jour le HTML
        const poster = bestFilmSection.querySelector('.best-movie-poster');
        const button = bestFilmSection.querySelector('.play-button');
        
        const handleBestMovieClick = (event) => {
            event.preventDefault();
            console.log(`Clic sur le meilleur film: ${movie.title} (ID: ${movie.id})`);
            openModal(movie.id);
        };

        if (poster) {
            poster.addEventListener('click', handleBestMovieClick);
        }
        if (button) {
            button.addEventListener('click', handleBestMovieClick);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du meilleur film:', error);
    }
}



async function loadAllGenres() {
    let allGenres = [];
    let nextUrl = 'http://localhost:8000/api/v1/genres/';
    
    while (nextUrl) {
        try {
            const response = await fetch(nextUrl);
            const data = await response.json();
            allGenres = allGenres.concat(data.results);
            nextUrl = data.next;
        } catch (error) {
            console.error('Erreur lors du chargement des genres:', error);
            break;
        }
    }
    
    return allGenres;
}

async function loadMovieSection(endpoint, sectionClass) {
    try {
        console.log(`Chargement de la section ${sectionClass} depuis ${endpoint}`);
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(`Données reçues pour ${sectionClass}:`, data);
        const movies = data.results;
        
        // Filtrer les films qui n'ont pas d'image
        const validMovies = movies.filter(movie => {
            if (!movie.image_url) {
                console.log(`Film sans image ignoré:`, movie);
                return false;
            }
            return true;
        });

        const section = document.querySelector(`.${sectionClass}`);
        const movieList = document.createElement('div');
        movieList.className = 'movie-list';

        validMovies.forEach(movie => {
            console.log(`Création de la carte pour le film:`, movie);
            // Créer la carte uniquement si nous avons une URL d'image valide
            if (!movie.image_url) {
                console.log(`Image manquante pour le film:`, movie);
                return;
            }

            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.dataset.movieId = movie.id; // Stocker l'ID du film dans l'élément
            
            const img = document.createElement('img');
            img.src = movie.image_url;
            img.alt = `Poster de ${movie.title}`;
            img.addEventListener('error', () => {
                console.log(`Erreur de chargement de l'image pour le film:`, movie);
            });

            const titleDiv = document.createElement('div');
            titleDiv.className = 'movie-title';
            titleDiv.textContent = movie.title;

            movieCard.appendChild(img);
            movieCard.appendChild(titleDiv);

            // Gestionnaire d'événements avec vérification
            const handleClick = (event) => {
                event.preventDefault();
                console.log(`Clic sur le film: ${movie.title} (ID: ${movie.id})`);
                openModal(movie.id);
            };

            movieCard.addEventListener('click', handleClick);
            movieList.appendChild(movieCard);
        });

        // Vérifions si nous avons assez de films valides
        if (validMovies.length < getPageSize()) {
            // Si nous n'avons pas assez de films, chargeons la page suivante
            if (data.next) {
                console.log(`Chargement de films supplémentaires depuis: ${data.next}`);
                const nextResponse = await fetch(data.next);
                const nextData = await nextResponse.json();
                const nextMovies = nextData.results.filter(movie => movie.image_url);
                validMovies.push(...nextMovies.slice(0, getPageSize() - validMovies.length));
            }
        }

        // Créer le conteneur du carrousel
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';
        
        // Gardons le titre h1 et remplaçons le reste
        const title = section.querySelector('h1');
        section.innerHTML = '';
        section.appendChild(title);

        // Si c'est la section "Autres films", ajouter la liste déroulante des genres
        if (sectionClass === 'otherFilms') {
            const genres = await loadAllGenres();
            const select = document.createElement('select');
            select.className = 'genre-select';
            
            // Trier les genres par ordre alphabétique
            genres.sort((a, b) => a.name.localeCompare(b.name));
            
            select.innerHTML = `
                <option value="">Sélectionnez un genre</option>
                ${genres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('')}
            `;
            
            select.addEventListener('change', async (e) => {
                if (e.target.value) {
                    const newEndpoint = `http://localhost:8000/api/v1/titles/?genre=${e.target.value}&sort_by=-imdb_score&page_size=${getPageSize()}`;
                    await loadMovieSection(newEndpoint, sectionClass);
                }
            });
            
            section.appendChild(select);
        }
        
        section.appendChild(movieList);
    } catch (error) {
        console.error(`Erreur lors du chargement de la section ${sectionClass}:`, error);
    }
}

function openModal(movieId) {
    if (!movieId) {
        console.error('Tentative d\'ouverture de modal sans ID de film');
        return;
    }
    console.log(`Ouverture de la modal pour le film ID: ${movieId}`);
    window.location.href = `modalWindows.html?id=${movieId}`;
}

function getPageSize() {
    // Retourne la taille de page appropriée en fonction de la largeur de l'écran
    if (window.innerWidth >= 1024) return 6; // Desktop
    if (window.innerWidth >= 768) return 4;  // Tablet
    return 2; // Mobile
}

async function initializePage() {
    const pageSize = getPageSize();
    
    // Chargement du meilleur film
    await loadBestMovie();
    
    // Chargement des films les mieux notés
    await loadMovieSection(
        `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${pageSize}`,
        'bestRatedFilms'
    );
    
    // Chargement de la catégorie Action
    await loadMovieSection(
        `http://localhost:8000/api/v1/titles/?genre=action&sort_by=-imdb_score&page_size=${pageSize}`,
        'category1'
    );
    
    // Chargement de la catégorie Fantasy
    await loadMovieSection(
        `http://localhost:8000/api/v1/titles/?genre=fantasy&sort_by=-imdb_score&page_size=${pageSize}`,
        'category2'
    );
    
    // Pour la section "Autres films", nous pouvons utiliser un genre différent, par exemple "Adventure"
    await loadMovieSection(
        `http://localhost:8000/api/v1/titles/?genre=adventure&sort_by=-imdb_score&page_size=${pageSize}`,
        'otherFilms'
    );
}

// Gestion du responsive
window.addEventListener('resize', () => {
    // Recharger la page avec le nouveau nombre d'éléments si la taille de l'écran change significativement
    initializePage();
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializePage);