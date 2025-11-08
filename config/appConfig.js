/**
 * 🔧 CONFIGURATION APPLICATION
 * Centralisation de toutes les constantes et configurations
 */

/**
 * Configuration des sections de films
 */
const FILM_SECTIONS = {
    bestRated: {
        title: 'Films les mieux notés',
        endpoint: '/titles/?sort_by=-imdb_score',
        sectionClass: 'bestRatedFilms',
        emoji: '🎭'
    },
    action: {
        title: 'Films d\'action',
        endpoint: '/titles/?genre=action&sort_by=-imdb_score',
        sectionClass: 'category1',
        emoji: '🎯'
    },
    mystery: {
        title: 'Films mystery', 
        endpoint: '/titles/?genre=mystery&sort_by=-imdb_score',
        sectionClass: 'category2',
        emoji: '🏰'
    },
    adventure: {
        title: 'Autres films',
        endpoint: '/titles/?genre=adventure&sort_by=-imdb_score',
        sectionClass: 'otherFilms',
        emoji: '🌟'
    }
};

/**
 * Messages de l'application
 */
const APP_MESSAGES = {
    loading: {
        bestMovie: '🎬 Chargement du meilleur film...',
        section: (emoji, title) => `${emoji} Chargement des ${title.toLowerCase()}...`,
        initialization: '🚀 Démarrage du chargement des sections...'
    },
    success: {
        bestMovie: '✅ Meilleur film chargé',
        section: (title) => `✅ ${title} chargés`,
        initialization: '🎉 Initialisation terminée avec succès'
    },
    modes: {
        pc: 'PC',
        tablet: 'Tablette', 
        mobile: 'Mobile'
    }
};

/**
 * Configuration des breakpoints responsive
 */
const RESPONSIVE_BREAKPOINTS = {
    mobile: 768,
    tablet: 992
};

/**
 * Utilitaires de configuration
 */
const AppConfig = {
    /**
     * Génère l'URL complète pour un endpoint
     * @param {string} endpoint - Endpoint de l'API
     * @param {number} pageSize - Nombre de films par page
     * @returns {string} URL complète
     */
    buildApiUrl(endpoint, pageSize) {
        const baseUrl = 'http://localhost:8000/api/v1';
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${baseUrl}${endpoint}${separator}page_size=${pageSize}`;
    },

    /**
     * Détermine le mode d'affichage actuel
     * @returns {string} Mode d'affichage (PC, Tablette, Mobile)
     */
    getCurrentDisplayMode() {
        const width = window.innerWidth;
        if (width >= RESPONSIVE_BREAKPOINTS.tablet) return APP_MESSAGES.modes.pc;
        if (width >= RESPONSIVE_BREAKPOINTS.mobile) return APP_MESSAGES.modes.tablet;
        return APP_MESSAGES.modes.mobile;
    },

    /**
     * Retourne toutes les sections configurées
     * @returns {Object} Sections de films
     */
    getFilmSections() {
        return FILM_SECTIONS;
    },

    /**
     * Retourne les messages de l'application
     * @returns {Object} Messages
     */
    getMessages() {
        return APP_MESSAGES;
    }
};

// Export pour utilisation dans script.js
if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
    window.FILM_SECTIONS = FILM_SECTIONS;
    window.APP_MESSAGES = APP_MESSAGES;
}