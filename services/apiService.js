/**
 * API SERVICE
 * Service centralisé pour les appels API vers JustStreamIt
 */

/**
 * Configuration de l'API
 * Paramètres de connexion à l'API JustStreamIt
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
 * Singleton pour la gestion des appels API
 * - Cache des requêtes pour optimisation
 * - Gestion d'erreurs centralisée
 * - Construction automatique des URLs
 * - Pagination automatique
 */
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
        this.cache = new Map(); // Cache en memoire pour eviter les appels redondants
    }

    /**
     * Effectue un appel API avec gestion d'erreurs
     * @param {string} endpoint - URL de l'API
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
     * @returns {Promise<boolean>} true si accessible
     */
    async testConnection() {
        try {
            console.log('Test de connexion a l\'API...');
            await this.fetchApi('/titles/?page_size=1');
            console.log('SUCCESS: Connexion API reussie');
            return true;
        } catch (error) {
            console.error('ERREUR: Echec connexion API:', error);
            return false;
        }
    }

    /**
     * Récupère les meilleurs films par score IMDb
     * @param {number} pageSize - Nombre de films (défaut: 10)
     * @returns {Promise<Array>} Films triés par score décroissant
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
            console.error('Erreur recuperation meilleurs films:', error);
            throw error;
        }
    }

    /**
     * Récupère les détails d'un film
     * @param {number|string} movieId - Identifiant du film
     * @returns {Promise<Object>} Détails complets du film
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
            console.error(`Erreur recuperation film ${movieId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère tous les genres disponibles (pagination automatique)
     * @returns {Promise<Array>} Liste des noms de genres
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
                
                console.log(`Genres recuperes: ${genres.length}, prochaine URL: ${nextUrl}`);
            }

            // Extraction des noms de genres
            const genreNames = genres.map(genre => genre.name);
            this.cache.set(cacheKey, genreNames);
            return genreNames;
        } catch (error) {
            console.error('Erreur recuperation genres:', error);
            throw error;
        }
    }

    /**
     * Récupère les films d'une section
     * @param {string} endpoint - URL de l'endpoint
     * @returns {Promise<Object>} Données avec pagination
     */
    async getMovieSection(endpoint) {
        try {
            const data = await this.fetchApi(endpoint);
            return data;
        } catch (error) {
            console.error('Erreur recuperation section:', error);
            throw error;
        }
    }

    /**
     * Récupère les films par genre
     * @param {string} genre - Nom du genre
     * @param {number} pageSize - Nombre de films (défaut: 7)
     * @returns {Promise<Array>} Films du genre triés par score
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
            console.error(`Erreur recuperation films ${genre}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les films les mieux notés
     * @param {number} pageSize - Nombre de films (défaut: 7)
     * @returns {Promise<Array>} Films triés par score
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
            console.error('Erreur recuperation films top rated:', error);
            throw error;
        }
    }

    /**
     * Construit une URL avec paramètres
     * @param {string} path - Chemin relatif
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
     * Vide le cache complètement
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache API vide');
    }

    /**
     * Obtient les statistiques du cache
     * @returns {Object} Taille et clés du cache
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

// Export pour utilisation dans script.js via l'objet window
// Permet d'acceder au service depuis n'importe quel fichier JavaScript
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