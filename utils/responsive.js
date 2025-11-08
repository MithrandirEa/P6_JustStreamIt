/**
 * 📱 RESPONSIVE UTILITIES
 * Gestion de la responsivité et des breakpoints
 */

/**
 * Configuration des breakpoints responsive
 */
const RESPONSIVE_CONFIG = {
    breakpoints: {
        mobile: { max: 767, pageSize: 2 },      // 1 colonne × 2 films empilés
        tablet: { min: 768, max: 991, pageSize: 4 }, // 2 colonnes × 2 lignes  
        desktop: { min: 992, pageSize: 6 }      // 3 colonnes × 2 lignes
    }
};

/**
 * Détermine le nombre de films à afficher selon la taille d'écran
 * @returns {number} Nombre de films adaptés à l'écran
 */
function getPageSize() {
    const width = window.innerWidth;
    let pageSize;
    
    if (width >= RESPONSIVE_CONFIG.breakpoints.desktop.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.desktop.pageSize;
        console.log(`Mode PC détecté (${width}px) - ${pageSize} films en grille 3×2`);
    } else if (width >= RESPONSIVE_CONFIG.breakpoints.tablet.min) {
        pageSize = RESPONSIVE_CONFIG.breakpoints.tablet.pageSize;
        console.log(`Mode Tablette détecté (${width}px) - ${pageSize} films en grille 2×2`);
    } else {
        pageSize = RESPONSIVE_CONFIG.breakpoints.mobile.pageSize;
        console.log(`Mode Mobile détecté (${width}px) - ${pageSize} films empilés verticalement`);
    }
    
    return pageSize;
}

/**
 * Détermine le type de device actuel
 * @returns {string} 'mobile', 'tablet', ou 'desktop'
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
 * Vérifie si on est en mode mobile
 * @returns {boolean} true si mobile
 */
function isMobile() {
    return getDeviceType() === 'mobile';
}

/**
 * Vérifie si on est en mode desktop
 * @returns {boolean} true si desktop
 */
function isDesktop() {
    return getDeviceType() === 'desktop';
}

// Export pour utilisation dans script.js
if (typeof window !== 'undefined') {
    window.ResponsiveUtils = {
        getPageSize,
        getDeviceType,
        isMobile,
        isDesktop,
        RESPONSIVE_CONFIG
    };
}