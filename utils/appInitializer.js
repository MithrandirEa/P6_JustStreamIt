/**
 * APP INITIALIZER
 * Gestionnaire d'initialisation de l'application
 * Orchestre le chargement séquentiel des sections
 */

/**
 * Classe de gestion de l'initialisation
 * Coordonne le chargement du meilleur film et des sections
 */
class AppInitializer {
    constructor() {
        this.pageSize = null; // Nombre de films par section selon l'ecran
        this.displayMode = null; // Mode d'affichage (mobile, tablette, desktop)
    }

    /**
     * Initialise les paramètres selon la taille d'écran
     */
    initializeSettings() {
        this.pageSize = window.ResponsiveUtils.getPageSize();
        this.displayMode = window.ResponsiveUtils.getDeviceType();
        
        console.log(`Initialisation avec ${this.pageSize} films par section`);
        console.log(`Mode detecte: ${this.displayMode} (largeur: ${window.innerWidth}px)`);
    }

    /**
     * Charge une section de films avec gestion d'erreur
     * @param {Object} sectionConfig - Configuration de la section
     */
    async loadSection(sectionConfig) {
        const { title, endpoint, sectionClass, emoji } = sectionConfig;
        const messages = window.AppConfig.getMessages();
        
        try {
            console.log(messages.loading.section(emoji, title));
            
            const fullUrl = window.AppConfig.buildApiUrl(endpoint, this.pageSize);
            await loadMovieSection(fullUrl, sectionClass);
            
            console.log(messages.success.section(title));
        } catch (error) {
            console.error(`Erreur lors du chargement de ${title}:`, error);
            throw error;
        }
    }

    /**
     * Charge le meilleur film avec gestion d'erreur
     */
    async loadBestMovieSection() {
        const messages = window.AppConfig.getMessages();
        
        try {
            console.log(messages.loading.bestMovie);
            await loadBestMovie();
            console.log(messages.success.bestMovie);
        } catch (error) {
            console.error('Erreur lors du chargement du meilleur film:', error);
            throw error;
        }
    }

    /**
     * Initialise l'application complètement
     * Charge séquentiellement toutes les sections
     */
    async initialize() {
        const messages = window.AppConfig.getMessages();
        
        try {
            // Initialisation des parametres
            this.initializeSettings();
            console.log(messages.loading.initialization);

            // Chargement du meilleur film (section hero)
            await this.loadBestMovieSection();

            // Chargement de toutes les sections configurees
            const sections = window.AppConfig.getFilmSections();
            
            for (const [key, sectionConfig] of Object.entries(sections)) {
                await this.loadSection(sectionConfig);
            }

            console.log(messages.success.initialization);

        } catch (error) {
            console.error('Erreur lors de l\'initialisation globale:', error);
            this.displayGlobalError();
        }
    }

    /**
     * Affiche une erreur globale à l'utilisateur
     */
    displayGlobalError() {
        const errorHtml = `
            <div class="error-global" style="
                position: fixed; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%);
                background: #f8d7da; 
                color: #721c24; 
                padding: 20px; 
                border: 1px solid #f5c6cb; 
                border-radius: 8px;
                z-index: 9999;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <h3 style="margin-top: 0;">ERREUR de chargement</h3>
                <p>Impossible de charger l'application. Veuillez verifier votre connexion et reessayer.</p>
                <button onclick="location.reload()" style="
                    background: #007bff; 
                    color: white; 
                    border: none; 
                    padding: 8px 16px; 
                    border-radius: 4px; 
                    cursor: pointer;
                    margin-top: 10px;
                ">Recharger</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHtml);
    }
}

// Export pour utilisation dans script.js via l'objet window
// Expose la classe AppInitializer pour l'initialisation de l'application
if (typeof window !== 'undefined') {
    window.AppInitializer = AppInitializer;
}