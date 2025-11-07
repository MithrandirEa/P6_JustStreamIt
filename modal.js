async function loadMovieDetails(movieId) {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/titles/${movieId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du film');
        }
        const movie = await response.json();
        console.log('Données du film:', movie);
        
        // Mettre à jour les titres (desktop et mobile)
        const titleSections = document.querySelectorAll('.film-title-section');
        titleSections.forEach(section => {
            section.innerHTML = `<h1>${movie.title}</h1>`;
        });
        
        // Mettre à jour les détails (desktop et mobile)
        const detailsSections = document.querySelectorAll('.film-details-section');
        detailsSections.forEach(section => {
            section.innerHTML = `
                <p><strong>${movie.year} -</strong> ${movie.genres.join(', ')}, ${movie.rated || 'Non classé'}</p>
                <p><strong>PG-13 -</strong> ${movie.duration} minutes (${movie.countries.join(' / ')})</p>
                <p><strong>IMDB score :</strong> ${movie.imdb_score}/10</p>
                <p><strong>Recettes au box office :</strong> ${movie.worldwide_gross_income ? new Intl.NumberFormat('fr-FR').format(movie.worldwide_gross_income) + '$' : 'Non disponible'}</p>
            `;
        });
        
        // Mettre à jour les sections réalisateur (desktop et mobile)
        const directorSections = document.querySelectorAll('.film-director-section');
        directorSections.forEach(section => {
            section.innerHTML = `
                <p><strong>Réalisé par :</strong></p>
                <p>${movie.directors.join(', ')}</p>
            `;
        });

        // Mettre à jour les images du poster (desktop et mobile)
        const posters = document.querySelectorAll('.poster img');
        posters.forEach(poster => {
            poster.src = movie.image_url;
            poster.alt = `Poster de ${movie.title}`;
            poster.title = movie.title;
            // Appliquer la bonne classe selon le contexte
            if (poster.closest('.modal-mobile')) {
                poster.className = 'modal-poster mobile-poster';
            } else {
                poster.className = 'modal-poster';
            }
        });
        console.log('URL du poster:', movie.image_url);

        // Mettre à jour les résumés (desktop et mobile)
        const summaries = document.querySelectorAll('.summarized');
        summaries.forEach(summary => {
            summary.innerHTML = `<p>${movie.long_description || movie.description}</p>`;
        });

        // Mettre à jour les sections acteurs (desktop et mobile)
        const actorsSections = document.querySelectorAll('.actors_section');
        actorsSections.forEach(section => {
            section.innerHTML = `
                <p>Avec : <br> 
                <span class="actors_names">${movie.actors.join(', ')}</span></p>
            `;
        });
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
        // Afficher un message d'erreur dans l'interface
        const titleSection = document.querySelector('.film-title-section');
        if (titleSection) {
            titleSection.innerHTML = '<h1>Erreur : Aucun film spécifié</h1>';
        }
    }
});