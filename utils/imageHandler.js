/**
 * 🖼️ IMAGE HANDLER UTILITIES
 * Gestion des images, fallbacks et erreurs de chargement
 */

/**
 * Configuration pour les fallbacks d'images
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
        icon: '🎬',
        text: 'Image non disponible'
    }
};

/**
 * Gère les erreurs de chargement d'images
 * @param {HTMLImageElement} img - Élément image qui a échoué
 * @param {string} fallbackClass - Classe CSS du fallback à afficher
 */
function handleImageError(img, fallbackClass = 'movie-fallback') {
    console.log('Image failed to load:', img.src);
    showFallback(img, fallbackClass);
}

/**
 * Vérifie si une image s'est correctement chargée
 * @param {HTMLImageElement} img - Élément image à vérifier
 * @param {string} fallbackClass - Classe CSS du fallback si échec
 */
function checkImageLoaded(img, fallbackClass = 'movie-fallback') {
    console.log('Image load event:', img.src, 'naturalWidth:', img.naturalWidth, 'naturalHeight:', img.naturalHeight);
    
    // Vérifier si l'image s'est vraiment chargée (dimensions > 0)
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.log('Image loaded but invalid dimensions, showing fallback');
        showFallback(img, fallbackClass);
    } else {
        console.log('Image loaded successfully');
    }
}

/**
 * Affiche le fallback à la place de l'image
 * @param {HTMLImageElement} img - Élément image à masquer
 * @param {string} fallbackClass - Classe CSS du fallback à afficher
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
        // Créer un fallback d'urgence si l'élément n'existe pas
        createEmergencyFallback(img, fallbackClass);
    }
}

/**
 * Crée un fallback d'urgence si l'élément prévu n'existe pas
 * @param {HTMLImageElement} img - Élément image à remplacer
 * @param {string} fallbackClass - Classe CSS du fallback
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
    
    // Insérer après l'image
    img.parentElement.insertBefore(emergencyFallback, img.nextSibling);
    console.log('Emergency fallback created for:', fallbackClass);
}

/**
 * Précharge une image pour éviter les erreurs de chargement
 * @param {string} src - URL de l'image à précharger
 * @returns {Promise} Promise qui se résout quand l'image est chargée
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
 * Vérifie si une URL d'image est valide
 * @param {string} src - URL à vérifier
 * @returns {boolean} true si l'URL semble valide
 */
function isValidImageUrl(src) {
    if (!src || typeof src !== 'string') return false;
    
    // Vérifier les extensions d'images courantes
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const hasValidExtension = imageExtensions.test(src);
    
    // Vérifier le protocole
    const hasValidProtocol = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:');
    
    return hasValidExtension && hasValidProtocol;
}

// Export pour utilisation dans script.js
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