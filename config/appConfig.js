/**
 * CONFIGURATION APPLICATION
 * Centralisation de toutes les constantes et configurations
 * Fichier de configuration principale de l'application JustStreamIt
 */

/**
 * Configuration des sections de films
 * Definit toutes les sections affichees sur la page d'accueil
 * Chaque section a un titre, un endpoint API, une classe CSS et une identification
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
 * Centralise tous les messages affiches dans la console pour le debogage
 * Organise les messages par type (chargement, succes, modes d'affichage)
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
 * Configuration des breakpoints responsive
 * Seuils de largeur d'ecran pour determiner le type d'appareil
 */
const RESPONSIVE_BREAKPOINTS = {
    mobile: 768,  // Seuil mobile/tablette
    tablet: 992   // Seuil tablette/desktop
};

/**
 * Utilitaires de configuration
 * Objet principal qui expose toutes les fonctions utilitaires de configuration
 */
const AppConfig = {
    /**
     * Genere l'URL complete pour un endpoint
     * Construit l'URL finale en ajoutant la base URL et le parametre page_size
     * @param {string} endpoint - Endpoint relatif de l'API (ex: '/titles/?sort_by=-imdb_score')
     * @param {number} pageSize - Nombre de films par page selon l'ecran
     * @returns {string} URL complete prete pour fetch (ex: 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6')
     */
    buildApiUrl(endpoint, pageSize) {
        const baseUrl = 'http://localhost:8000/api/v1';
        const separator = endpoint.includes('?') ? '&' : '?';
        return `${baseUrl}${endpoint}${separator}page_size=${pageSize}`;
    },

    /**
     * Determine le mode d'affichage actuel
     * Identifie le type d'appareil selon la largeur d'ecran actuelle
     * @returns {string} Mode d'affichage ('PC', 'Tablette', ou 'Mobile')
     */
    getCurrentDisplayMode() {
        const width = window.innerWidth;
        if (width >= RESPONSIVE_BREAKPOINTS.tablet) return APP_MESSAGES.modes.pc;
        if (width >= RESPONSIVE_BREAKPOINTS.mobile) return APP_MESSAGES.modes.tablet;
        return APP_MESSAGES.modes.mobile;
    },

    /**
     * Retourne toutes les sections configurees
     * Donne acces a la configuration complete des sections de films
     * @returns {Object} Objet contenant toutes les sections (bestRated, action, mystery, adventure)
     */
    getFilmSections() {
        return FILM_SECTIONS;
    },

    /**
     * Retourne les messages de l'application
     * Donne acces a tous les messages de debogage et d'information
     * @returns {Object} Objet contenant les messages organises par type
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