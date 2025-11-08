/**
 * IMAGE HANDLER UTILITIES
 * Gestion des images, fallbacks et erreurs de chargement
 * Utilitaires pour gerer les echecs de chargement des posters de films
 */

/**
 * Configuration pour les fallbacks d'images
 * Definit les styles et contenus par defaut pour les images manquantes
 */
const IMAGE_CONFIG = {
    fallbackStyles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#D9D9D9',
        color: '#666',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    },
    fallbackContent: {
        icon: 'FILM', // Remplace l'emoji par du texte
        text: 'Image non disponible'
    }
};

/**
 * Gere les erreurs de chargement d'images
 * Fonction appelee automatiquement par l'attribut onerror des images
 * @param {HTMLImageElement} img - Element image qui a echoue a se charger
 * @param {string} fallbackClass - Classe CSS du fallback a afficher (defaut: 'movie-fallback')
 */
function handleImageError(img, fallbackClass = 'movie-fallback') {
    console.log('Image failed to load:', img.src);
    showFallback(img, fallbackClass);
}

/**
 * Verifie si une image s'est correctement chargee
 * Fonction appelee par l'attribut onload pour valider le chargement
 * @param {HTMLImageElement} img - Element image a verifier
 * @param {string} fallbackClass - Classe CSS du fallback si echec
 */
function checkImageLoaded(img, fallbackClass = 'movie-fallback') {
    console.log('Image load event:', img.src, 'naturalWidth:', img.naturalWidth, 'naturalHeight:', img.naturalHeight);
    
    // Verifier si l'image s'est vraiment chargee (dimensions > 0)
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.log('Image loaded but invalid dimensions, showing fallback');
        showFallback(img, fallbackClass);
    } else {
        console.log('Image loaded successfully');
    }
}

/**
 * Affiche le fallback a la place de l'image
 * Masque l'image defaillante et active l'element de remplacement
 * @param {HTMLImageElement} img - Element image a masquer
 * @param {string} fallbackClass - Classe CSS du fallback a afficher
 */
function showFallback(img, fallbackClass) {
    img.style.display = 'none';
    const fallback = img.parentElement.querySelector('.' + fallbackClass);
    
    if (fallback) {
        // Appliquer les styles de fallback
        Object.assign(fallback.style, IMAGE_CONFIG.fallbackStyles);
        console.log('Fallback activated for:', fallbackClass);
    } else {
        console.error('Fallback element not found:', fallbackClass);
        // Creer un fallback d'urgence si l'element n'existe pas
        createEmergencyFallback(img, fallbackClass);
    }
}

/**
 * Cree un fallback d'urgence si l'element prevu n'existe pas
 * Solution de secours quand le template n'a pas prevu d'element fallback
 * @param {HTMLImageElement} img - Element image a remplacer
 * @param {string} fallbackClass - Classe CSS du fallback a creer
 */
function createEmergencyFallback(img, fallbackClass) {
    const emergencyFallback = document.createElement('div');
    emergencyFallback.className = fallbackClass;
    
    // Appliquer les styles et le contenu
    Object.assign(emergencyFallback.style, IMAGE_CONFIG.fallbackStyles);
    emergencyFallback.innerHTML = `
        <div>
            <div style="font-size: 48px; margin-bottom: 10px;">${IMAGE_CONFIG.fallbackContent.icon}</div>
            <div>${IMAGE_CONFIG.fallbackContent.text}</div>
        </div>
    `;
    
    // Inserer apres l'image
    img.parentElement.insertBefore(emergencyFallback, img.nextSibling);
    console.log('Emergency fallback created for:', fallbackClass);
}

/**
 * Precharge une image pour eviter les erreurs de chargement
 * Utile pour valider une URL d'image avant de l'afficher
 * @param {string} src - URL de l'image a precharger
 * @returns {Promise<Image>} Promise qui se resout avec l'image chargee ou rejette en cas d'erreur
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

/**
 * Verifie si une URL d'image est valide
 * Validation basique de format pour eviter les erreurs evidentes
 * @param {string} src - URL a verifier
 * @returns {boolean} true si l'URL semble valide (extension et protocole corrects)
 */
function isValidImageUrl(src) {
    if (!src || typeof src !== 'string') return false;
    
    // Verifier les extensions d'images courantes
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const hasValidExtension = imageExtensions.test(src);
    
    // Verifier le protocole
    const hasValidProtocol = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:');
    
    return hasValidExtension && hasValidProtocol;
}

// Export pour utilisation dans script.js via l'objet window
// Expose toutes les fonctions utilitaires pour la gestion d'images
if (typeof window !== 'undefined') {
    window.ImageHandler = {
        handleImageError,
        checkImageLoaded, 
        showFallback,
        createEmergencyFallback,
        preloadImage,
        isValidImageUrl,
        IMAGE_CONFIG
    };
}