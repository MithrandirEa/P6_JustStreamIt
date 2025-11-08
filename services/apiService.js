/**
 * API SERVICE
 * Service centralise pour tous les appels API vers JustStreamIt
 */

/**
 * Configuration de l'API
 * Centralise tous les parametres de connexion a l'API JustStreamIt
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
 * Classe singleton qui gere tous les appels vers l'API JustStreamIt
 * Fonctionnalites principales :
 * - Cache des requetes pour optimiser les performances
 * - Gestion d'erreurs centralisee
 * - Construction automatique des URLs
 * - Pagination automatique pour les genres
 */
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
        this.cache = new Map(); // Cache en memoire pour eviter les appels redondants
    }

    /**
     * Effectue un appel API generique avec gestion d'erreurs
     * Methode de base utilisee par toutes les autres methodes de la classe
     * @param {string} endpoint - URL relative ou absolue vers l'API
     * @param {Object} options - Options fetch (headers, method, body, etc.)
     * @returns {Promise<Object>} Donnees JSON retournees par l'API
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
     * Teste la connexion a l'API
     * Effectue un appel minimal pour verifier que l'API repond correctement
     * @returns {Promise<boolean>} true si l'API est accessible, false sinon
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
     * Recupere les meilleurs films pour selectionner le top
     * Utilise le tri par score IMDb decroissant pour obtenir les meilleurs films
     * @param {number} pageSize - Nombre de films a recuperer (defaut: 10)
     * @returns {Promise<Array>} Liste des films tries par score IMDb decroissant
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
     * Recupere les details complets d'un film
     * Utilise l'endpoint /titles/{id} pour obtenir toutes les informations d'un film
     * @param {number|string} movieId - ID unique du film dans l'API
     * @returns {Promise<Object>} Objet contenant tous les details du film
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
     * Recupere tous les genres disponibles
     * L'API pagine les genres (5 par page), cette methode fait donc une boucle
     * pour recuperer tous les genres disponibles automatiquement
     * @returns {Promise<Array>} Liste complete des noms de genres (chaines de caracteres)
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

            // Extraire seulement les noms des genres pour le tri
            const genreNames = genres.map(genre => genre.name);
            this.cache.set(cacheKey, genreNames);
            return genreNames;
        } catch (error) {
            console.error('Erreur recuperation genres:', error);
            throw error;
        }
    }

    /**
     * Recupere les films d'une section (genre, top rated, etc.)
     * Methode generique pour recuperer n'importe quelle section de films
     * @param {string} endpoint - URL complete de l'endpoint API
     * @returns {Promise<Object>} Donnees brutes avec films et informations de pagination
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
     * Recupere des films par genre specifique
     * Filtre les films par genre et les trie par score IMDb decroissant
     * @param {string} genre - Nom exact du genre a filtrer
     * @param {number} pageSize - Nombre de films a recuperer (defaut: 7)
     * @returns {Promise<Array>} Liste des films du genre specifie
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
     * Recupere les films les mieux notes
     * Equivalent a getBestMovies mais avec un nom plus explicite pour les sections
     * @param {number} pageSize - Nombre de films a recuperer (defaut: 7)
     * @returns {Promise<Array>} Liste des films tries par score IMDb decroissant
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
     * Construit une URL pour un endpoint avec parametres
     * Utilitaire pour construire des URLs avec parametres de requete
     * @param {string} path - Chemin relatif de l'endpoint API
     * @param {Object} params - Parametres de requete (genre, sort_by, page_size, etc.)
     * @returns {string} URL complete prete a etre utilisee
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
     * Vide completement le cache
     * Utile pour forcer le rechargement des donnees ou en cas de probleme
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache API vide');
    }

    /**
     * Obtient les statistiques du cache
     * Utile pour le debogage et le monitoring des performances
     * @returns {Object} Statistiques du cache (taille et cles)
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Instance singleton - une seule instance pour toute l'application
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