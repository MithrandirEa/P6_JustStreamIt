// Configuration

const API_URL = 'http://localhost:8000/api/v1';
const PAGE_SIZE = 6;

const CATEGORIES = [
    { id: 'bestRatedFilms', title: 'Films les mieux notés', query: 'sort_by=-imdb_score' },
    { id: 'category1', title: 'Action', query: 'genre=action&sort_by=-imdb_score' },
    { id: 'category2', title: 'Mystery', query: 'genre=mystery&sort_by=-imdb_score' },
    { id: 'otherFilms', title: 'Autres:', query: 'genre=adventure&sort_by=-imdb_score', isOther: true }
];

document.addEventListener('DOMContentLoaded', init);


async function init() {
    console.log('Démarrage de JustStreamIt...');
    try {
        await loadBestMovie();
        for (const category of CATEGORIES) {
            await loadCategory(category);
        }
        setupOtherCategorySelector();
    } catch (error) {
        console.error('Problème de démarrage :', error);
    }
}

// fecht JSON pour simplifier les appels API
async function fetchJSON(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return await response.json();
}

// section "Best Movie"
async function loadBestMovie() {

    const data = await fetchJSON(`/titles/?sort_by=-imdb_score&page_size=10`);
    const movies = data.results;
    
    // Tri des meilleurs films et sélection aléatoire
    const bestScore = Math.max(...movies.map(movie => parseFloat(movie.imdb_score)));
    const bestMovies = movies.filter(movie => parseFloat(movie.imdb_score) === bestScore);
    const bestMovie = bestMovies[Math.floor(Math.random() * bestMovies.length)];

    const fullData = await fetchJSON(`/titles/${bestMovie.id}`);
    const description = fullData.long_description || fullData.description || 'Pas de description disponible.';

    const section = document.querySelector('.bestFilm');
    section.innerHTML = `
        <h1>Meilleur film</h1>
        <div class="best-movie-container">
            <div class="best-movie-poster-container">
                <img src="${bestMovie.image_url}" alt="${bestMovie.title}" class="best-movie-poster" data-id="${bestMovie.id}">
            </div>
            <div class="best-movie-info">
                <div>
                    <div class="movie-title">${bestMovie.title}</div>
                    <p class="movie-description">${description}</p>
                </div>
                <button class="btn-details" data-id="${bestMovie.id}">Détails</button>
            </div>
        </div>
    `;

    section.querySelectorAll('[data-id]').forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(event.target.dataset.id);
        });
    });
}

async function loadCategory(category) {
    const section = document.querySelector(`.${category.id}`);
    if (!section) return;

    const url = `/titles/?${category.query}&page_size=${PAGE_SIZE}`;
    
    try {
        const data = await fetchJSON(url);

        let movies = data.results.filter(movie => movie.image_url);

        section.innerHTML = '';
        
        const h1 = document.createElement('h1');
        h1.textContent = category.title;
        
        if (category.isOther) {
             const titleContainer = document.createElement('div');
             titleContainer.className = 'd-flex align-items-center mb-3 gap-4';
             
             h1.classList.add('mb-0');
             titleContainer.appendChild(h1);
             
             const selectorContainer = document.createElement('div');
             selectorContainer.className = 'genre-selector';
             titleContainer.appendChild(selectorContainer);
             section.appendChild(titleContainer);
        } else {
             section.appendChild(h1);
        }

        const grid = document.createElement('div');
        grid.className = 'row gx-4 gy-4 movie-grid';
        
        movies.forEach(movie => {
            const col = document.createElement('div');
            
            col.className = 'col-6 col-md-6 col-lg-4'; 
            col.innerHTML = `
                <div class="movie-card-original" data-id="${movie.id}" style="cursor: pointer;">
                    <img src="${movie.image_url}" class="movie-poster w-100 h-100" alt="${movie.title}" style="object-fit: cover;">
                    <div class="movie-title-overlay">
                        <span class="movie-title-text">${movie.title}</span>
                         <button class="movie-details-btn">Détails</button>
                    </div>
                </div>
            `;
            col.querySelector('.movie-card-original').addEventListener('click', () => openModal(movie.id));
            grid.appendChild(col);
        });
        
        section.appendChild(grid);

        const seeMoreBtn = document.createElement('button');
        seeMoreBtn.className = 'btn-details btn-see-more';
        seeMoreBtn.textContent = 'Voir plus';
        
        const seeLessBtn = document.createElement('button');
        seeLessBtn.className = 'btn-details btn-see-more';
        seeLessBtn.textContent = 'Voir moins';
        seeLessBtn.style.display = 'none';

        seeMoreBtn.onclick = () => {
            grid.classList.add('expanded');
            seeMoreBtn.style.display = 'none';
            seeLessBtn.style.display = 'block';
        };

        seeLessBtn.onclick = () => {
            grid.classList.remove('expanded');
            seeLessBtn.style.display = 'none';
            seeMoreBtn.style.display = null; 
        };

        if (movies.length > 2) {
            section.appendChild(seeMoreBtn);
            section.appendChild(seeLessBtn);
        }

    } catch (error) {
        console.error(`Impossible de charger la catégorie ${category.title}`, error);
        section.innerHTML += `<p class="text-danger">Erreur de chargement des films</p>`;
    }
}

// systeme de cache des genres
let genresCache = [];

async function setupOtherCategorySelector(activeGenre = null) {
    const section = document.querySelector('.otherFilms');
    if (!section) return;

    let container = section.querySelector('.genre-selector');
    if (!container) return;

    if (genresCache.length === 0) {
        try {
            let nextUrl = '/genres/?page_size=50'; 
            while (nextUrl) {
                const data = await fetchJSON(nextUrl.replace(API_URL, ''));
                genresCache = [...genresCache, ...data.results];
                nextUrl = data.next;
                if (genresCache.length > 50) break; // 25 genres dans l'API
            }
            genresCache.sort((genreA, genreB) => genreA.name.localeCompare(genreB.name));
        } catch (error) {
            console.warn('Erreur chargement genres', error);
            return;
        }
    }

    const select = document.createElement('select');
    select.className = 'form-select w-auto fw-bold border-dark rounded-0'; 
    select.style.minWidth = '200px';
    
    let options = `<option value="">Catégories</option>`;
    options += genresCache.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('');
    
    select.innerHTML = options;

    if (activeGenre) {
        select.value = activeGenre;
    }

    select.addEventListener('change', (event) => {
        const genre = event.target.value;
        if (genre) {
            loadCategory({ 
                id: 'otherFilms', 
                title: 'Autres:', 
                query: `genre=${genre}&sort_by=-imdb_score`, 
                isOther: true 
            }).then(() => {
                setupOtherCategorySelector(genre);
            });
        }
    });
    
    container.innerHTML = '';
    container.appendChild(select);
}

async function openModal(movieId) {
    const modalEl = document.getElementById('movieModal');
    const modal = new bootstrap.Modal(modalEl);
    
    // reset du contenu
    document.getElementById('modalTitle').textContent = 'Chargement...';
    document.getElementById('modalBodyContent').innerHTML = '<div class="spinner-border" role="status"></div>';
    document.getElementById('modalPoster').src = '';
    
    modal.show();

    try {
        const movie = await fetchJSON(`/titles/${movieId}`);
        
        // Remplissage des données
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalPoster').src = movie.image_url;
        document.getElementById('modalBodyContent').innerHTML = `
            <p>
                <strong>${movie.year} - ${movie.genres.join(', ')}</strong><br>
                ${movie.rated} - ${movie.duration} minutes (${movie.countries.join(' / ')})<br>
                IMDB score: ${movie.imdb_score}/10
            </p>
            
            <p class="mb-3">
                <strong>Réalisé par:</strong><br>
                ${movie.directors.join(', ')}
            </p>
            
            <p class="mb-3 text-justify">
               ${movie.long_description || movie.description}
            </p>
            
            <p>
                <strong>Avec:</strong><br>
                ${movie.actors.join(', ')}
            </p>
        `;
        
        // box office si dispo
        if (movie.worldwide_gross_income) {
             const bo = new Intl.NumberFormat('fr-FR').format(movie.worldwide_gross_income) + '$';
             document.getElementById('modalBodyContent').innerHTML += `<p><strong>Box Office:</strong> ${bo}</p>`;
        }

    } catch (error) {
        document.getElementById('modalBodyContent').innerHTML = `<div class="alert alert-danger">Erreur: ${error.message}</div>`;
    }
}
