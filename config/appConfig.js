/**
 * CONFIGURATION APPLICATION
 * Centralisation des constantes et paramètres
 * Configuration principale de JustStreamIt
 */

/**
 * Configuration des sections de films
 * Définit les sections affichées sur la page d'accueil
 * @property {Object} bestRated - Films les mieux notés
 * @property {Object} action - Films d'action
 * @property {Object} mystery - Films mystery
 * @property {Object} adventure - Autres films
 */
const FILM_SECTIONS = {
    bestRated: {
        title: 'Films les mieux notes',
        endpoint: '/titles/?sort_by=-imdb_score',
        sectionClass: 'bestRatedFilms',
        emoji: 'TOP'
    },
    action: {
        title: 'Films d\'action',
        endpoint: '/titles/?genre=action&sort_by=-imdb_score',
        sectionClass: 'category1',
        emoji: 'ACTION'
    },
    mystery: {
        title: 'Films mystery', 
        endpoint: '/titles/?genre=mystery&sort_by=-imdb_score',
        sectionClass: 'category2',
        emoji: 'MYSTERY'
    },
    adventure: {
        title: 'Autres films',
        endpoint: '/titles/?genre=adventure&sort_by=-imdb_score',
        sectionClass: 'otherFilms',
        emoji: 'AUTRES'
    }
};

/**
 * Messages de l'application
 * Messages de débogage et d'information
 * @property {Object} loading - Messages de chargement
 * @property {Object} success - Messages de succès
 * @property {Object} modes - Modes d'affichage
 */
const APP_MESSAGES = {
    loading: {
        bestMovie: 'LOADING: Chargement du meilleur film...',
        section: (emoji, title) => `${emoji} Chargement des ${title.toLowerCase()}...`,
        initialization: 'LOADING: Demarrage du chargement des sections...'
    },
    success: {
        bestMovie: 'SUCCESS: Meilleur film charge',
        section: (title) => `SUCCESS: ${title} charges`,
        initialization: 'SUCCESS: Initialisation terminee avec succes'
    },
    modes: {
        pc: 'PC',
        tablet: 'Tablette', 
        mobile: 'Mobile'
    }
};

/**
 * Breakpoints responsive
 * Seuils de largeur d'écran pour la détection du type d'appareil
 */
const RESPONSIVE_BREAKPOINTS = {
    mobile: 457,  // Seuil phone/tablette (correspond à --breakpoint-phone + 1)
    tablet: 789   // Seuil tablette/desktop (correspond à --breakpoint-desktop)
};

/**
 * Utilitaires de configuration
 * Expose les fonctions de configuration de l'application
 */
const AppConfig = {
    /**
     * Génère l'URL complète pour un endpoint
     * @param {string} endpoint - Endpoint relatif de l'API
     * @param {number} pageSize - Nombre de films par page
     * @returns {string} URL complète
     */
    buildApiUrl(endpoint, pageSize) {
        const baseUrl = 'http://localhost:8000/api/v1';
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${baseUrl}${endpoint}${separator}page_size=${pageSize}`;
    },

    /**
     * Retourne les sections configurées
     * @returns {Object} Configuration des sections
     */
    getFilmSections() {
        return FILM_SECTIONS;
    },

    /**
     * Retourne les messages de l'application
     * @returns {Object} Messages par type
     */
    getMessages() {
        return APP_MESSAGES;
    }
};

// Export pour utilisation dans script.js via l'objet window
// Expose la configuration pour tous les autres modules de l'application
if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
    window.FILM_SECTIONS = FILM_SECTIONS;
    window.APP_MESSAGES = APP_MESSAGES;
}