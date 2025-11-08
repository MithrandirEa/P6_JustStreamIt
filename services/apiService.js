/**
 * 🌐 API SERVICE
 * Service centralisé pour tous les appels API vers JustStreamIt
 */

/**
 * Configuration de l'API
 */
const API_CONFIG = {
    baseUrl: 'http://localhost:8000/api/v1',
    timeout: 10000,
    defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

/**
 * Service API principal
 */
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
        this.cache = new Map();
    }

    /**
     * Effectue un appel API générique avec gestion d'erreurs
     * @param {string} endpoint - URL relative ou absolue
     * @param {Object} options - Options fetch
     * @returns {Promise<Object>} Données JSON
     */
    async fetchApi(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        
        const fetchOptions = {
            ...options,
            headers: {
                ...API_CONFIG.defaultHeaders,
                ...options.headers
            }
        };

        try {
            console.log('API Call:', url);
            const response = await fetch(url, fetchOptions);
            
            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Data:', data);
            return data;

        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Teste la connexion à l'API
     * @returns {Promise<boolean>} true si connecté
     */
    async testConnection() {
        try {
            console.log('Test de connexion à l\'API...');
            await this.fetchApi('/titles/?page_size=1');
            console.log('✅ Connexion API réussie');
            return true;
        } catch (error) {
            console.error('❌ Échec connexion API:', error);
            return false;
        }
    }

    /**
     * Récupère les meilleurs films pour sélectionner le top
     * @param {number} pageSize - Nombre de films à récupérer
     * @returns {Promise<Array>} Liste des films
     */
    async getBestMovies(pageSize = 10) {
        const cacheKey = `best_movies_${pageSize}`;
        
        if (this.cache.has(cacheKey)) {
            console.log('Cache hit for best movies');
            return this.cache.get(cacheKey);
        }

        try {
            const data = await this.fetchApi(`/titles/?sort_by=-imdb_score&page_size=${pageSize}`);
            const movies = data.results || [];
            
            this.cache.set(cacheKey, movies);
            return movies;
        } catch (error) {
            console.error('Erreur récupération meilleurs films:', error);
            throw error;
        }
    }

    /**
     * Récupère les détails complets d'un film
     * @param {number|string} movieId - ID du film
     * @returns {Promise<Object>} Détails du film
     */
    async getMovieDetails(movieId) {
        const cacheKey = `movie_${movieId}`;
        
        if (this.cache.has(cacheKey)) {
            console.log(`Cache hit for movie ${movieId}`);
            return this.cache.get(cacheKey);
        }

        try {
            const movie = await this.fetchApi(`/titles/${movieId}`);
            this.cache.set(cacheKey, movie);
            return movie;
        } catch (error) {
            console.error(`Erreur récupération film ${movieId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère tous les genres disponibles
     * @returns {Promise<Array>} Liste des genres
     */
    async getAllGenres() {
        const cacheKey = 'all_genres';
        
        if (this.cache.has(cacheKey)) {
            console.log('Cache hit for genres');
            return this.cache.get(cacheKey);
        }

        try {
            const genres = [];
            let nextUrl = `${this.baseUrl}/genres/`;

            while (nextUrl) {
                const data = await this.fetchApi(nextUrl);
                genres.push(...(data.results || []));
                nextUrl = data.next;
                
                console.log(`Genres récupérés: ${genres.length}, prochaine URL: ${nextUrl}`);
            }

            this.cache.set(cacheKey, genres);
            return genres;
        } catch (error) {
            console.error('Erreur récupération genres:', error);
            throw error;
        }
    }

    /**
     * Récupère les films d'une section (genre, top rated, etc.)
     * @param {string} endpoint - URL complète de l'endpoint
     * @returns {Promise<Object>} Données avec films et pagination
     */
    async getMovieSection(endpoint) {
        try {
            const data = await this.fetchApi(endpoint);
            return data;
        } catch (error) {
            console.error('Erreur récupération section:', error);
            throw error;
        }
    }

    /**
     * Récupère des films par genre
     * @param {string} genre - Nom du genre
     * @param {number} pageSize - Nombre de films
     * @returns {Promise<Array>} Liste des films
     */
    async getMoviesByGenre(genre, pageSize = 7) {
        const cacheKey = `genre_${genre}_${pageSize}`;
        
        if (this.cache.has(cacheKey)) {
            console.log(`Cache hit for genre ${genre}`);
            return this.cache.get(cacheKey);
        }

        try {
            const data = await this.fetchApi(`/titles/?genre=${encodeURIComponent(genre)}&sort_by=-imdb_score&page_size=${pageSize}`);
            const movies = data.results || [];
            
            this.cache.set(cacheKey, movies);
            return movies;
        } catch (error) {
            console.error(`Erreur récupération films ${genre}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les films les mieux notés
     * @param {number} pageSize - Nombre de films
     * @returns {Promise<Array>} Liste des films
     */
    async getTopRatedMovies(pageSize = 7) {
        const cacheKey = `top_rated_${pageSize}`;
        
        if (this.cache.has(cacheKey)) {
            console.log('Cache hit for top rated movies');
            return this.cache.get(cacheKey);
        }

        try {
            const data = await this.fetchApi(`/titles/?sort_by=-imdb_score&page_size=${pageSize}`);
            const movies = data.results || [];
            
            this.cache.set(cacheKey, movies);
            return movies;
        } catch (error) {
            console.error('Erreur récupération films top rated:', error);
            throw error;
        }
    }

    /**
     * Construit une URL pour un endpoint avec paramètres
     * @param {string} path - Chemin de l'endpoint
     * @param {Object} params - Paramètres de requête
     * @returns {string} URL complète
     */
    buildUrl(path, params = {}) {
        const url = new URL(path, this.baseUrl);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });

        return url.toString();
    }

    /**
     * Vide le cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache API vidé');
    }

    /**
     * Obtient les statistiques du cache
     * @returns {Object} Stats du cache
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Instance singleton
const apiService = new ApiService();

// Export pour utilisation dans script.js
if (typeof window !== 'undefined') {
    window.ApiService = {
        getInstance: () => apiService,
        testConnection: () => apiService.testConnection(),
        getBestMovies: (pageSize) => apiService.getBestMovies(pageSize),
        getMovieDetails: (movieId) => apiService.getMovieDetails(movieId),
        getAllGenres: () => apiService.getAllGenres(),
        getMovieSection: (endpoint) => apiService.getMovieSection(endpoint),
        getMoviesByGenre: (genre, pageSize) => apiService.getMoviesByGenre(genre, pageSize),
        getTopRatedMovies: (pageSize) => apiService.getTopRatedMovies(pageSize),
        buildUrl: (path, params) => apiService.buildUrl(path, params),
        clearCache: () => apiService.clearCache(),
        getCacheStats: () => apiService.getCacheStats()
    };
}