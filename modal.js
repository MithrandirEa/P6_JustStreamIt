async function loadMovieDetails(movieId) {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/titles/${movieId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du film');
        }
        const movie = await response.json();
        console.log('Données du film:', movie);
        
        // Mettre à jour les informations du film
        const filmInfo = document.querySelector('.filmInfo');
        filmInfo.innerHTML = `
            <h1>${movie.title}</h1>
            <p><strong>Année :</strong> ${movie.year}</p>
            <p><strong>Genres :</strong> ${movie.genres.join(', ')}</p>
            <p><strong>Classification :</strong> ${movie.rated}</p>
            <p><strong>Durée :</strong> ${movie.duration} minutes</p>
            <p><strong>Pays :</strong> ${movie.countries.join(', ')}</p>
            <p><strong>Score IMDb :</strong> ${movie.imdb_score}/10</p>
            <p><strong>Box Office :</strong> ${movie.worldwide_gross_income ? new Intl.NumberFormat('fr-FR').format(movie.worldwide_gross_income) + ' $' : 'Non disponible'}</p>
            <p><strong>Réalisateur :</strong> ${movie.directors.join(', ')}</p>
        `;

        // Mettre à jour l'image du poster
        const poster = document.querySelector('.poster img');
        poster.src = movie.image_url;
        poster.alt = `Poster de ${movie.title}`;
        poster.title = movie.title;
        console.log('URL du poster:', movie.image_url);

        // Mettre à jour le résumé
        const summary = document.querySelector('.summarized');
        summary.innerHTML = `<p>${movie.long_description || movie.description}</p>`;

        // Mettre à jour la section des acteurs
        const actorsSection = document.querySelector('.actors_section');
        actorsSection.innerHTML = `
            <p>Avec : <br> 
            <span class="actors_names">${movie.actors.join(', ')}</span></p>
        `;
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors du chargement des détails du film');
    }
}

// Récupérer l'ID du film depuis l'URL
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const movieId = getMovieIdFromUrl();
    if (movieId) {
        loadMovieDetails(movieId);
    } else {
        console.error('Aucun ID de film fourni');
    }
});