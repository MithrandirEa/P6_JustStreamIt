/**
 * RESPONSIVE UTILITIES
 * Gestion de la responsivité et des breakpoints
 * Calcule le nombre de films selon la taille d'écran
 */

/**
 * Configuration des breakpoints
 * Seuils d'écran selon les spécifications du projet
 */
const RESPONSIVE_CONFIG = {
    breakpoints: {
        mobile: { max: 456, pageSize: 2 },      // Phone: 1 colonne x 2 films empiles
        tablet: { min: 457, max: 788, pageSize: 4 }, // Tablette: 2 colonnes x 2 lignes  
        desktop: { min: 789, pageSize: 6 }      // Desktop: 3 colonnes x 2 lignes
    }
};

/**
 * Détermine le nombre de films à afficher
 * @returns {number} Nombre de films (2, 4 ou 6)
 */
function getPageSize() {
    const width = window.innerWidth;
    let pageSize;
    
    if (width >= RESPONSIVE_CONFIG.breakpoints.desktop.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.desktop.pageSize;
        console.log(`Mode desktop (${width}px) - ${pageSize} films 3x2`);
    } else if (width >= RESPONSIVE_CONFIG.breakpoints.tablet.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.tablet.pageSize;
        console.log(`Mode tablette (${width}px) - ${pageSize} films 2x2`);
    } else {
        pageSize = RESPONSIVE_CONFIG.breakpoints.mobile.pageSize;
        console.log(`Mode mobile (${width}px) - ${pageSize} films empilés`);
    }
    
    return pageSize;
}

/**
 * Détermine le type d'appareil actuel
 * @returns {string} 'mobile', 'tablet' ou 'desktop'
 */
function getDeviceType() {
    const width = window.innerWidth;
    
    if (width >= RESPONSIVE_CONFIG.breakpoints.desktop.min) {
        return 'desktop';
    } else if (width >= RESPONSIVE_CONFIG.breakpoints.tablet.min) {
        return 'tablet';
    } else {
        return 'mobile';
    }
}

/**
 * Vérifie si le mode est mobile
 * @returns {boolean} true si mobile
 */
function isMobile() {
    return getDeviceType() === 'mobile';
}

/**
 * Vérifie si le mode est desktop
 * @returns {boolean} true si desktop
 */
function isDesktop() {
    return getDeviceType() === 'desktop';
}

// Export pour utilisation dans script.js via l'objet window
// Expose les fonctions de gestion responsive
if (typeof window !== 'undefined') {
    window.ResponsiveUtils = {
        getPageSize,
        getDeviceType,
        isMobile,
        isDesktop,
        RESPONSIVE_CONFIG
    };
}