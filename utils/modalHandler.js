/**
 * MODAL HANDLER
 * Gestionnaire pour l'affichage des détails de films dans les modales
 * Utilise apiService et modalTemplate pour une architecture propre
 */

/**
 * Classe pour gérer l'affichage des modales de films
 * Coordonne l'appel API, la génération de templates et la mise à jour du DOM
 */
class ModalHandler {
    constructor() {
        this.movieId = null;
        this.movie = null;
    }

    /**
     * Récupère l'ID du film depuis l'URL
     * @returns {string|null} ID du film ou null si absent
     */
    getMovieIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    /**
     * Met à jour toutes les sections titre (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updateTitleSections(movie) {
        const titleSections = document.querySelectorAll('.film-title-section');
        const titleHTML = window.ModalTemplate.generateTitleSection(movie);
        
        titleSections.forEach(section => {
            section.innerHTML = titleHTML;
        });
    }

    /**
     * Met à jour toutes les sections détails (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updateDetailsSections(movie) {
        const detailsSections = document.querySelectorAll('.film-details-section');
        const detailsHTML = window.ModalTemplate.generateDetailsSection(movie);
        
        detailsSections.forEach(section => {
            section.innerHTML = detailsHTML;
        });
    }

    /**
     * Met à jour toutes les sections réalisateur (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updateDirectorSections(movie) {
        const directorSections = document.querySelectorAll('.film-director-section');
        const directorHTML = window.ModalTemplate.generateDirectorSection(movie);
        
        directorSections.forEach(section => {
            section.innerHTML = directorHTML;
        });
    }

    /**
     * Met à jour toutes les images de poster (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updatePosterImages(movie) {
        const posters = document.querySelectorAll('.poster img');
        
        posters.forEach(poster => {
            const isMobile = poster.closest('.modal-mobile') !== null;
            window.ModalTemplate.configurePosterImage(poster, movie, isMobile);
        });
    }

    /**
     * Met à jour toutes les sections résumé (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updateSummarySections(movie) {
        const summaries = document.querySelectorAll('.summarized');
        const summaryHTML = window.ModalTemplate.generateSummarySection(movie);
        
        summaries.forEach(summary => {
            summary.innerHTML = summaryHTML;
        });
    }

    /**
     * Met à jour toutes les sections acteurs (desktop et mobile)
     * @param {Object} movie - Données du film
     */
    updateActorsSections(movie) {
        const actorsSections = document.querySelectorAll('.actors_section');
        const actorsHTML = window.ModalTemplate.generateActorsSection(movie);
        
        actorsSections.forEach(section => {
            section.innerHTML = actorsHTML;
        });
    }

    /**
     * Met à jour tout le contenu de la modale avec les données du film
     * @param {Object} movie - Données complètes du film
     */
    updateModalContent(movie) {
        this.updateTitleSections(movie);
        this.updateDetailsSections(movie);
        this.updateDirectorSections(movie);
        this.updatePosterImages(movie);
        this.updateSummarySections(movie);
        this.updateActorsSections(movie);
    }

    /**
     * Affiche une erreur dans la modale
     * @param {Error} error - Erreur à afficher
     */
    displayError(error) {
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = window.ModalTemplate.generateError(error);
        }
    }

    /**
     * Charge et affiche les détails d'un film
     * @param {string} movieId - ID du film à charger
     */
    async loadMovieDetails(movieId) {
        try {
            // Utilisation du service API centralisé (pas de fetch direct)
            const movie = await window.ApiService.getMovieDetails(movieId);
            
            this.movie = movie;
            this.updateModalContent(movie);
            
        } catch (error) {
            console.error('Erreur lors du chargement des détails du film:', error);
            this.displayError(error);
        }
    }

    /**
     * Affiche un message d'erreur pour ID manquant
     */
    displayNoIdError() {
        const titleSection = document.querySelector('.film-title-section');
        if (titleSection) {
            titleSection.innerHTML = '<h1>Erreur : Aucun film spécifié</h1>';
        }
    }

    /**
     * Initialise la modale au chargement de la page
     * Point d'entrée principal appelé par le DOMContentLoaded
     */
    async initialize() {
        this.movieId = this.getMovieIdFromUrl();
        
        if (this.movieId) {
            await this.loadMovieDetails(this.movieId);
        } else {
            console.error('Aucun ID de film fourni dans l\'URL');
            this.displayNoIdError();
        }
    }
}

// Export pour utilisation via l'objet window
if (typeof window !== 'undefined') {
    window.ModalHandler = ModalHandler;
}